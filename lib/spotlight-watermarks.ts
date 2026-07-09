export type SpotlightWatermark = {
  text: string;
  top: string;
  left: string;
  rotate: number;
  zone?: "hero" | "proof" | "projects" | "contact";
  chapterId?: string;
};

export const SPOTLIGHT_WATERMARKS: SpotlightWatermark[] = [
  {
    text: "shipped in prod",
    top: "16%",
    left: "7%",
    rotate: -4,
    zone: "hero",
  },
  {
    text: "AI agents developer",
    top: "74%",
    left: "58%",
    rotate: 3,
    zone: "hero",
  },
  {
    text: "7 data sources",
    top: "44%",
    left: "76%",
    rotate: -2,
    zone: "proof",
  },
  {
    text: "FastAPI · React · GSAP",
    top: "26%",
    left: "12%",
    rotate: 5,
    zone: "projects",
  },
  {
    text: "open to apprenticeship 2026",
    top: "68%",
    left: "18%",
    rotate: -3,
    zone: "contact",
  },
  {
    text: "7 sources · one dashboard",
    top: "36%",
    left: "48%",
    rotate: 2,
    chapterId: "nokia",
  },
  {
    text: "3 friends · 1 product",
    top: "62%",
    left: "30%",
    rotate: -5,
    chapterId: "3geeks",
  },
];
