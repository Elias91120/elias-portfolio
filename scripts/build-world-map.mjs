/**
 * Pre-renders the dotted world map to public/world-dots.svg.
 *
 * The map is generated from a fixed region and grid, so computing it in the
 * browser only served to ship dotted-map + proj4 (~390 KB) to every visitor.
 * Run this after changing MAP_REGION in lib/collaboration-map.ts:
 *
 *   node scripts/build-world-map.mjs
 */
import { writeFile, stat } from "node:fs/promises";
import DottedMap from "dotted-map";
import sharp from "sharp";

const MAP_REGION = { lat: { min: 8, max: 62 }, lng: { min: -128, max: 82 } };

const map = new DottedMap({ height: 140, grid: "diagonal", region: MAP_REGION });
const svg = map.getSVG({
  radius: 0.2,
  color: "#FFFFFF35",
  shape: "circle",
  backgroundColor: "transparent",
});

// The SVG is ~2.4 MB of individual circles, so it is rasterised once to a
// transparent WebP rather than shipped as vector.
const out = "public/world-dots.webp";
await sharp(Buffer.from(svg), { density: 200 })
  .resize({ width: 1800, withoutEnlargement: false })
  .webp({ quality: 88, alphaQuality: 90, effort: 6 })
  .toFile(out);

const { size } = await stat(out);
console.log(`wrote ${out} — ${(size / 1024).toFixed(0)} KB (from ${(Buffer.byteLength(svg) / 1024 / 1024).toFixed(1)} MB of SVG)`);
