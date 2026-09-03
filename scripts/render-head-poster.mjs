/**
 * Renders public/3d/head.glb to public/3d/head-poster.webp.
 *
 * The poster is what every visitor sees instantly — the live canvas only
 * replaces it once three.js and the model have loaded. Lighting here is kept
 * identical to components/v2/Head3D.tsx so the swap is invisible.
 *
 *   node scripts/render-head-poster.mjs
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const ROOT = process.cwd();
const SIZE = 1100; // Rendered square, downscaled by the browser at display time.

const MIME = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".glb": "model/gltf-binary",
  ".html": "text/html",
  ".wasm": "application/wasm",
};

const page = `<!doctype html>
<html>
<head><meta charset="utf-8"><style>html,body{margin:0;background:transparent}canvas{display:block}</style>
<script type="importmap">
{"imports":{
  "three":"/node_modules/three/build/three.module.js",
  "three/examples/jsm/":"/node_modules/three/examples/jsm/"
}}
</script>
</head>
<body>
<script type="module">
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const SIZE = ${SIZE};

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(SIZE, SIZE);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

const key = new THREE.DirectionalLight(0xfff1de, 2.1);
key.position.set(2.5, 3, 4);
scene.add(key);
const rim = new THREE.DirectionalLight(0xa78bfa, 2.4);
rim.position.set(-3, 1.2, -2.5);
scene.add(rim);
const fill = new THREE.DirectionalLight(0x9fb4ff, 0.5);
fill.position.set(-1.5, -1, 2);
scene.add(fill);

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

const gltf = await loader.loadAsync("/public/3d/head.glb");
const model = gltf.scene;
const box = new THREE.Box3().setFromObject(model);
const size = box.getSize(new THREE.Vector3());
const center = box.getCenter(new THREE.Vector3());
model.position.sub(center);
const radius = Math.max(size.x, size.y, size.z) / 2;
camera.position.set(0, 0, (radius / Math.sin((camera.fov * Math.PI) / 360)) * 1.06);
camera.lookAt(0, 0, 0);

model.traverse((c) => {
  if (c.isMesh && c.material && "envMapIntensity" in c.material) c.material.envMapIntensity = 0.85;
});
scene.add(model);

renderer.render(scene, camera);
window.__done = true;
</script>
</body></html>`;

const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(page);
    return;
  }
  const file = path.join(ROOT, url);
  if (!file.startsWith(ROOT) || !existsSync(file)) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, {
    "Content-Type": MIME[path.extname(file)] ?? "application/octet-stream",
  });
  res.end(await readFile(file));
});

await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const ctx = await browser.newContext({
  viewport: { width: SIZE, height: SIZE },
  deviceScaleFactor: 1,
});
const tab = await ctx.newPage();
tab.on("pageerror", (e) => console.error("page error:", e.message));

await tab.goto(`http://127.0.0.1:${port}/`, { waitUntil: "load" });
await tab.waitForFunction(() => window.__done === true, null, { timeout: 120000 });

const canvas = await tab.locator("canvas");
const png = await canvas.screenshot({ omitBackground: true });

await browser.close();
server.close();

// The square framing is kept as-is so the poster and the live canvas occupy
// exactly the same box and the cross-fade does not shift the composition.
const out = "public/3d/head-poster.webp";
await sharp(png)
  .resize(760, 760, { fit: "inside" })
  .webp({ quality: 86, effort: 6 })
  .toFile(out);

const { size } = await stat(out);
console.log(`rendered ${out} — ${(size / 1024).toFixed(0)} KB`);
