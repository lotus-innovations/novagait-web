# Novagait Web Demo: Build Spec

> Copied from the Lotus demo-suite spec set (00-foundation excerpts + 02-web),
> so this public repo shows spec-driven development. Fictional brand; see README.

## Foundation: Demo Portfolio Foundation Spec (bd-37)

Shared foundation for the three Lotus demo projects. Every teammate reads this
spec before their own. Decisions locked with Abhinav 2026-07-22 (grill session);
build runs as one /team session with four Opus teammates.

## 1. The fictional client

**One brand across all three demos:** a fictional multi-location outpatient
physical-therapy clinic. The three demos together tell one story: "Lotus built
this clinic's entire accessible digital front door." The three pieces are the
site, the patient app, and the AI concierge.

**Brand name: Novagait Physical Therapy.** A web search cleared it on
2026-07-22. No live business or healthcare entity uses "Novagait", and only a
parked domain holds it. Earlier candidates Brightstep, Stridewell, and Kinelia
all FAILED clearance against real clinics. Do not resurrect them.

Residual build task: run one USPTO
TESS check of "Novagait" at build start. If a live mark exists in the
health or medical classes, coin a replacement by the same procedure. That
procedure is an invented compound, cleared by web and TESS search, with no
same-class entities. The orchestrator then posts the resolved name and slugs
to the task list, before any repo is created. Never use a real clinic's name, logo, copy, or trade dress.

**VA references, precise rule.** The ban is on impersonation and trade dress.
That means no VA seal, no presenting the demo as a VA or government product,
and no Va.gov look-and-feel.

Factual citation of public standards is permitted
and required. The mobile spec's checklist doc is correct usage. So is the
case-study line "tested against VA's published Section 508 Mobile Best
Practices". Do not
self-censor those references.

**Disclaimer (verbatim, on every artifact: site footer, app about screen,
README, case studies):**

> Demonstration project by Lotus Innovations. "[BRAND]" is a fictional brand;
> all data is synthetic. Not affiliated with any real clinic or entity.

**Synthetic data rules.** Use invented providers, invented locations, and
invented patients with obviously fake names. Use no realistic PHI shapes, which
rules out SSNs and real insurance member ID formats. Data lives in seed fixtures, never generated
from real datasets.

## 2. Design system (shared by web + mobile + widget)

- Palette: 3-4 accents max. Every text and background pair passes WCAG 2.2 AA,
  meaning 4.5:1 for normal text and 3:1 for large. Define light and dark themes
  up front.
- Type: system font stack; scale must survive 200% text zoom (web) and
  Android dynamic type (mobile).
- Motion: subtle only, and every animation respects prefers-reduced-motion /
  Android remove-animations.
- Touch targets: 44px web / 48dp Android minimum.
- Focus: visible, high-contrast focus indicators everywhere, never
  outline:none without replacement.
- Tokens file (`design-tokens.json`) lives in the web repo. It is copied into
  the mobile repo, not linked. web-dev owns it and defines it in their first
  task. They then post it to the task list so mobile-dev can consume it.

## 3. Repos and hosting

| Item       | Value                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub org | New free org, **DONE 2026-07-22: `lotus-innovations`** (broader than demos per Abhinav; hardened per 04 §1). Owner: amiryala (business identity). |

## Web spec: Spec 02: Novagait Web, Before/After Remediation Pair (web-dev)

Repo: `novagait-web` · Deploys to demo.lotusinnovations.io · The 508-wedge
showcase: gov primes, lotusinnovations.io case pages, Clutch, white-label
proof. Format follows W3C WAI's "Before and After Demonstration" pattern.
Read 00-foundation.md first. web-dev owns `design-tokens.json` and publishes
it early for mobile-dev.

## 1. What ships (one Next.js app, four surfaces)

1. **The "after" site** (the real clinic site): Home, Services, Providers,
   Locations, Contact/Request-an-appointment form. The concierge widget is
   embedded, as an integration task with ai-dev's embed package. It ships with
   0 AA violations, and is keyboard clean, reduced-motion aware, and clean at
   400% zoom in both themes.
2. **The "before" variant**: same pages, frozen copy, with the seeded
   violation set (Section 3). Lives at `/before/*`, `noindex`, with a
   persistent banner: "Intentionally inaccessible demonstration version."
3. **The exhibit** (`/accessibility-demo`) is a side-by-side toggle
   walkthrough in the BAD style. Each seeded barrier gets an inline annotation
   chip. The chip explains the barrier, the affected users, the WCAG 2.2
   criterion, and the fix applied in the after-site. The annotation UI itself must be fully
   accessible (that irony will not escape reviewers).
