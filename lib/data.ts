export type ChapterAnimation = {
  /** Timeline position where scrub begins (pages before current) */
  scrubIn?: number;
  /** Duration of the scrub window in timeline units */
  scrubSpan?: number;
  driftFrom?: number;
  driftTo?: number;
  transition?: "dissolve" | "pushUp" | "pushLeft";
};

export type Chapter = {
  id: string;
  years: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  /** Optional cinemagraph clip scrubbed by the scroll */
  video?: string;
  /** Gradient endpoints for the evolving background */
  bgA: string;
  bgB: string;
  /** Accent color used for the chapter kicker */
  accent: string;
  animation?: ChapterAnimation;
};

export function getChapterAnimation(ch: Chapter, index: number) {
  // Ch.1 = Runway cinemagraph → subtle GSAP drift complements the clip.
  // Ch.2+ = Ken Burns clips → motion lives in the video; extra drift doubles the zoom.
  const runwayStyle = index === 0;
  return {
    scrubIn: ch.animation?.scrubIn ?? (runwayStyle ? 0 : index - 0.45),
    scrubSpan: ch.animation?.scrubSpan ?? 0.55,
    driftFrom: ch.animation?.driftFrom ?? (runwayStyle ? 1.09 : 1),
    driftTo: ch.animation?.driftTo ?? 1,
    transition: ch.animation?.transition ?? "dissolve",
  } as Required<ChapterAnimation>;
}

export const chapters: Chapter[] = [
  {
    id: "beginning",
    years: "~2012",
    title: "The Beginning",
    text: "One evening, my dad came home carrying a big box — our first real computer. I was eight. Someone showed me Minecraft, and that was it: I spent hours building worlds block by block, wondering how a machine could hold entire universes inside. I didn't have the words for it yet, but I had just fallen in love with computers.",
    image: "/story/chapter-1.jpg",
    video: "/story/chapter-1.mp4",
    imageAlt: "Young Elias discovering Minecraft on his first computer",
    bgA: "#2b1708",
    bgB: "#160b03",
    accent: "#f59e0b",
  },
  {
    id: "first-code",
    years: "2016 — 2019",
    title: "First Lines of Code",
    text: "Playing was no longer enough — I wanted to make the machine obey. Redstone contraptions became little scripts, scripts became projects. I visited the IoT Valley startups in Toulouse to poke at connected objects, then walked into Nokia Paris-Saclay for a discovery internship. I remember thinking: one day, I'll work in a place like this.",
    image: "/story/chapter-2.jpg",
    video: "/story/chapter-2.mp4",
    imageAlt: "Teenage Elias writing his first lines of code",
    bgA: "#0a2328",
    bgB: "#051215",
    accent: "#2dd4bf",
  },
  {
    id: "sti2d",
    years: "2020 — 2023",
    title: "Tinkering Becomes Engineering",
    text: "In high school I chose STI2D, option SIN at Lycée Parc de Vilgenis in Massy — the path of electronics and code. Soldering irons, logic gates, embedded systems: little by little, playing turned into building, and building turned into engineering. Baccalauréat in hand, I knew exactly where I was heading.",
    image: "/story/chapter-3.jpg",
    video: "/story/chapter-3.mp4",
    imageAlt: "Elias soldering electronics in his high school tech lab",
    bgA: "#0e3028",
    bgB: "#071812",
    accent: "#4ade80",
  },
  {
    id: "ece",
    years: "2023 — 2026",
    title: "Data & AI at ECE Paris",
    text: "At ECE Paris I dove into data and artificial intelligence. With my team, I built an intent-based travel planner powered by Gemini — it was elected best Bachelor project of the school. Somewhere between the pipelines and the demos, 'coding' quietly became 'shipping'.",
    image: "/story/chapter-4.jpg",
    video: "/story/chapter-4.mp4",
    imageAlt: "Elias presenting his AI travel planner on stage",
    bgA: "#241246",
    bgB: "#100722",
    accent: "#a78bfa",
  },
  {
    id: "nokia",
    years: "2025 — 2026",
    title: "Nokia, the Turning Point",
    text: "A six-month internship became a full apprenticeship — and the chapter where everything accelerated. I built and shipped a FastAPI + React platform that analyzes features end-to-end, weaving seven data sources into one real-time dashboard, and automated workflows entire teams rely on daily. Then I led the adoption of Cursor: a knowledge portal, a RAG assistant, demos team after team. The intern had become the person teams call to move faster with AI.",
    image: "/story/chapter-5.jpg",
    video: "/story/chapter-5.mp4",
    imageAlt: "Elias presenting data dashboards at Nokia",
    bgA: "#062037",
    bgB: "#030f1d",
    accent: "#38bdf8",
  },
  {
    id: "3geeks",
    years: "2025 — now",
    title: "Three Friends, One Studio",
    text: "Meanwhile, with Noam and Charles, webgen became our studio — made in France, built around Web-Gen, our intent-to-website generator. We shipped Express Divorce USA into production, built CallKitchen, released the Two app, launched Green Jardin — a live CBD shop online and in-store — and released tools like PromptOptim in the open. Behind the products, we run our own prod stack on a Mac Mini: Coolify, Traefik, Cloudflare Tunnel — push to GitHub, live on *.3geeks.fr. Three friends, real clients, real code.",
    image: "/story/chapter-6.jpg",
    video: "/story/chapter-6.mp4",
    imageAlt: "Elias, Noam and Charles celebrating a launch at 3geeks",
    bgA: "#1d1240",
    bgB: "#0c0720",
    accent: "#c084fc",
  },
  {
    id: "future",
    years: "2026 — 2028",
    title: "Now & Next",
    text: "Next comes the M.Sc. Data Engineering & AI at EFREI Paris — RNCP level 7, built around data architecture, structural AI, and cloud governance. I'm actively looking for a two-year work-study company (2026–2028) where pipelines, agents, and production craft meet. Meanwhile, webgen keeps shipping real products with Noam and Charles. The eight-year-old in front of the Minecraft screen is still here. He just ships to production now.",
    image: "/story/chapter-7.jpg",
    video: "/story/chapter-7.mp4",
    imageAlt: "Elias looking at a futuristic city skyline at dawn",
    bgA: "#131643",
    bgB: "#070818",
    accent: "#fbbf24",
  },
];

