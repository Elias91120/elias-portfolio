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
/*  Path                                                               */
/* ------------------------------------------------------------------ */

export type PathStep = {
  period: L;
  title: string;
  subtitle: L;
  detail: L;
  status: "past" | "current" | "next";
};

export const path: PathStep[] = [
  {
    period: { en: "2020 — 2023", fr: "2020 — 2023" },
    title: "Baccalauréat STI2D · SIN",
    subtitle: {
      en: "Lycée Parc de Vilgenis, Massy",
      fr: "Lycée Parc de Vilgenis, Massy",
    },
    detail: {
      en: "Electronics, embedded systems and the first real circuits — where tinkering turned into engineering.",
      fr: "Électronique, systèmes embarqués et premiers vrais circuits — le moment où bricoler est devenu concevoir.",
    },
    status: "past",
  },
  {
    period: { en: "2023 — 2026", fr: "2023 — 2026" },
    title: "ECE Paris",
    subtitle: {
      en: "Bachelor in Computer Science — Data & AI",
      fr: "Bachelor Informatique — Data & IA",
    },
    detail: {
      en: "Graduated with the best Bachelor project of the school: an intent-based travel planner powered by Gemini.",
      fr: "Diplômé avec le meilleur projet de Bachelor de l'école : un planificateur de voyage par intention propulsé par Gemini.",
    },
    status: "past",
  },
  {
    period: { en: "2025 — 2026", fr: "2025 — 2026" },
    title: "Nokia",
    subtitle: {
      en: "Apprentice developer & test engineer",
      fr: "Alternant développeur & testeur",
    },
    detail: {
      en: "A six-month internship became a full apprenticeship: one real-time analysis platform, automated workflows, and AI tooling adopted across four teams.",
      fr: "Un stage de six mois devenu une alternance complète : une plateforme d'analyse temps réel, des workflows automatisés, et un outillage IA adopté par quatre équipes.",
    },
    status: "past",
  },
  {
    period: { en: "2025 — now", fr: "2025 — aujourd'hui" },
    title: "3geeks",
    subtitle: {
      en: "Co-founder — studio & self-hosted production",
      fr: "Co-fondateur — studio & production auto-hébergée",
    },
    detail: {
      en: "With Noam and Charles: shipped products, real clients, and an infrastructure we operate ourselves on our own hardware.",
      fr: "Avec Noam et Charles : des produits livrés, de vrais clients, et une infrastructure que nous opérons nous-mêmes sur notre propre matériel.",
    },
    status: "current",
  },
  {
    period: { en: "2026 — 2028", fr: "2026 — 2028" },
    title: "EFREI Paris",
    subtitle: {
      en: "M.Sc. Data Engineering & AI — RNCP level 7",
      fr: "M.Sc. Data Engineering & IA — RNCP niveau 7",
    },
    detail: {
      en: "Data architecture, structural AI and cloud governance. Started this September.",
      fr: "Architecture de données, IA structurelle et gouvernance cloud. Rentrée effectuée en septembre.",
    },
    status: "current",
  },
  {
    period: { en: "2026 — 2028", fr: "2026 — 2028" },
    title: "Cleva Solutions — ClevAI",
    subtitle: {
      en: "Apprentice, Data & AI (ClevAI Hub)",
      fr: "Alternant, Data & IA (Hub ClevAI)",
    },
    detail: {
      en: "Contract signed with the AI branch of Cleva Solutions: developing agentic workflows, IDP (Intelligent Document Processing), and sovereign AI assistants for insurance.",
      fr: "Contrat signé au sein du hub IA de Cleva Solutions : développement de workflows agentiques, IDP (traitement intelligent de documents) et assistants IA souverains pour l'assurance.",
    },
    status: "current",
  },
];

/* ------------------------------------------------------------------ */
/*  Skills                                                             */
/* ------------------------------------------------------------------ */

export type SkillGroup = { title: L; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: { en: "Data & AI", fr: "Data & IA" },
    skills: [
      "Python",
      "Pandas",
      "ETL / data pipelines",
      "LLM & RAG",
      "AI agents",
      "LangGraph",
      "Multi-agent orchestration",
      "Gemini",
      "Ollama",
      "Power BI",
      "SQL / PostgreSQL",
      "MongoDB",
      "Data governance",
    ],
  },
  {
    title: { en: "Web & Product", fr: "Web & Produit" },
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "FastAPI",
      "Node.js",
      "Expo / React Native",
      "Swift / SwiftUI",
      "Tailwind CSS",
      "Framer Motion",
      "Three.js",
      "REST & GraphQL",
      "Playwright",
    ],
  },
  {
    title: { en: "Cloud & Infra", fr: "Cloud & Infra" },
    skills: [
      "Docker",
      "Coolify",
      "Traefik",
      "Cloudflare (DNS · Tunnel)",
      "AWS (EC2 · S3 · IAM)",
      "PostgreSQL",
      "Supabase",
      "Firebase",
      "Git / GitLab CI",
      "Self-hosting",
      "Monitoring",
    ],
  },
  {
    title: { en: "AI-native workflow", fr: "Workflow AI-native" },
    skills: [
      "Cursor",
      "Claude",
      "MCP servers & skills",
      "Prompt engineering",
      "LLM guardrails & eval",
      "n8n",
      "Technical mentoring",
      "Agile / Jira",
    ],
  },
];

export const certifications = [
  { name: "AWS Academy — Cloud Architecting", issuer: "Amazon Web Services", year: "2026" },
  { name: "Python for Data Scientists", issuer: "DataScientest", year: "2025" },
  { name: "AI & GenAI — Prompt Engineering", issuer: "Nokia", year: "2024" },
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
    en: "French native · English C1 · Arabic fluent",
    fr: "Français natif · Anglais C1 · Arabe courant",
  } satisfies L,
  cvPath: "/CV_Elias_Elloumi_FR.pdf",
};
