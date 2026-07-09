---
name: portfolio-prompt-maker
description: Generates copy-paste implementation prompts for Elias Elloumi portfolio WOW features (axes 1–26). Use when the user invokes this skill and names an axe, part, number, or wow feature (intro cinématique, recruteur vs curieux, spotlight cursor, case study, Lenis, FR/EN, etc.) for elias-elloumi.com — output is a full prompt for a new Cursor conversation, not code.
disable-model-invocation: true
---

# Portfolio WOW Prompt Maker

Generates **implementation prompts** for new Cursor conversations. The user invokes this skill, names **one axe** (1–26), and receives a ready-to-paste prompt — same depth as the cinematic intro example.

**Do NOT implement code.** Output only the prompt (markdown block the user can copy).

## Workflow

1. **Identify the axe** — User says a number (`3`), name (`spotlight cursor`), or category (`conversion`, `mobile`). Map via [axes-reference.md](axes-reference.md).
2. **If ambiguous** — Ask once: which axe number (1–26)?
3. **Load context** — Read [project-context.md](project-context.md) and the matching axe section in [axes-reference.md](axes-reference.md).
4. **Explore the repo** — Read/grep files listed in the axe entry + anything the axe touches (Hero, Story, Projects, AskWidget, etc.). Note real paths, existing patterns, conflicts (GSAP, no global smooth scroll, Mistral API, etc.).
5. **Write the prompt** — Follow [prompt-template.md](prompt-template.md). Fill every section with **project-specific** details from step 4, not generics.
6. **Deliver** — One fenced markdown block containing the full prompt. Brief French intro outside the block: axe chosen + how to use it.

## Prompt quality rules

- **French** for meta-instructions inside the prompt; **English** for on-site copy (taglines, buttons, UI strings).
- Include **real file paths** discovered in the repo (`components/Hero.tsx`, not "the hero component").
- **Ce n'est PAS / C'est** — always contrast bad vs good for the axe.
- **UX obligatoire** — skip, `prefers-reduced-motion`, mobile, performance, GSAP/ScrollTrigger safety when relevant.
- **Architecture** — suggest concrete component names and integration point (`app/page.tsx`, new `components/X.tsx`).
- **Critères d'acceptation** — checklist of testable items.
- **Scope** — explicit "do not refactor unrelated sections".
- End every prompt with:
  ```
  Implemente directement — pas de plan mode, pas d'édition de fichiers `.plan.md`.
  ```
- If the axe needs **user-provided assets** (PDF CV, cal.com URL, audio file, logos, screen recordings), list them under **Ce que l'utilisateur doit fournir**.

## Axe catalog (quick index)

| # | Axe | Category |
|---|-----|----------|
| 1 | Intro cinématique 20–30 s | Unexpected |
| 2 | Mode recruteur vs curieux | Unexpected |
| 3 | Story interactive (visual novel) | Unexpected |
| 4 | Curseur spotlight | Unexpected |
| 5 | View Transitions case studies | Unexpected |
| 6 | Easter egg dev (Konami / terminal) | Unexpected |
| 7 | Agent IA star (scroll, vocal, hero) | AI proof |
| 8 | Démo live agent (vidéo) | AI proof |
| 9 | Comparaison avant/après IA | AI proof |
| 10 | Case studies mini-sites | Content WOW |
| 11 | Vidéo hover cartes projets | Content WOW |
| 12 | Bandeau Built with animé | Content WOW |
| 13 | Preuve sociale visuelle | Content WOW |
| 14 | Timeline stack evolution | Content WOW |
| 15 | Smooth scroll Lenis | Premium feel |
| 16 | Sons micro opt-in | Premium feel |
| 17 | Parallax multi-couches story | Premium feel |
| 18 | Hero heure / géo | Premium feel |
| 19 | OG image dynamique par page | Premium feel |
| 20 | Toggle FR/EN | Conversion |
| 21 | Book 15 min cal.com | Conversion |
| 22 | CV PDF + page /cv | Conversion |
| 23 | QR code vCard mobile | Conversion |
| 24 | Story mobile version courte | Mobile |
| 25 | Tap to preview projets | Mobile |
| 26 | PWA Add to Home Screen | Mobile |

Full specs: [axes-reference.md](axes-reference.md).

## Reference prompt (axe 1)

When writing axe 1 prompts, match the structure and specificity of the cinematic intro prompt the user validated (typewriter, aurora, avatar, tagline, skip, sessionStorage, audio opt-in, `CinematicIntro.tsx`). Other axes follow the same template shape, adapted to their feature.

## Multiple axes

If the user asks for several axes at once, generate **separate prompts** (one block per axe), ordered by dependency if obvious (e.g. 11 before 10, 15 conflicts with GSAP → note in prompt).