export const chaptersById = Object.fromEntries(
  chapters.map((ch) => [ch.id, ch])
) as Record<string, Chapter>;

export type SkillGroup = {
  title: string;
  accent: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "AI-Native Engineering",
    accent: "#4ade80",
    skills: [
      "Vibe coding",
      "Cursor",
      "Claude",
      "MCP servers & skills",
      "Prompt engineering",
      "AI-assisted dev at scale",
      "Polyglot development",
      "Any language via AI orchestration",
      "3geeks API hub (Ollama)",
      "LLM guardrails & eval",
      "n8n workflows",
    ],
  },
  {
    title: "Data & AI",
    accent: "#38bdf8",
    skills: [
      "Python",
      "Pandas",
      "ETL / data pipelines",
      "LLM & RAG integration",
      "AI agents",
      "Multi-agent orchestration",
      "Gemini API",
      "Self-hosted LLM (Ollama)",
      "Power BI",
      "DAX",
      "SQL / MySQL",
      "NoSQL / MongoDB",
      "Data governance",
      "Jira / GitLab / Confluence",
      "Telemetry integrations",
    ],
  },
  {
    title: "Web & Product",
    accent: "#c084fc",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Flask",
      "Django",
      "Node.js",
      "Streamlit",
      "Tailwind CSS",
      "REST APIs",
      "UI/UX design",
      "GSAP / ScrollTrigger",
      "Framer Motion",
      "Playwright",
      "Shopify",
      "Shopify Admin GraphQL",
      "E-commerce / omnichannel retail",
      "POS systems",
      "Loyalty systems",
      "Swift / SwiftUI",
      "App Store deployment",
    ],
  },
  {
    title: "Cloud & Engineering",
    accent: "#fbbf24",
    skills: [
      "AWS (EC2 · S3 · IAM)",
      "Docker",
      "Coolify",
      "Traefik",
      "Cloudflare (DNS · Tunnel)",
      "Self-hosting / OrbStack",
      "PostgreSQL",
      "Supabase",
      "Git",
      "GitLab CI",
      "Firebase (RTDB · Firestore · Auth)",
      "Firestore transactions",
      "Vercel serverless",
      "Real-time sync",
      "CSP / iframe isolation",
      "Payment integrations (SumUp)",
      "Monitoring & self-healing infra",
      "Cross-system integration",
      "AI voice agents",
      "Agile / JIRA",
      "Technical mentoring",
      "Workflow automation",
    ],
  },
  {
    title: "Embedded & Hardware",
    accent: "#f472b6",
    skills: [
      "Arduino",
      "C / C++",
      "Embedded systems",
      "Electronics (STI2D SIN)",
      "Logic gates & digital circuits",
    ],
  },
];

