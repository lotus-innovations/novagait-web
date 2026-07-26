# Changelog

## v1.0.0 (2026-07-26)

First demo-complete release.

- After-site: Home, Services, Providers, Locations, Contact with an
  accessible appointment form (focused error summary, per-field
  aria-describedby errors, focused success confirmation). Light + dark
  themes from AA-verified design tokens (25 contrast pairs unit-tested).
- Before-variant at /before/*: the same site with 12 realistic, documented
  accessibility violations (docs/seeded-violations.md); noindex + banner.
- Exhibit at /accessibility-demo: live iframe comparison and all 12
  barriers annotated with WCAG 2.2 criteria, affected users, and fixes.
- Audit ledgers committed in audit/: before (84 findings: 75 axe + 9
  manual), after (0 findings, 8 pages x 3 viewports), rescan diff (84
  fixed, 0 lost), VPAT starter; rendered at /accessibility-demo/audit and
  /vpat (draft-ACR labeling, all 55 A/AA rows completed).
- CI: lint + typecheck + vitest (34 tests) + build; a11y gate failing on
  any WCAG 2.2 A/AA violation (bite proven in PR #22); Playwright e2e (15
  tests). Secret scanning, push protection, Dependabot, branch ruleset.
- Production at https://demo.lotusinnovations.io (Vercel).
