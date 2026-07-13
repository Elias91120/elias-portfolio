import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "projects");

const targets = [
  { slug: "express-divorce", url: "https://expressdivorceusa.co" },
  { slug: "callkitchen", url: "https://call-kitchen-landing.vercel.app/" },
  { slug: "web-gen", url: "https://www.3geeks.fr" },
  { slug: "prompt-hub", url: "https://prompt-hub.3geeks.fr" },
  { slug: "promptoptim", url: "https://prompt-optim.3geeks.fr/" },
  { slug: "two", url: "https://apps.apple.com/fr/app/two/id6758867716" },
  { slug: "green-jardin", url: "https://green-jardin.fr", ageGate: true },
];

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const t of targets) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    try {
      await page.goto(t.url, { waitUntil: "networkidle", timeout: 45000 });
    } catch {
      console.warn(`${t.slug}: networkidle timeout, capturing anyway`);
    }
    if (t.ageGate) {
      const btn = page.getByRole("button", { name: /18 ans/i });
      if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(1500);
      }
    }
    // Let hero animations settle
    await page.waitForTimeout(4000);
    const png = await page.screenshot({ type: "png" });
    const out = join(OUT, `${t.slug}.webp`);
    await sharp(png).resize({ width: 1400 }).webp({ quality: 82 }).toFile(out);
    console.log(`captured ${t.slug} -> ${out}`);
    await page.close();
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
