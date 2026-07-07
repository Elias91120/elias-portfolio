# Elias Elloumi — Portfolio

A portfolio that reads like an illustrated book: each chapter is a full page that turns as you scroll — from a kid discovering Minecraft on his first PC to a data engineering & AI agent developer at Nokia and co-founder of 3geeks.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [GSAP + ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — pinned story, page-turn crossfades, snap-to-page, evolving ambient tone
- [Framer Motion](https://motion.dev) — section reveal animations
- Character illustrations generated with AI from real photos

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

- `app/` — layout, page, global styles
- `components/` — `Hero`, `Story` (the horizontal scrollytelling), `Skills`, `Projects`, `Contact`
- `lib/data.ts` — all content: chapters, skills, projects, contact info (edit this to update the site)
- `public/story/` — chapter illustrations

## Notes

- Desktop (≥1024px): the story section pins; scrolling turns full-screen pages (crossfade + slow cinematic drift) and always snaps to a full page, so it feels like reading, not scrolling. The navbar hides while the book is open.
- Mobile: the story falls back to a clean vertical flow, the ambient tone still evolves per chapter.
