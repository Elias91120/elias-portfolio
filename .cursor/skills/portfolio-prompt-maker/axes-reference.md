# Axes reference — portfolio WOW (1–26)

Each entry: **intent**, **must-haves**, **files usually involved**, **gotchas**, **user assets**.

---

## Catégorie A — L'effet « je ne m'y attendais pas »

### Axe 1 — Intro cinématique (~20–30 s)

**Intent:** First session load → fullscreen cinematic moment (game/film intro), then Hero/story.

**Must-haves:**
- Typewriter / letter stagger on name + tagline: *「AI agents developer — I ship products, not slides」*
- Aurora background (reuse Hero), avatar `/story/avatar-hero.jpg`
- Optional ambient sound, off by default or one-click mute
- Skip intro button; `sessionStorage` `intro-seen`
- `prefers-reduced-motion` → skip intro entirely
- Transition to existing Hero; don't break `#story` scroll CTA

**Files:** New `components/CinematicIntro.tsx`, `app/page.tsx`, `components/Hero.tsx` (delay animations?), `app/globals.css`

**Gotchas:** Hide Navbar/AskWidget during intro; no heavy video; mobile ~15 s; z-index 100+

**User assets:** Optional `public/sounds/intro-ambient.mp3` (< 200 Ko)

---

### Axe 2 — Mode recruteur vs curieux

**Intent:** Hero fork — 「I'm hiring」 vs 「Just browsing」→ two journeys on same site.

**Must-haves:**
- Recruteur path prioritizes: StatsBand, case studies, CV download, cal.com — skip or shorten story
- Curieux path: current immersive story-first flow
- Persist choice in `sessionStorage` or URL `?mode=hiring`
- UX proof of product thinking — clear, not gimmicky

**Files:** `components/Hero.tsx`, new `components/PathSelector.tsx` or context, `app/page.tsx`, maybe reorder sections conditionally

**Gotchas:** SSR/hydration mismatch; SEO still indexes full page; don't duplicate content maintenance hell — use same data.ts

**User assets:** cal.com URL (axe 21 synergy), CV PDF (axe 22)

---

### Axe 3 — Story interactive (visual novel)

**Intent:** 1–2 choices per chapter redirect scroll order (e.g. Skip to Nokia / webgen first).

**Must-haves:**
- Branching map over 7 chapters in `lib/data.ts` or companion config
- GSAP timeline adapts to chosen path
- Minimal UI: 2 buttons overlay on chapter, styled like story kickers
- Reset on new session or explicit 「Restart story」

**Files:** `lib/data.ts`, `useStoryScroll.ts`, `StoryPage.tsx`, `StorySection.tsx`

**Gotchas:** High complexity — pin height, snap points, video preload per path; test all branches

**User assets:** None

---

### Axe 4 — Curseur spotlight

**Intent:** Mouse halo reveals hidden layer — finer grain, watermark text (「shipped in prod」, 「7 data sources」), or chapter accent.

**Must-haves:**
- Desktop only (`pointer: fine`); disabled on touch
- Subtle radius (~120–200px), low opacity, mix-blend-mode optional
- Respects reduced motion → static cursor or off
- Optional: watermark text changes with active story chapter (`--bg-accent`)

**Files:** New `components/SpotlightCursor.tsx`, `app/globals.css`, mount in `app/layout.tsx` or `page.tsx`

**Gotchas:** `pointer-events: none` on overlay; performance on low-end GPUs; don't fight grain::after z-index

**User assets:** None

---

### Axe 5 — View Transitions (native app feel)

**Intent:** Home → case study (e.g. Web-Gen): project card morphs/expands into page.

**Must-haves:**
- View Transitions API or Next.js experimental support
- Shared element: card image/browser frame → case study hero
- Fallback: standard fade navigation

**Files:** `components/ProjectCard.tsx`, `app/projects/web-gen/page.tsx`, `app/layout.tsx`, possibly `next.config.ts`

**Gotchas:** Browser support; don't break back button; test with AskWidget z-index

**User assets:** None

---

### Axe 6 — Easter egg dev (Konami / terminal)

**Intent:** Konami code or 5× avatar click → fake terminal: `whoami`, `ls projects/`, `cat nokia/dashboard.ts`.

**Must-haves:**
- Fun fake outputs grounded in real projects from `data.ts`
- Close with Esc or `exit`
- No real shell — pure UI
- Optional: subtle hint after 30 s on site (debated — default no hint)

**Files:** New `components/DevTerminal.tsx`, `app/layout.tsx` or `Hero.tsx` listener

**Gotchas:** Don't trap focus forever; mobile Konami awkward — use avatar clicks on mobile

**User assets:** Optional fake `dashboard.ts` snippet content from user

