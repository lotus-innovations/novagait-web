#!/usr/bin/env node
/**
 * Composes the committed audit artifacts from the Stage A scan outputs plus
 * the manual-judgment findings (a11y-audit design: Stage B), and generates
 * the diff and VPAT starter:
 *
 *   audit-work/before/findings.json + manual findings -> audit/before.json
 *   audit-work/after/findings.json  + manual pass     -> audit/after.json
 *   diff via scripts/diff-findings.mjs pageMap        -> audit/diff.json
 *   after ledger + criteria catalog                   -> audit/vpat-starter.json
 *
 * Seeded-ID attribution follows docs/seeded-violations.md exactly; any axe
 * finding that fails to map throws (accidental-extra tripwire).
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { diffLedgers } from "./diff-findings.mjs";

/** rule + page -> seeded violation ID (docs/seeded-violations.md). */
function seededId(f) {
  const { rule, page } = f;
  if (rule === "select-name" && page === "/before/contact") return "V1";
  if (rule === "color-contrast") return "V3";
  if (rule === "image-alt" && page === "/before/providers") return "V5";
  if (rule === "heading-order") return "V6";
  if (rule === "aria-dialog-name" && page === "/before") return "V7";
  if (rule === "button-name" && page === "/before") return "V8";
  if (rule === "target-size" || rule === "link-name") return "V9";
  if (rule === "label" && page === "/before/contact") return "V12";
  return null;
}