export const certifications = [
  {
    name: "AWS Academy — Cloud Architecting",
    issuer: "Amazon Web Services",
    year: "2026",
  },
  {
    name: "Python for Data Scientists",
    issuer: "DataScientest",
    year: "2025",
  },
  {
    name: "AI & GenAI — Prompt Engineering",
    issuer: "Nokia",
    year: "2024",
  },
];

export type EducationStep = {
  years: string;
  title: string;
  subtitle: string;
  status: "completed" | "current" | "upcoming";
};

export const educationPath: EducationStep[] = [
  {
    years: "2023 — 2026",
    title: "ECE Paris",
    subtitle: "Bachelor Informatique — Data & AI",
    status: "current",
  },
  {
    years: "Sep 2026",
    title: "EFREI Paris",
    subtitle: "M.Sc. Data Engineering & AI (RNCP 7)",
    status: "upcoming",
  },
  {
    years: "2026 — 2028",
    title: "Apprenticeship",
    subtitle: "Data engineering / AI — actively seeking",
    status: "upcoming",
  },
];

export type Testimonial = {
  quote: string;
  author: string;
  projectTags: { label: string; accent: string }[];
  verified?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Équipe réactive, process très clair et exécution propre. Le nouveau site a fluidifié notre acquisition.",
    author: "Adrien",
    projectTags: [
      { label: "CallKitchen", accent: "#f472b6" },
      { label: "Express Divorce", accent: "#818cf8" },
    ],
  },
  {
    quote:
      "Ils ont compris notre métier rapidement et proposent des choix utiles. On a vu une vraie progression.",
    author: "Henry F.",
    projectTags: [{ label: "Two App", accent: "#c084fc" }],
    verified: true,
  },
];

export type ProjectCategory = "client-live" | "green-stack" | "professional";

export type Project = {
  name: string;
  role: string;
  description: string;
  tags: string[];
  highlights?: string[];
  link?: string;
  linkLabel?: string;
  ctaLabel?: string;
  logo?: string;
  /** Screenshot of the live product, shown in the card preview */
  image?: string;
  /** Internal case-study route — when set, the card navigates here instead of the live link */
  caseStudy?: string;
  /** Slug for shared-element view transitions (defaults to last segment of caseStudy) */
  caseStudySlug?: string;
  status: "Live" | "Beta" | "App Store" | "Award" | "Internal";
  accent: string;
  category: ProjectCategory;
};

