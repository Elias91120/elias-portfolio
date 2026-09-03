# Elias Elloumi — Portfolio

Data & AI engineer portfolio: a 3D portrait hero, a scroll-driven proof band, and
a stack of project cards backed by real numbers. Bilingual (EN / FR), dark, and
deliberately light on the wire.

Live: [elias-elloumi.com](https://elias-elloumi.com)

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev) — entrance reveals, scroll-linked text, sticky card stack
- [three.js](https://threejs.org) — the 3D portrait, loaded progressively

## The 3D portrait

The hero is a real 3D model of Elias, generated with Meshy from a photograph.
Getting it onto a landing page without hurting anyone on a weak connection took
three steps:

1. **The model is compressed.** The Meshy export is ~9.7 MB. `gltf-transform`
   simplifies the mesh to 56k triangles, resizes the three textures to 1024 and
   converts them to WebP, then applies meshopt quantisation — **568 KB**.
2. **A poster paints first.** `scripts/render-head-poster.mjs` renders the model
   once, headless, with exactly the lighting used at runtime, and saves a 50 KB
   transparent WebP. It is server-rendered and is the LCP element.
3. **The canvas upgrades in the background.** three.js and the model are fetched
   only once the browser is idle, and only when the connection allows it. On a
   data-saver or 2G connection, or with reduced motion enabled, the poster
   simply stays — a complete hero, not a degraded one.

Regenerate the poster after changing the model or the lighting:

```bash
npm run build:poster
```

## Performance

Everything on the page is budgeted. The story chapters and their seven video
clips were removed, the illustration set was replaced by CSS lighting, and the
runtime-generated world map became a pre-rendered image.

| | Before | Now |
|---|---|---|
| `public/` | 25 MB | 1.6 MB |
| LCP (local, unthrottled) | — | ~200 ms |
| Page weight without the 3D model | — | ~715 KB |
| Page weight on a throttled 3G connection | — | ~410 KB (model skipped) |

Notable cuts: `dotted-map` + `proj4` (~390 KB) replaced by a build-time image;
`motion` and `framer-motion` were the same library installed twice; `gsap` went
out with the story section; `react-markdown` now loads only when the assistant
actually answers; the accent serif loads only on case-study routes.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run build:poster` | Re-render the 3D portrait poster from `public/3d/head.glb` |
| `npm run build:map` | Re-render the dotted world map to `public/world-dots.webp` |
| `npm run audit:responsive` | Check 7 viewports for horizontal overflow, sub-44px touch targets and sub-11px text |

`audit:responsive` expects a server on `http://localhost:3000`; pass a URL to
point it at a production build instead.

## Structure

- `app/` — layout, page, global styles, OG card, case-study routes
- `components/v2/` — the landing page: `Hero`, `Head3D`, `Marquee`, `About`,
  `Expertise`, `WorkStack`, `OtherWork`, `Path`, `Skills`, `Recommendations`, `Contact`
- `components/case-study/` — the per-project deep dives
- `lib/content.ts` — identity, navigation, about copy, expertise
- `lib/work.ts` — the featured project cards and the secondary grid
- `lib/people.ts` — recommendations, career path, skills, contact
- `lib/i18n.tsx` — the EN/FR provider; every string is a `{ en, fr }` pair
- `lib/data.ts` — an English-resolved view of the above, for the AI assistant and dev terminal

To change copy, edit `lib/content.ts`, `lib/work.ts` or `lib/people.ts` — the
components hold no text of their own.

## Notes

- **Bilingual.** The language switch lives in the navbar and persists per visitor.
  The page renders in English on the server and applies the stored or browser
  preference right after hydration, so server and client markup always match.
- **Responsive.** One implementation, mobile-first, with `clamp()` typography
  throughout. The project cards pin and stack on desktop and become a plain
  vertical list on a phone, where a pinned card would only clip itself.
- **Reduced motion** disables the 3D canvas, the card stack and every reveal.
- **Environment variable** (portfolio assistant): set `THREEGEEKS_API_KEY` to the
  private studio API bearer token. Optional: `THREEGEEKS_MODEL`.
