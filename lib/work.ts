import type { L } from "@/lib/i18n";

export type Metric = { value: string; label: L };

export type Visual =
  | { kind: "image"; src: string; alt: L }
  | { kind: "panel"; title: L; rows: { k: string; v: string }[] };

export type Work = {
  id: string;
  name: string;
  origin?: "3geeks" | "nokia" | "client" | "academic";
  category: L;
  context: L;
  description: L;
  metrics: Metric[];
  stack: string[];
  visual: Visual;
  link?: string;
  linkLabel?: string;
  caseStudy?: string;
  accent: string;
};

/** The cards that stack on scroll — strongest proof first. */
export const featuredWork: Work[] = [
  {
    id: "nokia-dashboard",
    name: "Feature Analyzer 2.0",
    origin: "nokia",
    category: {
      en: "Nokia · Creator & lead developer",
      fr: "Nokia · Créateur & lead developer",
    },
    context: { en: "Internal platform", fr: "Plateforme interne" },
    description: {
      en: "Feature analysis at Nokia lived in a dozen exports nobody could reconcile. I built one platform that collects, correlates and reports across seven heterogeneous sources — the manual analysis became a live dashboard teams open every day.",
      fr: "L'analyse des features chez Nokia vivait dans une dizaine d'exports que personne ne pouvait réconcilier. J'ai construit une plateforme unique qui collecte, corrèle et restitue depuis sept sources hétérogènes — l'analyse manuelle est devenue un dashboard temps réel ouvert chaque jour.",
    },
    metrics: [
      { value: "7+", label: { en: "data sources unified", fr: "sources unifiées" } },
      { value: "4", label: { en: "pipeline stages", fr: "étapes de pipeline" } },
    ],
    stack: ["FastAPI", "React", "Python", "Data pipeline"],
    visual: {
      kind: "image",
      src: "/projects/nokia-dashboard.webp",
      alt: { en: "Feature Analyzer dashboard", fr: "Dashboard Feature Analyzer" },
    },
    caseStudy: "/projects/nokia-dashboard",
    accent: "#8b7ef8",
  },
  {
    id: "3geeks-infra",
    name: "3geeks Infra",
    origin: "3geeks",
    category: {
      en: "3geeks Studio · Co-founder & DevOps",
      fr: "3geeks Studio · Co-fondateur & DevOps",
    },
    context: { en: "Infrastructure", fr: "Infrastructure" },
    description: {
      en: "Our apps were scattered across Vercel with drifting env vars and no single view of production. I consolidated every 3geeks service onto one Mac Mini — Coolify, Traefik, Cloudflare Tunnel — with a golden path from git push to a live HTTPS domain, plus three Vercel migrations behind permanent redirects.",
      fr: "Nos apps étaient éparpillées sur Vercel, variables d'environnement à la dérive, sans vue d'ensemble de la prod. J'ai consolidé tous les services 3geeks sur un Mac Mini — Coolify, Traefik, Cloudflare Tunnel — avec un chemin direct du git push au domaine HTTPS, plus trois migrations Vercel derrière des redirections permanentes.",
    },
    metrics: [
      { value: "13", label: { en: "apps in production", fr: "apps en production" } },
      { value: "10+", label: { en: "domains routed", fr: "domaines routés" } },
      { value: "3", label: { en: "Vercel migrations", fr: "migrations Vercel" } },
    ],
    stack: ["Docker", "Coolify", "Traefik", "Cloudflare", "PostgreSQL"],
    visual: {
      kind: "panel",
      title: { en: "Deploy path", fr: "Chemin de déploiement" },
      rows: [
        { k: "push", v: "GitHub main" },
        { k: "build", v: "Coolify · Dockerfile" },
        { k: "route", v: "Traefik :443" },
        { k: "expose", v: "Cloudflare Tunnel" },
        { k: "live", v: "3geeks.fr" },
      ],
    },
    link: "https://www.3geeks.fr",
    linkLabel: "3geeks.fr",
    caseStudy: "/projects/3geeks-infra",
    accent: "#f0b429",
  },
  {
    id: "cursor-portal",
    name: "Cursor pour les nuls",
    origin: "nokia",
    category: { en: "Nokia · AI adoption lead", fr: "Nokia · Lead adoption IA" },
    context: { en: "Developer experience", fr: "Developer experience" },
    description: {
      en: "Buying AI licences is easy; getting engineers to actually use them is not. I built an internal portal with a RAG assistant trained on our own documentation, then ran demos and one-to-one sessions team after team until the tooling stuck.",
      fr: "Acheter des licences IA est facile ; faire en sorte que les ingénieurs s'en servent, beaucoup moins. J'ai construit un portail interne avec un assistant RAG branché sur notre documentation, puis enchaîné démos et sessions individuelles équipe par équipe jusqu'à l'adoption réelle.",
    },
    metrics: [
      { value: "1,019", label: { en: "portal views", fr: "vues du portail" } },
      { value: "75", label: { en: "unique visitors", fr: "visiteurs uniques" } },
      { value: "100+", label: { en: "RAG answers", fr: "réponses RAG" } },
      { value: "4", label: { en: "teams onboarded", fr: "équipes formées" } },
    ],
    stack: ["RAG", "MCP", "Cursor", "DevEx"],
    visual: {
      kind: "panel",
      title: { en: "Adoption loop", fr: "Boucle d'adoption" },
      rows: [
        { k: "01", v: "Knowledge portal" },
        { k: "02", v: "RAG assistant" },
        { k: "03", v: "Team demos" },
        { k: "04", v: "1:1 coaching" },
        { k: "05", v: "Skills & MCP servers" },
      ],
    },
    caseStudy: "/projects/cursor-portal",
    accent: "#f08a3c",
  },
  {
    id: "express-divorce",
    name: "Express Divorce USA",
    origin: "3geeks",
    category: { en: "3geeks Studio · Legal-tech SaaS", fr: "3geeks Studio · SaaS legal-tech" },
    context: { en: "Client · in production", fr: "Client · en production" },
    description: {
      en: "A regulated-sector SaaS that guides US couples through the divorce paperwork of their own state. Multi-state compliance, personal-data security and data sovereignty were constraints from day one, not an afterthought.",
      fr: "Un SaaS en secteur régulé qui guide les couples américains dans les démarches de divorce propres à leur État. Conformité multi-États, sécurité des données personnelles et souveraineté étaient des contraintes dès le premier jour, pas un rattrapage.",
    },
    metrics: [
      { value: "Live", label: { en: "with real users", fr: "avec de vrais utilisateurs" } },
      { value: "Multi-state", label: { en: "US compliance", fr: "conformité US" } },
    ],
    stack: ["Next.js", "TypeScript", "Compliance"],
    visual: {
      kind: "image",
      src: "/projects/express-divorce.webp",
      alt: { en: "Express Divorce USA landing", fr: "Landing Express Divorce USA" },
    },
    link: "https://expressdivorceusa.co",
    linkLabel: "expressdivorceusa.co",
    caseStudy: "/projects/express-divorce",
    accent: "#4aa8f0",
  },
  {
    id: "green-jardin",
    name: "Green Jardin",
    origin: "client",
    category: {
      en: "Omnichannel retail · online + in-store",
      fr: "Retail omnicanal · en ligne + boutique",
    },
    context: { en: "Client · in production", fr: "Client · en production" },
    description: {
      en: "One shop, three surfaces that had to agree: a Shopify storefront, a gram-scale point of sale at the counter, and a live TV menu on the wall. I built the private ops platform that keeps prices, stock and a 14% loyalty programme in sync in real time.",
      fr: "Une boutique, trois surfaces qui devaient rester d'accord : une vitrine Shopify, une caisse au gramme au comptoir, et un menu TV en direct au mur. J'ai construit la plateforme d'exploitation privée qui synchronise prix, stock et fidélité 14% en temps réel.",
    },
    metrics: [
      { value: "3", label: { en: "channels synced live", fr: "canaux synchronisés" } },
      { value: "14%", label: { en: "loyalty programme", fr: "programme fidélité" } },
    ],
    stack: ["Shopify GraphQL", "Firebase RTDB", "POS", "Next.js"],
    visual: {
      kind: "image",
      src: "/projects/green-jardin-tv.webp",
      alt: { en: "Green Jardin live TV menu", fr: "Menu TV en direct Green Jardin" },
    },
    link: "https://green-jardin.fr",
    linkLabel: "green-jardin.fr",
    caseStudy: "/projects/green-jardin",
    accent: "#3fbf6f",
  },
  {
    id: "prompt-hub",
    name: "Prompt Hub",
    origin: "3geeks",
    category: {
      en: "3geeks Studio · Multi-agent planning",
      fr: "3geeks Studio · Planification multi-agents",
    },
    context: { en: "Product · beta", fr: "Produit · bêta" },
    description: {
      en: "A vague idea in a chat window never becomes a build plan. Prompt Hub turns a short brief into phased steps and copy-paste prompts, orchestrated by seven specialised agents over a dependency graph, with versioned and reversible plans.",
      fr: "Une idée floue dans une fenêtre de chat ne devient jamais un plan de build. Prompt Hub transforme un brief court en étapes séquencées et prompts prêts à coller, orchestrés par sept agents spécialisés sur un graphe de dépendances, avec des plans versionnés et réversibles.",
    },
    metrics: [
      { value: "7+", label: { en: "specialised agents", fr: "agents spécialisés" } },
      { value: "< 1 min", label: { en: "idea to plan", fr: "de l'idée au plan" } },
    ],
    stack: ["Multi-agent", "FastAPI", "React", "PostgreSQL"],
    visual: {
      kind: "image",
      src: "/projects/prompt-hub.webp",
      alt: { en: "Prompt Hub interface", fr: "Interface Prompt Hub" },
    },
    link: "https://prompt-hub.3geeks.fr",
    linkLabel: "prompt-hub.3geeks.fr",
    accent: "#a78bfa",
  },
];

