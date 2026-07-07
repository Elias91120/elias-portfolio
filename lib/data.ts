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
};

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
    imageAlt: "Teenage Elias writing his first lines of code",
    bgA: "#0a2328",
    bgB: "#051215",
    accent: "#2dd4bf",
  },
  {
    id: "sti2d",
    years: "2020 — 2023",
    title: "Tinkering Becomes Engineering",
    text: "In high school I chose STI2D, option SIN — the path of electronics and code. Soldering irons, logic gates, embedded systems: little by little, playing turned into building, and building turned into engineering. Baccalauréat in hand, I knew exactly where I was heading.",
    image: "/story/chapter-3.jpg",
    imageAlt: "Elias soldering electronics in his high school tech lab",
    bgA: "#0e3028",
    bgB: "#071812",
    accent: "#4ade80",
  },
  {
    id: "ece",
    years: "2023 — 2026",
    title: "Data & AI at ECE Paris",
    text: "At ECE Paris I dove into data and artificial intelligence. With my team, I built an intent-based travel planner powered by Gemini — it was elected best Bachelor project of the school and took us to Web Summit Lisbon. Somewhere between the pipelines and the demos, 'coding' quietly became 'shipping'.",
    image: "/story/chapter-4.jpg",
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
    text: "Meanwhile, with Noam and Charles, our little collective webgen grew into 3geeks — our own studio, made in France. We shipped Express Divorce USA into production, built CallKitchen, released the Two app, and launched tools like PromptOptim in the open. Three friends, real clients, real code.",
    image: "/story/chapter-6.jpg",
    video: "/story/chapter-6.mp4",
    imageAlt: "Elias, Noam and Charles celebrating a launch at 3geeks",
    bgA: "#1d1240",
    bgB: "#0c0720",
    accent: "#c084fc",
  },
  {
    id: "future",
    years: "2026 →",
    title: "Now & Next",
    text: "Next comes a Master in Data & AI at ECE Paris — and an apprenticeship for 2026-2027, somewhere data, AI and craft meet. The eight-year-old in front of the Minecraft screen is still here. He just ships to production now.",
    image: "/story/chapter-7.jpg",
    video: "/story/chapter-7.mp4",
    imageAlt: "Elias looking at a futuristic city skyline at dawn",
    bgA: "#131643",
    bgB: "#070818",
    accent: "#fbbf24",
  },
];

export type SkillGroup = {
  title: string;
  accent: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Data & AI",
    accent: "#38bdf8",
    skills: [
      "Python",
      "Pandas",
      "ETL / data pipelines",
      "LLM & RAG integration",
      "AI agents",
      "Power BI",
      "SQL / MySQL",
      "NoSQL / MongoDB",
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
      "Node.js / Vite",
      "Tailwind CSS",
      "UI/UX design",
      "REST APIs",
    ],
  },
  {
    title: "Engineering Practices",
    accent: "#4ade80",
    skills: [
      "AI-assisted development (Cursor)",
      "Workflow automation",
      "Cross-system integration",
      "Monitoring & self-healing infra",
      "Git",
      "JIRA API",
      "Agile / sprints",
      "Technical mentoring",
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
];

export type Project = {
  name: string;
  role: string;
  description: string;
  tags: string[];
  link?: string;
  linkLabel?: string;
  status: "Live" | "Beta" | "App Store" | "Award" | "Internal";
  accent: string;
};

export const projects: Project[] = [
  {
    name: "Express Divorce USA",
    role: "3geeks — design & front-end",
    description:
      "Production web platform that simplifies and accelerates the divorce process in the US. Built from the ground up with Noam and Charles, live and serving real users.",
    tags: ["Next.js", "Production", "Legal tech"],
    link: "https://expressdivorceusa.co",
    linkLabel: "expressdivorceusa.co",
    status: "Live",
    accent: "#38bdf8",
  },
  {
    name: "Feature Analyzer Dashboard 2.0",
    role: "Nokia — creator & lead developer",
    description:
      "Centralized platform analyzing features end-to-end: 7+ heterogeneous sources aggregated through an automated collect → analyze → correlate → report pipeline, replacing scattered manual analyses with real-time insights.",
    tags: ["FastAPI", "React", "Data pipeline"],
    status: "Internal",
    accent: "#818cf8",
  },
  {
    name: "PromptOptim",
    role: "3geeks — open tool",
    description:
      "AI prompt optimizer designed for digital sobriety: fewer tokens per request, CO2 estimation per query, and a push for more mindful AI usage.",
    tags: ["Green IT", "AI", "Open tool"],
    link: "https://promptoptim.app",
    linkLabel: "promptoptim.app",
    status: "Live",
    accent: "#4ade80",
  },
  {
    name: "Prompt Hub",
    role: "3geeks — open tool",
    description:
      "Turns a vague idea into a structured execution plan: generated phases and steps with contextualized prompts for AI coding assistants, plus specialized agents in the works.",
    tags: ["AI planning", "Agents", "Beta"],
    link: "https://prompt-hub.app",
    linkLabel: "prompt-hub.app",
    status: "Beta",
    accent: "#c084fc",
  },
  {
    name: "AI Travel Planner",
    role: "ECE — best Bachelor project",
    description:
      "Intent-based travel planning app powered by Gemini and SaaS APIs: day-by-day tailor-made trips generated from what travelers actually want. Presented at Web Summit Lisbon 2025.",
    tags: ["Gemini", "APIs", "Web Summit 2025"],
    status: "Award",
    accent: "#fbbf24",
  },
  {
    name: "CallKitchen",
    role: "3geeks — product site",
    description:
      "Landing page for an AI phone assistant that helps restaurants capture missed calls — clear product story with a direct path to the demo.",
    tags: ["AI voice", "Landing", "Restaurants"],
    status: "Live",
    accent: "#f472b6",
  },
  {
    name: "Two",
    role: "3geeks — mobile app",
    description:
      "A polished consumer iOS experience, designed to be simple and useful from the very first interaction. Published on the App Store.",
    tags: ["iOS", "Mobile", "Product design"],
    status: "App Store",
    accent: "#2dd4bf",
  },
  {
    name: "Cursor pour les nuls",
    role: "Nokia — internal portal",
    description:
      "Internal portal accelerating Cursor adoption: centralized knowledge, a RAG-powered AI assistant, a collaborative forum — plus demos and hands-on onboarding across multiple teams.",
    tags: ["RAG", "DevEx", "AI adoption"],
    status: "Internal",
    accent: "#fb923c",
  },
];

export const contact = {
  email: "e.elloumi15@gmail.com",
  linkedin: "https://www.linkedin.com/in/elias-elloumi/",
  linkedinLabel: "linkedin.com/in/elias-elloumi",
  location: "Paris area, France",
  studio: "https://web-gen-lyart.vercel.app",
  studioLabel: "3geeks studio",
};
