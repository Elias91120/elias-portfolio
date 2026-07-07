import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.VERIFY_URL ?? "http://localhost:3000";
const OUT = join(process.cwd(), "screenshots", "story-verify");

async function main() {
  mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  await page.goto(BASE, { waitUntil: "networkidle" });

  const story = page.locator("#story");
  await story.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  await page.screenshot({ path: join(OUT, "desktop-story-start.png") });

  const pinSpacer = page.locator(".pin-spacer").first();
  const spacerBox = await pinSpacer.boundingBox();
  if (!spacerBox) throw new Error("Story pin spacer not found");

  const midY = spacerBox.y + spacerBox.height * 0.5;
  await page.evaluate((y) => window.scrollTo(0, y), midY);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(OUT, "desktop-story-mid.png") });

  const endY = spacerBox.y + spacerBox.height - 4;
  await page.evaluate((y) => window.scrollTo(0, y), endY);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(OUT, "desktop-story-end.png") });

  const checks = [
    await page.locator("#story .story-page").count(),
    await page.locator("#story video").count(),
    await page.locator(".story-grain").count(),
  ];

  console.log("Story pages:", checks[0]);
  console.log("Story videos:", checks[1]);
  console.log("Grain overlay:", checks[2]);
  console.log("Screenshots saved to", OUT);

  if (checks[0] !== 7 || checks[1] !== 7) {
    throw new Error("Expected 7 story pages and 7 videos");
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
