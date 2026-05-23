// Captures README/preview screenshots against a running production server.
// Usage: next build && next start -p 3211, then `node scripts/screenshots.mjs`.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3211";
const OUT = "docs/screenshots";

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

async function shot(file, path, opts = {}) {
  const {
    width = 1280,
    height = 832,
    dark = false,
    fullPage = false,
  } = opts;
  const ctx = await browser.newContext({
    viewport: { width, height },
    colorScheme: dark ? "dark" : "light",
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${file}`, fullPage });
  await ctx.close();
  console.log(`saved ${OUT}/${file}`);
}

await shot("dashboard-light.png", "/");
await shot("dashboard-dark.png", "/", { dark: true });
await shot("detail.png", "/users/1", { dark: true, fullPage: true });
await shot("mobile.png", "/", { width: 390, height: 844, fullPage: true });
await shot("mobile-320.png", "/", { width: 320, height: 720, fullPage: true });

await browser.close();
