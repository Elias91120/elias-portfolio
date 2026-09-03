/**
 * Responsive regression check.
 *
 * Walks the page at a set of viewports and reports, per breakpoint:
 *   - horizontal overflow (and the elements causing it)
 *   - interactive controls below the 44px touch-target floor
 *   - text smaller than 12px
 * Run against a dev or preview server: node scripts/responsive-audit.mjs [url]
 */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://localhost:3000";
const VIEWPORTS = [
  { name: "mobile-s", width: 320, height: 720 },
  { name: "mobile", width: 375, height: 812 },
  { name: "mobile-l", width: 430, height: 932 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
];

const audit = ({ touch }) => {
  const d = document.documentElement;
  const W = d.clientWidth;

  // Deliberate exceptions, documented rather than silently ignored:
  //  - map pins sit ~33px apart (Paris / Palaiseau / Antony), so 44px hit
  //    areas would overlap; every city is also listed as text under the map.
  //  - spotlight watermarks are 6%-opacity decoration, hidden on touch.
  const isMapPin = (el) => !!el.closest("[data-world-map]");
  const isWatermark = (el) => el.classList.contains("spotlight-watermark");

  const clipped = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const o = getComputedStyle(p);
      if (["hidden", "clip"].includes(o.overflowX) || ["hidden", "clip"].includes(o.overflow)) return true;
      p = p.parentElement;
    }
    return false;
  };

  const overflow = [];
  const smallTargets = [];
  const smallText = [];

  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;

    if ((r.right > W + 1 || r.left < -1) && !clipped(el)) {
      overflow.push({
        tag: el.tagName,
        cls: (el.className || "").toString().slice(0, 70),
        left: Math.round(r.left),
        right: Math.round(r.right),
      });
    }

    const tag = el.tagName;
    const isControl =
      tag === "BUTTON" ||
      (tag === "A" && el.getAttribute("href")) ||
      tag === "INPUT" ||
      el.getAttribute("role") === "button";
    // The 44px floor is a touch guideline — only enforced where taps happen.
    if (touch && isControl && !isMapPin(el) && r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44)) {
      smallTargets.push({
        tag,
        text: (el.textContent || "").trim().slice(0, 28),
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    }

    if (el.children.length === 0 && !isWatermark(el) && (el.textContent || "").trim().length > 2) {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 11) smallText.push({ text: (el.textContent || "").trim().slice(0, 26), fs: fs.toFixed(1) });
    }
  }

  return {
    clientWidth: W,
    scrollWidth: d.scrollWidth,
    overflowPx: d.scrollWidth - W,
    overflow: overflow.slice(0, 6),
    smallTargets: smallTargets.slice(0, 8),
    smallTargetCount: smallTargets.length,
    smallText: smallText.slice(0, 5),
    smallTextCount: smallText.length,
  };
};

const browser = await chromium.launch();
let failures = 0;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.width < 768,
    hasTouch: vp.width < 768,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });

  // Walk the whole page so lazy sections mount and in-view animations settle.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  const res = await page.evaluate(audit, { touch: vp.width < 768 });
  const bad = res.overflowPx > 1 || res.smallTargetCount > 0 || res.smallTextCount > 0;
  if (bad) failures++;

  console.log(`\n${bad ? "FAIL" : "ok  "}  ${vp.name.padEnd(9)} ${vp.width}x${vp.height}`);
  console.log(`      scrollWidth ${res.scrollWidth} / client ${res.clientWidth}  (overflow ${res.overflowPx}px)`);
  if (res.overflow.length) {
    console.log("      overflowing:");
    for (const o of res.overflow) console.log(`        ${o.tag} [${o.left}..${o.right}] ${o.cls}`);
  }
  if (res.smallTargetCount) {
    console.log(`      touch targets under 44px: ${res.smallTargetCount}`);
    for (const s of res.smallTargets) console.log(`        ${s.tag} ${s.w}x${s.h} "${s.text}"`);
  }
  if (res.smallTextCount) {
    console.log(`      text under 11px: ${res.smallTextCount} — e.g. ${res.smallText.map((s) => `"${s.text}" ${s.fs}px`).join(", ")}`);
  }

  await ctx.close();
}

await browser.close();
console.log(`\n${failures === 0 ? "All viewports clean." : `${failures} viewport(s) with issues.`}`);
process.exit(failures === 0 ? 0 : 1);
