// Procedural illustrations: pizzas, slices, cheese strands, drinks, stickers, QR, cutter.
import { markSVG, markLineSVG } from './logo.js';

let uid = 0;
const f = (n) => Math.round(n * 10) / 10;
const TAU = Math.PI * 2;

export function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// closed Catmull-Rom spline through points -> cubic bezier path
export function smooth(pts) {
  const n = pts.length;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}

// organic blob: radius wobbles by a few low-frequency sines
export function blob(r, n, amp, rnd, cx = 0, cy = 0, rot = 0) {
  const ph = [rnd() * TAU, rnd() * TAU, rnd() * TAU];
  const k = [2 + Math.floor(rnd() * 2), 3 + Math.floor(rnd() * 3), 7 + Math.floor(rnd() * 4)];
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + rot;
    const w = 1 + amp * (0.55 * Math.sin(k[0] * a + ph[0]) + 0.3 * Math.sin(k[1] * a + ph[1]) + 0.15 * Math.sin(k[2] * a + ph[2]));
    pts.push([cx + Math.cos(a) * r * w, cy + Math.sin(a) * r * w]);
  }
  return smooth(pts);
}

function scatter(rnd, count, rMax, minD, taken = []) {
  const out = [];
  for (let t = 0; t < count * 40 && out.length < count; t++) {
    const a = rnd() * TAU, r = Math.sqrt(rnd()) * rMax;
    const p = [Math.cos(a) * r, Math.sin(a) * r];
    if ([...taken, ...out].every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > minD)) out.push(p);
  }
  taken.push(...out);
  return out;
}

export function leafPath(len, wid) {
  return `M0,0 C${f(len * 0.25)},${f(-wid)} ${f(len * 0.75)},${f(-wid * 0.9)} ${len},0 C${f(len * 0.72)},${f(wid * 0.85)} ${f(len * 0.25)},${f(wid)} 0,0Z`;
}

export function basil(x, y, len, rot, rnd) {
  const wid = len * (0.36 + rnd() * 0.08);
  return `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)}) translate(${f(-len / 2)},0)">
    <path d="${leafPath(len, wid)}" fill="#2F7A33"/>
    <path d="M0,0 C${f(len * 0.25)},${f(-wid)} ${f(len * 0.75)},${f(-wid * 0.9)} ${len},0Z" fill="#46A045" opacity=".85"/>
    <path d="M${f(len * 0.06)},0 Q${f(len * 0.5)},${f(-wid * 0.08)} ${f(len * 0.95)},0" stroke="#1F5A24" stroke-width="${f(len * 0.035)}" fill="none" stroke-linecap="round"/>
    <path d="M${f(len * 0.12)},${f(-wid * 0.05)} Q${f(len * 0.4)},${f(-wid * 0.62)} ${f(len * 0.7)},${f(-wid * 0.5)}" stroke="#9AD38A" stroke-width="${f(len * 0.03)}" fill="none" opacity=".5" stroke-linecap="round"/>
  </g>`;
}

