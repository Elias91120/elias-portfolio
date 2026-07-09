import { chromium } from "playwright";
import sharp from "sharp";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "projects");

async function main() {
  const browser = await chromium.launch();

  // Web-Gen: pass language gate, dismiss cookie banner, then capture
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    await page.goto("https://web-gen-lyart.vercel.app", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await page.locator("text=Français").first().click({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await page.locator("button:has-text('Refuser')").first().click({ timeout: 5000 }).catch(() => console.warn("no cookie banner"));
    await page.waitForTimeout(2000);
    const png = await page.screenshot({ type: "png" });
    await sharp(png).resize({ width: 1400 }).webp({ quality: 82 }).toFile(join(OUT, "web-gen.webp"));
    console.log("captured web-gen (cookies dismissed)");
    await page.close();
  }

  // Two: crop out the App Store sidebar, keep the app hero + screenshots
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
      if (!(await page.locator("text=Une erreur est survenue").count())) break;
      console.warn(`two: retry ${i + 1}`);
    }
    // Scroll slightly so the phone screenshots fill the frame
    await page.evaluate(() => window.scrollTo(0, 260));
    await page.waitForTimeout(1500);
    const png = await page.screenshot({
      type: "png",
      clip: { x: 252, y: 0, width: 1188, height: 860 },
    });
    await sharp(png).resize({ width: 1400 }).webp({ quality: 82 }).toFile(join(OUT, "two.webp"));
    console.log("captured two (cropped)");
    await page.close();
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