const MANUAL_BEFORE = [
  {
    id: "manual-V1b",
    seededId: "V1",
    rule: "placeholder-only-labels",
    sc: "3.3.2",
    wcagLevel: "A",
    severity: "Serious",
    page: "/before/contact",
    selector: "form input[placeholder]",
    evidence:
      'Text inputs are labeled only by placeholder (e.g. <input name="phone" placeholder="Phone">). Automated label checks PASS these because the placeholder feeds accessible-name computation; the hint still disappears on entry and is not a label. Verified by inspection of before-form.tsx.',
    source: "manual",
    recommendation:
      "Add visible <label> elements associated via htmlFor/id; keep hints in aria-describedby.",
    effort: "S",
  },
  {
    id: "manual-V2",
    seededId: "V2",
    rule: "clickable-div-no-keyboard",
    sc: "2.1.1",
    wcagLevel: "A",
    severity: "Serious",
    page: "/before/services",
    selector: "div.cursor-pointer[onClick]",
    evidence:
      "Service cards are <div onClick> with no role, tabindex, or keydown handler (before-service-cards.tsx). Reproduction: Tab through the page; the six cards are never focusable and cannot be activated by keyboard.",
    source: "manual",
    recommendation: "Make the affordance a real link or button.",
    effort: "S",
  },
  {
    id: "manual-V4",
    seededId: "V4",
    rule: "focus-visible-removed",
    sc: "2.4.7",
    wcagLevel: "AA",
    severity: "Serious",
    page: "/before",
    selector: ".before-scope *:focus",
    evidence:
      "before.css sets outline: none on every focused element in the variant with no replacement. Reproduction: Tab through any /before page; no focus indicator ever appears.",
    source: "manual",
    recommendation:
      "Provide a visible high-contrast focus indicator; never remove outlines without a replacement.",
    effort: "S",
  },
  {
    id: "manual-V5b",
    seededId: "V5",
    rule: "junk-alt-text",
    sc: "1.1.1",
    wcagLevel: "A",
    severity: "Moderate",
    page: "/before/providers",
    selector: 'img[alt="IMG_4821.JPG"]',
    evidence:
      'Third provider image carries alt="IMG_4821.JPG". Automated checks pass it (alt is present); a screen reader reads a camera filename.',
    source: "manual",
    recommendation:
      "Describe meaningful images or mark decorative ones with empty alt.",
    effort: "S",
  },
  {
    id: "manual-V7b",
    seededId: "V7",
    rule: "keyboard-trap",
    sc: "2.1.2",
    wcagLevel: "A",
    severity: "Blocker",
    page: "/before",
    selector: '[role="dialog"]',
    evidence:
      "Playwright verification 2026-07-26: with focus inside the newsletter popup, a dispatched Tab keydown has defaultPrevented=true (swallowed); Escape leaves the dialog open; the only close control is a <span onClick> (mouse-only). Keyboard users cannot leave the dialog.",
    source: "manual",
    recommendation:
      "Contain focus properly (wrap, not swallow), close on Escape, make the close control a real button, restore focus on close.",
    effort: "M",
  },
  {
    id: "manual-V8b",
    seededId: "V8",
    rule: "autoplay-ignores-reduced-motion",
    sc: "2.2.2",
    wcagLevel: "A",
    severity: "Serious",
    page: "/before",
    selector: ".before-carousel-track",
    evidence:
      "Carousel auto-advances on an infinite CSS animation with !important that overrides the global prefers-reduced-motion kill switch (before.css); there is no pause/stop/hide control.",
    source: "manual",
    recommendation:
      "Provide pause/stop/hide; honor prefers-reduced-motion; avoid autoplay.",
    effort: "M",
  },
  {
    id: "manual-V10",
    seededId: "V10",
    rule: "color-only-error-indication",
    sc: "3.3.1",
    wcagLevel: "A",
    severity: "Serious",
    page: "/before/contact",
    selector: "form .border-\\[\\#dc2626\\]",
    evidence:
      "Submitting the empty form turns invalid field borders red (border-[#dc2626]) with no error text, no aria-invalid, no focus move, and no announcement (before-form.tsx onSubmit). Screen reader output: silence.",
    source: "manual",
    recommendation:
      "Identify errors in text, associate them to fields, and announce them (error summary + aria-describedby).",
    effort: "M",
  },
  {
    id: "manual-V11",
    seededId: "V11",
    rule: "focus-obscured-sticky-header",
    sc: "2.4.11",
    wcagLevel: "AA",
    severity: "Moderate",
    page: "/before/locations",
    selector: "header.sticky",
    evidence:
      "The before-header is position:sticky top-0 and no scroll-padding/scroll-margin exists anywhere in the scope. Reproduction: Shift+Tab upward through the locations page; focused links scroll underneath the header and become invisible while focused.",
    source: "manual",
    recommendation:
      "Reserve the header height with scroll-padding-top, or un-stick the header.",
    effort: "S",
  },
  {
    id: "manual-V12b",
    seededId: "V12",
    rule: "redundant-entry",
    sc: "3.3.7",
    wcagLevel: "A",
    severity: "Moderate",
    page: "/before/contact",
    selector: 'input[name="nameConfirm"], input[name="phoneConfirm"]',
    evidence:
      "The form re-asks for the name and phone number entered moments earlier (visible pseudo-labels: Confirm your name, Re-enter phone), with no autofill or carry-over.",
    source: "manual",
    recommendation: "Ask once; auto-populate or drop confirmation fields.",
    effort: "S",
  },
];