const TOP = {
  pepperoni(x, y, rnd, id) {
    const r = 21 + rnd() * 6;
    let s = `<g transform="translate(${f(x)},${f(y)})"><circle r="${f(r + 1.5)}" fill="#7E1C12" opacity=".45"/><circle r="${f(r)}" fill="url(#${id}pep)"/>`;
    for (let i = 0; i < 5; i++) { const a = rnd() * TAU, d = rnd() * r * 0.65; s += `<circle cx="${f(Math.cos(a) * d)}" cy="${f(Math.sin(a) * d)}" r="${f(1.6 + rnd() * 2.4)}" fill="#E8A07A" opacity=".55"/>`; }
    return s + `<path d="M${f(-r * 0.6)},${f(-r * 0.45)} A${f(r * 0.75)},${f(r * 0.75)} 0 0 1 ${f(r * 0.35)},${f(-r * 0.7)}" stroke="#F06A4C" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/></g>`;
  },
  olive(x, y, rnd) {
    const r = 8 + rnd() * 2;
    return `<g transform="translate(${f(x)},${f(y)}) scale(1,${f(0.82 + rnd() * 0.18)}) rotate(${f(rnd() * 180)})"><circle r="${f(r)}" fill="none" stroke="#211A17" stroke-width="6.5"/><path d="M${f(-r * 0.7)},${f(-r * 0.7)} A${f(r)},${f(r)} 0 0 1 ${f(r * 0.4)},${f(-r)}" stroke="#6E625B" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
  },
  mushroom(x, y, rnd) {
    const s = 0.8 + rnd() * 0.35;
    return `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rnd() * 360)}) scale(${f(s)})"><path d="M-17,2 C-17,-15 17,-15 17,2 C10,4 6,3 5,5 L6,16 C2,18 -2,18 -6,16 L-5,5 C-6,3 -10,4 -17,2Z" fill="#EDE0C8" stroke="#A88C6A" stroke-width="2.2"/><path d="M-11,-2 C-8,-9 6,-10 11,-3" stroke="#C8B08C" stroke-width="2" fill="none"/></g>`;
  },
  pepperG(x, y, rnd) { return pepper(x, y, rnd, '#3E9B3F', '#7CCB5E'); },
  pepperR(x, y, rnd) { return pepper(x, y, rnd, '#D2321F', '#F37A5A'); },
  tomato(x, y, rnd) {
    const r = 17 + rnd() * 5;
    let s = `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rnd() * 360)})"><circle r="${f(r)}" fill="#E24A2E"/><circle r="${f(r * 0.78)}" fill="#F0664A"/>`;
    for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU; s += `<ellipse cx="${f(Math.cos(a) * r * 0.45)}" cy="${f(Math.sin(a) * r * 0.45)}" rx="${f(r * 0.22)}" ry="${f(r * 0.13)}" transform="rotate(${f((a * 180) / Math.PI)} ${f(Math.cos(a) * r * 0.45)} ${f(Math.sin(a) * r * 0.45)})" fill="#F9C46B"/>`; }
    return s + `<circle r="${f(r * 0.16)}" fill="#F7B49C"/></g>`;
  },
  mozz(x, y, rnd) {
    return `<path d="${blob(20 + rnd() * 9, 10, 0.35, rnd, x, y)}" fill="#FFF7E6"/><path d="${blob(9 + rnd() * 4, 8, 0.3, rnd, x - 4, y - 4)}" fill="#fff" opacity=".9"/>`;
  },
  basil(x, y, rnd) { return basil(x, y, 34 + rnd() * 16, rnd() * 360, rnd); },
  onion(x, y, rnd) {
    const r = 15 + rnd() * 6, a0 = rnd() * TAU;
    return `<path d="M${f(x + Math.cos(a0) * r)},${f(y + Math.sin(a0) * r)} A${f(r)},${f(r)} 0 0 1 ${f(x + Math.cos(a0 + 2.4) * r)},${f(y + Math.sin(a0 + 2.4) * r)}" stroke="#B35C9E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${f(x + Math.cos(a0) * (r - 4))},${f(y + Math.sin(a0) * (r - 4))} A${f(r - 4)},${f(r - 4)} 0 0 1 ${f(x + Math.cos(a0 + 2.4) * (r - 4))},${f(y + Math.sin(a0 + 2.4) * (r - 4))}" stroke="#F1D9EA" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  },
  chili(x, y, rnd) { return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.6 + rnd() * 1.6)}" fill="#9E1F12"/>`; },
};

function pepper(x, y, rnd, c, hi) {
  const r = 18 + rnd() * 8, a0 = rnd() * TAU, sw = 2.2 + rnd();
  const p = (rr) => `M${f(x + Math.cos(a0) * rr)},${f(y + Math.sin(a0) * rr)} A${f(rr)},${f(rr * 0.85)} 0 0 1 ${f(x + Math.cos(a0 + sw) * rr)},${f(y + Math.sin(a0 + sw) * rr)}`;
  return `<path d="${p(r)}" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${p(r - 1)}" stroke="${hi}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"/>`;
}

