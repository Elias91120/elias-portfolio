import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import ffmpeg from "ffmpeg-static";

/** Scroll-scrub friendly clips from stills: slow push-in + subtle drift, dense keyframes. */
const chapters = [2, 3, 4, 5, 6, 7];

for (const n of chapters) {
  const src = `public/story/chapter-${n}.jpg`;
  const out = `public/story/chapter-${n}.mp4`;
  // Gentle push-in only — matches Runway subtlety, no sin drift, no double-zoom with GSAP
  execFileSync(ffmpeg, [
    "-y",
    "-loop", "1",
    "-i", src,
    "-vf",
    "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720," +
      "zoompan=z='1+0.03*on/120':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=120:s=1280x720:fps=24," +
      "format=yuv420p",
    "-t", "5",
    "-an",
    "-c:v", "libx264",
    "-profile:v", "high",
    "-crf", "22",
    "-g", "1",
    "-keyint_min", "1",
    "-sc_threshold", "0",
    "-x264-params", "bframes=0:scenecut=0",
    "-movflags", "+faststart",
    out,
  ]);
  console.log(`chapter-${n}.mp4`, Math.round(statSync(out).size / 1024) + "KB");
}
