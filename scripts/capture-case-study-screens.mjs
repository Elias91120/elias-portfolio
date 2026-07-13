import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "projects");
const STORY = join(process.cwd(), "public", "story");

/** Live captures for case-study supplementary screens */
const liveTargets = [
  {
    slug: "express-divorce-flow",
    url: "https://expressdivorceusa.co",
    // Scroll or navigate to a visible section if /get-started 404s
  },
  {
    slug: "green-jardin-shop",
    url: "https://green-jardin.fr/collections/fleurs-cbd",
    ageGate: true,
  },
];

/** Composite hero images from story chapters when no public URL exists */
const composites = [
  { slug: "nokia-dashboard", source: join(STORY, "chapter-5.jpg") },
  { slug: "ai-travel-planner", source: join(STORY, "chapter-4.jpg") },
];

async function captureLive(browser, target) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  try {
    await page.goto(target.url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    console.warn(`${target.slug}: networkidle timeout, capturing anyway`);
  }
  if (target.ageGate) {
    const btn = page.getByRole("button", { name: /18 ans/i });
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(1500);
    }
  }
  await page.waitForTimeout(4000);

  // Try to scroll to a form / CTA section for flow screenshot
  if (target.slug.includes("flow")) {
    await page.evaluate(() => window.scrollTo(0, Math.min(600, document.body.scrollHeight * 0.35)));
    await page.waitForTimeout(1500);
  }

  const png = await page.screenshot({ type: "png" });
  const out = join(OUT, `${target.slug}.webp`);
  await sharp(png).resize({ width: 1400 }).webp({ quality: 82 }).toFile(out);
  console.log(`captured ${target.slug} -> ${out}`);
  await page.close();
}

async function buildComposite({ slug, source }) {
  const out = join(OUT, `${slug}.webp`);
  // Crop top portion for browser-frame hero aspect
  const meta = await sharp(source).metadata();
  const cropH = Math.round((meta.height ?? 900) * 0.55);
  await sharp(source)
    .extract({ left: 0, top: 0, width: meta.width ?? 1400, height: cropH })
    .resize({ width: 1400 })
    .webp({ quality: 82 })
    .toFile(out);
  console.log(`composite ${slug} -> ${out}`);
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  for (const c of composites) {
    await buildComposite(c);
  }

  const browser = await chromium.launch();
  for (const t of liveTargets) {
    await captureLive(browser, t);
  }
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