export const RECIPES = {
  margherita: { tomato: 5, mozz: 8, basil: 9, chili: 0 },
  diavola: { pepperoni: 14, chili: 30, basil: 3, olive: 4 },
  fourcheese: { mozz: 12, basil: 3, chili: 12 },
  supreme: { pepperoni: 7, pepperG: 7, pepperR: 5, mushroom: 6, olive: 8, onion: 4 },
  veggie: { pepperG: 10, pepperR: 9, mushroom: 8, olive: 10, tomato: 3 },
};

// The pizza drawing (no <svg> wrapper). viewBox is -250 -250 500 500, crust radius ~232.
function pizzaBody(seed, recipe, id, cuts) {
  const rnd = rng(seed);
  let s = `<defs>
    <radialGradient id="${id}crust"><stop offset=".72" stop-color="#F3C47A"/><stop offset=".9" stop-color="#E29A4E"/><stop offset="1" stop-color="#B8662C"/></radialGradient>
    <radialGradient id="${id}cheese" cx=".45" cy=".42"><stop offset="0" stop-color="#FFE9A8"/><stop offset=".7" stop-color="#F9CF6A"/><stop offset="1" stop-color="#EDB048"/></radialGradient>
    <radialGradient id="${id}pep" cx=".4" cy=".38"><stop offset="0" stop-color="#D8402A"/><stop offset=".8" stop-color="#B42A1A"/><stop offset="1" stop-color="#8E1E12"/></radialGradient>
  </defs>`;
  s += `<path d="${blob(232, 30, 0.035, rnd)}" fill="url(#${id}crust)"/>`;
  for (let i = 0; i < 46; i++) {
    const a = rnd() * TAU, r = 206 + rnd() * 22, w = 5 + rnd() * 12;
    s += `<ellipse cx="${f(Math.cos(a) * r)}" cy="${f(Math.sin(a) * r)}" rx="${f(w)}" ry="${f(w * 0.45)}" transform="rotate(${f((a * 180) / Math.PI + 90)} ${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)})" fill="${rnd() < 0.6 ? '#9C4D1D' : '#FFE0A6'}" opacity="${f(0.18 + rnd() * 0.3)}"/>`;
  }
  s += `<path d="${blob(201, 36, 0.05, rnd)}" fill="#B9301C"/>`;
  s += `<path d="${blob(194, 44, 0.09, rnd)}" fill="url(#${id}cheese)"/>`;
  for (let i = 0; i < 26; i++) {
    const a = rnd() * TAU, r = Math.sqrt(rnd()) * 175;
    s += `<path d="${blob(8 + rnd() * 16, 8, 0.4, rnd, Math.cos(a) * r, Math.sin(a) * r)}" fill="${rnd() < 0.55 ? '#FFF2C4' : '#E59E3E'}" opacity="${f(0.35 + rnd() * 0.4)}"/>`;
  }
  const taken = [];
  for (const [kind, n] of Object.entries(recipe)) {
    const pts = scatter(rnd, n, kind === 'chili' ? 180 : 160, kind === 'chili' ? 6 : 34, kind === 'chili' ? [] : taken);
    for (const [x, y] of pts) s += TOP[kind](x, y, rnd, id);
  }
  if (cuts) for (let i = 0; i < cuts; i++) {
    const a = (i / cuts) * TAU - Math.PI / 2 - Math.PI / cuts;
    s += `<line x1="0" y1="0" x2="${f(Math.cos(a) * 234)}" y2="${f(Math.sin(a) * 234)}" stroke="#7A3514" stroke-width="2.5" opacity=".35"/>`;
  }
  return s;
}

