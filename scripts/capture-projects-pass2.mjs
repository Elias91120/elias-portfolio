import { chromium } from "playwright";
import sharp from "sharp";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "projects");

async function shoot(page, slug) {
  const png = await page.screenshot({ type: "png" });
  await sharp(png).resize({ width: 1400 }).webp({ quality: 82 }).toFile(join(OUT, `${slug}.webp`));
  console.log(`captured ${slug}`);
}

async function main() {
  const browser = await chromium.launch();

  // Web-Gen: pass the language gate, then capture the actual product
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    await page.goto("https://www.3geeks.fr", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await page.locator("text=Français").first().click({ timeout: 10000 }).catch(() => console.warn("web-gen: no lang gate"));
    await page.waitForTimeout(6000);
    await shoot(page, "web-gen");
    await page.close();
  }

  // Prompt Hub: same language gate
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    await page.goto("https://prompt-hub.3geeks.fr", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await page.locator("text=Français").first().click({ timeout: 10000 }).catch(() => console.warn("prompt-hub: no lang gate"));
    await page.waitForTimeout(6000);
    await shoot(page, "prompt-hub");
    await page.close();
  }

  // Two: App Store errored headless — retry with a real UA + locale
  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      locale: "fr-FR",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    });
    for (let i = 0; i < 3; i++) {
      await page.goto("https://apps.apple.com/fr/app/two/id6758867716", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
      await page.waitForTimeout(3000);
      const errored = await page.locator("text=Une erreur est survenue").count();
      if (!errored) break;
      console.warn(`two: App Store error, retry ${i + 1}`);
    }
    await shoot(page, "two");
    await page.close();
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
