# Prompt output template

Replace `{…}` placeholders. Output the result as a single copy-paste block.

---

```markdown
# Tâche : {TITRE_COURT} ({CATÉGORIE} — axe {N})

## Contexte projet

{PARAGRAPHE_STACK — from project-context.md, 4–6 lines}

Stack visuelle existante à respecter :
{LISTE_TOKENS_DESIGN — couleurs, polices, avatar, aurora, grain}

Structure homepage / routing pertinent :
{COMPOSANTS_ET_ROUTES_RÉELS}

État actuel lié à cette feature :
{CE_QUI_EXISTE_DÉJÀ — paths + comportement observé dans le repo}

## Objectif

{2–4 phrases — what success looks like for the visitor}

**Ce n'est PAS** :
- {anti-pattern 1}
- {anti-pattern 2}
- {anti-pattern 3}

**C'est** :
- {desired behavior 1}
- {desired behavior 2}
- {desired behavior 3}

## Spécification détaillée

{Sections adaptées à l'axe : séquence UX, copy EN, interactions, data sources}

### {Sous-section 1 — ex. Séquence, Layout, Parcours recruteur…}

{Timing, steps, or user flow}

### {Sous-section 2 — ex. Comportement technique}

{Integration details}

## Comportement UX obligatoire

1. **Skip / escape** — {if applicable}
2. **Session / persistence** — {sessionStorage, localStorage, URL param…}
3. **`prefers-reduced-motion: reduce`** — {fallback}
4. **GSAP / scroll safety** — {if touching Story or scroll}
5. **Mobile** — {touch targets, shorter paths, bottom sheet…}
6. **Performance** — {bundle, LCP, video weight…}
7. **Accessibility** — {ARIA, focus trap, keyboard…}
8. **{Axe-specific rules}**

## Architecture recommandée

{Suggested files to create/modify}

\`\`\`tsx
// Sketch d'intégration — adapter aux vrais noms
{MINIMAL_CODE_SKETCH}
\`\`\`

## Fichiers clés à lire avant de coder

- `{path}` — {why}
- `{path}` — {why}
- …

## Contraintes de code

- Minimiser le scope : {explicit out-of-scope list}
- Réutiliser {Framer Motion / GSAP / Tailwind / data.ts} — pas de lib lourde sauf justification ({Lenis, View Transitions API, etc.})
- Matcher le style existant (ease, rings accent, font-display)
- `npm run build` doit passer
- Explications en français ; copy du site en anglais (sauf axe FR/EN)

## Critères d'acceptation

- [ ] {testable item 1}
- [ ] {testable item 2}
- [ ] {testable item 3}
- [ ] {testable item 4}
- [ ] Aucune régression sur Story GSAP / AskWidget / {other critical paths}

## Ce que l'utilisateur doit fournir

- {assets, URLs, API keys, PDFs, recordings — or "Rien — tout peut être implémenté sans input utilisateur"}

## Livrables attendus

1. {file / component}
2. {integration point}
3. {styles if any}
4. Résumé en français : ce qui a été fait + comment tester

Implemente directement — pas de plan mode, pas d'édition de fichiers `.plan.md`.
```

---

## Section tuning by category

| Category | Extra sections to emphasize |
|----------|---------------------------|
| Unexpected (1–6) | Séquence narrative, z-index layering, first-visit logic |
| AI proof (7–9) | API routes, agent-context.ts, privacy, fallback sans clé |
| Content WOW (10–14) | data.ts shape, SEO, sitemap, screenshots/videos |
| Premium feel (15–19) | Conflict with GSAP/Lenis; opt-in; subtlety |
| Conversion (20–23) | i18n strategy, external links, PDF in public/ |
| Mobile (24–26) | breakpoints, `matchMedia`, PWA manifest |

## Lenis warning (axe 15)

If generating axe 15, explicitly instruct: test compatibility with GSAP ScrollTrigger pin; may need Lenis only outside story section or `ScrollTrigger.scrollerProxy`.

## View Transitions (axe 5)

Mention Next.js 16 / `@view-transition` or experimental config; link ProjectCard → `/projects/[slug]` morph.
