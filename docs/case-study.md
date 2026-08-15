# Case study: an accessibility remediation, shown end to end

**Client:** Novagait Physical Therapy (fictional demonstration brand; all
data synthetic; not affiliated with any real clinic or entity).
**Vendor:** Lotus Innovations. **Live:** https://demo.lotusinnovations.io

## The problem

Clinic websites fail the people who need them most. To show what remediation
actually involves, we built one clinic site twice. The before-version carries
12 realistic accessibility barriers. The after-version fixes every one, and
adds the tooling that keeps it fixed.

## What we measured (every number from this repository's audit artifacts)

| Measure | Before | After |
|---------|--------|-------|
| Audit findings (axe-core, 3 viewports, + manual pass) | 84 (75 automated + 9 manual) | 0 |
| Findings resolved in the rescan diff | n/a | 84 fixed, 0 still open, 0 lost |
| WCAG 2.2 A/AA criteria with a completed conformance judgment | n/a | 55 of 55 (draft ACR) |

## What automation misses (why audits need humans)

Only 8 of the 12 barriers were machine-detectable. Automated checks passed
placeholder-only form fields, a keyboard trap, and focus-indicator removal.
They also passed color-only error signaling, and a sticky header that hides
focused elements. One third of our before-findings' violation classes required
a human pass. The demo documents which, and why.

## How it stays fixed

- CI gate: axe runs on 8 pages across 3 viewports on every push. The
  viewports are desktop, mobile, and 320px reflow. A single WCAG 2.2 A/AA
  violation fails the build. Proof it bites: a deliberately planted violation failed the
  gate in 1 minute 32 seconds (PR #22, run 30222906501).
- Design tokens with 25 contrast pairs unit-tested at AA or better
  (lowest ratio 5.47:1), in light and dark themes.
- 34 unit tests and 15 end-to-end tests, including a keyboard-only walk
  asserting a visible focus indicator at every stop.

## Scope honesty

Zero findings means zero findings within tested scope: the pages,
viewports, and checks listed in the committed ledgers (`audit/*.json`).
We report what we tested and what we found; we do not certify compliance.

---
Demonstration project by Lotus Innovations. Method and tooling are the
same we apply to client WCAG 2.2 / Section 508 engagements:
https://lotusinnovations.io
