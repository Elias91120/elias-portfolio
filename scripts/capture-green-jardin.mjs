import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "projects");
const OPS_BASE = "https://green-jardin-tele.vercel.app";
const STAFF_EMAIL = "caisse@greenjardin.fr";
const STAFF_PASSWORD = process.env.STAFF_PASSWORD || "GreenJardin2026!";

async function savePng(png, slug) {
  const out = join(OUT, `${slug}.webp`);
  await sharp(png).resize({ width: 1400 }).webp({ quality: 82 }).toFile(out);
  console.log(`captured ${slug} -> ${out}`);
}

async function dismissAgeGate(page) {
  const btn = page.getByRole("button", { name: /18 ans/i });
  if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(1500);
  }
}

async function captureStorefront(browser) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  await page.goto("https://green-jardin.fr", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await dismissAgeGate(page);
  await page.waitForTimeout(3500);
  await savePng(await page.screenshot({ type: "png" }), "green-jardin");

  await page.goto("https://green-jardin.fr/collections/fleurs-cbd", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await dismissAgeGate(page);
  await page.waitForTimeout(3000);
  await savePng(await page.screenshot({ type: "png" }), "green-jardin-shop");
  await page.close();
}

async function staffLogin(page) {
  await page.goto(OPS_BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  const passwordInput = page.locator("#staff-password");
  if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await passwordInput.fill(STAFF_PASSWORD);
    await page.getByRole("button", { name: /connexion|connecter|sign in/i }).click();
    await page.waitForTimeout(3000);
  }
}

async function captureOps(browser) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // TV menu (embed mode — public read-only view)
  await page.goto(`${OPS_BASE}/tv?embed=1`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(4000);
  await savePng(await page.screenshot({ type: "png" }), "green-jardin-tv");

  await staffLogin(page);

  await page.goto(`${OPS_BASE}/caisse`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(3500);
  await savePng(await page.screenshot({ type: "png" }), "green-jardin-pos");

  await page.goto(`${OPS_BASE}/admin`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(3500);
  // Scroll to Shopify panel if present
  await page.evaluate(() => {
    const el = document.querySelector(".shopify-sync-panel, [class*='shopify']");
    if (el) el.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(1000);
  await savePng(await page.screenshot({ type: "png" }), "green-jardin-shopify-sync");

  await page.goto(`${OPS_BASE}/loyalty`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(4000);
  await savePng(await page.screenshot({ type: "png" }), "green-jardin-loyalty");

  await page.close();
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  try {
    await captureStorefront(browser);
    await captureOps(browser);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
