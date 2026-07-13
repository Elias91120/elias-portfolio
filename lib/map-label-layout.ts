export type LabelAnchor = "start" | "middle" | "end";

export type CityLabelLayout = {
  x: number;
  y: number;
  anchor: LabelAnchor;
};

/** Manual label offsets for collaboration cities — tuned per geographic cluster. */
export const cityLabelLayout: Record<string, CityLabelLayout> = {
  Seattle: { x: -58, y: -24, anchor: "end" },
  Dallas: { x: 0, y: 30, anchor: "middle" },
  "Washington, D.C.": { x: 62, y: -14, anchor: "start" },
  London: { x: -62, y: -16, anchor: "end" },
  Paris: { x: 0, y: -32, anchor: "middle" },
  Palaiseau: { x: -58, y: 34, anchor: "end" },
  Antony: { x: 58, y: 36, anchor: "start" },
  Wrocław: { x: 58, y: -20, anchor: "start" },
  Espoo: { x: 44, y: -38, anchor: "start" },
  Tunis: { x: -58, y: 10, anchor: "end" },
  Sousse: { x: 58, y: 28, anchor: "start" },
  Dubai: { x: 0, y: 34, anchor: "middle" },
  Bangalore: { x: -62, y: 18, anchor: "end" },
};