/* ------------------------------------------------------------------ */
/*  The rest of the shipped work — compact grid                        */
/* ------------------------------------------------------------------ */

export type SideProject = {
  name: string;
  origin?: "3geeks" | "nokia" | "client" | "academic";
  tagline: L;
  stack: string[];
  status: L;
  link?: string;
  caseStudy?: string;
  accent: string;
};

export const otherWork: SideProject[] = [
  {
    name: "Trading Orchestrator",
    origin: "3geeks",
    tagline: {
      en: "3geeks live trading desk on Kraken spot: a LangGraph workflow with no LLM anywhere on the decision path, and a fail-closed risk manager that holds sole approval authority.",
      fr: "Desk de trading 3geeks sur Kraken spot : un workflow LangGraph sans aucun LLM sur le chemin de décision, et un risk manager fail-closed seul détenteur de l'autorité d'approbation.",
    },
    stack: ["Python", "LangGraph", "ccxt", "PostgreSQL", "Docker"],
    status: { en: "Running in production", fr: "En production" },
    accent: "#f0b429",
  },
  {
    name: "VIPA",
    origin: "3geeks",
    tagline: {
      en: "iOS productivity assistant — AI planning, tasks, notes and habits on an Expo + Supabase monorepo, with its own billing API in production.",
      fr: "Assistant de productivité iOS — planning IA, tâches, notes et habitudes sur un monorepo Expo + Supabase, avec son API de facturation en production.",
    },
    stack: ["Expo", "TypeScript", "Supabase", "FastAPI", "Stripe"],
    status: { en: "In development", fr: "En développement" },
    accent: "#4aa8f0",
  },
  {
    name: "Two",
    origin: "client",
    tagline: {
      en: "All-in-one iOS space for couples — shared calendar, expenses, memories and a geolocated photo map. Data stays between the two partners, never sold.",
      fr: "Espace iOS tout-en-un pour les couples — calendrier partagé, dépenses, souvenirs et carte photo géolocalisée. Les données restent entre les deux partenaires, jamais revendues.",
    },
    stack: ["Swift", "SwiftUI", "Firebase"],
    status: { en: "On the App Store", fr: "Sur l'App Store" },
    link: "https://apps.apple.com/fr/app/two/id6758867716",
    accent: "#2dd4bf",
  },
  {
    name: "3geeks API Hub",
    origin: "3geeks",
    tagline: {
      en: "A fully local, OpenAI-compatible gateway in front of Ollama — personal tokens, live usage stats and model management for the whole studio.",
      fr: "Une passerelle 100% locale compatible OpenAI devant Ollama — tokens personnels, statistiques d'usage en direct et gestion des modèles pour tout le studio.",
    },
    stack: ["FastAPI", "Ollama", "SQLite", "React"],
    status: { en: "Internal, in production", fr: "Interne, en production" },
    accent: "#8b7ef8",
  },
  {
    name: "PromptOptim",
    origin: "3geeks",
    tagline: {
      en: "Same intent, fewer tokens: a prompt optimiser that surfaces the CO₂ cost of every request and favours European models.",
      fr: "Même intention, moins de tokens : un optimiseur de prompts qui affiche le coût CO₂ de chaque requête et privilégie les modèles européens.",
    },
    stack: ["Next.js", "FastAPI", "Green IT"],
    status: { en: "Live and open", fr: "En ligne, ouvert" },
    link: "https://prompt-optim.3geeks.fr/",
    accent: "#3fbf6f",
  },
  {
    name: "3geeks",
    origin: "3geeks",
    tagline: {
      en: "The studio flagship: an intent-to-website generator where a written brief becomes a fully laid-out site, plus our own landing.",
      fr: "Le produit phare du studio : un générateur de sites à partir d'une intention, où un brief écrit devient un site entièrement mis en page.",
    },
    stack: ["Next.js", "LLM", "GenUI"],
    status: { en: "Live", fr: "En ligne" },
    link: "https://www.3geeks.fr",
    caseStudy: "/projects/web-gen",
    accent: "#3fbf6f",
  },
  {
    name: "CallKitchen",
    origin: "3geeks",
    tagline: {
      en: "An AI voice agent that answers a restaurant's phone 24/7 — takeout, bookings and menu questions, with SMS confirmation and a kitchen dashboard.",
      fr: "Un agent vocal IA qui répond au téléphone d'un restaurant 24h/24 — commandes, réservations et questions menu, avec confirmation SMS et dashboard cuisine.",
    },
    stack: ["AI voice", "Next.js", "SaaS"],
    status: { en: "Live landing", fr: "Landing en ligne" },
    link: "https://call-kitchen-landing.vercel.app/",
    accent: "#f472b6",
  },
  {
    name: "Filament",
    origin: "3geeks",
    tagline: {
      en: "A 4v4 .io game in Canvas 2D — territory painting, filaments between teammates and heart destruction, with a bot benchmark to balance matches.",
      fr: "Un jeu .io 4v4 en Canvas 2D — peinture de territoire, filaments entre coéquipiers et destruction du Cœur adverse, avec un benchmark de bots pour équilibrer les parties.",
    },
    stack: ["Next.js", "Canvas 2D", "Game loop"],
    status: { en: "Live", fr: "En ligne" },
    link: "https://filament.3geeks.fr",
    accent: "#a78bfa",
  },
  {
    name: "AI Travel Planner",
    origin: "academic",
    tagline: {
      en: "Intent-based travel planning powered by Gemini: a natural-language brief becomes a day-by-day itinerary. Elected best Bachelor project at ECE Paris.",
      fr: "Planification de voyage par intention avec Gemini : un brief en langage naturel devient un itinéraire jour par jour. Élu meilleur projet de Bachelor de l'ECE Paris.",
    },
    stack: ["Gemini", "Python", "APIs"],
    status: { en: "Best Bachelor project", fr: "Meilleur projet Bachelor" },
    caseStudy: "/projects/ai-travel-planner",
    accent: "#f0b429",
  },
  {
    // Client work under NDA — described by its architecture only, with no
    // brand, sector or operator detail.
    name: "Telegram Mini-App",
    origin: "client",
    tagline: {
      en: "A private ordering mini-app running entirely inside Telegram, paired with a PIN-protected operator dashboard built to live pinned on a single phone.",
      fr: "Une mini-app de commande privée qui tourne entièrement dans Telegram, avec un dashboard opérateur protégé par code PIN, pensé pour vivre épinglé sur un seul téléphone.",
    },
    stack: ["Node.js", "Telegram", "SQLite", "PWA"],
    status: { en: "Client project, in production", fr: "Projet client, en production" },
    accent: "#f08a3c",
  },
];
