import type { L } from "@/lib/i18n";

export type Metric = { value: string; label: L };

export type Visual =
  | { kind: "image"; src: string; alt: L }
  | { kind: "panel"; title: L; rows: { k: string; v: string }[] };

/**
 * The three tiers the featured cards are grouped into.
 *
 * The label is printed once, above the first card of each group — that heading
 * is what separates paid professional work from the studio's own products,
 * instead of leaving a visitor to infer it from sixteen equal-looking cards.
 */
export type Tier = "pro" | "studio" | "infra";

export const tierLabel: Record<Tier, L> = {
  pro: {
    en: "Professional — Nokia",
    fr: "Professionnel — Nokia",
  },
  studio: {
    en: "3geeks Studio — products in production",
    fr: "3geeks Studio — produits en production",
  },
  infra: {
    en: "3geeks Studio — what runs them",
    fr: "3geeks Studio — ce qui les fait tourner",
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
  /* ---------------- Professional — Nokia ---------------- */
  {
    id: "nokia-dashboard",
    name: "Feature Analyzer 2.0",
    tier: "pro",
    origin: "nokia",
    category: {
      en: "Creator & lead developer",
      fr: "Créateur & lead developer",
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
    id: "cursor-portal",
    name: "Cursor pour les nuls",
    tier: "pro",
    origin: "nokia",
    category: { en: "AI adoption lead", fr: "Lead adoption IA" },
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

  /* ------------- 3geeks Studio — in production ------------- */
  {
    id: "prompt-hub",
    name: "Prompt Hub",
    tier: "studio",
    origin: "3geeks",
    category: {
      en: "Multi-agent planning",
      fr: "Planification multi-agents",
    },
    context: { en: "Product · open beta", fr: "Produit · bêta ouverte" },
    description: {
      en: "A vague idea in a chat window never becomes a build plan. Prompt Hub turns a short brief into phased steps and copy-paste prompts, orchestrated by seven specialised agents over a dependency graph. Since launch it has gained multiplayer — invite a teammate by email and watch their cursor move on the same plan — and it runs end to end on our own infrastructure. Free, open beta.",
      fr: "Une idée floue dans une fenêtre de chat ne devient jamais un plan de build. Prompt Hub transforme un brief court en étapes séquencées et prompts prêts à coller, orchestrés par sept agents spécialisés sur un graphe de dépendances. Depuis le lancement il est passé en multijoueur — on invite un coéquipier par email et on voit son curseur bouger sur le même plan — et il tourne de bout en bout sur notre propre infrastructure. Bêta ouverte et gratuite.",
    },
    metrics: [
      {
        value: "20k+",
        label: { en: "reach on the launch post", fr: "portée du post de lancement" },
      },
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
    id: "promptoptim",
    name: "PromptOptim",
    tier: "studio",
    origin: "3geeks",
    category: {
      en: "Green IT & sovereignty",
      fr: "Green IT & souveraineté",
    },
    context: { en: "Product · live and open", fr: "Produit · en ligne et ouvert" },
    description: {
      en: "Verbose prompts burn tokens and CO₂ with nothing on screen to show it. PromptOptim rewrites a prompt for the same intent with fewer tokens, puts the carbon cost of every request in front of the user, and favours European models — an answer to AI usage that has to account for itself.",
      fr: "Les prompts verbeux brûlent des tokens et du CO₂ sans que rien ne le montre à l'écran. PromptOptim réécrit un prompt à intention égale avec moins de tokens, met le coût carbone de chaque requête sous les yeux de l'utilisateur et privilégie les modèles européens — une réponse à un usage de l'IA qui doit pouvoir se justifier.",
    },
    metrics: [
      { value: "CO₂", label: { en: "shown per request", fr: "affiché par requête" } },
      { value: "EU", label: { en: "models favoured", fr: "modèles privilégiés" } },
    ],
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Green IT"],
    visual: {
      kind: "image",
      src: "/projects/promptoptim.webp",
      alt: { en: "PromptOptim interface", fr: "Interface PromptOptim" },
    },
    link: "https://prompt-optim.3geeks.fr/",
    linkLabel: "prompt-optim.3geeks.fr",
    accent: "#3fbf6f",
  },
  {
    id: "express-divorce",
    name: "Express Divorce USA",
    tier: "studio",
    origin: "3geeks",
    category: { en: "Legal-tech SaaS", fr: "SaaS legal-tech" },
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
    id: "callkitchen",
    name: "CallKitchen",
    tier: "studio",
    origin: "3geeks",
    category: { en: "AI voice agent", fr: "Agent vocal IA" },
    context: { en: "Product · live", fr: "Produit · en ligne" },
    description: {
      en: "A restaurant loses orders every time the phone rings mid-service and nobody can pick up. CallKitchen answers it around the clock — takeaway orders, bookings and menu questions drawn from an approved menu — then confirms by SMS and pushes the order through to the kitchen.",
      fr: "Un restaurant perd des commandes chaque fois que le téléphone sonne en plein service sans que personne puisse décrocher. CallKitchen répond 24h/24 — commandes à emporter, réservations et questions menu puisées dans une carte validée — puis confirme par SMS et transmet la commande en cuisine.",
    },
    metrics: [
      { value: "24/7", label: { en: "phone answered", fr: "au téléphone" } },
      { value: "SMS", label: { en: "confirm + kitchen push", fr: "confirmation + envoi cuisine" } },
    ],
    stack: ["AI voice", "Next.js", "SaaS"],
    visual: {
      kind: "image",
      src: "/projects/callkitchen.webp",
      alt: { en: "CallKitchen landing", fr: "Landing CallKitchen" },
    },
    link: "https://call-kitchen-landing.vercel.app/",
    linkLabel: "call-kitchen-landing.vercel.app",
    accent: "#f472b6",
  },

  /* ---------- 3geeks Studio — what runs them ---------- */
  {
    id: "3geeks-infra",
    name: "3geeks Infra",
    tier: "infra",
    origin: "3geeks",
    category: {
      en: "Co-founder & DevOps",
      fr: "Co-fondateur & DevOps",
    },
    context: { en: "Infrastructure", fr: "Infrastructure" },
    description: {
      en: "Every product above runs on this. Our apps were scattered across Vercel with drifting env vars and no single view of production; I consolidated every 3geeks service onto one Mac Mini — Coolify, Traefik, Cloudflare Tunnel — with a golden path from git push to a live HTTPS domain, plus three Vercel migrations behind permanent redirects.",
      fr: "Tous les produits ci-dessus tournent là-dessus. Nos apps étaient éparpillées sur Vercel, variables d'environnement à la dérive, sans vue d'ensemble de la prod ; j'ai consolidé tous les services 3geeks sur un Mac Mini — Coolify, Traefik, Cloudflare Tunnel — avec un chemin direct du git push au domaine HTTPS, plus trois migrations Vercel derrière des redirections permanentes.",
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
    // Private to the studio: described, never linked, no repository access.
    // The point of the entry is the guardrail design, not the trading.
    name: "Trading Orchestrator",
    origin: "3geeks",
    tagline: {
      en: "A deterministic execution engine where the model never touches the decision path: a LangGraph workflow proposes, and a fail-closed risk manager holds sole approval authority. Four isolated modes, from fully mocked to live, so nothing reaches a real account by accident.",
      fr: "Un moteur d'exécution déterministe où le modèle ne touche jamais au chemin de décision : un workflow LangGraph propose, un risk manager fail-closed détient seul l'autorité d'approbation. Quatre modes isolés, du tout-simulé au réel, pour qu'aucun ordre ne parte par accident.",
    },
    stack: ["Python", "LangGraph", "PostgreSQL", "Docker"],
    status: { en: "Private — 3geeks studio", fr: "Privé — 3geeks studio" },
    accent: "#f0b429",
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
    // Client work, anonymised: architecture only, no brand, sector or location.
    name: "Retail ops platform",
    origin: "client",
    tagline: {
      en: "One shop, three surfaces that had to agree: an online storefront, a scale-driven point of sale at the counter and a live wall display. A private ops platform keeps prices, stock and loyalty in sync in real time.",
      fr: "Une boutique, trois surfaces qui devaient rester d'accord : une vitrine en ligne, une caisse au poids au comptoir et un affichage mural en direct. Une plateforme d'exploitation privée synchronise prix, stock et fidélité en temps réel.",
    },
    stack: ["Shopify GraphQL", "Firebase RTDB", "POS", "Next.js"],
    status: { en: "Client project, in production", fr: "Projet client, en production" },
    accent: "#3fbf6f",
  },
  {
    // Client work, anonymised: architecture only, no brand, sector or operator.
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
