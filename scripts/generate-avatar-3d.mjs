/**
 * Regenerates the hero portrait from the source avatar via the Meshy API.
 *
 *   MESHY_API_KEY=... node scripts/generate-avatar-3d.mjs <source-image> [outDir]
 *
 * The first model shipped here came from Meshy 6 Lite on the free tier: soft
 * geometry, a 2K baked texture, and lighting cooked into the albedo. This runs
 * Meshy 7 in ultra mode with a 4K PBR set instead, so the mesh carries real
 * surface detail and the site can light it itself.
 *
 * The raw result is deliberately left uncompressed — `scripts/optimize-avatar.mjs`
 * owns the web budget, and keeping the two apart means the expensive generation
 * never has to be re-run to try different compression settings.
 */
import { writeFile, mkdir, rm, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const run = promisify(execFile);

const API = "https://api.meshy.ai/openapi/v1";
const KEY = process.env.MESHY_API_KEY;

if (!KEY) {
  console.error("MESHY_API_KEY is not set.");
  process.exit(1);
}

const source = process.argv[2];
const outDir = process.argv[3] ?? "public/3d";

if (!source) {
  console.error("Usage: node scripts/generate-avatar-3d.mjs <source-image> [outDir]");
  process.exit(1);
}

/**
 * Node's built-in fetch cannot reach api.meshy.ai from this machine (connect
 * timeout), while curl goes straight through — so every call shells out.
 * Bodies go via a temp file because the textured request carries a megabyte
 * of base64 and would blow the command-line length limit.
 */
async function api(route, { method = "GET", body } = {}) {
  const args = [
    "-sS",
    "--http1.1",
    "--retry",
    "2",
    "--max-time",
    "300",
    "-X",
    method,
    "-H",
    `Authorization: Bearer ${KEY}`,
    "-H",
    "Content-Type: application/json",
  ];

  let bodyFile;
  if (body) {
    bodyFile = path.join(tmpdir(), `meshy-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
    await writeFile(bodyFile, body);
    args.push("--data-binary", `@${bodyFile}`);
  }
  args.push(`${API}${route}`);

  try {
    const { stdout } = await run("curl.exe", args, { maxBuffer: 64 * 1024 * 1024 });
    let json;
    try {
      json = JSON.parse(stdout);
    } catch {
      throw new Error(`Bad JSON from ${route}: ${stdout.slice(0, 300)}`);
    }
    if (json.message && !json.result && !json.id && json.balance === undefined) {
      throw new Error(`${route}: ${JSON.stringify(json)}`);
    }
    return json;
  } finally {
    if (bodyFile) await rm(bodyFile, { force: true });
  }
}

/**
 * The source avatar is 384px natively, and Meshy re-enhances the input on its
 * own, so there is no detail to gain from sending a huge upscale — and large
 * base64 bodies get reset in transit from here. 768px at q90 is the sweet spot
 * that actually reaches the API.
 */
async function prepareImage(file) {
  const buf = await sharp(file)
    .resize(768, 768, { fit: "cover", kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .toBuffer();
  console.log(`  input ${(buf.length / 1024).toFixed(0)} KB`);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "avatar-source.jpg"), buf);
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

async function poll(id) {
  let lastProgress = -1;
  for (;;) {
    const task = await api(`/image-to-3d/${id}`);
    if (task.progress !== lastProgress) {
      lastProgress = task.progress;
      process.stdout.write(`\r  ${task.status.padEnd(10)} ${task.progress}%   `);
    }
    if (task.status === "SUCCEEDED") {
      process.stdout.write("\n");
      return task;
    }
    if (task.status === "FAILED" || task.status === "CANCELED") {
      process.stdout.write("\n");
      throw new Error(`Task ${task.status}: ${JSON.stringify(task.task_error)}`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
}

async function download(url, dest) {
  await run("curl.exe", ["-sSL", "--max-time", "300", "-o", dest, url], {
    maxBuffer: 8 * 1024 * 1024,
  });
  const { size } = await stat(dest);
  return size;
}

const { balance } = await api("/balance");
console.log(`Meshy balance: ${balance} credits`);

console.log(`Preparing ${source} …`);
const imageDataUri = await prepareImage(source);

const body = {
  image_url: imageDataUri,
  ai_model: "meshy-7",
  ultra_mode: true, // Higher-fidelity geometry — the main upgrade over Lite.
  topology: "triangle",
  should_texture: true,
  enable_pbr: true, // Metallic / roughness / normal, so we light it ourselves.
  texture_resolution: "4k",
  image_enhancement: true,
  should_remesh: false, // Keep Meshy's dense mesh; we decimate downstream.
  alpha_thumbnail: true,
  target_formats: ["glb"],
  texture_prompt:
    "clean stylized 3D character portrait, smooth even skin, dark navy t-shirt, thin silver chain necklace, dark curly hair, neutral unlit albedo, no baked shadows or highlights, no background",
};

console.log("Creating Meshy 7 ultra task …");
const { result: taskId } = await api("/image-to-3d", {
  method: "POST",
  body: JSON.stringify(body),
});
console.log(`  task ${taskId}`);

const task = await poll(taskId);

await mkdir(outDir, { recursive: true });
const glbUrl = task.model_urls?.glb;
if (!glbUrl) throw new Error(`No GLB in result: ${JSON.stringify(task.model_urls)}`);

const glbPath = path.join(outDir, "avatar-raw.glb");
const bytes = await download(glbUrl, glbPath);
console.log(`Saved ${glbPath} — ${(bytes / 1048576).toFixed(2)} MB`);

if (task.thumbnail_url) {
  await download(task.thumbnail_url, path.join(outDir, "avatar-thumbnail.png"));
  console.log(`Saved ${outDir}/avatar-thumbnail.png`);
}

const after = await api("/balance");
console.log(`Balance after: ${after.balance} (spent ${balance - after.balance})`);
