# Elias Elloumi — Portfolio

A portfolio that reads like an illustrated book: each chapter is a full page that turns as you scroll — from a kid discovering Minecraft on his first PC to a data engineering & AI agent developer at Nokia and co-founder of 3geeks.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [GSAP + ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — pinned story, cinematic page turns, scroll-scrubbed cinemagraphs, snap-to-page, evolving ambient tone
- [Framer Motion](https://motion.dev) — section reveal animations
- Character illustrations generated with AI from real photos
- 7 chapter cinemagraph clips (`chapter-1.mp4` … `chapter-7.mp4`), scrubbed by scroll on desktop and looped on mobile
- Branded Open Graph card generated at build time with `next/og` (`app/opengraph-image.tsx`)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel (free)

Option 1 — CLI:

```bash
npx vercel
```

Option 2 — Git: push this repo to GitHub, then import it on [vercel.com/new](https://vercel.com/new). Every push deploys automatically. No environment variables needed.

## Structure

- `app/` — layout, page, global styles, Open Graph image
- `components/story/` — modular story book: `StorySection`, `StoryPage`, `StoryVideo`, `StoryProgress`, `useStoryScroll`
- `components/` — `Hero`, `Skills`, `Projects`, `Contact`
- `lib/data.ts` — all content: chapters, skills, projects, contact info (edit this to update the site)
- `public/story/` — chapter illustrations + cinemagraph clips
- `assets/fonts/` — TTFs embedded in the Open Graph card

## Notes

- Desktop (≥1024px): the story section pins; scrolling turns full-screen pages with cinematic dissolve transitions (blur, wipe accent, parallax text) and always snaps to a full page. The navbar hides while the book is open. All 7 clips are scroll-scrubbed with adaptive smoothing — the scene plays forward and backward as you scroll. Keyboard: Arrow Up/Down, Page Up/Down, Home, End.
- Mobile: vertical flow with fade-in scale on illustrations; clips loop when in view; compact chapter dots for navigation.
- Reduced motion: scrubbing, loops, and video layers are disabled; illustrations stay static with instant page cuts.
- Regenerate Ken Burns fallback clips: `node gen-cinemagraphs.mjs` (chapters 2–7 from JPG sources).
