/* 1-bit ordered dither scenes. Every image on the site is generated here,
   so the look stays coherent and nothing depends on a stock photo host. */

const SCENES = [
  'horizon', 'ridges', 'orbit', 'swell', 'eclipse', 'dunes', 'sea', 'topo',
  'galaxy', 'grid', 'peak', 'atom', 'blocks', 'skyline', 'rain', 'nebula',
] as const;
export type Scene = (typeof SCENES)[number];

export const SCENE_INDEX = Object.fromEntries(SCENES.map((s, i) => [s, i])) as Record<Scene, number>;

/* Each product owns one scene, so no picture repeats across the work grid and its detail page. */
export const PRODUCT_SCENE: Record<string, Scene> = {
  meltir: 'galaxy', 'levios-ai': 'sea', wesanjs: 'skyline', friday: 'grid', dante: 'eclipse',
  notch: 'topo', levios: 'atom', 'empire inc.': 'peak', 'block forge': 'blocks',
};

/* Newsroom items take scenes no product uses, in list order. */
export const NEWS_SCENES: Scene[] = ['dunes', 'nebula', 'rain', 'ridges', 'swell', 'orbit'];

export type Tone = 'architecture' | 'workstation' | 'stage' | 'industrial' | 'dawn' | 'geology' | 'systems';

/* Kept outside the client module so server pages can read it as plain data. */
export const TONE_SCENE: Record<Tone, [Scene, number]> = {
  architecture: ['horizon', 1],
  workstation: ['orbit', 2],
  stage: ['swell', 3],
  industrial: ['ridges', 4],
  dawn: ['horizon', 5],
  geology: ['ridges', 6],
  systems: ['orbit', 7],
};

export const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

export const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScene;
uniform float uSeed;
uniform vec2 uLight;
uniform vec3 uInk;
uniform vec3 uGround;
uniform float uGain;

// Arithmetic hash: sin()-based hashes lose float precision at pixel-sized
// coordinates and print a visible grid.
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx + uSeed * 13.1) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
// Single-pixel stars in device space, so they never dither into blocks.
float stars() {
  float h = hash(floor(gl_FragCoord.xy));
  return step(0.9975, h) * step(0.35, fract(h * 91.7 + uTime * 0.2));
}

// Planet limb seen from orbit: cloud bands, terminator, thin atmosphere.
float horizon(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y);
  vec2 c = vec2(0.42, -2.2);
  float r = 2.55, d = length(q - c) - r;
  vec2 n = normalize(q - c);
  float lit = clamp(dot(n, normalize(vec2(uLight.x - 0.5, 0.9))) * 1.4, 0.0, 1.0);
  float clouds = fbm(vec2(q.x * 3.0 + uTime * 0.012, q.y * 9.0));
  float body = (0.18 + 0.82 * clouds) * lit * (1.0 - smoothstep(-0.02, 0.0, d));
  float atmo = exp(-max(d, 0.0) * 38.0) * (0.35 + 0.65 * lit) * step(0.0, d);
  atmo *= step(0.004, atmo);
  return body + atmo + stars() * step(0.02, d);
}

// Layered ridgelines receding into haze; nearer layers darker.
float ridges(vec2 uv, float asp) {
  float x = uv.x * asp;
  float v = 0.10 + 0.55 * pow(uv.y, 1.6);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float base = 0.62 - fi * 0.12;
    float h = base + 0.16 * fbm(vec2(x * (1.2 + fi * 0.5) + fi * 7.3 + uTime * 0.004 * (fi + 1.0), fi));
    if (uv.y < h) v = 0.62 - fi * 0.13 + 0.6 * (h - uv.y) * (0.5 - fi * 0.08);
  }
  return v;
}

// Lit sphere with tilted rings and a moon on its path.
float orbit(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y - 0.5);
  float r = 0.27, d = length(q);
  vec3 n = vec3(q / r, sqrt(max(0.0, 1.0 - dot(q, q) / (r * r))));
  float lit = clamp(dot(n, normalize(vec3(uLight.x - 0.3, 0.4, 0.6))), 0.0, 1.0);
  float sphere = step(d, r) * (0.08 + 0.9 * lit) * (0.8 + 0.2 * fbm(q * 18.0));
  vec2 e = vec2(q.x, q.y * 3.4 + q.x * 0.6);
  float ring = smoothstep(0.012, 0.0, abs(length(e) - 0.46)) + smoothstep(0.006, 0.0, abs(length(e) - 0.53)) * 0.6;
  ring *= 1.0 - step(length(q), r) * step(0.0, e.y);
  float a = uTime * 0.05 + uSeed;
  float moon = step(length(q - vec2(cos(a) * 0.5, sin(a) * 0.5 / 3.4)), 0.022);
  return max(sphere, ring * 0.85) + moon + stars() * step(r, d);
}