export const projects: Project[] = [
  {
    name: "Express Divorce USA",
    role: "Legal-tech SaaS · 3geeks",
    description:
      "Live legal-tech SaaS with real users — simplifying US divorce journeys across multiple states. Built for regulated-sector constraints: multi-state compliance, personal-data security, and data sovereignty.",
    highlights: [
      "In production with real users",
      "Multi-state US compliance",
      "Data sovereignty & personal-data security",
    ],
    tags: ["Next.js", "Production", "Legal tech"],
    link: "https://expressdivorceusa.co",
    linkLabel: "expressdivorceusa.co",
    ctaLabel: "Read the case study",
    image: "/projects/express-divorce.webp",
    caseStudy: "/projects/express-divorce",
    caseStudySlug: "express-divorce",
    status: "Live",
    accent: "#38bdf8",
    category: "client-live",
  },
  {
    name: "CallKitchen",
    role: "Restaurant phone automation · webgen",
    description:
      "Restaurants lose orders, reservations, and customer questions when the phone rings during rush hour and staff can't pick up. CallKitchen is the live landing for an AI voice agent that answers 24/7 — takeout, bookings, FAQs from approved menus, SMS confirmations, and kitchen dashboard — with a demo line, pricing tiers, and a full how-it-works narrative. A shipped GTM page recruiters can click through, not a mockup.",
    highlights: [
      "24/7 AI reception — orders, reservations, FAQs, multilingual",
      "Three-step flow: answer → handle → SMS + kitchen notify",
      "Live landing with demo CTA, pricing ($449–$1,499/mo), and FAQ",
    ],
    tags: ["AI voice", "SaaS landing", "Restaurants"],
    link: "https://call-kitchen-landing.vercel.app/",
    linkLabel: "call-kitchen-landing.vercel.app",
    ctaLabel: "Open project",
    image: "/projects/callkitchen.webp",
    status: "Live",
    accent: "#f472b6",
    category: "client-live",
  },
  {
    name: "Two",
    role: "Consumer iOS app · webgen",
    description:
      "Couples scatter their shared life across chat, calendar, expenses, and memories — nothing feels private or unified. Two is an all-in-one iOS cocoon: distance tracking, mood sharing, a sweet-notes wall, geolocated photo map, shared home vault, synced calendar, expense split, and a playroom — data stays between the two partners only, never sold for ads. Live on the App Store, built for daily recurring use.",
    highlights: [
      "All-in-one couple space — logistics + intimacy in one app",
      "Privacy-first: secured data, accessible only to the couple",
      "Shipped on the App Store — real consumer product",
    ],
    tags: ["iOS", "Swift", "Consumer app"],
    link: "https://apps.apple.com/fr/app/two/id6758867716",
    linkLabel: "App Store",
    ctaLabel: "App Store",
    image: "/projects/two.webp",
    status: "App Store",
    accent: "#2dd4bf",
    category: "client-live",
  },
  {
    name: "Green Jardin",
    role: "CBD retail · omnichannel",
    description:
      "Live CBD shop online and in-store (Palaiseau) — Shopify storefront with Ino Digital, plus a private ops platform: real-time TV menu, gram-scale POS, 14% loyalty, and Shopify price sync.",
    highlights: [
      "Shopify storefront + live TV embed on green-jardin.fr",
      "Private ops platform — POS, loyalty, Shopify bridge (no public URL)",
      "Firebase RTDB real-time sync between counter and customer TV",
    ],
    tags: ["Shopify", "Firebase", "POS", "Omnichannel"],
    link: "https://green-jardin.fr",
    linkLabel: "green-jardin.fr",
    ctaLabel: "Read the case study",
    image: "/projects/image.png",
    caseStudy: "/projects/green-jardin",
    caseStudySlug: "green-jardin",
    status: "Live",
    accent: "#22c55e",
    category: "client-live",
  },
  {
    name: "Web-Gen",
    role: "webgen · AI web generation",
    description:
      "Intent-to-website generator: a text brief becomes a fully laid-out site. Flagship product of the studio — LLM orchestration meets UI generation.",
    highlights: [
      "Brief → structured layout in one flow",
      "LLM + GenUI orchestration with Next.js",
      "Studio flagship — the product webgen was built around",
    ],
    tags: ["LLM", "GenUI", "Next.js", "webgen"],
    link: "https://www.3geeks.fr",
    linkLabel: "www.3geeks.fr",
    ctaLabel: "Read the case study",
    logo: "/3geeks-logo.png",
    image: "/projects/web-gen.webp",
    caseStudy: "/projects/web-gen",
    caseStudySlug: "web-gen",
    status: "Live",
    accent: "#4ade80",
    category: "green-stack",
  },
  {
    name: "3geeks Infra",
    role: "Self-hosted prod · webgen",
    description:
      "webgen's apps lived on Vercel with scattered env vars and rising bills — no single view of what ran in prod. I built a Mac Mini cluster (Coolify + Traefik + Cloudflare Tunnel) so every *.3geeks.fr service deploys from GitHub in one golden path, with Vercel migrations and PostgreSQL on Coolify. 8+ live apps, 7 public domains, infrastructure we operate.",
    highlights: [
      "8+ apps on Coolify — landing, API hub, workspace, Prompt Hub, PromptOptim",
      "Golden path: git push → Coolify → Traefik :443 → CF Tunnel",
      "3 Vercel → self-host migrations with permanent redirects",
    ],
    tags: ["Coolify", "Traefik", "Cloudflare", "Docker"],
    link: "https://www.3geeks.fr",
    linkLabel: "www.3geeks.fr",
    ctaLabel: "Read the case study",
    logo: "/3geeks-logo.png",
    caseStudy: "/projects/3geeks-infra",
    caseStudySlug: "3geeks-infra",
    status: "Live",
    accent: "#fbbf24",
    category: "green-stack",
  },
  {
    name: "Prompt Hub",
    role: "AI project planning · webgen beta",
    description:
      "A vague idea in chat doesn't become a build plan — developers lose hours re-explaining stack and context. Prompt Hub turns a short brief into phased steps and copy-paste prompts (objectives, constraints, decisions, skills included), orchestrated by 7+ specialized agents with a dependency graph and versioned history. Beta live and free — idea to executable plan in under a minute.",
    highlights: [
      "Plan → steps → contextualized prompts ready for your IDE",
      "7+ specialized agents: Plan, Chat, Analyser, Prompt Generator…",
      "Interactive dependency graph + reversible plan mutations",
    ],
    tags: ["Multi-agent", "AI planning", "Beta"],
    link: "https://prompt-hub.3geeks.fr",
    linkLabel: "prompt-hub.3geeks.fr",
    ctaLabel: "Open the beta",
    image: "/projects/prompt-hub.webp",
    status: "Beta",
    accent: "#c084fc",
    category: "green-stack",
  },
  {
    name: "PromptOptim",
    role: "Green IT & digital sovereignty · webgen",
    description:
      "Verbose prompts burn tokens and CO₂ with zero visibility into the environmental cost. PromptOptim sharpens prompts for the same intent with fewer tokens, estimates carbon impact per request, and champions European models with a GDPR-conscious stance. Open tool in production — webgen's answer to mindful, sovereign AI usage.",
    highlights: [
      "Same intent, fewer tokens — precision over padding",
      "CO₂ estimation surfaced on every optimization",
      "European models + GDPR positioning, live and open",
    ],
    tags: ["Green IT", "AI", "Open tool"],
    link: "https://prompt-optim.3geeks.fr/",
    linkLabel: "prompt-optim.3geeks.fr",
    ctaLabel: "Open PromptOptim",
    image: "/projects/promptoptim.webp",
    status: "Live",
    accent: "#4ade80",
    category: "green-stack",
  },
  {
    name: "Feature Analyzer Dashboard 2.0",
    role: "Nokia — creator & lead developer",
    description:
      "Centralized platform analyzing features end-to-end: 7+ heterogeneous sources aggregated through an automated collect → analyze → correlate → report pipeline, replacing scattered manual analyses with real-time insights.",
    highlights: [
      "7+ heterogeneous data sources unified",
      "Collect → analyze → correlate → report pipeline",
      "FastAPI + React — workflows teams rely on daily",
    ],
    tags: ["FastAPI", "React", "Data pipeline"],
    ctaLabel: "Read the case study",
    image: "/projects/nokia-dashboard.webp",
    caseStudy: "/projects/nokia-dashboard",
    caseStudySlug: "nokia-dashboard",
    status: "Internal",
    accent: "#818cf8",
    category: "professional",
  },
  {
    name: "AI Travel Planner",
    role: "ECE — best Bachelor project",
    description:
      "Intent-based travel planning app powered by Gemini and SaaS APIs: day-by-day tailor-made trips generated from what travelers actually want. Elected best Bachelor project at ECE Paris.",
    highlights: [
      "Intent-based planning from a natural-language brief",
      "Gemini + SaaS APIs for day-by-day itineraries",
      "Best Bachelor project at ECE Paris",
    ],
    tags: ["Gemini", "APIs", "Best Bachelor project"],
    ctaLabel: "Read the case study",
    image: "/projects/ai-travel-planner.webp",
    caseStudy: "/projects/ai-travel-planner",
    caseStudySlug: "ai-travel-planner",
    status: "Award",
    accent: "#fbbf24",
    category: "professional",
  },
  {
    name: "Cursor pour les nuls",
    role: "Nokia — portal & AI adoption lead",
    description:
      "Internal portal accelerating Cursor adoption: knowledge hub, RAG assistant (100+ questions answered), team demos across 4 squads, and hands-on 1:1 coaching on real use cases.",
    highlights: [
      "1,019 portal views · 75 unique visitors",
      "100+ questions answered by the embedded RAG assistant",
      "Demos & onboarding across 4 teams in the sector",
    ],
    tags: ["RAG", "DevEx", "AI adoption", "MCP"],
    ctaLabel: "Read the case study",
    caseStudy: "/projects/cursor-portal",
    caseStudySlug: "cursor-portal",
    status: "Internal",
    accent: "#fb923c",
    category: "professional",
  },
];

export const clientLiveProjects = projects.filter(
  (p) => p.category === "client-live",
);
export const greenStackProjects = projects.filter(
  (p) => p.category === "green-stack",
);
export const professionalProjects = projects.filter(
  (p) => p.category === "professional",
);

export const contact = {
  email: "e.elloumi15@gmail.com",
  linkedin: "https://www.linkedin.com/in/elias-elloumi/",
  linkedinLabel: "linkedin.com/in/elias-elloumi",
  location: "Palaiseau (91), France",
  studio: "https://www.3geeks.fr",
  studioLabel: "webgen studio",
  fiverr: "https://www.fiverr.com/three_geeks",
  fiverrLabel: "@three_geeks",
  languages: "FR native · EN C1 · AR fluent",
  cvPath: "/CV_Elias_Elloumi_FR.pdf",
  cvDownloadLabel: "Download CV (FR)",
};
