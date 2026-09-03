/**
 * Flat, English-resolved view of the site content.
 *
 * The bilingual source of truth lives in `lib/content.ts`, `lib/work.ts` and
 * `lib/people.ts`. This module adapts it into the plain shape consumed by the
 * portfolio assistant, the dev terminal and the world map — none of which are
 * localized, and all of which want one array to iterate over.
 */
import { featuredWork, otherWork } from "@/lib/work";
import {
  contact as contactSource,
  skillGroups as skillSource,
} from "@/lib/people";

export type Project = {
  name: string;
  role: string;
  description: string;
  tags: string[];
  link?: string;
  caseStudy?: string;
  caseStudySlug?: string;
  status: string;
  accent: string;
};

function slugFromCaseStudy(caseStudy?: string): string | undefined {
  return caseStudy?.match(/\/projects\/([^/]+)\/?$/)?.[1];
}

export const projects: Project[] = [
  ...featuredWork.map((w) => ({
    name: w.name,
    role: w.category.en,
    description: w.description.en,
    tags: w.stack,
    link: w.link,
    caseStudy: w.caseStudy,
    caseStudySlug: slugFromCaseStudy(w.caseStudy),
    status: w.context.en,
    accent: w.accent,
  })),
  ...otherWork.map((w) => ({
    name: w.name,
    role: w.stack.slice(0, 2).join(" · "),
    description: w.tagline.en,
    tags: w.stack,
    link: w.link,
    caseStudy: w.caseStudy,
    caseStudySlug: slugFromCaseStudy(w.caseStudy),
    status: w.status.en,
    accent: w.accent,
  })),
];

export type SkillGroup = { title: string; accent: string; skills: string[] };

const skillAccents = ["#38bdf8", "#c084fc", "#fbbf24", "#4ade80"];

export const skillGroups: SkillGroup[] = skillSource.map((g, i) => ({
  title: g.title.en,
  accent: skillAccents[i % skillAccents.length],
  skills: g.skills,
}));

export const contact = {
  email: contactSource.email,
  linkedin: contactSource.linkedin,
  linkedinLabel: contactSource.linkedinLabel,
  github: contactSource.github,
  location: contactSource.location.en,
  studio: contactSource.studio,
  studioLabel: contactSource.studioLabel,
  fiverr: "https://www.fiverr.com/three_geeks",
  fiverrLabel: "@three_geeks",
  languages: contactSource.languages.en,
  cvPath: contactSource.cvPath,
  cvDownloadLabel: "Download CV (FR)",
};

export type CollaborationLocation = {
  city: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
};

/** Real cities where Elias has collaborated — Nokia, clients, OSS, studio. */
export const collaborationLocations: CollaborationLocation[] = [
  { city: "Dallas", country: "United States", region: "Texas", lat: 32.7767, lng: -96.797 },
  { city: "Washington, D.C.", country: "United States", region: "District of Columbia", lat: 38.9072, lng: -77.0369 },
  { city: "Seattle", country: "United States", region: "Washington", lat: 47.6062, lng: -122.3321 },
  { city: "Paris", country: "France", region: "Île-de-France", lat: 48.8566, lng: 2.3522 },
  { city: "Palaiseau", country: "France", region: "Île-de-France", lat: 48.7142, lng: 2.2415 },
  { city: "Antony", country: "France", region: "Île-de-France", lat: 48.7538, lng: 2.298 },
  { city: "Tunis", country: "Tunisia", region: "Governorate of Tunis", lat: 36.8065, lng: 10.1815 },
  { city: "Sousse", country: "Tunisia", region: "Governorate of Sousse", lat: 35.8254, lng: 10.637 },
  { city: "London", country: "United Kingdom", region: "England", lat: 51.5074, lng: -0.1278 },
  { city: "Dubai", country: "United Arab Emirates", region: "Emirate of Dubai", lat: 25.2048, lng: 55.2708 },
  { city: "Lisbon", country: "Portugal", region: "Lisbon", lat: 38.7223, lng: -9.1393 },
  { city: "Espoo", country: "Finland", region: "Uusimaa", lat: 60.2052, lng: 24.6559 },
  { city: "Wrocław", country: "Poland", region: "Lower Silesian Voivodeship", lat: 51.1079, lng: 17.0385 },
  { city: "Bangalore", country: "India", region: "Karnataka", lat: 12.9716, lng: 77.5946 },
];