// Two-source interference: crisp moire bands, like a sound field on water.
float swell(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y - 0.5);
  vec2 s1 = vec2(-0.35 + 0.05 * sin(uSeed), -0.2), s2 = vec2(0.4, 0.25);
  float a = sin(length(q - s1) * 26.0 - uTime * 0.8);
  float b = sin(length(q - s2) * 26.0 - uTime * 0.6);
  float contour = 1.0 - smoothstep(0.0, 0.22, abs(a + b));
  return contour * (0.3 + 0.6 * uv.y);
}

const float PI = 3.14159265;

// Total eclipse: a dark disc inside a streaked corona.
float eclipse(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y - 0.52);
  float d = length(q), r = 0.17;
  float streak = 0.55 + 0.45 * fbm(vec2(atan(q.y, q.x) * 3.0 + uSeed, d * 4.0));
  float corona = exp(-max(d - r, 0.0) * 9.0) * streak * step(r, d);
  float rim = 1.0 - smoothstep(0.0, 0.012, abs(d - r));
  return corona + rim + stars() * step(0.35, d);
}

// Wind-shaped dunes lit from one side, with fine ripples.
float dunes(vec2 uv, float asp) {
  float x = uv.x * asp;
  float v = 0.04 + 0.22 * uv.y;
  for (int i = 0; i < 4; i++) {
    float fi = float(i), k = 3.0 + fi, ph = fi * 2.1 + uSeed;
    float h = 0.6 - fi * 0.14 + 0.06 * sin(x * k + ph) + 0.03 * fbm(vec2(x * 2.0, fi));
    if (uv.y < h) v = 0.22 + 0.32 * (0.5 + 0.5 * cos(x * k + ph)) - fi * 0.04 + 0.06 * sin(x * 70.0 + uv.y * 25.0);
  }
  return v;
}

// Sea at dusk: low sun on the horizon and a glittering reflection.
float sea(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y);
  float hz = 0.46, sx = 0.15;
  if (uv.y > hz) {
    float sun = step(length(q - vec2(sx, hz + 0.07)), 0.07);
    return max(0.06 + 0.3 * (1.0 - smoothstep(hz, 1.0, uv.y)), sun) + stars() * step(0.82, uv.y);
  }
  float depth = (hz - uv.y) / hz;
  float waves = noise(vec2(q.x * 40.0 / (0.25 + depth), uv.y * 220.0 / (0.3 + depth)));
  float column = exp(-abs(q.x - sx) * (6.0 + depth * 3.0));
  return 0.05 + column * waves * 0.95 + 0.12 * waves * (1.0 - depth);
}

// Topographic map: contour lines with every fifth line drawn heavier.
float topo(vec2 uv, float asp) {
  float h = fbm(vec2(uv.x * asp, uv.y) * 1.4 + uSeed) * 7.0;
  float minor = 1.0 - smoothstep(0.04, 0.09, abs(fract(h) - 0.5));
  float major = 1.0 - smoothstep(0.03, 0.08, abs(fract(h / 5.0) - 0.5) * 5.0);
  return 0.04 + minor * 0.45 + major * 0.45;
}

// Spiral galaxy seen at an angle: two arms, dust and a bright core.
float galaxy(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, (uv.y - 0.5) * 1.9);
  float r = length(q), a = atan(q.y, q.x);
  float arms = 0.5 + 0.5 * cos(2.0 * (a - log(r + 0.001) * 2.6) + uTime * 0.05);
  float disk = exp(-r * 4.5) * (0.35 + 0.65 * arms) * (0.6 + 0.5 * fbm(q * 9.0 + uSeed));
  return disk * 1.2 + exp(-r * 18.0) + stars() * 0.8;
}

// Perspective floor grid running to a glowing horizon.
float grid(vec2 uv, float asp) {
  float hz = 0.6;
  if (uv.y > hz) return 0.05 + 0.4 * exp(-(uv.y - hz) * 12.0) + stars();
  float z = 0.18 / (hz - uv.y);
  vec2 g = abs(fract(vec2((uv.x - 0.5) * asp * z, z + uTime * 0.08) * 2.0) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.04 * z, min(g.x, g.y));
  return 0.04 + line * clamp(1.4 - z * 0.25, 0.0, 1.0);
}

