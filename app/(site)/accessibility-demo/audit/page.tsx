import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Section } from "@/components/ui";
import before from "@/audit/before.json";
import after from "@/audit/after.json";
import diffLedger from "@/audit/diff.json";

export const metadata: Metadata = {
  title: "Audit ledgers",
  description:
    "Machine-readable before/after accessibility audit ledgers and the rescan diff for the Novagait demo.",
};

type Finding = {
  id: string;
  rule: string;
  sc: string | null;
  severity: string;
  page: string;
  selector: string;
  evidence: string;
  source: string;
  seededId?: string;
};

const severityTone: Record<string, string> = {
  Blocker: "text-error",
  Serious: "text-error",
  Moderate: "text-fg",
  Minor: "text-fg-muted",
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-bg p-5">
      <p className="text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-fg-muted">{label}</p>
    </div>
  );
}

export default function AuditPage() {
  const findings = before.findings as Finding[];
  const recon = before.audit.reconciliation;
  const diff = diffLedger.diff;
  const bySeeded = new Map<string, Finding[]>();
  for (const f of findings) {
    const key = f.seededId ?? "unmapped";
    if (!bySeeded.has(key)) bySeeded.set(key, []);
    bySeeded.get(key)!.push(f);
  }
  const seededIds = [...bySeeded.keys()].sort(
    (a, b) => Number(a.slice(1)) - Number(b.slice(1)),
  );

  return (
    <>
      <Section labelledBy="audit-heading">
        <Eyebrow>Audit ledgers</Eyebrow>
        <h1
          id="audit-heading"
          className="text-4xl font-extrabold tracking-tight"
        >
          Before, after, and the diff
        </h1>
        <p className="mt-4 max-w-prose text-lg text-fg-muted">
          These numbers render directly from the committed machine ledgers (
          <a
            href="https://github.com/lotus-innovations/novagait-web/tree/main/audit"
            className="font-semibold text-primary underline"
          >
            audit/*.json
          </a>
          ): axe-core scans across three viewports plus a manual-judgment pass,
          then a rescan diff pairing each before-page with its after-page. No
          violations found within tested scope on the after-site; that is a
          statement of scope, not a certification.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Findings on the before-variant"
            value={findings.length}
          />
          <Stat
            label="Findings on the after-site"
            value={after.findings.length}
          />
          <Stat label="Fixed in the diff" value={diff.fixed.length} />
          <Stat
            label="Still open, regressed, or lost"
            value={
              diff.stillOpen.length +
              diff.regressed.length +
              diff.new.length +
              diff.unreconciled.length
            }
          />
        </div>
      </Section>

      <Section surface labelledBy="recon-heading">
        <h2
          id="recon-heading"
          className="text-3xl font-extrabold tracking-tight"
        >
          Seeded-set reconciliation
        </h2>
        <p className="mt-3 max-w-prose text-fg-muted">
          The before-variant carries exactly 12 documented barriers. Every
          finding in the ledger maps to one of them; the build script fails if
          an unmapped violation ever appears.
        </p>
        <div
          tabIndex={0}
          role="region"
          aria-label="Reconciliation table"
          className="mt-6 overflow-x-auto"
        >
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">
              Reconciliation of audit findings to the 12 seeded violations
            </caption>
            <thead>
              <tr>
                <th scope="col" className="border-b-2 border-border py-2 pr-4">
                  Seeded ID
                </th>
                <th scope="col" className="border-b-2 border-border py-2 pr-4">
                  Detection
                </th>
                <th scope="col" className="border-b-2 border-border py-2 pr-4">
                  Findings
                </th>
                <th scope="col" className="border-b-2 border-border py-2">
                  Rules involved
                </th>
              </tr>
            </thead>
            <tbody>
              {seededIds.map((sid) => {
                const items = bySeeded.get(sid)!;
                const axeCount = items.filter((f) => f.source === "axe").length;
                return (
                  <tr key={sid}>
                    <th
                      scope="row"
                      className="border-b border-border py-2 pr-4 font-bold"
                    >
                      <Link
                        href={`/accessibility-demo#${sid.toLowerCase()}`}
                        className="text-primary underline"
                      >
                        {sid}
                      </Link>
                    </th>
                    <td className="border-b border-border py-2 pr-4">
                      {axeCount > 0 ? "axe + manual" : "manual only"}
                    </td>
                    <td className="border-b border-border py-2 pr-4">
                      {items.length} ({axeCount} axe, {items.length - axeCount}{" "}
                      manual)
                    </td>
                    <td className="border-b border-border py-2 text-fg-muted">
                      {[...new Set(items.map((f) => f.rule))].join(", ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-fg-muted">
          {recon.axeDetectedIds.length} of 12 seeded violations carry at least
          one automated finding; {recon.manualOnlyIds.length} (
          {recon.manualOnlyIds.join(", ")}) are catchable only by a human.
        </p>
      </Section>

      <Section labelledBy="findings-heading">
        <h2
          id="findings-heading"
          className="text-3xl font-extrabold tracking-tight"
        >
          Every before-finding
        </h2>
        <div
          tabIndex={0}
          role="region"
          aria-label="All before-variant findings"
          className="mt-6 overflow-x-auto"
        >
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <caption className="sr-only">
              All findings recorded on the before-variant
            </caption>
            <thead>
              <tr>
                <th scope="col" className="border-b-2 border-border py-2 pr-3">
                  Seeded
                </th>
                <th scope="col" className="border-b-2 border-border py-2 pr-3">
                  Severity
                </th>
                <th scope="col" className="border-b-2 border-border py-2 pr-3">
                  WCAG
                </th>
                <th scope="col" className="border-b-2 border-border py-2 pr-3">
                  Rule
                </th>
                <th scope="col" className="border-b-2 border-border py-2 pr-3">
                  Page
                </th>
                <th scope="col" className="border-b-2 border-border py-2">
                  Selector
                </th>
              </tr>
            </thead>
            <tbody>
              {findings.map((f) => (
                <tr key={f.id}>
                  <th scope="row" className="border-b border-border py-2 pr-3">
                    {f.seededId}
                  </th>
                  <td
                    className={`border-b border-border py-2 pr-3 font-semibold ${severityTone[f.severity] ?? ""}`}
                  >
                    {f.severity}
                  </td>
                  <td className="border-b border-border py-2 pr-3">{f.sc}</td>
                  <td className="border-b border-border py-2 pr-3">
                    {f.rule}
                    {f.source === "manual" ? " (manual)" : ""}
                  </td>
                  <td className="border-b border-border py-2 pr-3">{f.page}</td>
                  <td className="border-b border-border py-2 font-mono text-xs text-fg-muted">
                    {f.selector.length > 80
                      ? `${f.selector.slice(0, 80)}…`
                      : f.selector}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-fg-muted">
          Scan metadata: axe-core {String(before.audit.engines["axe-core"])} ·
          viewports desktop 1280 / mobile 375 / 320px reflow · exhibit iframes
          excluded from after-scans (the framed before-variant is ledgered here,
          not there).{" "}
          <Link
            href="/accessibility-demo/vpat"
            className="font-semibold text-primary underline"
          >
            Continue to the draft conformance report
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
