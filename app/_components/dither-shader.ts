/* 1-bit ordered dither scenes. Every image on the site is generated here,
   so the look stays coherent and nothing depends on a stock photo host. */

export type Scene = 'horizon' | 'ridges' | 'orbit' | 'swell';

export const SCENE_INDEX: Record<Scene, number> = { horizon: 0, ridges: 1, orbit: 2, swell: 3 };

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
  float a = sin(length(q - s1) * 46.0 - uTime * 0.8);
  float b = sin(length(q - s2) * 46.0 - uTime * 0.6);
  return clamp(0.5 + 0.28 * (a + b), 0.0, 1.0) * (0.35 + 0.65 * uv.y);
}

float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer8(vec2 a) {
  return bayer2(0.25 * a) * 0.0625 + bayer2(0.5 * a) * 0.25 + bayer2(a);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  float l = uScene < 0.5 ? horizon(uv, asp) : uScene < 1.5 ? ridges(uv, asp) : uScene < 2.5 ? orbit(uv, asp) : swell(uv, asp);
  // A 1/64 floor keeps near-black luminance from printing a lattice at the zero threshold.
  float on = step(max(bayer8(gl_FragCoord.xy), 0.016), l);
  gl_FragColor = vec4(mix(uGround, uInk, on), 1.0);
}
`;
