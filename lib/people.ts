import type { L } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  LinkedIn recommendations — Nokia, August 2026                      */
/*  Public on linkedin.com/in/elias-elloumi/details/recommendations    */
/* ------------------------------------------------------------------ */

export type Recommendation = {
  author: string;
  role: L;
  company: string;
  relation: L;
  date: L;
  quote: L;
  /** Initials used for the avatar chip. */
  initials: string;
};

export const recommendations: Recommendation[] = [
  {
    author: "Davide Bacchiega",
    role: { en: "Automation Tools Engineer", fr: "Automation Tools Engineer" },
    company: "Nokia",
    relation: { en: "Was Elias' mentor", fr: "A été le mentor d'Elias" },
    date: { en: "August 2026", fr: "Août 2026" },
    initials: "DB",
    quote: {
      fr: "C'est un jeune particulièrement curieux et autonome, doté de solides compétences techniques, notamment dans le domaine de l'intelligence artificielle. Il se distingue surtout par sa capacité à prendre des initiatives, à proposer des solutions pragmatiques et à aller au-delà de ce qui lui est demandé.",
      en: "He is a particularly curious and autonomous young engineer with solid technical skills, especially in artificial intelligence. What sets him apart is his ability to take initiative, propose pragmatic solutions and go beyond what is asked of him.",
    },
  },
  {
    author: "Abderrahmane Nezrouk",
    role: { en: "3G RAN Expert", fr: "Expert 3G RAN" },
    company: "Nokia · Alcatel-Lucent",
    relation: {
      en: "Worked with Elias on the same team",
      fr: "A travaillé avec Elias dans la même équipe",
    },
    date: { en: "August 2026", fr: "Août 2026" },
    initials: "AN",
    quote: {
      fr: "Il ne se contente pas de comprendre les concepts liés à l'IA, il sait surtout réfléchir à la manière de les utiliser concrètement pour répondre à des besoins professionnels et améliorer les processus existants. Il a fait preuve d'initiative et d'efficacité en développant des outils utiles au suivi et à l'aide à la décision.",
      en: "He does not stop at understanding AI concepts — above all, he knows how to think about using them concretely to meet business needs and improve existing processes. He showed initiative and efficiency by building tools that genuinely helped tracking and decision-making.",
    },
  },
  {
    author: "Mohamed Tsouri Bentsouri",
    role: {
      en: "R&D Verification Test Architect",
      fr: "R&D Verification Test Architect",
    },
    company: "Nokia",
    relation: {
      en: "Worked with Elias on the same team",
      fr: "A travaillé avec Elias dans la même équipe",
    },
    date: { en: "August 2026", fr: "Août 2026" },
    initials: "MT",
    quote: {
      fr: "Un apprenti efficace, autonome et doté d'une maîtrise solide de l'IA. Il sait penser out of the box, proposer des solutions innovantes et transformer rapidement une idée en résultat concret. Un talent prometteur, créatif et orienté impact.",
      en: "An effective, autonomous apprentice with a solid command of AI. He thinks outside the box, proposes innovative solutions and turns an idea into a concrete result quickly. A promising talent — creative and impact-driven.",
    },
  },
  {
    author: "Honoré Ho",
    role: { en: "Telecom Expert", fr: "Expert Télécom" },
    company: "Nokia",
    relation: { en: "Was senior to Elias", fr: "Était le supérieur d'Elias" },
    date: { en: "August 2026", fr: "Août 2026" },
    initials: "HH",
    quote: {
      fr: "Elias a prouvé à de multiples reprises sa capacité d'écoute et d'adaptation pour fournir un travail très satisfaisant et sérieux.",
      en: "Elias proved his ability to listen and adapt time and again, delivering work that was consistently thorough and dependable.",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Client feedback                                                    */
/* ------------------------------------------------------------------ */

export type ClientQuote = {
  author: string;
  projects: string[];
  quote: L;
  verified?: boolean;
};

export const clientQuotes: ClientQuote[] = [
  {
    author: "Adrien",
    projects: ["CallKitchen", "Express Divorce"],
    quote: {
      fr: "Équipe réactive, process très clair et exécution propre. Le nouveau site a fluidifié notre acquisition.",
      en: "Responsive team, a very clear process and clean execution. The new site smoothed out our acquisition.",
    },
  },
  {
    author: "Henry F.",
    projects: ["Two"],
    verified: true,
    quote: {
      fr: "Ils ont compris notre métier rapidement et proposent des choix utiles. On a vu une vraie progression.",
      en: "They understood our business quickly and suggest choices that actually help. We saw real progress.",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Education — the employers live in `experience` (lib/content.ts)    */
/* ------------------------------------------------------------------ */

export type PathStep = {
  period: L;
  title: string;
  subtitle: L;
  detail: L;
  status: "past" | "current";
};

export const path: PathStep[] = [
  {
    period: { en: "2026 — 2028", fr: "2026 — 2028" },
    title: "EFREI Paris",
    subtitle: {
      en: "Mastère Data Engineering & AI — RNCP level 7",
      fr: "Mastère Data Engineering & IA — RNCP niveau 7",
    },
    detail: {
      en: "Data architecture, structural AI and cloud governance, alongside the Cleva apprenticeship.",
      fr: "Architecture de données, IA structurelle et gouvernance cloud, en alternance chez Cleva.",
    },
    status: "current",
  },
  {
    period: { en: "2023 — 2026", fr: "2023 — 2026" },
    title: "ECE Paris",
    subtitle: {
      en: "Bachelor in Artificial Intelligence — licence grade",
      fr: "Bachelor Intelligence Artificielle — grade de licence",
    },
    detail: {
      en: "Final year as an apprentice at Nokia, closed by the best Bachelor project of the year.",
      fr: "Dernière année en alternance chez Nokia, clôturée par le meilleur projet de Bachelor de la promotion.",
    },
    status: "past",
  },
  {
    period: { en: "2020 — 2023", fr: "2020 — 2023" },
    title: "Baccalauréat STI2D · SIN",
    subtitle: {
      en: "Lycée Parc de Vilgenis, Massy",
      fr: "Lycée Parc de Vilgenis, Massy",
    },
    detail: {
      en: "Electronics and embedded systems.",
      fr: "Électronique et systèmes embarqués.",
    },
    status: "past",
  },
];

/* ------------------------------------------------------------------ */
/*  Skills — grouped by what they were used for, kept short on purpose */
/* ------------------------------------------------------------------ */

export type SkillGroup = { title: L; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: { en: "AI & models", fr: "IA & modèles" },
    skills: [
      "Fine-tuning open-source models",
      "Serving on self-hosted GPU",
      "LLM & RAG",
      "AI agents (LangGraph)",
      "Prompt engineering & guardrails",
      "Gemini · Ollama",
    ],
  },
  {
    title: { en: "Data", fr: "Data" },
    skills: [
      "Python · Pandas",
      "ETL / data pipelines",
      "SQL · PostgreSQL",
      "MongoDB",
      "Power BI",
    ],
  },
  {
    title: { en: "Backend & product", fr: "Backend & produit" },
    skills: [
      "FastAPI",
      "TypeScript · React · Next.js",
      "Node.js",
      "Swift · SwiftUI",
      "REST & GraphQL",
    ],
  },
  {
    title: { en: "Infra & delivery", fr: "Infra & delivery" },
    skills: [
      "Docker",
      "Coolify · Traefik · Cloudflare",
      "AWS (EC2 · S3 · IAM)",
      "GitLab CI",
      "Jira · Agile",
    ],
  },
];

export const certifications = [
  { name: "IA & GenAI — Prompt Engineering N1", issuer: "Liora", year: "2026" },
  { name: "AWS Academy — Machine Learning Foundations", issuer: "Amazon Web Services", year: "2026" },
  { name: "AWS Academy — Cloud Architecting", issuer: "Amazon Web Services", year: "2026" },
  { name: "Python for Data Scientists", issuer: "DataScientest", year: "2025" },
];

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

export const contact = {
  email: "e.elloumi15@gmail.com",
  linkedin: "https://www.linkedin.com/in/elias-elloumi/",
  linkedinLabel: "linkedin.com/in/elias-elloumi",
  github: "https://github.com/Elias91120",
  githubLabel: "github.com/Elias91120",
  location: { en: "Palaiseau (91), France", fr: "Palaiseau (91), France" } satisfies L,
  studio: "https://www.3geeks.fr",
  studioLabel: "3geeks studio",
  languages: {
    en: "French native · English C1 · Arabic basics",
    fr: "Français natif · Anglais C1 · Arabe notions de base",
  } satisfies L,
  cvPath: "/CV_Elias_Elloumi_FR.pdf",
};