// mode: whole | rest (pizza minus one slice) | slice. Slice k=0 points up (centred on -90deg).
export function pizzaSVG({ seed = 1, recipe = RECIPES.supreme, mode = 'whole', cuts = 8, cls = '' } = {}) {
  const id = `pz${++uid}`;
  const half = Math.PI / cuts, a0 = -Math.PI / 2 - half, a1 = -Math.PI / 2 + half, R = 300;
  const wedge = `M0,0 L${f(Math.cos(a0) * R)},${f(Math.sin(a0) * R)} A${R},${R} 0 0 1 ${f(Math.cos(a1) * R)},${f(Math.sin(a1) * R)}Z`;
  let clip = '';
  if (mode === 'slice') clip = `<clipPath id="${id}clip"><path d="${wedge}"/></clipPath>`;
  if (mode === 'rest') clip = `<clipPath id="${id}clip"><path clip-rule="evenodd" d="M-300,-300H300V300H-300Z ${wedge}"/></clipPath>`;
  const body = pizzaBody(seed, recipe, id, mode === 'whole' ? cuts : cuts);
  return `<svg class="pizza ${cls}" viewBox="-250 -250 500 500" aria-hidden="true">${clip}<g ${clip ? `clip-path="url(#${id}clip)"` : ''}>${body}</g></svg>`;
}

// ---- flat vector pizza (hero): thick orange crust, wavy sauce ring, flat cheese ----
export const FLAT = { crust: '#F5A23C', bevel: '#F9BD6B', sauce: '#E2333B', sauceD: '#C9262F', cheeseB: '#EFCB45', cheese: '#F5E163', side: ['#EE8C2C', '#D8651B'] };

function wavy(r, freq, amp, rnd, n = 96) {
  const ph = rnd() * TAU, ph2 = rnd() * TAU, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    pts.push([Math.cos(a) * r * (1 + amp * Math.sin(freq * a + ph) + amp * 0.4 * Math.sin((freq + 3) * a + ph2)), Math.sin(a) * r * (1 + amp * Math.sin(freq * a + ph) + amp * 0.4 * Math.sin((freq + 3) * a + ph2))]);
  }
  return smooth(pts);
}

function flatLeaf(x, y, len, rot) {
  const w = len * 0.42;
  return `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)}) translate(${f(-len / 2)},0)">
    <path d="M0,0 C${f(len * 0.25)},${f(-w)} ${f(len * 0.75)},${f(-w * 0.9)} ${len},0Z" fill="#46A341"/>
    <path d="M0,0 C${f(len * 0.25)},${f(w)} ${f(len * 0.75)},${f(w * 0.9)} ${len},0Z" fill="#2E7F2E"/>
    <path d="M${f(len * 0.04)},0 L${f(len * 0.9)},0" stroke="#7CC768" stroke-width="${f(len * 0.035)}" stroke-linecap="round" opacity=".7"/></g>`;
}

