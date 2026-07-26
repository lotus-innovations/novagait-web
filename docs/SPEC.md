# Novagait Web Demo — Build Spec

> Copied from the Lotus demo-suite spec set (00-foundation excerpts + 02-web),
> so this public repo shows spec-driven development. Fictional brand; see README.

## Foundation: Demo Portfolio Foundation Spec (bd-37)

Shared foundation for the three Lotus demo projects. Every teammate reads this
spec before their own. Decisions locked with Abhinav 2026-07-22 (grill session);
build runs as one /team session with four Opus teammates.

## 1. The fictional client

**One brand across all three demos:** a fictional multi-location outpatient
physical-therapy clinic. The three demos together tell one story: "Lotus built
this clinic's entire accessible digital front door" (site, patient app,
AI concierge).

**Brand name: Novagait Physical Therapy** (cleared 2026-07-22 by web search:
no live business or healthcare entity uses "Novagait"; only a parked domain.
Earlier candidates Brightstep, Stridewell, and Kinelia all FAILED clearance
against real clinics; do not resurrect them). Residual build task: one USPTO
TESS check of "Novagait" at build start; if a live mark exists in the
health/medical classes, coin a replacement using the same procedure (invented
compound, web + TESS search, no same-class entities) and the orchestrator
posts the resolved name and slugs to the task list before any repo is
created. Never use a real clinic's name, logo, copy, or trade dress.

**VA references, precise rule:** the ban is on impersonation and trade dress:
no VA seal, no presenting the demo as a VA or government product, no Va.gov
look-and-feel. Factual citation of public standards is permitted and
required: the mobile spec's checklist doc and case-study line "tested against
VA's published Section 508 Mobile Best Practices" are correct usage. Do not
self-censor those references.

**Disclaimer (verbatim, on every artifact: site footer, app about screen,
README, case studies):**

> Demonstration project by Lotus Innovations. "[BRAND]" is a fictional brand;
> all data is synthetic. Not affiliated with any real clinic or entity.

**Synthetic data rules:** invented providers, invented locations, invented
patients (obviously fake names), no realistic PHI shapes (no SSNs, no real
insurance member ID formats). Data lives in seed fixtures, never generated
from real datasets.

## 2. Design system (shared by web + mobile + widget)

- Palette: 3-4 accents max, every text/background pair passes WCAG 2.2 AA
  (4.5:1 normal, 3:1 large); define light and dark themes up front.
- Type: system font stack; scale must survive 200% text zoom (web) and
  Android dynamic type (mobile).
- Motion: subtle only, and every animation respects prefers-reduced-motion /
  Android remove-animations.
- Touch targets: 44px web / 48dp Android minimum.
- Focus: visible, high-contrast focus indicators everywhere, never
  outline:none without replacement.
- Tokens file (`design-tokens.json`) lives in the web repo and is copied (not
  linked) into the mobile repo; web-dev owns it, defines it in their first
  task, and posts it to the task list so mobile-dev can consume it.

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
   Locations, Contact/Request-an-appointment form. Concierge widget embedded
   (integration task with ai-dev's embed package). 0 AA violations, keyboard
   clean, both themes, reduced-motion aware, 400% zoom clean.
2. **The "before" variant**: same pages, frozen copy, with the seeded
   violation set (Section 3). Lives at `/before/*`, `noindex`, with a
   persistent banner: "Intentionally inaccessible demonstration version."
3. **The exhibit** (`/accessibility-demo`): side-by-side/toggle walkthrough,
   BAD-style: each seeded barrier gets an inline annotation chip explaining
   the barrier, the affected users, the WCAG 2.2 criterion, and the fix
   applied in the after-site. The annotation UI itself must be fully
   accessible (that irony will not escape reviewers).
4. **The audit + VPAT pages** (`/accessibility-demo/audit`, `/accessibility-demo/vpat`):
   render a11y-reviewer's committed artifacts at fixed paths in THIS repo:
   `audit/before.json`, `audit/after.json`, `audit/diff.json` (schema: the
   a11y-audit design doc addendum; diff buckets fixed / still-open /
   regressed / new via the `/before/*` page-normalization map), and
   `audit/vpat-starter.json`. The VPAT page renders the starter and web-dev
   COMPLETES the gaps (rows the automated ledger cannot fill get manual
   entries); you are completing a generated draft, not authoring ~50 criteria
   from scratch. Label: "Draft ACR based on internal audit of a
   demonstration product." If artifacts are not yet committed when you reach
   this task, build against the schema fixtures and swap when a11y-reviewer
   delivers (they push directly to this repo, docs-prefixed commits).

## 2. Stack

- TypeScript, Next.js (App Router), Tailwind, static-first (no backend; the
  appointment form posts to a stub endpoint that renders an accessible
  success state and error states for validation demo).
- Content in MDX/JSON fixtures; imagery: generated/abstract only, no stock
  photos of real people or real clinics.

## 3. Seeded violation set for the before-variant (12, spread across pages)

Each violation must be (a) realistic (the kind found in real audits),
(b) detectable or demonstrable, (c) annotated in the exhibit, (d) fixed in
the after-site. Target mix:

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

At least 8 of 12 must be axe-detectable (proves the scanner story); the rest
are manual-judgment findings (proves the human-audit story). a11y-reviewer
confirms the split empirically.

## 4. Task breakdown (self-contained, ordered)

1. Scaffold repo + CI + Next.js + Tailwind + `design-tokens.json` (publish to
   task list for mobile-dev). Deploy skeleton to Vercel.
2. After-site pages + appointment form (accessible by construction).
3. Before-variant: freeze copies, implement the 12 seeded violations, banner
   - noindex. Evidence: violation checklist mapped to implementations.
4. Exhibit page with annotation system (toggle/side-by-side + chips).
5. Audit + VPAT pages consuming a11y-reviewer's committed `audit/*.json`
   artifacts (paths and schema fixed in 05-a11y.md; build on schema fixtures
   if artifacts lag, swap on delivery). The CI a11y gate uses
   `scripts/a11y-gate.mjs`, handed over by a11y-reviewer (05 task 2); wire it
   into ci.yml when it arrives (it is repo-vendored, no harness paths).
6. Concierge widget integration (ai-dev's embed package) + Playwright e2e
   suite (page walk, form paths, exhibit toggle, keyboard tab-walk
   assertion) + architecture doc with mermaid diagram + final a11y fixes
   from reviewer findings + tagged v1.0.0 release with notes.

## 5. Acceptance criteria

- After-site + exhibit + audit/VPAT pages: axe 0 AA (a11y-reviewer verified),
  keyboard walk evidence, reduced-motion + 400% zoom evidence.
- Before-variant: a11y-reviewer's scan finds the seeded axe-detectable set
  (>= 8) and their manual pass finds the rest; counts reconcile with the
  seeded list exactly (no accidental extra violations in the before-variant
  beyond the seeded set; keep it controlled).
- Rescan diff renders: all 12 as "fixed" between before and after ledgers.
- Draft VPAT complete for every WCAG 2.2 A/AA criterion (no blank rows) with
  the draft-ACR labeling.
- Walkthrough video script (60-90s): toggle a barrier, show the annotation,
  show the axe delta, end on the VPAT. Case-study one-pager from measured
  results only.
