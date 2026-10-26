import '@fontsource/rammetto-one';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/inter-tight/700.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { markSVG, wordSVG, wordLettersSVG } from './logo.js';
import { pizzaSVG, flatPizzaSVG, FLAT, strandsSVG, glassSVG, stickerSVG, popularSVG, cutterSVG, boardSVG, basil, rng, RECIPES } from './art.js';

gsap.registerPlugin(ScrollTrigger);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const mobile = () => innerWidth <= 760;

/* ---------------- build ---------------- */
$$('[data-mark]').forEach((el) => el.insertAdjacentHTML('beforeend', markSVG()));
$$('[data-word]').forEach((el) => el.insertAdjacentHTML('beforeend', wordSVG()));
$('#heroWord').innerHTML = wordLettersSVG();
$('#heroSticker').innerHTML = stickerSVG({ text: 'TAKE A SLICE • TAKE A SLICE • ', bg: '#F2B33D', center: 'line' });
$$('[data-leaf]').forEach((el, i) => {
  el.innerHTML = `<svg viewBox="-40 -30 80 60">${basil(0, 0, 70, -20 + i * 50, rng(40 + i))}</svg>`;
});

// hero pizza: flat vector style; stacked crust silhouettes under the top give it a dough wall in 3D
const HERO_SEED = 7, EDGE_LAYERS = 12;
const mix = (a, b, t) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.substr(i, 2), 16) * (1 - t) + parseInt(b.substr(i, 2), 16) * t).toString(16).padStart(2, '0')).join('');
const edges = (mode) => Array.from({ length: EDGE_LAYERS }, (_, k) =>
  `<div class="pz-edge" style="--k:${k + 1}">${flatPizzaSVG({ seed: HERO_SEED, mode, edge: mix(FLAT.side[0], FLAT.side[1], k / (EDGE_LAYERS - 1)) })}</div>`).join('');
$('#pzRest').innerHTML = edges('rest') + flatPizzaSVG({ seed: HERO_SEED, mode: 'rest', cls: 'pz-top' });
$('#pzSlice').innerHTML = edges('slice') + flatPizzaSVG({ seed: HERO_SEED, mode: 'slice', cls: 'pz-top' });
const strands = $('#pzStrands');
strands.classList.add('s1');
strands.innerHTML = strandsSVG(3, ['#F5E163', '#FFF3A6']);
const strands2 = strands.cloneNode(false);
strands2.className = 'pz-strands s2';
strands2.innerHTML = strandsSVG(9, ['#F5E163', '#FFF3A6']);
strands.after(strands2);
$('#glass').innerHTML = glassSVG();
$('#inlinePz').innerHTML = pizzaSVG({ seed: 4, recipe: RECIPES.diavola });

const PIZZAS = [
  { name: 'Margherita', note: 'Tomato, fior di latte, basil', price: 14, seed: 21, recipe: RECIPES.margherita, qty: 1 },
  { name: 'Diavola', note: 'Spicy salami, chilli, olives', price: 17, seed: 22, recipe: RECIPES.diavola, qty: 1 },
  { name: 'Four Cheese', note: 'Mozzarella, gorgonzola, parm, fontina', price: 16, seed: 23, recipe: RECIPES.fourcheese, qty: 1 },
  { name: 'Shogun Supreme', note: 'Everything, sliced in silence', price: 19, seed: 24, recipe: RECIPES.supreme, qty: 1, popular: true },
];
$('#cards').innerHTML = PIZZAS.map((p, i) => `
  <article class="card" data-i="${i}">
    ${p.popular ? popularSVG() : ''}
    <h3>${p.name}</h3><p class="price-note">${p.note}</p>
    <div class="pz-card">${pizzaSVG({ seed: p.seed, recipe: p.recipe })}</div>
    <div class="stepper"><button data-d="-1" aria-label="Remove one">−</button><span class="q">${p.qty}</span><button data-d="1" aria-label="Add one">+</button></div>
    <button class="add">Add to cart · <b>$${p.price}</b></button>
  </article>`).join('');