function flatBody(seed, cuts = true) {
  const rnd = rng(seed);
  const crust = blob(234, 26, 0.045, rnd);
  let s = `<path d="${crust}" fill="${FLAT.crust}"/>`;
  s += `<path d="${blob(212, 26, 0.04, rnd)}" fill="${FLAT.bevel}"/>`;
  for (let i = 0; i < 16; i++) {
    const a = rnd() * TAU, r = 216 + rnd() * 12;
    s += `<circle cx="${f(Math.cos(a) * r)}" cy="${f(Math.sin(a) * r)}" r="${f(2.4 + rnd() * 2.6)}" fill="#FCD69A"/>`;
  }
  s += `<path d="${wavy(200, 7, 0.03, rnd)}" fill="${FLAT.sauceD}"/>`;
  s += `<path d="${wavy(194, 7, 0.032, rnd)}" fill="${FLAT.sauce}"/>`;
  s += `<path d="${wavy(181, 9, 0.04, rnd)}" fill="${FLAT.cheeseB}"/>`;
  s += `<path d="${wavy(173, 9, 0.042, rnd)}" fill="${FLAT.cheese}"/>`;
  const taken = [];
  for (const [x, y] of scatter(rnd, 9, 140, 58, taken)) {
    const r = 24 + rnd() * 4;
    s += `<g transform="translate(${f(x)},${f(y)})"><circle r="${f(r)}" fill="#C9414A" transform="translate(0,2.5)"/><circle r="${f(r)}" fill="#EA5A5E"/>`;
    for (let k = 0; k < 4; k++) { const a = rnd() * TAU, d = rnd() * r * 0.6; s += `<circle cx="${f(Math.cos(a) * d)}" cy="${f(Math.sin(a) * d)}" r="${f(2.5 + rnd() * 3)}" fill="#D7464C"/>`; }
    s += `</g>`;
  }
  for (const [x, y] of scatter(rnd, 7, 150, 40, taken)) s += flatLeaf(x, y, 46 + rnd() * 10, rnd() * 360);
  for (const [x, y] of scatter(rnd, 8, 158, 30, taken)) s += `<circle cx="${f(x)}" cy="${f(y)}" r="7.5" fill="none" stroke="#4A4A3C" stroke-width="5"/><circle cx="${f(x)}" cy="${f(y)}" r="7.5" fill="none" stroke="#6E6E5C" stroke-width="1.6" stroke-dasharray="6 40"/>`;
  for (let i = 0; i < 18; i++) {
    const a = rnd() * TAU, r = Math.sqrt(rnd()) * 160;
    s += `<circle cx="${f(Math.cos(a) * r)}" cy="${f(Math.sin(a) * r)}" r="${f(1.8 + rnd() * 1.4)}" fill="${i % 2 ? '#FFFFFF' : '#5E5E4A'}" opacity=".9"/>`;
  }
  // eight even cuts, on the same angles as the slice wedge
  if (cuts) for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU - Math.PI / 2 - Math.PI / 8, x = f(Math.cos(a) * 221), y = f(Math.sin(a) * 221);
    s += `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#B9661E" stroke-width="4" stroke-linecap="round" opacity=".55"/><line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#FFF4C2" stroke-width="1.2" opacity=".55" transform="translate(1.6,1.6)"/>`;
  }
  return { crust, body: s };
}

function wedgeClip(id, mode, cuts = 8) {
  const half = Math.PI / cuts, a0 = -Math.PI / 2 - half, a1 = -Math.PI / 2 + half, R = 300;
  const wedge = `M0,0 L${f(Math.cos(a0) * R)},${f(Math.sin(a0) * R)} A${R},${R} 0 0 1 ${f(Math.cos(a1) * R)},${f(Math.sin(a1) * R)}Z`;
  if (mode === 'slice') return `<clipPath id="${id}clip"><path d="${wedge}"/></clipPath>`;
  if (mode === 'rest') return `<clipPath id="${id}clip"><path clip-rule="evenodd" d="M-300,-300H300V300H-300Z ${wedge}"/></clipPath>`;
  return '';
}

// edge: a colour -> only the crust silhouette in that colour (stacked to give the pizza its thickness)
export function flatPizzaSVG({ seed = 7, mode = 'whole', edge = null, cuts = true, cls = '' } = {}) {
  const id = `fp${++uid}`;
  const clip = wedgeClip(id, mode);
  const { crust, body } = flatBody(seed, cuts);
  let inner = body;
  if (edge) {
    inner = `<path d="${crust}" fill="${edge}"/>`;
  }
  return `<svg class="pizza ${cls}" viewBox="-250 -250 500 500" aria-hidden="true">${clip}<g ${clip ? `clip-path="url(#${id}clip)"` : ''}>${inner}</g></svg>`;
}

