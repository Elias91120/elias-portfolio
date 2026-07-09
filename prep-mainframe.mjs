import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";

const n = Number(process.argv[2] || 2);
const src = `public/story/chapter-${n}.jpg`;
const sm = `public/story/chapter-${n}-sm.jpg`;

execFileSync(ffmpeg, [
  "-y", "-i", src,
  "-vf", "scale=800:-1",
  "-q:v", "4",
  sm,
]);

const b64 = readFileSync(sm).toString("base64");
writeFileSync(`mainframe-ch${n}.json`, JSON.stringify({ size: b64.length }));
console.log(`chapter-${n} base64: ${b64.length} chars`);
