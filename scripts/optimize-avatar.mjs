/**
 * Optimizes the raw GLB exported by Meshy for instant web loading.
 *
 * Runs glTF-Transform:
 *   - Dedup and prune unused nodes and attributes
 *   - Resize textures to 2048px max and compress them to WebP
 *   - Simplify geometry while preserving silhouette and normal maps
 *   - Apply Meshopt compression (decoded by Three.js MeshoptDecoder)
 *
 * Usage:
 *   node scripts/optimize-avatar.mjs [inputGlb] [outputGlb]
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { stat } from "node:fs/promises";

const run = promisify(execFile);

const input = process.argv[2] ?? "public/3d/avatar-raw.glb";
const output = process.argv[3] ?? "public/3d/head.glb";

console.log(`Optimizing ${input} -> ${output} …`);

const inputStat = await stat(input).catch(() => null);
if (!inputStat) {
  console.error(`Input file not found: ${input}`);
  process.exit(1);
}
console.log(`  Raw size: ${(inputStat.size / 1048576).toFixed(2)} MB`);

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const args = [
  "--yes",
  "@gltf-transform/cli",
  "optimize",
  input,
  output,
  "--compress",
  "meshopt",
  "--meshopt-level",
  "high",
  "--simplify",
  "true",
  "--simplify-ratio",
  "0.05",
  "--simplify-error",
  "0.002",
  "--texture-compress",
  "webp",
  "--texture-size",
  "2048",
  "--palette",
  "false",
];

console.log("  Running gltf-transform optimize (meshopt + webp) …");
await run(npxCmd, args, { maxBuffer: 64 * 1024 * 1024, shell: true });

const outputStat = await stat(output);
const ratio = (((inputStat.size - outputStat.size) / inputStat.size) * 100).toFixed(1);
console.log(
  `  Optimized size: ${(outputStat.size / 1024).toFixed(0)} KB (-${ratio}%)`
);
console.log(`Done! Output saved to ${output}`);
