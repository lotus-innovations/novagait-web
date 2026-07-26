import type { Metadata } from "next";
import { Eyebrow, Section } from "@/components/ui";
import vpat from "@/audit/vpat-starter.json";

export const metadata: Metadata = {
  title: "Draft accessibility conformance report",
  description:
    "Draft ACR (VPAT-style) for the Novagait demo after-site, covering every WCAG 2.2 A and AA criterion.",
};

/**
 * Completed remarks for rows the generated starter leaves blank
 * (vpat-starter.json fills remarks only for Not Applicable rows). This is
 * the human completion the draft asks for; every A/AA criterion ends up
 * with a non-empty remark.
 */
const REMARKS: Record<string, string> = {
  "1.1.1":
    "Images are decorative vector art marked decorative (empty alt or aria-hidden); monogram avatars are hidden; meaning always carried by adjacent text.",
  "1.3.1":
    "Semantic HTML throughout: strict heading outline, labeled sections (aria-labelledby), real tables with th/scope/caption for hours, fieldset/legend for radio groups.",
  "1.3.2": "Single-column document order matches visual order on all pages.",
  "1.3.3":
    "No instruction relies on shape, position, or sound; labels are textual.",
  "1.3.4": "No orientation lock; layout works in portrait and landscape.",
  "1.3.5":
    "Appointment form uses autocomplete=name and autocomplete=tel on the matching fields.",
  "1.4.1":
    "Color never carries meaning alone: errors get text plus icons, links in prose are underlined.",
  "1.4.3":
    "Every text/background pair comes from design-tokens.json; all 25 pairs unit-tested at 4.5:1 or better in CI (lowest 5.47:1).",
  "1.4.4": "Rem-based type; 200% text zoom verified without loss of content.",
  "1.4.5": "No images of text anywhere; all text is real text.",
  "1.4.10":
    "320px reflow (400% zoom) scanned as a first-class viewport in the CI gate; no horizontal scrolling for reading.",
  "1.4.11":
    "Focus indicator 7.9:1 (light) / 9.4:1 (dark); form field borders and icons meet 3:1 against adjacent colors.",
  "1.4.12":
    "No fixed heights on text containers; spacing overrides reflow cleanly.",
  "1.4.13": "No content appears on hover or focus beyond browser defaults.",
  "2.1.1":
    "Every interactive element is a native link, button, or form control; full keyboard walk evidence in the audit ledger.",
  "2.1.2":
    "No traps; the only dialog-like state (form success) never contains focus.",
  "2.4.1": "Skip link to #main on every page, visible on focus.",
  "2.4.2": "Unique, descriptive titles via the Next.js metadata template.",
  "2.4.3": "Focus order follows document order; verified in the keyboard walk.",
  "2.4.4":
    "Link text is self-describing; repeated links carry sr-only context (e.g. per-location hours links).",
  "2.4.5":
    "Header navigation, footer navigation, and in-page links provide multiple ways.",
  "2.4.6":
    "Headings and labels describe their sections; form labels name their fields.",
  "2.4.7": "Global 3px :focus-visible outline with offset; never removed.",
  "2.4.11": "Header is not sticky; nothing overlays focused elements.",
  "2.5.1": "No multipoint or path-based gestures.",
  "2.5.2": "All actions fire on click/up; no down-event-only activation.",
  "2.5.3": "Visible labels are the start of every accessible name.",
  "2.5.7": "No dragging interactions.",
  "2.5.8":
    "All interactive targets are at least 44px (min-h-11 on controls), above the 24px minimum.",
  "3.1.1": "html lang=en on every page.",
  "3.1.2": "Single-language content (English) throughout.",
  "3.2.1": "Focus never triggers a context change.",
  "3.2.2":
    "Input never auto-submits or redirects; submission is an explicit button.",
  "3.2.3": "Identical header and footer navigation on every page.",
  "3.2.4": "Components are styled and named consistently across pages.",
  "3.2.6":
    "Contact/help (phone + appointment link) appears in the same relative order in header and footer on every page.",
  "3.3.1":
    "Validation failures render a focused role=alert error summary with per-field text errors linked by aria-describedby and aria-invalid.",
  "3.3.2":
    "Every field has a visible programmatic label; hints via aria-describedby.",
  "3.3.3":
    "Error messages state the fix, with a format example for the phone field.",
  "3.3.7": "Each fact is asked exactly once; copy commits to it explicitly.",
  "4.1.2":
    "Native elements everywhere; the theme selector is a labeled select; state changes use standard semantics.",
  "4.1.3":
    "Status changes (error summary, success confirmation) use role=alert and focus management.",
};

const toneFor: Record<string, string> = {
  Supports: "text-accent",
  "Not Applicable": "text-fg-muted",
  "Does Not Support": "text-error",
  "Partially Supports": "text-error",
};

export default function VpatPage() {
  const rows = vpat.rows as {
    sc: string;
    name: string;
    level: string;
    suggestion: string;
    remarks: string;
    linkedFindings: string[];
  }[];
  const blank = rows.filter((r) => !r.remarks && !REMARKS[r.sc]);

  return (
    <Section labelledBy="vpat-heading">
      <Eyebrow>Conformance report</Eyebrow>
      <h1 id="vpat-heading" className="text-4xl font-extrabold tracking-tight">
        Draft ACR: WCAG 2.2 A and AA
      </h1>
      <p className="mt-4 max-w-prose text-lg text-fg-muted">
        <strong>
          Draft ACR based on internal audit of a demonstration product.
        </strong>{" "}
        Generated from the committed audit ledgers and completed by hand; every
        one of the {rows.length} Level A and AA criteria has a conformance
        judgment and remarks. A production ACR would follow the ITI VPAT
        template and an independent audit; this page shows the working method.
      </p>
      {blank.length > 0 && (
        <p className="mt-3 font-semibold text-error">
          {blank.length} row(s) missing remarks:{" "}
          {blank.map((r) => r.sc).join(", ")}
        </p>
      )}
      <div
        tabIndex={0}
        role="region"
        aria-label="Conformance table"
        className="mt-8 overflow-x-auto"
      >
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Conformance judgment for every WCAG 2.2 A and AA success criterion
          </caption>
          <thead>
            <tr>
              <th scope="col" className="border-b-2 border-border py-2 pr-3">
                Criterion
              </th>
              <th scope="col" className="border-b-2 border-border py-2 pr-3">
                Level
              </th>
              <th scope="col" className="border-b-2 border-border py-2 pr-3">
                Conformance
              </th>
              <th scope="col" className="border-b-2 border-border py-2">
                Remarks and explanations
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.sc}>
                <th
                  scope="row"
                  className="border-b border-border py-2 pr-3 align-top font-semibold"
                >
                  {r.sc} {r.name}
                </th>
                <td className="border-b border-border py-2 pr-3 align-top">
                  {r.level}
                </td>
                <td
                  className={`border-b border-border py-2 pr-3 align-top font-bold ${toneFor[r.suggestion] ?? ""}`}
                >
                  {r.suggestion}
                </td>
                <td className="border-b border-border py-2 align-top text-fg-muted">
                  {r.remarks || REMARKS[r.sc]}
                  {r.linkedFindings.length > 0 &&
                    ` Linked findings: ${r.linkedFindings.join(", ")}.`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm text-fg-muted">
        Basis: {vpat.meta.basis} {vpat.meta.note}
      </p>
    </Section>
  );
}