// stretchy mozzarella strands; drawn in a 200x100 box, stretched with preserveAspectRatio=none
export function strandsSVG(seed = 3, [c1, c2] = ['#F9D477', '#FFE9A8']) {
  const rnd = rng(seed);
  let s = '';
  for (let i = 0; i < 11; i++) {
    const x = 14 + i * 17 + (rnd() - 0.5) * 8, dx = (rnd() - 0.5) * 18, w = 2.5 + rnd() * 5, sag = (rnd() - 0.5) * 14;
    const tw = w * (1.4 + rnd()), bw = w * (1.6 + rnd());
    s += `<path d="M${f(x - tw)},0 C${f(x - w * 0.4 + sag)},30 ${f(x + dx - w * 0.4 + sag)},70 ${f(x + dx - bw)},100 L${f(x + dx + bw)},100 C${f(x + dx + w * 0.4 + sag)},70 ${f(x + w * 0.4 + sag)},30 ${f(x + tw)},0Z" fill="${i % 3 ? c1 : c2}"/>`;
    if (rnd() < 0.5) s += `<path d="M${f(x)},6 C${f(x + sag * 0.5)},35 ${f(x + dx + sag * 0.5)},65 ${f(x + dx)},94" stroke="#FFF6D6" stroke-width="1.2" fill="none" opacity=".8"/>`;
  }
  return `<svg class="strands-svg" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
}

// soda in a glass, seen from above
export function glassSVG() {
  const id = `gl${++uid}`;
  const rnd = rng(77);
  let ice = '';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + rnd(), r = 30 + rnd() * 28, w = 26 + rnd() * 10;
    ice += `<rect x="${f(-w / 2)}" y="${f(-w / 2)}" width="${f(w)}" height="${f(w)}" rx="7" transform="translate(${f(Math.cos(a) * r)},${f(Math.sin(a) * r)}) rotate(${f(rnd() * 90)})" fill="#fff" opacity=".22" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`;
  }
  return `<svg class="glass" viewBox="-110 -110 220 220" aria-hidden="true"><defs>
    <radialGradient id="${id}c" cx=".45" cy=".4"><stop offset="0" stop-color="#A2461E"/><stop offset=".75" stop-color="#5C1D0D"/><stop offset="1" stop-color="#3A1007"/></radialGradient></defs>
    <circle r="104" fill="#F5F1EA" opacity=".55"/><circle r="104" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>
    <circle r="92" fill="url(#${id}c)"/>${ice}
    <g transform="rotate(-30)"><circle cx="38" cy="-30" r="24" fill="#F4E25B" stroke="#E7C83A" stroke-width="4"/><path d="M38,-30 l0,-20 M38,-30 l17,-10 M38,-30 l17,10 M38,-30 l0,20 M38,-30 l-17,10 M38,-30 l-17,-10" stroke="#FFF7B0" stroke-width="2"/></g>
    <rect x="-6" y="-100" width="12" height="96" rx="6" fill="#E1473A" transform="rotate(35)"/><rect x="-6" y="-100" width="4" height="96" rx="2" fill="#fff" opacity=".45" transform="rotate(35)"/>
    <path d="M-70,-60 A92,92 0 0 1 10,-100" stroke="#fff" stroke-width="6" fill="none" opacity=".5" stroke-linecap="round"/></svg>`;
}

// round badge with text running around the edge
export function stickerSVG({ text = 'TAKE A SLICE • TAKE A SLICE • ', bg = '#F2B33D', fg = '#1E1917', center = 'mark', cls = '' } = {}) {
  const id = `st${++uid}`;
  const inner = center === 'line' ? markLineSVG('st-mark') : markSVG('st-mark');
  return `<div class="sticker ${cls}" style="--bg:${bg};--fg:${fg}">
    <svg class="st-ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="${id}" d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0"/></defs>
    <circle cx="100" cy="100" r="97" fill="${bg}"/><circle cx="100" cy="100" r="88" fill="none" stroke="${fg}" stroke-width="1.5" stroke-dasharray="2 5" opacity=".6"/>
    <text font-family="Rammetto One" font-size="17" letter-spacing="2.2" fill="${fg}"><textPath href="#${id}">${text}</textPath></text></svg>
    <div class="st-center" style="color:${fg}">${inner}</div></div>`;
}

// scalloped "popular" badge
export function popularSVG() {
  const pts = [];
  for (let i = 0; i < 48; i++) { const a = (i / 48) * TAU, r = i % 2 ? 46 : 50; pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]); }
  return `<svg class="popular" viewBox="0 0 100 100" aria-hidden="true"><path d="${smooth(pts)}" fill="#E1473A"/>
    <g font-family="Inter Tight" font-weight="700" font-size="11" fill="#F6EFE6" text-anchor="middle" transform="rotate(-18 50 50)">
    <text x="50" y="38">Popular</text><text x="50" y="54">Popular</text><text x="50" y="70">Popular</text></g></svg>`;
}

// decorative QR-like code (demo)
export function qrSVG(seed = 5) {
  const rnd = rng(seed), n = 21;
  let s = '';
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="currentColor"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="currentColor"/>`;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const inF = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    if (!inF && rnd() < 0.48) s += `<rect x="${x}" y="${y}" width="1" height="1" fill="currentColor"/>`;
  }
  return `<svg class="qr" viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges" aria-hidden="true"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/>${s}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
}

// pizza cutter seen from the side; the wheel spins as .cutter-wheel
export function cutterSVG() {
  const id = `ct${++uid}`;
  let spokes = '';
  for (let i = 0; i < 6; i++) spokes += `<line x1="0" y1="0" x2="${f(Math.cos((i / 6) * TAU) * 44)}" y2="${f(Math.sin((i / 6) * TAU) * 44)}" stroke="#8D949A" stroke-width="2"/>`;
  return `<svg class="cutter" viewBox="-80 -230 300 300" aria-hidden="true"><defs>
    <radialGradient id="${id}m" cx=".35" cy=".3"><stop offset="0" stop-color="#F4F6F7"/><stop offset=".6" stop-color="#C3C9CE"/><stop offset="1" stop-color="#8A9298"/></radialGradient></defs>
    <g transform="rotate(-38)"><rect x="-9" y="-215" width="18" height="160" rx="9" fill="#1E1917"/><rect x="-5" y="-208" width="5" height="140" rx="2.5" fill="#fff" opacity=".18"/>
    <rect x="-7" y="-62" width="14" height="62" fill="#B9C0C5"/></g>
    <g class="cutter-wheel"><circle r="62" fill="url(#${id}m)"/><circle r="62" fill="none" stroke="#6F777D" stroke-width="2"/><circle r="56" fill="none" stroke="#fff" stroke-width="1.5" opacity=".6"/>${spokes}<circle r="11" fill="#1E1917"/><circle r="4" fill="#C3C9CE"/></g></svg>`;
}

// wooden serving board, top view
export function boardSVG() {
  const id = `bd${++uid}`, rnd = rng(31);
  let grain = '';
  for (let i = 0; i < 22; i++) { const y = -250 + i * 23 + rnd() * 8; grain += `<path d="M-260,${f(y)} C-120,${f(y + (rnd() - 0.5) * 20)} 80,${f(y + (rnd() - 0.5) * 20)} 260,${f(y)}" stroke="#8A5226" stroke-width="${f(1 + rnd() * 2)}" fill="none" opacity="${f(0.15 + rnd() * 0.25)}"/>`; }
  return `<svg class="board" viewBox="-260 -260 520 520" aria-hidden="true"><defs><clipPath id="${id}"><circle r="256"/></clipPath>
    <radialGradient id="${id}g" cx=".45" cy=".4"><stop offset="0" stop-color="#E2A869"/><stop offset="1" stop-color="#B9773C"/></radialGradient></defs>
    <circle r="256" fill="url(#${id}g)"/><g clip-path="url(#${id})">${grain}</g><circle r="256" fill="none" stroke="#8F5525" stroke-width="5"/></svg>`;
}

export const MARK = markSVG;
