/**
 * Smoke test of the home pages. Run against a running build:
 *   npm run build && npx next start -p 3000   (then)   npm run verify
 * or against production: VERIFY_URL=https://elias-elloumi.com npm run verify
 */
import { chromium } from "playwright";

const BASE = (process.env.VERIFY_URL ?? "http://localhost:3000").replace(/\/$/, "");
const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failures.push(label);
};

const browser = await chromium.launch();

for (const [path, lang, heading] of [
  ["/", "en", "A project to build?"],
  ["/fr", "fr", "Ça passe par le studio."],
]) {
  // A fresh context per page: no stored language preference carries over.
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // The analytics script only exists once deployed on Vercel.
  page.on("console", (m) => m.type() === "error" && !/404/.test(m.text()) && errors.push(m.text()));
  page.on("response", (r) => r.status() >= 400 && !r.url().includes("/_vercel/") && errors.push(`${r.status()} ${r.url()}`));

  // Server-rendered HTML, before any script runs: this is what crawlers index.
  const html = await (await context.request.get(BASE + path)).text();
  check(html.includes(heading), `${path} server HTML is in ${lang}`);
  check(/hreflang="fr"/i.test(html) && /hreflang="en"/i.test(html), `${path} declares hreflang en + fr`);

  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  check((await page.locator("h1").count()) === 1, `${path} has one h1`);
  check(await page.locator("#studio").isVisible(), `${path} shows the studio section`);
  const studioHref = await page.locator("#studio a[href*='3geeks.fr']").first().getAttribute("href");
  check(Boolean(studioHref?.includes("utm_source=")), `${path} studio link is tagged`);
  check(
    (await page.locator("[data-project-slug]").count()) >= 5,
    `${path} cards carry data-project-slug`,
  );
  check(errors.length === 0, `${path} no console errors${errors.length ? `: ${errors[0]}` : ""}`);
  await context.close();
}

await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log("\nAll checks passed");