$('[data-board]').innerHTML = boardSVG();
$('#photoPz').innerHTML = pizzaSVG({ seed: 31, recipe: RECIPES.diavola, cuts: 0 });
$('#cutter').innerHTML = cutterSVG();
$('#stickers').innerHTML =
  stickerSVG({ text: 'TAKE A SLICE • TAKE A SLICE • ', bg: '#F2B33D' }) +
  stickerSVG({ text: 'NINJA DELIVERY • NINJA DELIVERY • ', bg: '#1E1917', fg: '#F3EEE6', center: 'line' }) +
  stickerSVG({ text: 'HOT IN 30 • HOT IN 30 • HOT IN 30 • ', bg: '#E1473A', fg: '#F3EEE6' });

// marquee rows: words repeat, every few is red
const ROWS = ['NINJA', 'DELIVERY', 'PIZZA', 'TAKEAWAY', 'NINJA'];
$('#marquee').innerHTML = ROWS.map((w, r) => `<div class="mq-row">${Array.from({ length: 9 }, (_, i) => `<span class="${(i + r * 2) % 4 === 2 ? 'r' : ''}">${w}</span>`).join('')}</div>`).join('');
$('#fly1').innerHTML = pizzaSVG({ seed: 41, recipe: RECIPES.veggie, mode: 'rest' });
$('#fly2').innerHTML = pizzaSVG({ seed: 42, recipe: RECIPES.supreme, mode: 'rest' });

const strip = (n) => `<div class="strip">${Array.from({ length: n }, () => `<span>NINJAPIZZA</span>${markSVG()}`).join('')}</div>`;
$('#box').innerHTML = `<div class="box-tilt" id="boxTilt"><div class="box" id="boxSpin">
  <div class="face lid">
    <div class="lid-word">${wordSVG()}</div>
    <span class="lid-n" style="left:22%">20</span><div class="lid-mark">${markSVG()}</div><span class="lid-n" style="right:22%">26</span>
    <p class="lid-tag">Pizza that strikes fast<br/>and leaves no crumbs</p>
    <div class="lid-st">${stickerSVG({ text: 'TAKE A SLICE • TAKE A SLICE • ', bg: '#1E1917', fg: '#F3EEE6', center: 'line' })}</div>
    <div class="lid-band"></div>
  </div>
  <div class="face base"></div>
  <div class="face sx right">${strip(3)}</div><div class="face sx left">${strip(3)}</div>
  <div class="face sy top">${strip(3)}</div><div class="face sy bottom">${strip(3)}</div>
</div></div>`;
// unwrap: #box is the positioned shell, #boxTilt/#boxSpin do the 3D work
const boxPos = $('#boxPos');
boxPos.innerHTML = $('#box').innerHTML;

$('#flyers').innerHTML = ['f1', 'f2', 'f3'].map((c) => `
  <div class="flyer ${c}"><p class="ft">‘NINJA’</p><div class="fm"><span>20</span>${markSVG()}<span>26</span></div>
  <p class="fl">Pizza that strikes fast<br/>and leaves no crumbs</p><p class="fs">Hand-stretched · Wood-fired · At your door in 30</p></div>`).join('');

const REVIEWS = [
  ['Amaya R', 'Kochi', 'Ordered at midnight, it was at my door before I found the remote. Crust was blistered and the Diavola actually had a kick.'],
  ['Dev S', 'Kakkanad', 'The Margherita is the real deal. Simple, salty, a cheese pull you could film. Already ordered twice this week.'],
  ['Noor K', 'Fort Kochi', 'Box came still too hot to hold. The Shogun Supreme is loaded edge to edge, no sad bare slices anywhere.'],
  ['Rahul M', 'Edappally', 'Fast, friendly and the app is dead simple. Four Cheese with chilli flakes is my new Friday ritual.'],
  ['Leah P', 'Vyttila', 'Tried every pizza place in town. None of them come close on the dough. Light, chewy, properly charred.'],
];
const reviewHTML = REVIEWS.map(([n, loc, q], i) => `
  <div class="review"><q>${q}</q><div class="rv-foot">
    <div class="who"><span class="av" style="background:${['#E1473A', '#1E1917', '#C98A2A'][i % 3]}">${n[0]}</span>${n}</div>
    <div><span class="h">Location</span><span class="v" style="color:inherit;letter-spacing:0">${loc}</span></div>
    <div><span class="h">Rating</span><span class="v">★★★★★</span></div></div></div>`).join('');
