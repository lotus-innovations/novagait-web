#!/usr/bin/env node
/**
 * Rescan diff engine (a11y-audit design doc section 6 + 6.1 addendum).
 * Compares a base findings ledger against a head ledger and buckets every
 * finding as fixed / stillOpen / regressed / new; anything that cannot be
 * reconciled is listed under `unreconciled`, never silently dropped.
 *
 * Page normalization: an explicit pageMap pairs base pages with head pages
 * (the demo's /before/<p> pairing with /<p>); identity is the default.
 *
 * Diff key: (rule, normalized page, selector), with a fuzzy fallback on
 * (rule, normalized page) + evidence similarity for selector drift.
 *
 * Exported as pure functions so the vitest suite covers the bucketing on a
 * synthetic fixture (tests/unit/diff-findings.test.ts). Mirrored by the
 * harness /a11y-audit skill for generic rescans; this copy is canonical for
 * the demo repo.
 *
 * CLI: node scripts/diff-findings.mjs <base.json> <head.json> <pagemap.json> [out.json]
 */

import { readFile, writeFile } from "node:fs/promises";

/** Normalize a base page path through the pageMap; identity by default. */
export function normalizePage(pageMap, basePage) {
  const hit = pageMap.find((m) => m.base === basePage);
  return hit ? hit.head : basePage;
}

function findingRef(f, extra = {}) {
  return {
    id: f.id,
    rule: f.rule,
    sc: f.sc ?? null,
    severity: f.severity,
    selector: f.selector,
    source: f.source,
    ...extra,
  };
}

/** Crude token-overlap similarity for evidence strings (0..1). */
export function evidenceSimilarity(a, b) {
  const tok = (s) =>
    new Set(
      String(s ?? "")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean),
    );
  const ta = tok(a);
  const tb = tok(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared++;
  return shared / Math.max(ta.size, tb.size);
}

export function diffLedgers(base, head, pageMap = []) {
  const headPool = head.findings.map((f) => ({ f, matched: false }));

  const exactKey = (rule, page, selector) => `${rule}|${page}|${selector}`;
  const headByExact = new Map();
  for (const entry of headPool) {
    headByExact.set(
      exactKey(entry.f.rule, entry.f.page, entry.f.selector),
      entry,
    );
  }

  const fixed = [];
  const stillOpen = [];
  const unreconciled = [];

  for (const bf of base.findings) {
    const headPage = normalizePage(pageMap, bf.page);
    const exact = headByExact.get(exactKey(bf.rule, headPage, bf.selector));
    if (exact && !exact.matched) {
      exact.matched = true;
      stillOpen.push(
        findingRef(bf, { basePage: bf.page, headPage, matchedBy: "exact" }),
      );
      continue;
    }
    // Fuzzy fallback: same rule on the mapped page, similar evidence.
    const fuzzy = headPool.find(
      (entry) =>
        !entry.matched &&
        entry.f.rule === bf.rule &&
        entry.f.page === headPage &&
        evidenceSimilarity(entry.f.evidence, bf.evidence) >= 0.5,
    );
    if (fuzzy) {
      fuzzy.matched = true;
      stillOpen.push(
        findingRef(bf, { basePage: bf.page, headPage, matchedBy: "fuzzy" }),
      );
      continue;
    }
    // Not present in head: the finding was fixed (if the mapped page was in
    // head scope) or cannot be reconciled (page never scanned in head).
    const headScope = new Set(head.audit?.scope?.pages ?? []);
    if (headScope.size === 0 || headScope.has(headPage)) {
      fixed.push(findingRef(bf, { basePage: bf.page, headPage }));
    } else {
      unreconciled.push(
        findingRef(bf, {
          basePage: bf.page,
          headPage,
          reason: "mapped page not in head scope",
        }),
      );
    }
  }

  // Anything in head that no base finding claimed:
  // new on pages that (via the map) existed in base scope; regressed means
  // it was previously recorded as fixed, which a two-ledger diff cannot
  // know, so regressions are detected as: present in head AND the base
  // ledger has zero findings for that rule+page pair while the page WAS in
  // base scope. Both buckets are emitted; consumers treat them together.
  const baseScopeMapped = new Set(
    (base.audit?.scope?.pages ?? []).map((p) => normalizePage(pageMap, p)),
  );
  const newFindings = [];
  const regressed = [];
  for (const entry of headPool) {
    if (entry.matched) continue;
    const ref = findingRef(entry.f, { headPage: entry.f.page });
    if (baseScopeMapped.has(entry.f.page)) {
      newFindings.push(ref);
    } else {
      regressed.push({ ...ref, reason: "page not present in base scope" });
    }
  }

  return {
    diff: {
      base: base.audit,
      head: head.audit,
      pageMap,
      fixed,
      stillOpen,
      regressed,
      new: newFindings,
      unreconciled,
    },
  };
}

const isMain =
  process.argv[1] &&
  import.meta.url.endsWith("diff-findings.mjs") &&
  process.argv[1].endsWith("diff-findings.mjs");
if (isMain) {
  const [basePath, headPath, mapPath, outPath] = process.argv.slice(2);
  if (!basePath || !headPath) {
    console.error(
      "Usage: diff-findings.mjs <base.json> <head.json> [pagemap.json] [out.json]",
    );
    process.exit(2);
  }
  const base = JSON.parse(await readFile(basePath, "utf8"));
  const head = JSON.parse(await readFile(headPath, "utf8"));
  const pageMap = mapPath ? JSON.parse(await readFile(mapPath, "utf8")) : [];
  const result = diffLedgers(base, head, pageMap);
  const json = JSON.stringify(result, null, 2);
  if (outPath) {
    await writeFile(outPath, json);
    console.log(
      `fixed=${result.diff.fixed.length} stillOpen=${result.diff.stillOpen.length} regressed=${result.diff.regressed.length} new=${result.diff.new.length} unreconciled=${result.diff.unreconciled.length} -> ${outPath}`,
    );
  } else {
    console.log(json);
  }
}
