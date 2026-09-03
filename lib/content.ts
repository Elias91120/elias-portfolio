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
  { id: "expertise", label: { en: "Expertise", fr: "Expertise" } },
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
    en: "I build the systems that make products actually work — data pipelines, AI agents, and the infrastructure underneath. Two years at Nokia turned scattered analyses into one real-time platform and put AI tooling in the hands of four teams. With 3geeks I co-run a studio that ships to real users and operates its own production stack. Now pursuing an M.Sc. in Data Engineering & AI at EFREI Paris, and working as an apprentice at Cleva Solutions (ClevAI).",
    fr: "Je construis les systèmes qui font réellement tourner les produits : pipelines de données, agents IA et infrastructure de production. Deux ans chez Nokia ont transformé des analyses éparpillées en une plateforme temps réel et mis l'outillage IA entre les mains de quatre équipes. Avec 3geeks, je co-dirige un studio qui livre à de vrais utilisateurs et opère sa propre infrastructure de production. Actuellement en M.Sc. Data Engineering & IA à l'EFREI Paris, et alternant chez Cleva Solutions (branche ClevAI).",
  } satisfies L,
};

/* ------------------------------------------------------------------ */
/*  Expertise                                                          */
/* ------------------------------------------------------------------ */

export type Expertise = {
  number: string;
  name: L;
  description: L;
  stack: string[];
};

export const expertise: Expertise[] = [
  {
    number: "01",
    name: { en: "Data Engineering", fr: "Data Engineering" },
    description: {
      en: "Pipelines that turn scattered, heterogeneous sources into one trustworthy view — collection, correlation, and reporting that teams can rely on every morning.",
      fr: "Des pipelines qui transforment des sources éparpillées et hétérogènes en une vue fiable — collecte, corrélation et restitution sur lesquelles les équipes s'appuient chaque matin.",
    },
    stack: ["Python", "FastAPI", "PostgreSQL", "Pandas", "Power BI"],
  },
  {
    number: "02",
    name: { en: "AI Agents & LLM", fr: "Agents IA & LLM" },
    description: {
      en: "Multi-agent systems, RAG assistants, and LLM orchestration built with guardrails — where the model proposes and deterministic code decides.",
      fr: "Systèmes multi-agents, assistants RAG et orchestration LLM sous garde-fous — le modèle propose, le code déterministe décide.",
    },
    stack: ["LangGraph", "RAG", "MCP", "Ollama", "Gemini"],
  },
  {
    number: "03",
    name: { en: "Product Engineering", fr: "Product Engineering" },
    description: {
      en: "Full-stack products taken from brief to App Store and production — web, iOS, and the payment, auth, and real-time plumbing in between.",
      fr: "Des produits full-stack menés du brief à l'App Store et à la prod — web, iOS, et toute la plomberie paiement, auth et temps réel entre les deux.",
    },
    stack: ["Next.js", "TypeScript", "React", "Expo", "Supabase"],
  },
  {
    number: "04",
    name: { en: "Infrastructure", fr: "Infrastructure" },
    description: {
      en: "Self-hosted production we operate ourselves: containers, reverse proxy, zero-trust tunnels, and a golden path from git push to a live domain.",
      fr: "Une prod auto-hébergée que nous opérons nous-mêmes : conteneurs, reverse proxy, tunnels zero-trust, et un chemin direct du git push au domaine en ligne.",
    },
    stack: ["Docker", "Coolify", "Traefik", "Cloudflare", "AWS"],
  },
  {
    number: "05",
    name: { en: "AI-Native Workflow", fr: "Workflow AI-Native" },
    description: {
      en: "Making other engineers faster — internal portals, custom skills and MCP servers, hands-on onboarding until the tooling actually sticks.",
      fr: "Rendre les autres ingénieurs plus rapides — portails internes, skills et serveurs MCP sur mesure, accompagnement jusqu'à ce que l'outil soit vraiment adopté.",
    },
    stack: ["Cursor", "Claude", "MCP", "n8n", "Playwright"],
  },
];
