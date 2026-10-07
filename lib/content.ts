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
    en: "Data & AI engineer — I unify data, fine-tune models and prototype fast",
    fr: "Ingénieur Data & IA — j'unifie la donnée, je fine-tune des modèles, je prototype vite",
  } satisfies L,
  status: {
    en: "Apprentice @ Cleva Solutions (ClevAI) · Mastère EFREI Paris",
    fr: "Alternant @ Cleva Solutions (ClevAI) · Mastère EFREI Paris",
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
/*  Experience — the three places the work was done                    */
/*  Read first, in two seconds: who, where, and the one thing to know. */
/* ------------------------------------------------------------------ */

export type Experience = {
  id: string;
  company: string;
  /**
   * Official logo, shown as published — never recoloured. `plate` sets it on a
   * light tile for marks drawn in a colour that does not hold on the dark card.
   */
  logo: {
    src: string;
    width: number;
    height: number;
    plate?: boolean;
    /** Trim the empty margin baked into the source file (our own logo only). */
    crop?: boolean;
  };
  /** One line on what the company is, so the name alone is enough to place it. */
  tagline: L;
  role: L;
  period: L;
  /** Marks the engagement that is running right now. */
  current?: boolean;
  accent: string;
  /** The single headline figure of the column. */
  stat: { value: string; label: L };
  points: L[];
  /** A closing line set apart from the bullets. */
  note?: L;
};

export const experience: Experience[] = [
  {
    id: "cleva",
    company: "Cleva Solutions",
    logo: { src: "/brands/cleva-white.png", width: 1236, height: 337 },
    tagline: {
      en: "Insurance software · ClevAI, its AI hub",
      fr: "Logiciels d'assurance · ClevAI, son hub IA",
    },
    role: { en: "Apprentice, Data & AI — ClevAI hub", fr: "Alternant, Data & IA — hub ClevAI" },
    period: { en: "2026 — now", fr: "2026 — aujourd'hui" },
    current: true,
    accent: "#22d3ee",
    stat: {
      value: "GPU",
      label: { en: "fine-tuned model served in-house", fr: "modèle fine-tuné servi en interne" },
    },
    points: [
      {
        en: "Fine-tuning an open-source voice model and serving it on an in-house GPU.",
        fr: "Fine-tuning d'un modèle vocal open source, servi sur un GPU interne.",
      },
      {
        en: "Building client proofs of concept that show what a fine-tuned model can do for their case.",
        fr: "Des POC clients qui montrent ce qu'un modèle fine-tuné peut faire pour leur besoin.",
      },
      {
        en: "Brought 3geeks tooling into the team's workflow.",
        fr: "Outillage 3geeks intégré au workflow de l'équipe.",
      },
    ],
  },
  {
    id: "nokia",
    company: "Nokia",
    logo: { src: "/brands/nokia.svg", width: 170, height: 40, plate: true },
    tagline: {
      en: "Global telecom company",
      fr: "Entreprise mondiale des télécoms",
    },
    role: {
      en: "Data & AI Tools Specialist — internship, then apprenticeship",
      fr: "Data & AI Tools Specialist — stage, puis alternance",
    },
    period: { en: "2025 — 2026", fr: "2025 — 2026" },
    accent: "#8b7ef8",
    stat: {
      value: "7+",
      label: { en: "sources in one live dashboard", fr: "sources dans un dashboard unique" },
    },
    points: [
      {
        en: "Feature Analyzer: Jira and the other internal sources unified into one dashboard, with an AI summary on top.",
        fr: "Feature Analyzer : Jira et les autres sources internes réunis dans un dashboard, avec un résumé IA par-dessus.",
      },
      {
        en: "AI adoption across 4 teams: a RAG assistant, demos and one-to-one coaching.",
        fr: "Adoption de l'IA dans 4 équipes : assistant RAG, démos et coaching individuel.",
      },
      {
        en: "Brought Prompt Hub, built at 3geeks, into the company.",
        fr: "Prompt Hub, conçu chez 3geeks, intégré dans l'entreprise.",
      },
    ],
    note: {
      en: "Staying on was a natural next step. I found a better fit at Cleva's AI hub.",
      fr: "Rester était une suite naturelle. J'ai trouvé mieux au hub IA de Cleva.",
    },
  },
  {
    id: "3geeks",
    company: "3geeks",
    logo: { src: "/brands/3geeks.png", width: 338, height: 117, crop: true },
    tagline: {
      en: "Studio I co-founded · clients worldwide",
      fr: "Studio que j'ai co-fondé · clients dans le monde",
    },
    role: { en: "Co-founder — studio & self-hosted production", fr: "Co-fondateur — studio & production auto-hébergée" },
    period: { en: "2025 — now", fr: "2025 — aujourd'hui" },
    current: true,
    accent: "#f0b429",
    stat: {
      value: "13",
      label: { en: "apps in production", fr: "apps en production" },
    },
    points: [
      {
        en: "Building tools that keep AI-assisted coding structured and maintainable.",
        fr: "Des outils qui gardent le code écrit avec l'IA structuré et maintenable.",
      },
      {
        en: "One base solution, adapted to each company's stack — GitLab, Jira — with Claude Code or any IDE.",
        fr: "Une solution de base, adaptée à la stack de chaque entreprise — GitLab, Jira — avec Claude Code ou n'importe quel IDE.",
      },
      {
        en: "Runs its own production on its own hardware.",
        fr: "Opère sa propre production, sur son propre matériel.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  What I bring — three things, each backed by a project below        */
/* ------------------------------------------------------------------ */

export type Capability = {
  title: L;
  body: L;
  /** The project that proves it. */
  proof: { label: L; target: string };
};

export const capabilities = {
  heading: { en: "What I bring to a team", fr: "Ce que j'apporte à une équipe" } satisfies L,
  items: [
    {
      title: { en: "Make scattered data legible", fr: "Rendre la donnée éparpillée lisible" },
      body: {
        en: "I walk into a company, find the data spread across its tools, and build the pipeline that brings it into one live dashboard — with an AI summary on top, so reaching a conclusion no longer means opening a dozen tabs.",
        fr: "J'arrive dans une entreprise, je repère la donnée éparpillée entre ses outils et je construis le pipeline qui la réunit dans un dashboard vivant — avec un résumé IA par-dessus, pour qu'une conclusion ne demande plus douze onglets.",
      },
      proof: {
        label: { en: "Feature Analyzer · Nokia", fr: "Feature Analyzer · Nokia" },
        target: "nokia-dashboard",
      },
    },
    {
      title: { en: "Go past the API call", fr: "Aller plus loin que l'appel d'API" },
      body: {
        en: "Wiring in a hosted model is the easy part. I fine-tune open-source models, serve them on our own hardware, and put a working demo in front of a client.",
        fr: "Brancher un modèle hébergé, c'est la partie facile. Je fine-tune des modèles open source, je les sers sur notre propre matériel et je mets une démo qui tourne devant un client.",
      },
      proof: {
        label: { en: "Voice model · Cleva Solutions", fr: "Modèle vocal · Cleva Solutions" },
        target: "cleva-voice",
      },
    },
    {
      title: { en: "Prototype from zero, fast", fr: "Prototyper de zéro, vite" },
      body: {
        en: "I conceptualise quickly and get a first working prototype into people's hands early, instead of reading documentation for months first. Clients decide faster when they can see a result.",
        fr: "Je conceptualise vite et je mets un premier prototype fonctionnel entre les mains des gens tôt, au lieu de lire de la documentation pendant des mois. Un client décide plus vite quand il voit un résultat.",
      },
      proof: {
        label: { en: "3geeks · adapted inside Nokia and Cleva", fr: "3geeks · adapté chez Nokia et Cleva" },
        target: "prompt-hub",
      },
    },
  ] satisfies Capability[],
};