---

## Catégorie B — Prouver 「AI agents developer」

### Axe 7 — Agent star (not widget)

**Intent:** Elevate Ask agent — hero CTA with 3 questions, scroll-to-section + highlight, optional voice.

**Must-haves:**
- Hero block: 「Ask me anything about my work」+ clickable suggestions
- Command parsing: 「Show me Nokia」→ scroll to project card + ring highlight
- Voice: Web Speech API recognition + speechSynthesis (opt-in, EN/FR)
- Keep existing `/api/ask` Mistral stream

**Files:** `components/Hero.tsx`, `AskWidget.tsx`, new `lib/agent-actions.ts`, optional `app/api/ask/route.ts` tool schema

**Gotchas:** Voice browser permissions; scroll vs GSAP pin; highlight cleanup

**User assets:** `MISTRAL_API_KEY` on Vercel

---

### Axe 8 — Démo live agent (vidéo)

**Intent:** Section 「Watch an agent work」— ~45 s accelerated screen recording with captions.

**Must-haves:**
- Video player (lazy load), poster WebP
- Captions steps: trigger → agent acts → result
- Projects: PromptOptim, Web-Gen, or custom agent

**Files:** New `components/AgentDemo.tsx`, `app/page.tsx`, `public/videos/agent-demo.mp4`

**Gotchas:** Video weight — compress; mobile autoplay muted only

**User assets:** **Required** — screen recording from user (Loom/obs)

---

### Axe 9 — Comparaison avant/après IA

**Intent:** Split screen — Without agent: 2h manual / With agent: 12 min — real project grounding.

**Must-haves:**
- Animated counters or timeline bars
- Copy cites real project (Nokia dashboard, PromptOptim, etc.)
- Credible numbers from `data.ts` highlights — no fabrication

**Files:** New `components/BeforeAfterAgent.tsx`, insert after Skills or before Projects

**Gotchas:** Verify numbers with user if not in data.ts

**User assets:** Optional validated time-savings figures

---

## Catégorie C — Contenu WOW

### Axe 10 — Case studies mini-sites

**Intent:** Each major project = dedicated aesthetic URL (Express Divorce legal/US, Nokia data viz, Travel mood).

**Must-haves:**
- Per-project layout/theme in `app/projects/[slug]/`
- Web-Gen case study as pattern reference
- SEO metadata + sitemap per page
- Homepage remains hub

**Files:** `app/projects/*/page.tsx`, `lib/data.ts` (`caseStudy` field), `ProjectCard.tsx` links

**Gotchas:** Scope control — ship 1 new case study at a time; shared components for DRY

**User assets:** Extra screenshots, metrics, copy per project

---

### Axe 11 — Vidéo hover cartes projets

**Intent:** Static WebP → 5 s product clip on hover.

**Must-haves:**
- `video` in card, preload none, play on mouseenter
- WebM/MP4 optimized (< 500 Ko each)
- Extend Playwright capture scripts for clips

**Files:** `ProjectCard.tsx`, `lib/data.ts` (`previewVideo?`), `capture-projects*.mjs`, `public/projects/previews/`

**Gotchas:** Mobile → link to axe 25; CPU on many hovers

**User assets:** None if Playwright captures live URLs

---

### Axe 12 — Bandeau Built with animé

**Intent:** Infinite marquee — Next.js, Mistral, AWS, GSAP, Supabase logos.

**Must-haves:** CSS marquee or Framer; grayscale → color on hover; no false claims (Mistral not Claude)

**Files:** New `components/BuiltWithMarquee.tsx`, `app/page.tsx` (after Hero or Skills)

**Gotchas:** Use official SVG logos; don't clutter mobile

**User assets:** None

---

### Axe 13 — Preuve sociale visuelle

**Intent:** Logos Nokia/ECE/EFREI + mentor quote + Best Bachelor badge visual.

**Must-haves:** Logo strip + blockquote component; permission-safe labels

**Files:** New `components/SocialProof.tsx`, `public/logos/`, near StatsBand

**Gotchas:** **Legal** — user must confirm logo usage rights

**User assets:** Logo SVGs, quote text, award screenshot

---

### Axe 14 — Timeline stack evolution

**Intent:** Interactive 2016 HTML → 2023 Python/ML → 2025 agents; click year filters projects.

**Must-haves:** Horizontal timeline; projects tagged by era in data or derived from story chapters

**Files:** New `components/StackTimeline.tsx`, extend `lib/data.ts` with `era` on projects

**Gotchas:** Don't duplicate story — complementary section

**User assets:** None

---

## Catégorie D — Finition premium

### Axe 15 — Lenis smooth scroll

**Intent:** Buttery scroll desktop — premium feel.

