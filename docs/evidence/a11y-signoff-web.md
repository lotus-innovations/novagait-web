# Accessibility sign-off: novagait-web (after-variant)

Date: 2026-07-26 · Auditor: L. Fox (Lotus Innovations) · Scope: the 8
after-site surfaces at demo.lotusinnovations.io (Home, Services, Providers,
Locations, Contact, exhibit, audit, VPAT), desktop 1280 / mobile 375 / 320px
reflow.

No violations found within tested scope. This report does not certify
compliance; it records what was tested and what was found.

## Automated (Stage A)

- axe-core via the repo-vendored gate and the /a11y-audit runner, tags
  wcag2a/wcag2aa/wcag21a/wcag21aa/wcag22aa plus best-practice on the ledger
  run: **0 findings across 8 pages x 3 viewports** (`audit/after.json`).
- CI enforces the same result on every push: `a11y-gate` job, required
  status check on `main`.
- Gate-bite proof: PR #22 introduced one deliberate `image-alt` violation;
  run 30222906501 failed the a11y-gate job in 1m32s while build-test
  passed. The gate blocks real regressions.

## Keyboard walk (Stage B)

- Home page: 31 tabbable elements enumerated in DOM order; all 31 received
  focus; **0 missing focus indicators**; first tab stop is the skip link
  ("Skip to main content"), which becomes visible on focus.
- Real-keypress spot check (Playwright `keyboard.press("Tab")`, /contact):
  third tab stop = "Services" nav link, computed outline
  `3px solid rgb(67, 56, 202)`, `el.matches(":focus-visible") === true`.
- Form error flow: submitting the empty form renders a `role="alert"` error
  summary listing 5 problems as links, and the summary receives focus
  (accessibility-tree snapshot 2026-07-26, `alert [active]` with
  linked entries). Success flow: reference heading receives focus
  (`document.activeElement === h2`, verified with response NG-B6E37D).
- No traps anywhere on the after-site; the only overlay-like state (form
  success) contains no focus.

## Motion, zoom, themes

- Reduced-motion: the only animation (hero gait-line draw) sits inside
  `@media (prefers-reduced-motion: no-preference)` plus a global kill
  switch; nothing moves under reduced motion.
- 320px reflow is a first-class scanned viewport (0 findings); rem-based
  type survives 200% zoom.
- Both themes ship AA-verified token pairs (25 pairs unit-tested in CI,
  lowest ratio 5.47:1; focus indicators 7.9:1 light / 9.4:1 dark).

## Counter-evidence check (before-variant)

The same tooling on `/before/*` records 84 findings (75 axe + 9 manual)
mapping exactly to the 12 seeded barriers, with an accidental-extra
tripwire in `scripts/build-ledgers.mjs` that fails the ledger build on any
unmapped finding. The instruments detect what they are supposed to detect.
