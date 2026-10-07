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
    en: "Data & AI — I build the pipelines, the models and the products on top",
    fr: "Data & IA — je construis les pipelines, les modèles et les produits qui vont avec",
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
      value: "POC",
      label: { en: "working AI demos for clients", fr: "démos IA fonctionnelles pour les clients" },
    },
    points: [
      {
        en: "Adapting and fine-tuning open-source AI models for client proofs of concept.",
        fr: "Adaptation et fine-tuning de modèles IA open source pour des POC clients.",
      },
      {
        en: "Deploying them locally, to show what is possible on a real case.",
        fr: "Déploiement en local, pour montrer ce qui est possible sur un cas réel.",
      },
      {
        en: "Only the start: the first of many builds.",
        fr: "Seulement le début : le premier de nombreux chantiers.",
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
      label: { en: "internal sources, one live dashboard", fr: "sources internes, un dashboard unique" },
    },
    points: [
      {
        en: "Built the data pipeline and the dashboard that bring scattered internal data together, with an AI summary on top.",
        fr: "Pipeline de données et dashboard qui réunissent la donnée interne éparpillée, avec un résumé IA par-dessus.",
      },
      {
        en: "Helped several teams adopt AI tooling, through demos and one-to-one coaching.",
        fr: "Adoption des outils IA dans plusieurs équipes, par des démos et du coaching individuel.",
      },
      {
        en: "Brought tools built at 3geeks into the company.",
        fr: "Outils conçus chez 3geeks intégrés dans l'entreprise.",
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
/*  What I bring — kept general on purpose                             */
/*  Employer work is described by what it shows I can do, never by     */
/*  internal tool names; the studio's own products can be specific.    */
/* ------------------------------------------------------------------ */

export type Capability = {
  title: L;
  body: L;
  /** The card below that backs the claim. */
  proof: { label: L; target: string };
};

export const capabilities = {
  heading: { en: "What I can bring to your team", fr: "Ce que je peux apporter à votre équipe" } satisfies L,
  items: [
    {
      title: { en: "Turn scattered data into one clear picture", fr: "Transformer une donnée éparpillée en une vue claire" },
      body: {
        en: "I build data pipelines that pull many sources together, and the dashboards that make them readable — with an AI summary on top, so a conclusion no longer takes a dozen tabs.",
        fr: "Je construis des pipelines de données qui réunissent de nombreuses sources, et les dashboards qui les rendent lisibles — avec un résumé IA par-dessus, pour qu'une conclusion ne demande plus une douzaine d'onglets.",
      },
      proof: {
        label: { en: "Pipelines & dashboards", fr: "Pipelines & dashboards" },
        target: "data-pipelines",
      },
    },
    {
      title: { en: "Make AI work on a real need", fr: "Faire marcher l'IA sur un vrai besoin" },
      body: {
        en: "Calling a hosted model is the easy part. I fine-tune open-source models, deploy them locally and integrate AI into real workflows — then show it working on the case at hand.",
        fr: "Appeler un modèle hébergé, c'est la partie facile. Je fine-tune des modèles open source, je les déploie en local et j'intègre l'IA dans de vrais workflows — puis je la montre à l'œuvre sur le cas concret.",
      },
      proof: {
        label: { en: "AI models in practice", fr: "Les modèles IA en pratique" },
        target: "ai-models",
      },
    },
    {
      title: { en: "Prototype from zero, fast", fr: "Prototyper de zéro, vite" },
      body: {
        en: "I conceptualise quickly and get a first working prototype into people's hands early, instead of reading documentation for months first. Clients decide faster when they can see a result.",
        fr: "Je conceptualise vite et je mets un premier prototype fonctionnel entre les mains des gens tôt, au lieu de lire de la documentation pendant des mois. Un client décide plus vite quand il voit un résultat.",
      },
      proof: {
        label: { en: "3geeks · adapted inside companies", fr: "3geeks · adapté dans les entreprises" },
        target: "prompt-hub",
      },
    },
  ] satisfies Capability[],
  outro: {
    en: "Still an apprentice, still learning fast — and what I build now is the base of what I can bring to your team tomorrow.",
    fr: "Encore alternant, et j'apprends vite — ce que je construis aujourd'hui est la base de ce que je peux apporter à votre équipe demain.",
  } satisfies L,
};