$('#reviewsTrack').innerHTML = reviewHTML + reviewHTML;

$('#riser').innerHTML = markSVG() + `<div class="slice-hand">${pizzaSVG({ seed: 12, recipe: RECIPES.margherita, mode: 'slice' })}</div>`;
$('#finaleWord').innerHTML = wordLettersSVG();

/* ---------------- smooth scroll ---------------- */
const lenis = new Lenis({ lerp: 0.1 });
window.lenis = lenis;
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  e.preventDefault();
  const t = $(id);
  if (t) lenis.scrollTo(id === '#order' ? t.offsetTop + t.offsetHeight - innerHeight : t, { duration: 1.6 });
}));

/* ---------------- hero pizza rig ---------------- */
// one pizza flies from the hero plate to the red panel; everything is driven from this state
const pz = { x: 0, y: 0, sc: 1, tilt: 58, spin: 0, plate: 1, lift: 0, bob: 0, out: 0, srot: 0, shadow: 0 };
const pzPos = $('#pzPos'), pzTilt = $('#pzTilt'), pzSpin = $('#pzSpin'), pzSlice = $('#pzSlice'), pzPlate = $('#pzPlate'), pzShadow = $('#pzShadow');
let S = 600;
let L = {}; // layout targets

function layout() {
  const w = innerWidth, h = innerHeight;
  if (mobile()) {
    S = w * 0.9;
    L = { hx: w * 0.5, hy: h * 0.64, rx: w * 0.52, ry: h * 0.32, rsc: (w * 0.64) / S, lift: S * 0.17, spin: 60 };
  } else {
    S = Math.min(w * 0.44, h * 0.9);
    L = { hx: w * 0.5, hy: h * 0.64, rx: w * 0.33, ry: h * 0.5, rsc: Math.min(w * 0.4, h * 0.74) / S, lift: S * 0.15, spin: 135 };
  }
  pzPos.style.setProperty('--S', `${S}px`);
  pzPos.style.setProperty('--T', `${S * 0.06}px`);
}

function applyPz() {
  const lift = Math.max(0, pz.lift * (1 + pz.bob));
  pzPos.style.transform = `translate3d(${pz.x - S / 2}px, ${pz.y - S / 2}px, 0) scale(${pz.sc})`;
  pzTilt.style.transform = `rotateX(${pz.tilt}deg)`;
  pzSpin.style.transform = `rotate(${pz.spin}deg)`;
  pzPlate.style.transform = `translateZ(${-S * 0.06 - 3}px) scale(${pz.plate})`;
  pzPlate.style.opacity = Math.min(1, pz.plate * 1.5);
  pzSlice.style.transform = `translate3d(0, ${-pz.out * S}px, ${lift + 2}px) rotate(${pz.srot}deg)`;
  const st = `rotateX(-90deg)`;
  for (const [el, k] of [[strands, 1], [strands2, 0.92]]) {
    el.style.height = `${lift * k}px`;
    el.style.transform = st;
    el.style.opacity = lift > 3 ? 1 : 0;
  }
  pzShadow.style.opacity = Math.min(1, lift / (S * 0.1)) * 0.9 + pz.shadow;
}

layout();
Object.assign(pz, { x: L.hx, y: L.hy });
applyPz();

