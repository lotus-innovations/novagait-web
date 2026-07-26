"use client";

/**
 * Live before/after comparison for the exhibit. Fully accessible by
 * construction: labeled page selector, radio group for view mode, iframes
 * with descriptive titles. The framed pages are real routes.
 */

import { useState } from "react";

const pages = [
  { path: "", label: "Home" },
  { path: "/services", label: "Services" },
  { path: "/providers", label: "Providers" },
  { path: "/locations", label: "Locations" },
  { path: "/contact", label: "Contact" },
];

type View = "side-by-side" | "before" | "after";

export function CompareFrames() {
  const [page, setPage] = useState("");
  const [view, setView] = useState<View>("side-by-side");
  const label = pages.find((p) => p.path === page)?.label ?? "Home";

  return (
    <div>
      <div className="flex flex-wrap items-end gap-6">
        <div>
          <label htmlFor="compare-page" className="block font-semibold">
            Page to compare
          </label>
          <select
            id="compare-page"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            className="mt-2 block min-h-11 rounded-md border border-border bg-bg px-3 py-2"
          >
            {pages.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend className="font-semibold">View</legend>
          <div className="mt-2 flex flex-wrap gap-1">
            {(
              [
                ["side-by-side", "Side by side"],
                ["before", "Before only"],
                ["after", "After only"],
              ] as [View, string][]
            ).map(([value, text]) => (
              <label
                key={value}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 has-checked:border-primary has-checked:bg-surface"
              >
                <input
                  type="radio"
                  name="compare-view"
                  value={value}
                  checked={view === value}
                  onChange={() => setView(value)}
                  className="h-4 w-4 accent-[var(--button-bg)]"
                />
                {text}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div
        className={`mt-6 grid gap-4 ${view === "side-by-side" ? "lg:grid-cols-2" : ""}`}
      >
        {view !== "after" && (
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-error">
              Before (12 seeded barriers)
            </p>
            <iframe
              src={`/before${page}`}
              title={`Before version of the ${label} page, intentionally inaccessible`}
              className="h-[480px] w-full rounded-lg border-2 border-error bg-white"
            />
          </div>
        )}
        {view !== "before" && (
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              After (remediated)
            </p>
            <iframe
              src={`${page || "/"}`}
              title={`Accessible after version of the ${label} page`}
              className="h-[480px] w-full rounded-lg border-2 border-accent bg-white"
            />
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-fg-muted">
        Both frames load the real pages. Tab into the before-frame to feel the
        missing focus indicators; try the same walk in the after-frame.
      </p>
    </div>
  );
}
