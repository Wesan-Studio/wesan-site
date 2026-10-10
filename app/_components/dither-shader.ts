/* 1-bit ordered dither scenes. Every image on the site is generated here,
   so the look stays coherent and nothing depends on a stock photo host. */

const SCENES = [
  'horizon', 'ridges', 'orbit', 'swell', 'eclipse', 'dunes', 'sea', 'topo',
  'galaxy', 'grid', 'peak', 'atom', 'blocks', 'skyline', 'rain', 'nebula',
  'converge', 'develop', 'loop', 'dial', 'calendar', 'storefront', 'growth', 'panels',
] as const;
export type Scene = (typeof SCENES)[number];

export const SCENE_INDEX = Object.fromEntries(SCENES.map((s, i) => [s, i])) as Record<Scene, number>;

/* Each product owns a scene that pictures what it does; none repeats across the grid. */
export const PRODUCT_SCENE: Record<string, Scene> = {
  meltir: 'converge', 'levios-ai': 'develop', wesanjs: 'storefront', friday: 'loop', dante: 'dial',
  notch: 'calendar', levios: 'panels', 'empire inc.': 'growth', 'block forge': 'blocks',
};

/* Newsroom items take the atmospheric scenes, in list order. */
export const NEWS_SCENES: Scene[] = ['dunes', 'nebula', 'rain', 'eclipse', 'galaxy', 'sea'];

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

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
float fillBox(vec2 p, vec2 b, float r) { return 1.0 - step(0.0, sdRoundBox(p, b, r)); }
float stroke(float d, float w) { return 1.0 - smoothstep(0.0, w, abs(d)); }

// Meltir: strands from many small sources (calendar, mail, tasks) converge on one node.
float converge(vec2 uv, float asp) {
  vec2 q = vec2(uv.x * asp, uv.y);
  vec2 node = vec2(asp * 0.72, 0.5);
  float v = 0.0;
  for (int i = 0; i < 18; i++) {
    float fi = float(i);
    float y0 = 0.08 + 0.84 * hash(vec2(fi, 11.0));
    float x0 = asp * (0.06 + 0.24 * hash(vec2(fi, 5.0)));
    v = max(v, fillBox(q - vec2(x0 - 0.025, y0), vec2(0.022, 0.013), 0.004) * 0.65);
    if (q.x < x0 || q.x > node.x) continue;
    float t = (q.x - x0) / (node.x - x0);
    float y = mix(y0, node.y, t * t * (3.0 - 2.0 * t));
    float line = stroke(q.y - y, 0.003 + 0.003 * (1.0 - t));
    float pulse = 0.55 + 0.45 * step(0.85, fract(t * 3.0 - uTime * 0.25 + hash(vec2(fi, 2.0))));
    v = max(v, line * (0.35 + 0.5 * t) * pulse);
  }
  float d = length(q - node);
  float hub = exp(-d * 14.0) * 1.1 + stroke(d - 0.07, 0.006) * 0.7;
  float exitLine = step(node.x, q.x) * stroke(q.y - node.y, 0.005) * 0.85;
  return max(v, max(hub, exitLine));
}

// Levios AI: a raw, grainy photo becomes a clean, ready-to-share post.
float develop(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y - 0.5);
  float img = fbm(q * 3.0 + uSeed);
  vec2 lp = q + vec2(asp * 0.22, 0.0);
  float raw = fillBox(lp, vec2(0.16, 0.22), 0.01) * (img * 0.75 + 0.35 * (hash(floor(gl_FragCoord.xy / 2.0)) - 0.5));
  vec2 rp = q - vec2(asp * 0.22, 0.0);
  float card = stroke(sdRoundBox(rp, vec2(0.18, 0.3), 0.025), 0.004) * 0.8;
  float photo = fillBox(rp - vec2(0.0, 0.04), vec2(0.15, 0.17), 0.012) * (0.1 + 0.85 * smoothstep(0.42, 0.6, img));
  float caption = max(fillBox(rp - vec2(-0.03, -0.18), vec2(0.12, 0.01), 0.005), fillBox(rp - vec2(-0.06, -0.225), vec2(0.09, 0.01), 0.005)) * 0.55;
  float avatar = (1.0 - step(0.018, length(rp - vec2(-0.13, 0.25)))) * 0.75;
  float shaft = stroke(q.y, 0.004) * step(-0.05, q.x) * step(q.x, 0.03);
  float head = step(0.02, q.x) * step(abs(q.y), 0.05 - q.x);
  return raw + photo + max(card, max(caption, avatar)) + max(shaft, head) * 0.85;
}

