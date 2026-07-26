#!/usr/bin/env node
/**
 * CI accessibility gate for novagait-web.
 *
 * Repo-vendored derivative of the harness /a11y-audit Stage A runner
 * (~/.claude/skills/a11y-audit/scripts/run-axe.mjs). It lives in the repo
 * because GitHub Actions cannot see the local harness. Kept in parity with
 * the skill runner; divergences, all deliberate:
 *   - gates on WCAG 2.2 A/AA tags only (no best-practice tags), because
 *     this script FAILS the build; the skill runner also records
 *     best-practice findings for report context
 *   - starts and stops `next start` itself (no external server)
 *   - emits a console table, not a findings.json ledger
 *
 * EXCLUDED BY DESIGN: every /before/* route. That is the intentionally
 * inaccessible demonstration variant with 12 seeded violations
 * (docs/seeded-violations.md). Gating it would defeat the demo. Do NOT add
 * /before pages to PAGES.
 *
 * Usage: node scripts/a11y-gate.mjs   (expects `npm run build` done)
 */

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "package.json"));
const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");

const PORT = 4319;
const BASE = `http://localhost:${PORT}`;

// After-site surfaces only. /before/* is excluded by design (header note).
const PAGES = ["/", "/services", "/providers", "/locations", "/contact"];

const GATE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 375, height: 812 },
  { name: "zoom400", width: 320, height: 900 }, // WCAG 1.4.10 reflow width
];

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not become ready`);
}

async function main() {
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    stdio: "ignore",
    detached: true,
  });
  let failures = 0;
  try {
    await waitForServer(BASE);
    const browser = await chromium.launch();
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();
      for (const pagePath of PAGES) {
        await page.goto(`${BASE}${pagePath}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        const results = await new AxeBuilder({ page })
          .withTags(GATE_TAGS)
          .analyze();
        if (results.violations.length > 0) {
          failures += results.violations.length;
          for (const v of results.violations) {
            console.error(
              `FAIL ${viewport.name} ${pagePath} [${v.id}] ${v.impact}: ${v.help}`,
            );
            for (const node of v.nodes.slice(0, 5)) {
              console.error(`     ${node.target.join(" ")}`);
            }
          }
        } else {
          console.log(`ok   ${viewport.name} ${pagePath}`);
        }
      }
      await context.close();
    }
    await browser.close();
  } finally {
    try {
      process.kill(-server.pid);
    } catch {
      server.kill();
    }
  }
  if (failures > 0) {
    console.error(
      `\na11y gate: ${failures} WCAG 2.2 A/AA violation(s). Build fails.`,
    );
    process.exit(1);
  }
  console.log(
    "\na11y gate: 0 WCAG 2.2 A/AA violations across all pages and viewports.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
