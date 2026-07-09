// Quick visual check: screenshots of a URL (optionally scrolled to a selector).
// Usage: node scripts/shot.mjs <url> <outfile> [selector] [viewport]
import { chromium } from "playwright";

const [url, outfile, selector, viewport] = process.argv.slice(2);
const [w, h] = (viewport ?? "1440x900").split("x").map(Number);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
if (selector) {
  await page.locator(selector).first().scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(1500);
}
await page.waitForTimeout(2500);
await page.screenshot({ path: outfile });
console.log("saved", outfile);
await browser.close();
