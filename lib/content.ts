import type { L } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Identity                                                           */
/* ------------------------------------------------------------------ */

export const profile = {
  firstName: "Elias",
  lastName: "Elloumi",
  role: {
    en: "Data & AI Engineer",
    fr: "Ingénieur Data & IA",
  } satisfies L,
  heroLine: {
    en: "a data & ai engineer who ships products, not slides",
    fr: "ingénieur data & ia — je livre des produits, pas des slides",
  } satisfies L,
  status: {
    en: "Apprentice @ Cleva Solutions (ClevAI) · EFREI Paris",
    fr: "Alternant @ Cleva Solutions (ClevAI) · EFREI Paris",
  } satisfies L,
};

export const nav: { id: string; label: L }[] = [
  { id: "about", label: { en: "About", fr: "Profil" } },
  { id: "work", label: { en: "Work", fr: "Projets" } },
  { id: "contact", label: { en: "Contact", fr: "Contact" } },
];

export const ui = {
  contactCta: { en: "Contact me", fr: "Me contacter" } satisfies L,
  liveProject: { en: "Live project", fr: "Voir le projet" } satisfies L,
  caseStudy: { en: "Case study", fr: "Étude de cas" } satisfies L,
  downloadCv: { en: "Download CV", fr: "Télécharger le CV" } satisfies L,
  scroll: { en: "Scroll", fr: "Défiler" } satisfies L,
};

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */

export const about = {
  heading: { en: "About me", fr: "Mon profil" } satisfies L,
  paragraph: {
    en: "I build the systems that make products actually work — data pipelines, AI agents, and the infrastructure underneath. A year at Nokia turned scattered analyses into one real-time platform and put AI tooling in the hands of four teams. With 3geeks I co-run a studio that ships to real users and operates its own production stack. Now pursuing an M.Sc. in Data Engineering & AI at EFREI Paris, and working as an apprentice at Cleva Solutions (ClevAI).",
    fr: "Je construis les systèmes qui font réellement tourner les produits : pipelines de données, agents IA et infrastructure de production. Un an chez Nokia a transformé des analyses éparpillées en une plateforme temps réel et mis l'outillage IA entre les mains de quatre équipes. Avec 3geeks, je co-dirige un studio qui livre à de vrais utilisateurs et opère sa propre infrastructure de production. Actuellement en M.Sc. Data Engineering & IA à l'EFREI Paris, et alternant chez Cleva Solutions (branche ClevAI).",
  } satisfies L,
};
