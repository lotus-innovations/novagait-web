import { describe, expect, it } from "vitest";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- plain .mjs module, typed loosely on purpose
import {
  diffLedgers,
  evidenceSimilarity,
  normalizePage,
} from "../../scripts/diff-findings.mjs";

type Finding = {
  id: string;
  rule: string;
  sc: string | null;
  severity: string;
  page: string;
  selector: string;
  evidence: string;
  source: string;
};

function ledger(pages: string[], findings: Partial<Finding>[]) {
  return {
    audit: { target: "test", scope: { pages } },
    findings: findings.map((f, i) => ({
      id: `f-${i}`,
      rule: "label",
      sc: "4.1.2",
      severity: "Serious",
      page: "/contact",
      selector: "input",
      evidence: "<input>",
      source: "axe",
      ...f,
    })),
  };
}

const pageMap = [
  { base: "/before", head: "/" },
  { base: "/before/contact", head: "/contact" },
];

// The .mjs module is untyped; give the diff result a loose shape for tests.
type LooseDiff = Record<string, Record<string, unknown>[]>;
const runDiff = (base: unknown, head: unknown, map = pageMap): LooseDiff =>
  (diffLedgers as (b: unknown, h: unknown, m: unknown) => { diff: LooseDiff })(
    base,
    head,
    map,
  ).diff;

describe("normalizePage", () => {
  it("maps through the pageMap and defaults to identity", () => {
    expect(normalizePage(pageMap, "/before/contact")).toBe("/contact");
    expect(normalizePage(pageMap, "/somewhere")).toBe("/somewhere");
  });
});

describe("evidenceSimilarity", () => {
  it("scores identical evidence 1 and disjoint evidence 0", () => {
    expect(evidenceSimilarity('<input name="a">', '<input name="a">')).toBe(1);
    expect(evidenceSimilarity("<img src=x>", "totally different")).toBe(0);
  });
});

describe("diffLedgers", () => {
  it("buckets fixed findings when absent from the head ledger", () => {
    const base = ledger(
      ["/before/contact"],
      [{ page: "/before/contact", rule: "label", selector: "input[name=a]" }],
    );
    const head = ledger(["/contact"], []);
    const diff = runDiff(base, head);
    expect(diff.fixed).toHaveLength(1);
    expect(diff.fixed[0].headPage).toBe("/contact");
    expect(diff.stillOpen).toHaveLength(0);
    expect(diff.new).toHaveLength(0);
  });

  it("buckets stillOpen on an exact rule+page+selector match", () => {
    const base = ledger(
      ["/before/contact"],
      [{ page: "/before/contact", selector: "input[name=a]" }],
    );
    const head = ledger(
      ["/contact"],
      [{ page: "/contact", selector: "input[name=a]" }],
    );
    const diff = runDiff(base, head);
    expect(diff.stillOpen).toHaveLength(1);
    expect(diff.stillOpen[0].matchedBy).toBe("exact");
    expect(diff.fixed).toHaveLength(0);
  });

  it("falls back to fuzzy evidence matching when selectors drift", () => {
    const base = ledger(
      ["/before/contact"],
      [
        {
          page: "/before/contact",
          selector: "form > input:nth-child(1)",
          evidence: '<input type="tel" placeholder="Phone">',
        },
      ],
    );
    const head = ledger(
      ["/contact"],
      [
        {
          page: "/contact",
          selector: "#field-phone",
          evidence: '<input type="tel" placeholder="Phone" id="field-phone">',
        },
      ],
    );
    const diff = runDiff(base, head);
    expect(diff.stillOpen).toHaveLength(1);
    expect(diff.stillOpen[0].matchedBy).toBe("fuzzy");
  });

  it("buckets unmatched head findings on in-scope pages as new", () => {
    const base = ledger(["/before/contact"], []);
    const head = ledger(
      ["/contact"],
      [{ page: "/contact", rule: "color-contrast", selector: "p.muted" }],
    );
    const diff = runDiff(base, head);
    expect(diff.new).toHaveLength(1);
    expect(diff.regressed).toHaveLength(0);
  });

  it("never silently drops: unmapped-scope base findings go to unreconciled", () => {
    const base = ledger(
      ["/before/contact", "/before/legacy"],
      [{ page: "/before/legacy", selector: "input" }],
    );
    const head = ledger(["/contact"], []);
    const diff = runDiff(base, head);
    expect(diff.unreconciled).toHaveLength(1);
    expect(diff.unreconciled[0].reason).toContain("not in head scope");
  });

  it("full demo shape: every seeded finding fixed, none lost", () => {
    const seeded = [
      { page: "/before/contact", rule: "label", selector: "input[name=name]" },
      { page: "/before/contact", rule: "label", selector: "input[name=phone]" },
      { page: "/before", rule: "color-contrast", selector: ".hero p" },
      { page: "/before", rule: "button-name", selector: "button.prev" },
    ];
    const base = ledger(["/before", "/before/contact"], seeded);
    const head = ledger(["/", "/contact"], []);
    const diff = runDiff(base, head);
    expect(diff.fixed).toHaveLength(4);
    expect(
      diff.stillOpen.length +
        diff.new.length +
        diff.regressed.length +
        diff.unreconciled.length,
    ).toBe(0);
  });
});