// Friday: the plan, execute, verify loop, with a terminal cursor at its centre.
float loop(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y - 0.5);
  float r = 0.28, d = length(q);
  float v = stroke(d - r, 0.009) * 0.7;
  for (int i = 0; i < 3; i++) {
    float t = float(i) * 2.0 * PI / 3.0 + PI / 2.0;
    float nd = length(q - vec2(cos(t), sin(t)) * r);
    v = max(v, (1.0 - step(0.06, nd)) * 0.3 + stroke(nd - 0.06, 0.012) * 0.95);
  }
  float a = uTime * 0.6 + uSeed;
  v = max(v, 1.0 - step(0.026, length(q - vec2(cos(a), sin(a)) * r)));
  float cursor = fillBox(q, vec2(0.028, 0.045), 0.004) * step(0.5, fract(uTime * 0.8 + 0.25));
  return v + cursor * 0.85;
}

// Dante: six completion rings on a 24-hour dial, one per tracker.
float dial(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y - 0.5);
  float d = length(q);
  float a = fract(atan(q.x, q.y) / (2.0 * PI) + 1.0);
  float v = 0.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float done = 0.35 + 0.6 * hash(vec2(fi, uSeed));
    float band = 1.0 - smoothstep(0.012, 0.016, abs(d - (0.12 + fi * 0.042)));
    v = max(v, band * (a < done ? 0.95 : 0.18));
  }
  float ticks = step(0.38, d) * step(d, 0.405) * step(fract(a * 24.0), 0.07);
  float majors = step(0.37, d) * step(d, 0.42) * step(fract(a * 4.0 + 0.012), 0.024);
  return v + max(ticks, majors) * 0.8;
}

// Notch: a year of days, notched one by one; marks get denser as the habit holds.
float calendar(vec2 uv, float asp) {
  float cell = 0.085;
  vec2 g = (vec2(uv.x * asp, uv.y) - vec2(0.07 * asp, 0.2)) / cell;
  vec2 id = floor(g), f = fract(g);
  float cols = floor(asp * 0.86 / cell);
  if (id.y < 0.0 || id.y > 6.0 || id.x < 0.0 || id.x >= cols) return 0.0;
  float progress = (id.x * 7.0 + 6.0 - id.y) / (cols * 7.0);
  float marked = step(hash(id + uSeed), 0.2 + 0.75 * progress);
  float inset = fillBox(f - 0.5, vec2(0.36), 0.08);
  float today = step(cols - 1.0, id.x) * step(3.0, id.y) * step(id.y, 3.0) * stroke(sdRoundBox(f - 0.5, vec2(0.45), 0.1), 0.06);
  return inset * (0.12 + 0.78 * marked) + today;
}

