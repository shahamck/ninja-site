// Inline builders for the traced NinjaPizza logo (potrace output in assets/).
import markRaw from './assets/mark.svg?raw';
import wordRaw from './assets/word.svg?raw';
import lineRaw from './assets/markline.svg?raw';

function parse(raw) {
  const vb = raw.match(/viewBox="([^"]+)"/)[1];
  const g = raw.match(/<g transform="([^"]+)"/)[1];
  const paths = [...raw.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1].replace(/\s+/g, ' '));
  return { vb, g, paths };
}

const MARK = parse(markRaw);
const WORD = parse(wordRaw);
const LINE = parse(lineRaw);

// mark paths: 0 head (face cut out), 1-2 eyes, 3-4 bandana tails
const MARK_CLASS = ['m-head', 'm-eye', 'm-eye', 'm-tail m-tail1', 'm-tail m-tail2'];

export function markSVG(cls = '') {
  const p = MARK.paths.map((d, i) => `<path class="${MARK_CLASS[i] || ''}" d="${d}"/>`).join('');
  return `<svg class="mark ${cls}" viewBox="${MARK.vb}" aria-hidden="true"><g transform="${MARK.g}" fill="currentColor">${p}</g></svg>`;
}

export function wordSVG(cls = '', label = 'NinjaPizza') {
  const p = WORD.paths.map((d) => `<path d="${d}"/>`).join('');
  return `<svg class="word ${cls}" viewBox="${WORD.vb}" role="img" aria-label="${label}"><g transform="${WORD.g}" fill="currentColor">${p}</g></svg>`;
}

export function markLineSVG(cls = '') {
  const p = LINE.paths.map((d) => `<path d="${d}"/>`).join('');
  return `<svg class="markline ${cls}" viewBox="${LINE.vb}" aria-hidden="true"><g transform="${LINE.g}" fill="currentColor" fill-rule="evenodd">${p}</g></svg>`;
}

// the word "NinjaPizza" split into letters for staggered reveals (paths are in visual order by x)
export function wordLettersSVG(cls = '') {
  const items = WORD.paths
    .map((d) => ({ d, x: +d.match(/^M(-?\d+)/)[1] }))
    .sort((a, b) => a.x - b.x)
    .map(({ d }) => `<path class="wl" d="${d}"/>`)
    .join('');
  return `<svg class="word ${cls}" viewBox="${WORD.vb}" role="img" aria-label="NinjaPizza"><g transform="${WORD.g}" fill="currentColor">${items}</g></svg>`;
}