**Must-haves:** Lenis on main document OR exclude story pin zone; test GSAP compatibility

**Files:** `app/layout.tsx` client wrapper, `useStoryScroll.ts` integration

**Gotchas:** **Known conflict** with ScrollTrigger pin — may need scrollerProxy or disable Lenis during story

**User assets:** None

---

### Axe 16 — Sons micro opt-in

**Intent:** Soft click on CTA, whoosh on chapter change; global mute toggle bottom.

**Must-haves:** All sounds off until user enables; small MP3 set; persist preference

**Files:** `components/SoundToggle.tsx`, hook `useSound`, story transition hooks

**Gotchas:** Extremely easy to annoy — volume very low; respect reduced motion → mute

**User assets:** Optional sound files

---

### Axe 17 — Parallax multi-couches story

**Intent:** Text, video, grain at different scroll speeds in story chapters.

**Must-haves:** 2–3 layers per StoryPage; tied to ScrollTrigger progress

**Files:** `StoryPage.tsx`, `useStoryScroll.ts`, `globals.css`

**Gotchas:** Motion sickness — subtle deltas only; reduced motion off

**User assets:** None

---

### Axe 18 — Hero heure / géo

**Intent:** 「Good evening from Paris」+ subtle day/night aurora shift.

**Must-haves:** Client-only; timezone from browser; no creepy geo IP required (optional)

**Files:** `components/Hero.tsx`

**Gotchas:** SSR default generic greeting

**User assets:** None

---

### Axe 19 — OG image dynamique par page

**Intent:** LinkedIn preview unique per case study route.

**Must-haves:** `opengraph-image.tsx` per route or dynamic OG generation with project title/screenshot

**Files:** `app/projects/web-gen/opengraph-image.tsx`, pattern for others

**Gotchas:** Next.js OG image API limits; test Twitter/LinkedIn card debugger

**User assets:** Per-project OG assets optional

---

## Catégorie E — Conversion

### Axe 20 — Toggle FR/EN

**Intent:** Bilingual site — target alternance France 2026–2028.

**Must-haves:** Toggle in Navbar; dictionary or `data.fr.ts`; agent responds in visitor language (already in agent-context)

**Files:** `lib/i18n/` or parallel data, all section components, `app/layout.tsx` `lang`

**Gotchas:** Large scope — prompt should phase 1: Hero + Contact + Projects labels

**User assets:** User reviews FR translations

---

### Axe 21 — Book 15 min (cal.com)

**Intent:** cal.com embed or link in Contact + recruteur path.

**Files:** `components/Contact.tsx`, `lib/data.ts` `contact.calUrl`

**User assets:** **Required** — cal.com booking link

---

### Axe 22 — CV PDF + page /cv

**Intent:** Download button + print-friendly `/cv` page.

**Files:** `app/cv/page.tsx`, `public/cv/elias-elloumi.pdf`, Contact CTA

**User assets:** **Required** — PDF CV

---

### Axe 23 — QR vCard mobile

**Intent:** Footer QR 「Save my contact」— vCard download.

**Files:** `components/Footer.tsx`, `public/contact.vcf`, QR via library or static PNG

**User assets:** vCard fields confirmation (phone optional)

---

## Catégorie F — Mobile

### Axe 24 — Story mobile courte

**Intent:** 3 key chapters + tap advance + static images instead of 7 scrub videos.

**Must-haves:** `matchMedia` branch in Story; lighter assets for mobile

**Files:** `StorySection.tsx`, `useStoryScroll.ts`, optional `chaptersMobile` in data.ts

**Gotchas:** Maintain narrative coherence; test iOS Safari video policies

**User assets:** None

---

### Axe 25 — Tap to preview projets

**Intent:** Bottom sheet with video + live link on project tap.

**Files:** `ProjectCard.tsx`, new `components/ProjectPreviewSheet.tsx`

**Gotchas:** Pairs with axe 11 videos

**User assets:** None

---

### Axe 26 — PWA Add to Home Screen

**Intent:** Installable portfolio — manifest + icons + service worker (minimal).

**Files:** `public/manifest.json`, icons, `app/layout.tsx` meta, optional next-pwa

**Gotchas:** Keep SW minimal; cache strategy don't break deploys

**User assets:** PWA icons 192/512 if not generated from avatar

---

## Dependency hints (for multi-prompt ordering)

```
11 (video hover) → 25 (mobile sheet)
10 (case studies) → 5 (view transitions) → 19 (OG per page)
2 (recruteur) → 21 (cal) + 22 (CV)
7 (agent star) → existing Mistral API
15 (Lenis) — test before 17 (parallax)
24 (mobile story) — independent but huge; do after 3 if both chosen
```