/* ---------------- intro ---------------- */
const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 });
intro
  .from('#heroWord .wl', { y: -6400, duration: 1.3, stagger: 0.045 })
  .from(pz, { sc: 0.4, spin: -160, plate: 0, duration: 1.6, onUpdate: applyPz }, 0.15)
  .from(pzPos, { opacity: 0, duration: 0.5 }, 0.15)
  .to(pz, { lift: () => L.lift, duration: 1.4, ease: 'elastic.out(1, 0.55)', onUpdate: applyPz }, 0.95)
  .from('#heroSticker', { scale: 0, rotate: -120, duration: 1.1, ease: 'back.out(2)' }, 0.8)
  .from('.leaf', { scale: 0, rotate: -90, duration: 1, stagger: 0.12, ease: 'back.out(2.4)' }, 1.1)
  .from(['.hero-tag', '.hero-app', '.nav'], { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.6);

// idle: the lifted slice breathes, leaves drift
gsap.to(pz, { bob: 0.12, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1, onUpdate: applyPz });
$$('.leaf').forEach((el, i) => gsap.to(el, { y: -14 - i * 4, rotate: i % 2 ? 12 : -10, duration: 2.4 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));

/* ---------------- story scroll: hero -> red panel -> slice out ---------------- */
function storyTimeline() {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '#story', start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
  });
  const upd = { onUpdate: applyPz };
  tl.to('#heroWord', { yPercent: -60, opacity: 0, duration: 0.3 }, 0.06)
    .to(['.hero-tag', '.hero-app'], { y: -60, opacity: 0, duration: 0.2 }, 0.06)
    .to('#heroSticker', { y: -200, rotate: 160, opacity: 0, duration: 0.3 }, 0.06)
    .to('.leaf', { y: () => -innerHeight * 0.5, rotate: 200, opacity: 0, duration: 0.3, stagger: 0.02 }, 0.08)
    .to(pz, { lift: 0, duration: 0.18, ...upd }, 0.06)
    .to(pz, { plate: 0, duration: 0.2, ease: 'power2.in', ...upd }, 0.14)
    .fromTo('#redPanel', { clipPath: 'circle(0% at 50% 66%)' }, { clipPath: 'circle(150% at 50% 66%)', duration: 0.36, ease: 'power2.in' }, 0.12)
    .to(pz, { tilt: 0, x: () => L.rx, y: () => L.ry, sc: () => L.rsc, spin: () => L.spin, duration: 0.4, ease: 'power2.inOut', ...upd }, 0.14)
    .from('.red-copy > *', { y: 50, opacity: 0, duration: 0.14, stagger: 0.03 }, 0.42)
    .from('#glass', { x: () => -innerWidth * 0.3, y: -100, rotate: -90, duration: 0.2, ease: 'power3.out' }, 0.44)
    .to(pz, { out: 0.2, srot: 16, shadow: 0, duration: 0.26, ease: 'power2.out', ...upd }, 0.62)
    .to({}, { duration: 0.12 });
  return tl;
}
storyTimeline();

/* ---------------- menu ---------------- */
function rowsIn(scope) {
  $$('.big-title .row', scope).forEach((row) => {
    gsap.from(row.children.length ? row.children : row, {
      yPercent: 110, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: row, start: 'top 88%' },
    });
  });
}
rowsIn($('#menu'));
gsap.from('.menu-side > *, .menu-copy', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.menu-head', start: 'top 80%' } });
gsap.from('.card', { y: 120, opacity: 0, rotate: (i) => [-4, 2, -2, 5][i], duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '#cards', start: 'top 85%' } });
$$('.card .pz-card').forEach((el, i) => gsap.fromTo(el, { rotate: -90 - i * 20 }, { rotate: 90 + i * 20, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.5 } }));
gsap.from('.card .popular', { scale: 0, duration: 1, ease: 'back.out(3)', scrollTrigger: { trigger: '#cards', start: 'top 70%' } });

