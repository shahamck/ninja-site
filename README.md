# NinjaPizza — pizza that strikes fast

Brand website for NinjaPizza. Vite + GSAP ScrollTrigger + Lenis.

- Hero: the NinjaPizza wordmark with a flat 3D pizza cut into eight slices; one slice lifts with stretching cheese.
- On scroll the same pizza flattens into a red panel and the slice slides out.
- Menu cards with a working quantity stepper and add-to-cart, a pizza cutter rolling through a pizza, a word marquee with a 3D box landing, menu flyers and reviews.
- Finale: the ninja rises out of a red hole holding a slice, over the giant wordmark.

The logo is traced to SVG in `src/assets/`; every pizza and prop is drawn procedurally in `src/art.js`.

```bash
npm install
npm run dev
```

Copy, prices and reviews are placeholders.

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.