// WCAG 2.2 A + AA criteria (4.1.1 removed in 2.2). 31 A + 24 AA = 55 rows.
const CRITERIA = [
  ["1.1.1", "Non-text Content", "A"],
  ["1.2.1", "Audio-only and Video-only (Prerecorded)", "A"],
  ["1.2.2", "Captions (Prerecorded)", "A"],
  ["1.2.3", "Audio Description or Media Alternative (Prerecorded)", "A"],
  ["1.2.4", "Captions (Live)", "AA"],
  ["1.2.5", "Audio Description (Prerecorded)", "AA"],
  ["1.3.1", "Info and Relationships", "A"],
  ["1.3.2", "Meaningful Sequence", "A"],
  ["1.3.3", "Sensory Characteristics", "A"],
  ["1.3.4", "Orientation", "AA"],
  ["1.3.5", "Identify Input Purpose", "AA"],
  ["1.4.1", "Use of Color", "A"],
  ["1.4.2", "Audio Control", "A"],
  ["1.4.3", "Contrast (Minimum)", "AA"],
  ["1.4.4", "Resize Text", "AA"],
  ["1.4.5", "Images of Text", "AA"],
  ["1.4.10", "Reflow", "AA"],
  ["1.4.11", "Non-text Contrast", "AA"],
  ["1.4.12", "Text Spacing", "AA"],
  ["1.4.13", "Content on Hover or Focus", "AA"],
  ["2.1.1", "Keyboard", "A"],
  ["2.1.2", "No Keyboard Trap", "A"],
  ["2.1.4", "Character Key Shortcuts", "A"],
  ["2.2.1", "Timing Adjustable", "A"],
  ["2.2.2", "Pause, Stop, Hide", "A"],
  ["2.3.1", "Three Flashes or Below Threshold", "A"],
  ["2.4.1", "Bypass Blocks", "A"],
  ["2.4.2", "Page Titled", "A"],
  ["2.4.3", "Focus Order", "A"],
  ["2.4.4", "Link Purpose (In Context)", "A"],
  ["2.4.5", "Multiple Ways", "AA"],
  ["2.4.6", "Headings and Labels", "AA"],
  ["2.4.7", "Focus Visible", "AA"],
  ["2.4.11", "Focus Not Obscured (Minimum)", "AA"],
  ["2.5.1", "Pointer Gestures", "A"],
  ["2.5.2", "Pointer Cancellation", "A"],
  ["2.5.3", "Label in Name", "A"],
  ["2.5.4", "Motion Actuation", "A"],
  ["2.5.7", "Dragging Movements", "AA"],
  ["2.5.8", "Target Size (Minimum)", "AA"],
  ["3.1.1", "Language of Page", "A"],
  ["3.1.2", "Language of Parts", "AA"],
  ["3.2.1", "On Focus", "A"],
  ["3.2.2", "On Input", "A"],
  ["3.2.3", "Consistent Navigation", "AA"],
  ["3.2.4", "Consistent Identification", "AA"],
  ["3.2.6", "Consistent Help", "A"],
  ["3.3.1", "Error Identification", "A"],
  ["3.3.2", "Labels or Instructions", "A"],
  ["3.3.3", "Error Suggestion", "AA"],
  ["3.3.4", "Error Prevention (Legal, Financial, Data)", "AA"],
  ["3.3.7", "Redundant Entry", "A"],
  ["3.3.8", "Accessible Authentication (Minimum)", "AA"],
  ["4.1.2", "Name, Role, Value", "A"],
  ["4.1.3", "Status Messages", "AA"],
];

/** Criteria with no applicable content on this site. */
const NOT_APPLICABLE = {
  "1.2.1": "No audio or video content anywhere on the site.",
  "1.2.2": "No prerecorded media.",
  "1.2.3": "No prerecorded media.",
  "1.2.4": "No live media.",
  "1.2.5": "No prerecorded media.",
  "1.4.2": "No auto-playing audio.",
  "2.1.4": "No character-key shortcuts are implemented.",
  "2.2.1": "No time limits on any interaction.",
  "2.5.4": "No motion-actuated functionality.",
  "3.3.4":
    "No legal, financial, or data-modifying transactions (demo booking stores nothing).",
  "3.3.8": "No authentication on public surfaces (the demo has no login).",
};