4. **The audit + VPAT pages** (`/accessibility-demo/audit`,
   `/accessibility-demo/vpat`) render a11y-reviewer's committed artifacts at
   fixed paths in THIS repo. Those are `audit/before.json`,
   `audit/after.json`, `audit/diff.json`, and `audit/vpat-starter.json`. The
   schema is the a11y-audit design doc addendum. The diff buckets are fixed,
   still-open, regressed and new, resolved through the `/before/*`
   page-normalization map.

   The VPAT page renders the starter, and web-dev COMPLETES the gaps. Rows the
   automated ledger cannot fill get manual entries. You are completing a
   generated draft, not authoring roughly 50 criteria from scratch. Label it
   "Draft ACR based on internal audit of a demonstration product."

   If artifacts are not yet committed when you reach this task, build against
   the schema fixtures. Swap them when a11y-reviewer delivers, which they do
   by pushing directly to this repo in docs-prefixed commits.

## 2. Stack

- TypeScript, Next.js (App Router), Tailwind, static-first, with no backend.
  The appointment form posts to a stub endpoint. That endpoint renders an
  accessible success state, plus error states for the validation demo.
- Content in MDX/JSON fixtures; imagery: generated/abstract only, no stock
  photos of real people or real clinics.

## 3. Seeded violation set for the before-variant (12, spread across pages)

Each violation must be realistic, meaning the kind found in real audits. It
must also be detectable or demonstrable, annotated in the exhibit, and fixed
in the after-site. Target mix:

1. Form inputs without programmatic labels (Contact form).
2. Clickable `<div>` "buttons" with no role/keyboard support (Services cards).
3. Text contrast below 4.5:1 (hero + footer links).
4. Focus indicator removed globally (`outline: none`).
5. Missing/decorative-abused alt text (Providers page).
6. Broken heading hierarchy (h1 -> h4 jumps, Home).
7. Keyboard trap in a modal (newsletter popup on before-site only).
8. Auto-playing motion ignoring prefers-reduced-motion (hero carousel).
9. Touch targets under 24px (social icons row).
10. Error messages announced by color alone (form validation).
11. Focus-obscured sticky header (WCAG 2.2, 2.4.11).
12. Redundant entry: form re-asks previously provided info (WCAG 2.2, 3.3.7).

At least 8 of 12 must be axe-detectable, which proves the scanner story. The
rest are manual-judgment findings, which prove the human-audit story.
a11y-reviewer confirms the split empirically.

## 4. Task breakdown (self-contained, ordered)

1. Scaffold repo + CI + Next.js + Tailwind + `design-tokens.json` (publish to
   task list for mobile-dev). Deploy skeleton to Vercel.
2. After-site pages + appointment form (accessible by construction).
3. Before-variant: freeze copies, implement the 12 seeded violations, banner
   - noindex. Evidence: violation checklist mapped to implementations.
4. Exhibit page with annotation system (toggle/side-by-side + chips).
5. Audit + VPAT pages consuming a11y-reviewer's committed `audit/*.json`
   artifacts. Paths and schema are fixed in 05-a11y.md. Build on schema
   fixtures if the artifacts lag, and swap them on delivery. The CI a11y gate
   uses `scripts/a11y-gate.mjs`, handed over by a11y-reviewer in 05 task 2.
   Wire it into ci.yml when it arrives. It is repo-vendored, with no harness
   paths.
6. Concierge widget integration, using ai-dev's embed package. Then a
   Playwright e2e suite covering the page walk, the form paths, the exhibit
   toggle, and a keyboard tab-walk assertion. Then an architecture doc with a
   mermaid diagram, and the final a11y fixes from reviewer findings. Close
   with a tagged v1.0.0 release and notes.

## 5. Acceptance criteria

- After-site + exhibit + audit/VPAT pages: axe 0 AA (a11y-reviewer verified),
  keyboard walk evidence, reduced-motion + 400% zoom evidence.
- Before-variant: a11y-reviewer's scan finds the seeded axe-detectable set of
  8 or more, and their manual pass finds the rest. Counts reconcile with the
  seeded list exactly. The before-variant carries no accidental extra
  violations beyond the seeded set, so keep it controlled.
- Rescan diff renders: all 12 as "fixed" between before and after ledgers.
- Draft VPAT complete for every WCAG 2.2 A/AA criterion (no blank rows) with
  the draft-ACR labeling.
- Walkthrough video script (60-90s): toggle a barrier, show the annotation,
  show the axe delta, end on the VPAT. Case-study one-pager from measured
  results only.