// A single peak under a moon; the left face catches the light.
float peak(vec2 uv, float asp) {
  float x = (uv.x - 0.5) * asp;
  float h = 0.62 - abs(x) * 0.9 + 0.05 * fbm(vec2(x * 6.0, uSeed));
  if (uv.y > h) {
    float moon = step(length(vec2(x + 0.35, uv.y - 0.78)), 0.05);
    return max(0.06 + 0.18 * uv.y, moon) + stars() * step(0.7, uv.y);
  }
  float face = x < 0.0 ? 0.55 : 0.18;
  return face + step(h - 0.08, uv.y) * 0.35 + 0.1 * fbm(vec2(x, uv.y) * 12.0);
}

// Three crossing electron orbits around a bright nucleus.
float atom(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y - 0.5);
  float v = 0.0;
  for (int i = 0; i < 3; i++) {
    float t = float(i) * PI / 3.0 + uSeed * 0.2;
    vec2 r = mat2(cos(t), -sin(t), sin(t), cos(t)) * q;
    v = max(v, 1.0 - smoothstep(0.0, 0.012, abs(length(vec2(r.x, r.y * 3.2)) - 0.38)));
  }
  return v * 0.85 + exp(-length(q) * 30.0) * 1.2 + stars() * 0.6;
}

// Bevelled blocks stacking up from the floor, like a puzzle mid-game.
float blocks(vec2 uv, float asp) {
  vec2 q = vec2(uv.x * asp, uv.y) * 10.0;
  vec2 id = floor(q), f = fract(q);
  float filled = step(hash(id + 3.0), 0.9 - uv.y * 1.1);
  float inset = step(0.08, f.x) * step(0.08, f.y);
  return filled * inset * (0.22 + 0.6 * (f.x + 1.0 - f.y) * 0.5);
}

// Night skyline: towers of random height with scattered lit windows.
float skyline(vec2 uv, float asp) {
  float x = uv.x * asp * 12.0;
  float id = floor(x);
  float h = 0.16 + 0.5 * hash(vec2(id, 7.0)) * hash(vec2(id, 3.0));
  if (uv.y > h) return 0.05 + 0.2 * (1.0 - smoothstep(0.0, 0.5, uv.y - h)) * 0.5 + stars();
  vec2 w = vec2(fract(x * 3.0), fract(uv.y * 55.0));
  float lit = step(0.62, hash(floor(vec2(x * 3.0, uv.y * 55.0))));
  return 0.1 + step(0.3, w.x) * step(0.35, w.y) * lit * 0.85;
}

// Rain streaks over a wet, reflective ground.
float rain(vec2 uv, float asp) {
  float col = floor(uv.x * asp * 90.0);
  float y = fract(uv.y * (1.5 + hash(vec2(col, 2.0))) + uTime * (0.1 + 0.2 * hash(vec2(col, 1.0))) + hash(vec2(col, 3.0)));
  float streak = step(0.86, y) * step(0.45, hash(vec2(col, 4.0)));
  float ground = step(uv.y, 0.12) * (0.12 + 0.35 * noise(vec2(col * 0.2, uv.y * 80.0)));
  return 0.04 + streak * 0.7 + ground;
}

// Folded nebula clouds in a star field.
float nebula(vec2 uv, float asp) {
  vec2 q = vec2(uv.x * asp, uv.y) * 2.0;
  vec2 w = vec2(fbm(q + uSeed), fbm(q + 4.7 - uSeed));
  return smoothstep(0.35, 0.85, fbm(q * 1.5 + 2.5 * w)) * 0.9 + stars();
}

float scene(float s, vec2 uv, float asp) {
  if (s < 0.5) return horizon(uv, asp);
  if (s < 1.5) return ridges(uv, asp);
  if (s < 2.5) return orbit(uv, asp);
  if (s < 3.5) return swell(uv, asp);
  if (s < 4.5) return eclipse(uv, asp);
  if (s < 5.5) return dunes(uv, asp);
  if (s < 6.5) return sea(uv, asp);
  if (s < 7.5) return topo(uv, asp);
  if (s < 8.5) return galaxy(uv, asp);
  if (s < 9.5) return grid(uv, asp);
  if (s < 10.5) return peak(uv, asp);
  if (s < 11.5) return atom(uv, asp);
  if (s < 12.5) return blocks(uv, asp);
  if (s < 13.5) return skyline(uv, asp);
  if (s < 14.5) return rain(uv, asp);
  return nebula(uv, asp);
}

float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer8(vec2 a) {
  return bayer2(0.25 * a) * 0.0625 + bayer2(0.5 * a) * 0.25 + bayer2(a);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  float l = scene(uScene, uv, asp);
  l *= uGain;
  // A 1/64 floor keeps near-black luminance from printing a lattice at the zero threshold.
  float on = step(max(bayer8(gl_FragCoord.xy), 0.016), l);
  gl_FragColor = vec4(mix(uGround, uInk, on), 1.0);
}
`;