async function main() {
  const beforeScan = JSON.parse(
    await readFile("audit-work/before/findings.json", "utf8"),
  );
  const afterScan = JSON.parse(
    await readFile("audit-work/after/findings.json", "utf8"),
  );

  // BEFORE ledger: attribute every axe finding to its seeded ID.
  const attributed = beforeScan.findings.map((f) => {
    const sid = seededId(f);
    if (!sid) {
      throw new Error(
        `Accidental extra violation (no seeded mapping): ${f.rule} on ${f.page} at ${f.selector}`,
      );
    }
    return { ...f, seededId: sid };
  });
  const before = {
    audit: {
      ...beforeScan.audit,
      variant: "before",
      stageB:
        "Manual-judgment pass performed per wcag22-manual-checklist; manual findings carry reproduction evidence.",
    },
    findings: [...attributed, ...MANUAL_BEFORE],
  };

  // Seeded reconciliation (docs/SPEC.md 02 section 5): all 12 IDs present,
  // >= 8 with at least one axe-source finding, zero unmapped extras.
  const ids = new Set(before.findings.map((f) => f.seededId));
  const axeIds = new Set(
    before.findings.filter((f) => f.source === "axe").map((f) => f.seededId),
  );
  if (ids.size !== 12) {
    throw new Error(`Expected 12 seeded IDs, got ${ids.size}: ${[...ids]}`);
  }
  if (axeIds.size < 8) {
    throw new Error(`Expected >=8 axe-detected seeded IDs, got ${axeIds.size}`);
  }
  before.audit.reconciliation = {
    seededIds: [...ids].sort(),
    axeDetectedIds: [...axeIds].sort(),
    manualOnlyIds: [...ids].filter((i) => !axeIds.has(i)).sort(),
    axeFindingCount: attributed.length,
    manualFindingCount: MANUAL_BEFORE.length,
  };

  // AFTER ledger: zero axe findings + manual pass summary.
  const after = {
    audit: {
      ...afterScan.audit,
      variant: "after",
      stageB:
        "Manual pass on the after-site: keyboard-only walk of every page (focus visible at each stop, logical order, skip link works, no traps), form error/success announcement flow verified with focus management, reduced-motion honored (hero animation inert), sticky-header obscuring not applicable (header not sticky). No violations found within tested scope.",
    },
    findings: afterScan.findings,
  };

  const pageMap = [
    { base: "/before", head: "/" },
    { base: "/before/services", head: "/services" },
    { base: "/before/providers", head: "/providers" },
    { base: "/before/locations", head: "/locations" },
    { base: "/before/contact", head: "/contact" },
  ];
  const diff = diffLedgers(before, after, pageMap);

  // VPAT starter from the after ledger.
  const findingsBySc = new Map();
  for (const f of after.findings) {
    if (!findingsBySc.has(f.sc)) findingsBySc.set(f.sc, []);
    findingsBySc.get(f.sc).push(f.id);
  }
  const vpat = {
    meta: {
      product: "Novagait Physical Therapy demo website (after-variant)",
      standard: "WCAG 2.2 Levels A and AA",
      date: after.audit.date,
      basis:
        "Generated from the after-audit findings ledger (axe-core Stage A across 6 pages x 3 viewports, tags incl. best-practice) plus the Stage B manual pass. DRAFT input for an ACR; not an ACR itself.",
      note: "Suggestions are per-criterion starting points. Absence of findings is evidence within tested scope only; it never certifies compliance.",
    },
    rows: CRITERIA.map(([sc, name, level]) => {
      const linked = findingsBySc.get(sc) ?? [];
      const na = NOT_APPLICABLE[sc];
      return {
        sc,
        name,
        level,
        suggestion: na
          ? "Not Applicable"
          : linked.length > 0
            ? "Does Not Support"
            : "Supports",
        linkedFindings: linked,
        remarks: na ?? "",
      };
    }),
  };

  await mkdir("audit", { recursive: true });
  await writeFile("audit/before.json", JSON.stringify(before, null, 2));
  await writeFile("audit/after.json", JSON.stringify(after, null, 2));
  await writeFile("audit/diff.json", JSON.stringify(diff, null, 2));
  await writeFile("audit/vpat-starter.json", JSON.stringify(vpat, null, 2));
  console.log(
    `before: ${before.findings.length} findings (${attributed.length} axe + ${MANUAL_BEFORE.length} manual), after: ${after.findings.length}, diff: fixed=${diff.diff.fixed.length} stillOpen=${diff.diff.stillOpen.length} new=${diff.diff.new.length} unreconciled=${diff.diff.unreconciled.length}, vpat rows: ${vpat.rows.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
