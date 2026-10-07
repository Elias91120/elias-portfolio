import type { L } from "@/lib/i18n";

export type Metric = { value: string; label: L };

export type FlowNode = {
  label: L;
  sub?: L;
  /** Small tags shown inside the node — used for a group of sources. */
  chips?: L[];
};

export type Visual =
  | { kind: "image"; src: string; alt: L }
  | { kind: "panel"; title: L; rows: { k: string; v: string }[] }
  | { kind: "flow"; title: L; nodes: FlowNode[]; badge?: L };

/**
 * The tiers the featured cards are grouped into.
 *
 * The label is printed once, above the first card of each group, so a visitor
 * sees at a glance which employer or venture each piece of work belongs to
 * instead of inferring it from equal-looking cards.
 */
export type Tier = "now" | "pro" | "studio";

export const tierLabel: Record<Tier, L> = {
  now: {
    en: "Cleva Solutions — right now",
    fr: "Cleva Solutions — en ce moment",
  },
  pro: {
    en: "Nokia — 2025 · 2026",
    fr: "Nokia — 2025 · 2026",
  },
  studio: {
    en: "3geeks — co-founded, built to be adapted inside companies",
    fr: "3geeks — co-fondé, conçu pour s'adapter aux entreprises",
  },
};

export type Work = {
  id: string;
  name: string;
  tier: Tier;
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


/** The cards that stack on scroll, grouped by tier. */
export const featuredWork: Work[] = [
  /* ---------------- Cleva Solutions ---------------- */
  {
    id: "ai-models",
    name: "AI models in practice",
    tier: "now",
    category: {
      en: "AI engineering",
      fr: "Ingénierie IA",
    },
    context: { en: "Now · Cleva Solutions", fr: "En ce moment · Cleva Solutions" },
    description: {
      en: "Clients want to know what AI can do for them, and a slide will not tell them. I take existing open-source models, adapt them to a precise need, deploy them locally and put a working proof of concept in front of the client. It is where I work every day — and only the beginning.",
      fr: "Les clients veulent savoir ce que l'IA peut faire pour eux, et une slide ne le leur dira pas. Je prends des modèles open source existants, je les adapte à un besoin précis, je les déploie en local et je mets un POC fonctionnel devant le client. C'est là que je travaille chaque jour — et ce n'est que le début.",
    },
    metrics: [
      { value: "POC", label: { en: "working demos, not slides", fr: "des démos qui marchent, pas des slides" } },
      { value: "Local", label: { en: "deployment, on our own infrastructure", fr: "déploiement, sur notre propre infrastructure" } },
    ],
    stack: ["Fine-tuning", "Open-source models", "Local deployment", "AI integration"],
    visual: {
      kind: "flow",
      title: { en: "From open model to client proof", fr: "Du modèle ouvert à la preuve client" },
      badge: { en: "Ongoing", fr: "En cours" },
      nodes: [
        {
          label: { en: "Open-source model", fr: "Modèle open source" },
          sub: { en: "picked for the need", fr: "choisi pour le besoin" },
        },
        {
          label: { en: "Adapt", fr: "Adapter" },
          sub: { en: "fine-tuned to the use case", fr: "fine-tuné sur le cas d'usage" },
        },
        {
          label: { en: "Deploy locally", fr: "Déployer en local" },
          sub: { en: "on our own infrastructure", fr: "sur notre propre infrastructure" },
        },
        {
          label: { en: "Client proof of concept", fr: "POC client" },
          sub: { en: "shown working, on their case", fr: "démontré, sur leur cas" },
        },
      ],
    },
    accent: "#22d3ee",
  },

  /* ---------------------- Nokia ---------------------- */
  {
    id: "data-pipelines",
    name: "Data pipelines & dashboards",
    tier: "pro",
    origin: "nokia",
    category: {
      en: "Creator & lead developer",
      fr: "Créateur & lead developer",
    },
    context: { en: "Internal platform · Nokia", fr: "Plateforme interne · Nokia" },
    description: {
      en: "Information on a single topic was scattered across many internal tools, and every analysis meant reconciling them by hand. I built the pipeline that gathers it, links it together and presents it in one clean, live dashboard — with an AI summary on top.",
      fr: "L'information sur un même sujet était éparpillée dans de nombreux outils internes, et chaque analyse demandait de les recouper à la main. J'ai construit le pipeline qui la réunit, la relie et la présente dans un dashboard unique, propre et en direct — avec un résumé IA par-dessus.",
    },
    metrics: [
      { value: "7+", label: { en: "internal sources unified", fr: "sources internes unifiées" } },
      { value: "1", label: { en: "clean live dashboard", fr: "dashboard propre et vivant" } },
      { value: "AI", label: { en: "summary on top", fr: "résumé par-dessus" } },
    ],
    stack: ["Python", "Data pipelines", "Dashboards", "AI summary"],
    visual: {
      kind: "flow",
      title: { en: "Many sources → one clear view", fr: "Plusieurs sources → une vue claire" },
      nodes: [
        {
          label: { en: "7+ internal sources", fr: "7+ sources internes" },
          sub: { en: "scattered across tools", fr: "éparpillées entre les outils" },
        },
        {
          label: { en: "Collect", fr: "Collecter" },
          sub: { en: "one automated pipeline", fr: "un pipeline automatisé" },
        },
        {
          label: { en: "Correlate", fr: "Corréler" },
          sub: { en: "one shared picture", fr: "une vue commune" },
        },
        {
          label: { en: "Live dashboard + AI summary", fr: "Dashboard live + résumé IA" },
          sub: { en: "read in one pass", fr: "lisible d'un coup" },
        },
      ],
    },
    accent: "#8b7ef8",
  },

  /* ------------------------ 3geeks ------------------------ */
  {
    id: "prompt-hub",
    name: "Prompt Hub",
    tier: "studio",
    origin: "3geeks",
    category: {
      en: "Multi-agent planning",
      fr: "Planification multi-agents",
    },
    context: {
      en: "Product · also adapted inside Nokia",
      fr: "Produit · aussi adapté chez Nokia",
    },
    description: {
      en: "A vague idea in a chat window never becomes a build plan. Prompt Hub turns a short brief into phased steps and copy-paste prompts, orchestrated by seven specialised agents over a dependency graph, with multiplayer editing. Built at 3geeks, then brought into Nokia.",
      fr: "Une idée floue dans une fenêtre de chat ne devient jamais un plan de build. Prompt Hub transforme un brief court en étapes séquencées et prompts prêts à coller, orchestrés par sept agents spécialisés sur un graphe de dépendances, en édition multijoueur. Conçu chez 3geeks, puis intégré chez Nokia.",
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
  {
    id: "3geeks-infra",
    name: "3geeks Infra",
    tier: "studio",
    origin: "3geeks",
    category: {
      en: "Co-founder & DevOps",
      fr: "Co-fondateur & DevOps",
    },
    context: { en: "Infrastructure", fr: "Infrastructure" },
    description: {
      en: "Every 3geeks product runs on this. The studio's apps were scattered across Vercel with drifting environment variables; I consolidated them onto one self-hosted stack — Coolify, Traefik, Cloudflare Tunnel — with a straight path from git push to a live HTTPS domain.",
      fr: "Tous les produits 3geeks tournent là-dessus. Les apps du studio étaient éparpillées sur Vercel, variables d'environnement à la dérive ; je les ai consolidées sur une stack auto-hébergée — Coolify, Traefik, Cloudflare Tunnel — avec un chemin direct du git push au domaine HTTPS.",
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
];

/* ------------------------------------------------------------------ */
/*  The rest of the shipped work — compact list                        */
/*  Each entry is one sentence: what it does, nothing about how it     */
/*  felt. The first few show by default, the rest sit behind a button. */
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
    // Private to the studio: described, never linked, no repository access.
    // The point of the entry is the guardrail design, not the trading.
    name: "Trading Orchestrator",
    origin: "3geeks",
    tagline: {
      en: "A deterministic execution engine: a LangGraph workflow proposes, and a fail-closed risk manager alone approves. Four isolated modes, from fully mocked to live.",
      fr: "Un moteur d'exécution déterministe : un workflow LangGraph propose, un risk manager fail-closed est seul à approuver. Quatre modes isolés, du tout-simulé au réel.",
    },
    stack: ["Python", "LangGraph", "PostgreSQL"],
    status: { en: "Private — 3geeks", fr: "Privé — 3geeks" },
    accent: "#f0b429",
  },
  {
    name: "PromptOptim",
    origin: "3geeks",
    tagline: {
      en: "Rewrites a prompt for the same intent with fewer tokens, shows the carbon cost of each request and favours European models.",
      fr: "Réécrit un prompt à intention égale avec moins de tokens, affiche le coût carbone de chaque requête et privilégie les modèles européens.",
    },
    stack: ["Next.js", "FastAPI", "Green IT"],
    status: { en: "Live and open", fr: "En ligne et ouvert" },
    link: "https://prompt-optim.3geeks.fr/",
    accent: "#3fbf6f",
  },
  {
    name: "CallKitchen",
    origin: "3geeks",
    tagline: {
      en: "An AI voice agent that answers a restaurant's phone around the clock — takeaway, bookings, menu questions — then confirms by SMS and sends the order to the kitchen.",
      fr: "Un agent vocal IA qui répond au téléphone d'un restaurant 24h/24 — commandes, réservations, questions menu — puis confirme par SMS et envoie la commande en cuisine.",
    },
    stack: ["AI voice", "Next.js", "SaaS"],
    status: { en: "Live", fr: "En ligne" },
    link: "https://call-kitchen-landing.vercel.app/",
    accent: "#f472b6",
  },
  {
    name: "Express Divorce USA",
    origin: "3geeks",
    tagline: {
      en: "A regulated-sector SaaS guiding US couples through their own state's divorce paperwork. Multi-state compliance and data security from day one.",
      fr: "Un SaaS en secteur régulé qui guide les couples américains dans les démarches de divorce de leur État. Conformité multi-États et sécurité des données dès le premier jour.",
    },
    stack: ["Next.js", "TypeScript", "Compliance"],
    status: { en: "In production", fr: "En production" },
    link: "https://expressdivorceusa.co",
    caseStudy: "/projects/express-divorce",
    accent: "#4aa8f0",
  },
  {
    name: "3geeks API Hub",
    origin: "3geeks",
    tagline: {
      en: "A fully local, OpenAI-compatible gateway in front of Ollama — personal tokens, live usage stats and model management for the whole studio.",
      fr: "Une passerelle 100 % locale compatible OpenAI devant Ollama — tokens personnels, statistiques d'usage en direct et gestion des modèles pour tout le studio.",
    },
    stack: ["FastAPI", "Ollama", "React"],
    status: { en: "Internal, in production", fr: "Interne, en production" },
    accent: "#8b7ef8",
  },
  {
    name: "3geeks",
    origin: "3geeks",
    tagline: {
      en: "The studio flagship: an intent-to-website generator where a written brief becomes a fully laid-out site.",
      fr: "Le produit phare du studio : un générateur de sites à partir d'une intention, où un brief écrit devient un site entièrement mis en page.",
    },
    stack: ["Next.js", "LLM", "GenUI"],
    status: { en: "Live", fr: "En ligne" },
    link: "https://www.3geeks.fr",
    caseStudy: "/projects/web-gen",
    accent: "#3fbf6f",
  },
  {
    name: "Two",
    origin: "client",
    tagline: {
      en: "An iOS space for couples — shared calendar, expenses, memories and a geolocated photo map. The data stays between the two partners.",
      fr: "Un espace iOS pour les couples — calendrier partagé, dépenses, souvenirs et carte photo géolocalisée. Les données restent entre les deux partenaires.",
    },
    stack: ["Swift", "SwiftUI", "Firebase"],
    status: { en: "On the App Store", fr: "Sur l'App Store" },
    link: "https://apps.apple.com/fr/app/two/id6758867716",
    accent: "#2dd4bf",
  },
  {
    name: "AI Travel Planner",
    origin: "academic",
    tagline: {
      en: "A natural-language brief becomes a day-by-day itinerary, powered by Gemini. Elected best Bachelor project at ECE Paris.",
      fr: "Un brief en langage naturel devient un itinéraire jour par jour, avec Gemini. Élu meilleur projet de Bachelor de l'ECE Paris.",
    },
    stack: ["Gemini", "Python", "APIs"],
    status: { en: "Best Bachelor project", fr: "Meilleur projet Bachelor" },
    caseStudy: "/projects/ai-travel-planner",
    accent: "#f0b429",
  },
  {
    // Client work, anonymised: architecture only, no brand, sector or location.
    name: "Retail ops platform",
    origin: "client",
    tagline: {
      en: "One shop, three surfaces that must agree — storefront, scale-driven point of sale, live wall display — kept in sync in real time by a private ops platform.",
      fr: "Une boutique, trois surfaces qui doivent rester d'accord — vitrine, caisse au poids, affichage mural — synchronisées en temps réel par une plateforme d'exploitation privée.",
    },
    stack: ["Shopify GraphQL", "Firebase RTDB", "Next.js"],
    status: { en: "Client project", fr: "Projet client" },
    accent: "#3fbf6f",
  },
  {
    // Client work, anonymised: architecture only, no brand, sector or operator.
    name: "Telegram Mini-App",
    origin: "client",
    tagline: {
      en: "A private ordering mini-app running entirely inside Telegram, with a PIN-protected operator dashboard.",
      fr: "Une mini-app de commande privée qui tourne entièrement dans Telegram, avec un dashboard opérateur protégé par code PIN.",
    },
    stack: ["Node.js", "Telegram", "SQLite"],
    status: { en: "Client project", fr: "Projet client" },
    accent: "#f08a3c",
  },
];

/** How many compact entries are visible before the "show more" button. */
export const OTHER_WORK_VISIBLE = 6;
