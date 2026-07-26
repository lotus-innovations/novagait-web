import type { Metadata } from "next";
import Link from "next/link";
import { CompareFrames } from "@/components/compare-frames";
import { Eyebrow, Section } from "@/components/ui";
import { seededViolations } from "@/content/violations";

export const metadata: Metadata = {
  title: "Accessibility exhibit",
  description:
    "Side-by-side walkthrough of 12 realistic accessibility barriers and their fixes, in the style of the W3C Before and After Demonstration.",
};

function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "axe" | "manual";
}) {
  const tones = {
    neutral: "border-border text-fg-muted",
    axe: "border-accent text-accent",
    manual: "border-primary text-primary",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export default function AccessibilityDemoPage() {
  return (
    <>
      <Section labelledBy="exhibit-heading">
        <Eyebrow>Accessibility exhibit</Eyebrow>
        <h1
          id="exhibit-heading"
          className="text-4xl font-extrabold tracking-tight"
        >
          The same site, twice
        </h1>
        <p className="mt-4 max-w-prose text-lg text-fg-muted">
          This demo follows the W3C WAI{" "}
          <a
            href="https://www.w3.org/WAI/demos/bad/"
            className="font-semibold text-primary underline"
          >
            Before and After Demonstration
          </a>{" "}
          pattern: one clinic website built twice. The before-version carries 12
          realistic barriers, the kind real audits find every week. The
          after-version fixes every one, and a CI gate keeps them fixed.
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          <li>
            <Chip tone="axe">8 of 12 machine-detectable (axe-core)</Chip>
          </li>
          <li>
            <Chip tone="manual">4 of 12 need human judgment</Chip>
          </li>
          <li>
            <Chip>WCAG 2.2 A/AA</Chip>
          </li>
        </ul>
        <p className="mt-6">
          <Link
            href="/accessibility-demo/audit"
            className="font-semibold text-primary underline"
          >
            Audit ledgers and rescan diff
          </Link>
          <span className="mx-3 text-fg-muted" aria-hidden="true">
            ·
          </span>
          <Link
            href="/accessibility-demo/vpat"
            className="font-semibold text-primary underline"
          >
            Draft accessibility conformance report
          </Link>
        </p>
      </Section>

      <Section surface labelledBy="compare-heading">
        <h2
          id="compare-heading"
          className="text-3xl font-extrabold tracking-tight"
        >
          Compare them live
        </h2>
        <div className="mt-6">
          <CompareFrames />
        </div>
      </Section>

      <Section labelledBy="barriers-heading">
        <h2
          id="barriers-heading"
          className="text-3xl font-extrabold tracking-tight"
        >
          The 12 barriers, one by one
        </h2>
        <p className="mt-3 max-w-prose text-fg-muted">
          Each barrier below is real on the before-pages right now. The
          numbering matches the audit ledgers and{" "}
          <a
            href="https://github.com/lotus-innovations/novagait-web/blob/main/docs/seeded-violations.md"
            className="font-semibold text-primary underline"
          >
            the seeded-violation checklist
          </a>
          .
        </p>
        <ol className="mt-8 space-y-10">
          {seededViolations.map((v) => (
            <li
              key={v.id}
              id={v.id.toLowerCase()}
              className="rounded-lg border border-border p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-extrabold tracking-tight">
                  <span className="text-fg-muted">{v.id}.</span> {v.title}
                </h3>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip>
                  WCAG {v.sc} {v.scName}
                </Chip>
                <Chip tone={v.detection}>
                  {v.detection === "axe"
                    ? `Caught by axe: ${v.axeRule}`
                    : "Human judgment required"}
                </Chip>
              </div>
              <div className="mt-5 grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-error">
                    What is broken
                  </h4>
                  <p className="mt-2 text-fg-muted">{v.barrier}</p>
                  <pre
                    tabIndex={0}
                    role="region"
                    aria-label={`Broken code for ${v.id}`}
                    className="mt-3 overflow-x-auto rounded-md bg-surface p-4 text-sm"
                  >
                    <code>{v.beforeCode}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                    The fix applied
                  </h4>
                  <p className="mt-2 text-fg-muted">{v.fix}</p>
                  <pre
                    tabIndex={0}
                    role="region"
                    aria-label={`Fixed code for ${v.id}`}
                    className="mt-3 overflow-x-auto rounded-md bg-surface p-4 text-sm"
                  >
                    <code>{v.afterCode}</code>
                  </pre>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-muted">
                  Who hits this barrier
                </h4>
                <p className="mt-2 max-w-prose text-fg-muted">{v.affected}</p>
              </div>
              <p className="mt-4 flex flex-wrap gap-4">
                <Link
                  href={v.beforePage}
                  className="font-semibold text-primary underline"
                >
                  See it broken
                  <span className="sr-only"> ({v.id} on the before-site)</span>
                </Link>
                <Link
                  href={v.afterPage}
                  className="font-semibold text-primary underline"
                >
                  See it fixed
                  <span className="sr-only"> ({v.id} on the after-site)</span>
                </Link>
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