// wesanjs: a shopfront with a striped awning, stocked shelves and a door.
float storefront(vec2 uv, float asp) {
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y);
  float w = 0.42;
  if (abs(q.x) > w) return 0.04 + step(uv.y, 0.12) * 0.1;
  float v = 0.13;
  if (uv.y > 0.82 && uv.y < 0.9) v = 0.6;
  if (uv.y > 0.66 && uv.y < 0.8) v = mod(floor((q.x + w) * 22.0), 2.0) < 1.0 ? 0.85 : 0.28;
  float scallop = 1.0 - step(0.022, length(vec2(fract((q.x + w) * 11.0) - 0.5, (uv.y - 0.66) * 11.0)));
  v = max(v, scallop * step(uv.y, 0.66) * 0.75);
  if (uv.y > 0.22 && uv.y < 0.58 && q.x > -w + 0.04 && q.x < 0.1) {
    float shelf = stroke(fract((uv.y - 0.22) / 0.12) - 0.02, 0.06) * 0.7;
    float good = step(0.45, hash(floor(vec2(q.x * 30.0, (uv.y - 0.22) / 0.12)))) * step(0.15, fract((uv.y - 0.22) / 0.12)) * step(fract((uv.y - 0.22) / 0.12), 0.75) * step(0.2, fract(q.x * 30.0));
    v = 0.06 + max(shelf, good * 0.6);
  }
  if (q.x > 0.16 && q.x < 0.36 && uv.y > 0.12 && uv.y < 0.58) v = 0.32 + (1.0 - step(0.012, length(q - vec2(0.33, 0.36)))) * 0.6;
  return v + stroke(uv.y - 0.12, 0.004) * 0.6;
}

// Empire Inc.: towers rising left to right, a growth line across their tops.
float growth(vec2 uv, float asp) {
  float n = 12.0;
  float id = floor(uv.x * n), f = fract(uv.x * n);
  float h = 0.12 + 0.62 * pow((id + 1.0) / n, 1.6) * (0.85 + 0.15 * hash(vec2(id, uSeed)));
  float bar = step(0.15, f) * step(f, 0.85) * step(uv.y, h);
  float lit = step(0.5, fract(uv.y * 40.0)) * step(0.5, fract(f * 4.0)) * step(0.55, hash(floor(vec2(uv.x * n * 4.0, uv.y * 40.0))));
  float trend = stroke(uv.y - (0.17 + 0.62 * pow((uv.x * n + 0.5) / n, 1.6)), 0.006);
  return bar * (0.32 + 0.5 * lit) + trend * 0.9 + stars() * 0.3 * step(h, uv.y);
}

// Levios: dashboard panels assembling themselves from the domain.
float panels(vec2 uv, float asp) {
  vec2 size = vec2(asp / 3.0, 0.5);
  vec2 id = floor(vec2(uv.x * asp, uv.y) / size), f = fract(vec2(uv.x * asp, uv.y) / size);
  vec2 p = (f - 0.5) * vec2(size.x / size.y, 1.0);
  float pan = sdRoundBox(p, vec2(size.x / size.y * 0.42, 0.42), 0.04);
  float kind = mod(id.x + id.y * 3.0 + floor(uSeed), 3.0);
  float viz;
  if (kind < 0.5) {
    float b = fract((f.x - 0.15) * 8.0 / 0.7);
    float bh = 0.2 + 0.5 * hash(vec2(floor((f.x - 0.15) * 8.0 / 0.7), id.x + id.y * 3.0));
    viz = step(0.15, f.x) * step(f.x, 0.85) * step(b, 0.7) * step(0.18, f.y) * step(f.y, 0.18 + bh * 0.6);
  } else if (kind < 1.5) {
    viz = stroke(f.y - (0.45 + 0.2 * sin(f.x * 6.0 + id.x) + 0.08 * sin(f.x * 17.0)), 0.02) * step(0.12, f.x) * step(f.x, 0.88);
  } else {
    float r = length(p), ang = fract(atan(p.x, p.y) / (2.0 * PI) + 1.0);
    viz = step(0.16, r) * step(r, 0.24) * (ang < 0.7 ? 1.0 : 0.25);
  }
  return stroke(pan, 0.01) * 0.6 + step(pan, 0.0) * viz * 0.85;
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
  if (s < 15.5) return nebula(uv, asp);
  if (s < 16.5) return converge(uv, asp);
  if (s < 17.5) return develop(uv, asp);
  if (s < 18.5) return loop(uv, asp);
  if (s < 19.5) return dial(uv, asp);
  if (s < 20.5) return calendar(uv, asp);
  if (s < 21.5) return storefront(uv, asp);
  if (s < 22.5) return growth(uv, asp);
  return panels(uv, asp);
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
