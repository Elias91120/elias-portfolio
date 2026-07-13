/** Map crop — Americas through India, tuned for dotted-map. */
export const MAP_REGION = {
  lat: { min: 8, max: 62 },
  lng: { min: -128, max: 82 },
};

export type LabelSide = "top" | "bottom" | "left" | "right";

export type CollaborationMarker = {
  city: string;
  /** 0–100, relative to map bitmap */
  x: number;
  y: number;
  labelSide: LabelSide;
};

/**
 * Marker positions derived from Mercator projection on MAP_REGION.
 * Île-de-France & Maghreb clusters are slightly spread for readability.
 */
export const collaborationMarkers: CollaborationMarker[] = [
  { city: "Seattle", x: 2.7, y: 35.4, labelSide: "top" },
  { city: "Dallas", x: 14.9, y: 62.8, labelSide: "bottom" },
  { city: "Washington, D.C.", x: 24.3, y: 52.2, labelSide: "bottom" },
  { city: "London", x: 60.9, y: 27.0, labelSide: "top" },
  { city: "Paris", x: 62.1, y: 31.5, labelSide: "top" },
  { city: "Palaiseau", x: 60.8, y: 34.8, labelSide: "left" },
  { city: "Antony", x: 63.6, y: 34.8, labelSide: "right" },
  { city: "Espoo", x: 72.7, y: 5.2, labelSide: "bottom" },
  { city: "Wrocław", x: 69.1, y: 27.9, labelSide: "top" },
  { city: "Tunis", x: 65.5, y: 54.5, labelSide: "left" },
  { city: "Sousse", x: 66.5, y: 58.5, labelSide: "right" },
  { city: "Dubai", x: 87.3, y: 74.9, labelSide: "bottom" },
  { city: "Bangalore", x: 97.9, y: 92.9, labelSide: "left" },
];

export const collaborationRegions = [
  {
    id: "americas",
    label: "Americas",
    cities: ["Seattle", "Dallas", "Washington, D.C."],
  },
  {
    id: "europe",
    label: "Europe",
    cities: ["London", "Paris", "Palaiseau", "Antony", "Espoo", "Wrocław"],
  },
  {
    id: "mena-asia",
    label: "MENA & Asia",
    cities: ["Tunis", "Sousse", "Dubai", "Bangalore"],
  },
] as const;
