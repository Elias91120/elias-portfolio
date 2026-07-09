# Portfolio project context (stable)

Use this in every generated prompt. Refresh file paths if the repo layout changed — verify with glob/grep before writing.

## Stack

- **Next.js 16** App Router, TypeScript, Tailwind v4
- **Framer Motion** — Hero, cards, AskWidget, StatsBand, Magnetic CTAs
- **GSAP + ScrollTrigger** — Story pin, video scrub, chapter dissolve (`components/story/useStoryScroll.ts`)
- **Mistral AI** — `app/api/ask/route.ts`, `MISTRAL_API_KEY`, model `mistral-small-latest`, `@mistralai/mistralai`
- **Playwright** — project screenshot scripts in repo root (`capture-projects*.mjs`)

## Design tokens

| Token | Value |
|-------|--------|
| Background | `#08060f` |
| Foreground | `#ece9f6` |
| Muted | `#9d97b5` |
| Accent | `#a78bfa` |
| Card | `#120e20` |

**Fonts:** Space Grotesk (`--font-display`), Inter (`--font-body`), Fraunces italic (`--font-story` / `--font-serif`)

**Motion ease:** `[0.22, 1, 0.36, 1]`

**Avatar:** `/story/avatar-hero.jpg`

**Aurora:** `.aurora`, `.aurora-slow` in `app/globals.css`; used in `components/Hero.tsx`

**Grain:** `body.grain` in `app/layout.tsx`

## Homepage structure (`app/page.tsx`)

```
ScrollProgress → Navbar → Hero → Story → StatsBand → Skills → Projects → Contact → Footer → AskWidget
```

## Key files

| Area | Path |
|------|------|
| Data (story, projects, contact) | `lib/data.ts` |
| Agent system prompt | `lib/agent-context.ts` |
| Hero | `components/Hero.tsx` |
| Story shell | `components/Story.tsx`, `components/story/StorySection.tsx` |
| Story scroll logic | `components/story/useStoryScroll.ts` |
| Story pages / video | `components/story/StoryPage.tsx`, `StoryVideo.tsx` |
| Projects | `components/Projects.tsx`, `components/ProjectCard.tsx` |
| Case study example | `app/projects/web-gen/page.tsx` |
| Contact | `components/Contact.tsx` |
| Ask widget | `components/AskWidget.tsx` |
| Stats | `components/StatsBand.tsx` (hardcoded stats, not in data.ts) |
| Globals / animations | `app/globals.css` |
| Layout / SEO | `app/layout.tsx`, `app/opengraph-image.tsx`, `app/sitemap.ts` |
| Magnetic buttons | `components/Magnetic.tsx` |
| Scroll progress | `components/ScrollProgress.tsx` |

## Critical constraints (mention when relevant)

1. **No `scroll-behavior: smooth` in CSS** — fights GSAP snap; anchor scroll handled in JS.
2. **`body[data-story]`** — hides Navbar during story pin (`globals.css` + `useStoryScroll.ts`).
3. **`prefers-reduced-motion`** — already disables float, aurora, story videos in `globals.css`; story hook also checks it.
4. **Story videos** — re-encoded MP4s in `/public/story/`; scrub via ScrollTrigger; mobile perf sensitive.
5. **Ask agent** — server-only API key; widget streams plain text from `/api/ask`.
6. **Site language** — UI copy mostly English; user target includes FR alternance 2026–2028.
7. **Domain** — `https://elias-elloumi.com`

## Owner facts (for copy in prompts)

- Elias Elloumi — full-stack, data engineering & AI agents
- Nokia apprenticeship, co-founder **webgen** (with Noam & Charles)
- M.Sc. EFREI Paris from Sept 2026; seeking apprenticeship 2026–2028
- Contact: `e.elloumi15@gmail.com`, LinkedIn in `lib/data.ts`
- Tagline candidate: **「AI agents developer — I ship products, not slides」**

## Existing WOW already shipped

- Project cards with live screenshots (WebP), browser frame, hover zoom
- Case study `/projects/web-gen`
- Ask my portfolio widget (Mistral)
- StatsBand animated counters after story
- ScrollProgress gradient bar
- Magnetic email/LinkedIn CTAs
- Story: 7 chapters, cinemagraph scrub, keyboard nav

Do not re-prompt already-done work unless the user asks to extend it.