// cart
let cartCount = 2;
const cartN = $('#cartN');
$('#cards').addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  const p = PIZZAS[+card.dataset.i];
  const step = e.target.closest('.stepper button');
  if (step) {
    p.qty = Math.max(1, Math.min(9, p.qty + +step.dataset.d));
    $('.q', card).textContent = p.qty;
    gsap.fromTo($('.q', card), { scale: 1.6 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    return;
  }
  if (!e.target.closest('.add')) return;
  nav.classList.remove('hide');
  const from = $('.pz-card', card).getBoundingClientRect();
  const to = $('#cart').getBoundingClientRect();
  const clone = document.createElement('div');
  clone.className = 'fly-clone';
  clone.innerHTML = $('.pz-card', card).innerHTML;
  Object.assign(clone.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
  document.body.append(clone);
  const tx = to.left + to.width / 2 - (from.left + from.width / 2), ty = to.top + to.height / 2 - (from.top + from.height / 2);
  gsap.timeline({ onComplete: () => clone.remove() })
    .to(clone, { x: tx, duration: 0.8, ease: 'power1.in' }, 0)
    .to(clone, { y: ty, duration: 0.8, ease: 'back.in(1.4)' }, 0)
    .to(clone, { scale: 0.08, rotate: 540, duration: 0.8, ease: 'power2.in' }, 0)
    .add(() => {
      cartCount += p.qty;
      cartN.textContent = cartCount;
      gsap.fromTo('#cart', { rotate: -18, scale: 1.3 }, { rotate: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, .4)' });
    });
});

/* ---------------- share: cutter rolls through the pizza ---------------- */
rowsIn($('#delivery'));
gsap.from('.share-copy .eyebrow, .share-copy .body-copy, .share-copy .btn-ink', { y: 30, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.share-copy', start: 'top 75%' } });
gsap.from('.stickers .sticker', { scale: 0, rotate: -140, duration: 1.1, stagger: 0.15, ease: 'back.out(2.2)', scrollTrigger: { trigger: '#photo', start: 'top 70%' } });
gsap.fromTo('#photo', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '#photo', start: 'top 85%' } });
{
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#photo', start: 'top 65%', end: 'bottom 25%', scrub: 0.6 } });
  const photo = $('#photo'), cutter = $('#cutter');
  // wheel centre sits at x=80/300, y=230/300 of the cutter box; rest the wheel's bottom on the cut line
  // follow the projected cut line; the cutter box has its wheel centre at (80, 230) of 300
  const pos = (u) => {
    const pr = photo.getBoundingClientRect(), lr = $('#cutLine').getBoundingClientRect(), cw = cutter.offsetWidth;
    return { x: lr.left - pr.left + lr.width * u - cw * (80 / 300), y: lr.top + lr.height / 2 - pr.top - cw * (288 / 300) };
  };
  tl.fromTo(cutter, { x: () => pos(-0.25).x, y: () => pos(0).y }, { x: () => pos(1.05).x, y: () => pos(1).y, duration: 1 })
    .fromTo('#cutter .cutter-wheel', { rotate: 0 }, { rotate: 900, duration: 1 }, 0)
    .fromTo('#cutLine', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9 }, 0.12);
}

/* ---------------- dark: marquee, flying pizzas, box landing, flyers, reviews ---------------- */
const nav = $('#nav');
ScrollTrigger.create({ trigger: '#dark', start: 'top 40px', end: 'bottom 40px', toggleClass: { targets: nav, className: 'on-dark' } });
{
  const vw = () => innerWidth, vh = () => innerHeight;
  const bw = () => boxPos.offsetWidth;
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#dark', start: 'top bottom', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true } });
  // the section scrolls in for the first 100vh of its 600vh, so the stage is pinned from 1/6 onward.
  // explicit sets at 0 keep later actors parked off-stage even after a refresh invalidates the tweens
  tl.set(['#fly1', '#fly2'], { x: -9999 }, 0)
    .set('.flyer', { y: () => vh() * 1.2 }, 0)
    .set('#reviews', { yPercent: 102 }, 0)
    .set(boxPos, { y: () => vh() * 1.3 }, 0);
  $$('.mq-row').forEach((row, i) => {
    const dir = i % 2 ? 1 : -1;
    tl.fromTo(row, { x: () => (dir > 0 ? -row.scrollWidth * 0.35 : -row.scrollWidth * 0.05) }, { x: () => (dir > 0 ? -row.scrollWidth * 0.05 : -row.scrollWidth * 0.35), duration: 0.5 }, 0);
  });
  tl.fromTo('#fly1', { x: () => -vw() * 0.2, y: () => vh() * 0.9, rotate: -40 }, { x: () => vw() * 1.05, y: () => -vh() * 0.25, rotate: 320, duration: 0.36 }, 0.08)
    .fromTo('#fly2', { x: () => vw() * 1.05, y: () => vh() * 0.75, rotate: 60 }, { x: () => -vw() * 0.2, y: () => vh() * 0.05, rotate: -300, duration: 0.36 }, 0.16)
    .to('#marquee', { y: () => -vh() * 1.1, duration: 0.14, ease: 'power1.in' }, 0.36)
    // box: tumbles in from the bottom right, lands over the cream plate
    .fromTo(boxPos, { x: () => vw() * 0.92 - bw() / 2, y: () => vh() * 1.1, scale: 0.35 }, { x: () => vw() * 0.7 - bw() / 2, y: () => vh() * 0.55, scale: 0.45, duration: 0.18 }, 0.18)
    .to(boxPos, { x: () => vw() * 0.5 - bw() / 2, y: () => vh() * 0.47 - bw() / 2, scale: 1, duration: 0.16, ease: 'power2.inOut' }, 0.36)
    .fromTo('#boxTilt', { rotationX: 20, rotationY: -50 }, { rotationX: 58, rotationY: 0, duration: 0.34, ease: 'power2.out' }, 0.18)
    .fromTo('#boxSpin', { rotation: 140 }, { rotation: -32, duration: 0.34, ease: 'power2.out' }, 0.18)
    .to('#boxPlate', { scale: 1, duration: 0.12, ease: 'back.out(1.6)' }, 0.42)
    .to(boxPos, { y: () => vh() * 0.44 - bw() / 2, duration: 0.06, ease: 'sine.inOut' }, 0.52)
    // box leaves upward, flyers fan in from below
    .to([boxPos, '#boxPlate'], { y: (i) => (i ? -vh() * 1.2 : -vh() * 0.8 - bw()), duration: 0.14, ease: 'power2.in' }, 0.6)
    .fromTo('.flyer', { y: () => vh() * 1.1, rotate: (i) => [-30, 10, 34][i] }, { y: 0, rotate: (i) => [-13, -3, 11][i], duration: 0.16, stagger: 0.03, ease: 'power3.out' }, 0.64)
    .fromTo('#reviews', { yPercent: 102 }, { yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.82)
    .to('.flyer', { y: () => -vh() * 0.16, duration: 0.12, ease: 'power3.out' }, 0.82)
    .to({}, { duration: 0.06 });
}

/* ---------------- finale: ninja rises from the hole, wordmark settles ---------------- */
{
  const vh = () => innerHeight;
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#order', start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true } });
  tl.fromTo('#riser', { yPercent: 105, rotate: -8 }, { yPercent: 0, rotate: 0, duration: 0.3, ease: 'back.out(1.4)' }, 0)
    .fromTo('#riser .slice-hand', { rotate: -50, scale: 0.4, opacity: 0 }, { rotate: 28, scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(2)' }, 0.18)
    .from('#finaleWord .wl', { y: -6400, duration: 0.28, stagger: 0.012, ease: 'power3.out' }, 0.12)
    .to('#holeWrap', { y: () => -vh() * 0.62, duration: 0.3, ease: 'power2.in' }, 0.56)
    .to('#finaleWord', { y: () => -vh() * (mobile() ? 0.38 : 0.4), duration: 0.32, ease: 'power2.inOut' }, 0.56)
    .fromTo('#finaleCopy', { opacity: 0, y: () => vh() * 0.2 }, { opacity: 1, y: () => -vh() * (mobile() ? 0.39 : 0.15), duration: 0.32, ease: 'power2.inOut' }, 0.6)
    .fromTo('.footer', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, 0.72)
    .to({}, { duration: 0.1 });
}

/* ---------------- nav: hides on the way down, returns on the way up ---------------- */
let lastY = 0;
lenis.on('scroll', ({ scroll }) => {
  const d = scroll - lastY;
  if (Math.abs(d) > 4) nav.classList.toggle('hide', d > 0 && scroll > 120);
  lastY = scroll;
});
ScrollTrigger.create({ trigger: '#story', start: '30% top', end: 'bottom top', toggleClass: { targets: nav, className: 'on-red' } });

/* ---------------- resize ---------------- */
let rt;
addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => {
    layout();
    ScrollTrigger.refresh();
    if (scrollY < 10) Object.assign(pz, { x: L.hx, y: L.hy });
    applyPz();
  }, 150);
});
document.fonts.ready.then(() => ScrollTrigger.refresh());
