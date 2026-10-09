'use client';

import { useEffect, useRef } from 'react';
import { FRAG, SCENE_INDEX, VERT, type Scene } from './dither-shader';

type RGB = [number, number, number];
interface Gl { gl: WebGLRenderingContext; prog: WebGLProgram }
interface Frame { scene: Scene; seed: number; gain: number; time: number; light: [number, number]; ink: RGB; ground: RGB }

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

function createGl(canvas: HTMLCanvasElement): Gl | null {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;
  const prog = gl.createProgram()!;
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('dither shader failed:', gl.getShaderInfoLog(frag));
    return null;
  }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return { gl, prog };
}

function draw({ gl, prog }: Gl, w: number, h: number, f: Frame) {
  const u = (n: string) => gl.getUniformLocation(prog, n);
  gl.viewport(0, 0, w, h);
  gl.uniform2f(u('uRes'), w, h);
  gl.uniform1f(u('uTime'), f.time);
  gl.uniform1f(u('uScene'), SCENE_INDEX[f.scene]);
  gl.uniform1f(u('uSeed'), f.seed);
  gl.uniform1f(u('uGain'), f.gain);
  gl.uniform2f(u('uLight'), f.light[0], f.light[1]);
  gl.uniform3f(u('uInk'), ...f.ink);
  gl.uniform3f(u('uGround'), ...f.ground);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// Theme colors live in CSS so light and dark modes repaint the imagery too.
function themeColors(): { ink: RGB; ground: RGB } {
  const cs = getComputedStyle(document.documentElement);
  const read = (v: string) => cs.getPropertyValue(v).trim().split(/\s+/).map((n) => Number(n) / 255) as RGB;
  return { ink: read('--dither-ink'), ground: read('--dither-ground') };
}

function onThemeChange(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => { mo.disconnect(); mq.removeEventListener('change', cb); };
}

// Stills share one offscreen context: a page can carry many images without
// running into the browser's cap on live WebGL contexts.
let shared: { canvas: HTMLCanvasElement; ctx: Gl | null } | null = null;

function paintStill(target: HTMLCanvasElement, f: Frame) {
  if (!shared) {
    const canvas = document.createElement('canvas');
    shared = { canvas, ctx: createGl(canvas) };
  }
  if (!shared.ctx) return;
  const { width: w, height: h } = target;
  shared.canvas.width = w;
  shared.canvas.height = h;
  draw(shared.ctx, w, h, f);
  target.getContext('2d')?.drawImage(shared.canvas, 0, 0);
}

function fitCanvas(canvas: HTMLCanvasElement, cell: number) {
  const r = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.ceil(r.width / cell));
  const h = Math.max(1, Math.ceil(r.height / cell));
  const changed = canvas.width !== w || canvas.height !== h;
  if (changed) { canvas.width = w; canvas.height = h; }
  return changed;
}

// gain dims a scene so it can sit behind text without fighting it.
interface Props { scene: Scene; seed?: number; cell?: number; gain?: number; className?: string }

export function DitherStill({ scene, seed = 1, cell = 2, gain = 1, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const paint = () => paintStill(canvas, { scene, seed, gain, time: seed * 9, light: [0.7, 0.8], ...themeColors() });
    const ro = new ResizeObserver(() => { if (fitCanvas(canvas, cell)) paint(); });
    ro.observe(canvas);
    const off = onThemeChange(paint);
    return () => { ro.disconnect(); off(); };
  }, [scene, seed, cell, gain]);

  return <canvas ref={ref} className={`dither ${className}`} aria-hidden="true" />;
}

export function DitherField({ scene, seed = 1, cell = 3, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = createGl(canvas);
    if (!ctx) return;
    return runLoop(canvas, ctx, { scene, seed, cell });
  }, [scene, seed, cell]);

  return <canvas ref={ref} className={`dither ${className}`} aria-hidden="true" />;
}

function runLoop(canvas: HTMLCanvasElement, ctx: Gl, o: { scene: Scene; seed: number; cell: number }) {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let colors = themeColors(), raf = 0, visible = true;
  const light: [number, number] = [0.62, 0.8];
  const target: [number, number] = [0.62, 0.8];
  const t0 = performance.now();

  const frame = () => {
    fitCanvas(canvas, o.cell);
    // Ease the light toward the pointer so the scene drifts, never jumps.
    light[0] += (target[0] - light[0]) * 0.04;
    light[1] += (target[1] - light[1]) * 0.04;
    draw(ctx, canvas.width, canvas.height, { scene: o.scene, seed: o.seed, gain: 1, time: still ? 4 : (performance.now() - t0) / 1000, light, ...colors });
    if (!still && visible) raf = requestAnimationFrame(frame);
  };
  const onMove = (e: PointerEvent) => { target[0] = 0.35 + 0.55 * (e.clientX / innerWidth); };
  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(frame);
  });
  const ro = new ResizeObserver(() => { if (still) frame(); });
  const off = onThemeChange(() => { colors = themeColors(); if (still || !visible) frame(); });

  io.observe(canvas);
  ro.observe(canvas);
  addEventListener('pointermove', onMove, { passive: true });
  return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); off(); removeEventListener('pointermove', onMove); };
}
