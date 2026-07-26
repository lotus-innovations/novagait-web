import type { Metadata } from "next";
import Link from "next/link";
import "./before.css";

/**
 * The BEFORE variant: the same clinic site with 12 seeded accessibility
 * violations (docs/SPEC.md section 3). Everything inside .before-scope is
 * intentionally broken in controlled, documented ways. Do not "fix" this
 * tree; the violation set is reconciled exactly by the audit ledgers.
 *
 * Chrome-level seeded violations living in this layout:
 * - V3b: footer links below 4.5:1 contrast
 * - V4:  focus indicators removed globally (before.css)
 * - V9:  social icon links under 24px with no accessible names
 * - V11: sticky header that obscures focused elements (no scroll padding)
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { absolute: "Novagait (inaccessible before-version)" },
};

const nav = [
  { href: "/before/services", label: "Services" },
  { href: "/before/providers", label: "Providers" },
  { href: "/before/locations", label: "Locations" },
  { href: "/before/contact", label: "Contact" },
];

export default function BeforeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="before-scope flex min-h-screen flex-col bg-white text-[#1a2233]">
      {/* Accessible demo banner: part of the demo chrome, NOT a seeded
          violation. It is the escape hatch back to the remediated site. */}
      <div
        role="region"
        aria-label="Demonstration notice"
        className="bg-[#7c2d12] px-6 py-3 text-white"
      >
        <p className="mx-auto max-w-6xl text-sm font-semibold">
          Intentionally inaccessible demonstration version.{" "}
          <Link href="/" className="underline">
            Go to the accessible version
          </Link>{" "}
          or{" "}
          <Link href="/accessibility-demo" className="underline">
            see the annotated comparison
          </Link>
          .
        </p>
      </div>

      {/* V11: sticky header with no scroll-margin compensation anywhere. */}
      <header className="sticky top-0 z-40 border-b border-[#d8dce4] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link
            href="/before"
            className="text-xl font-extrabold tracking-tight text-[#1a2233] no-underline"
          >
            Novagait
          </Link>
          <nav>
            <ul className="flex flex-wrap gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center px-3 py-2 font-medium text-[#1a2233] no-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[#d8dce4] bg-[#f4f6f9]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          {/* V9: touch targets far under 24px, icon-only links with no
              accessible names. */}
          <div className="flex gap-2">
            {["facebook", "x", "instagram", "youtube"].map((network) => (
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a
                key={network}
                href={`https://example.com/${network}`}
                className="block h-4 w-4"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" focusable="false">
                  <rect
                    width="16"
                    height="16"
                    rx="3"
                    fill="#5a6478"
                    aria-hidden="true"
                  />
                </svg>
              </a>
            ))}
          </div>
          {/* V3b: link text at ~2.4:1 against #f4f6f9. */}
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[#b6bcc9] no-underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#5a6478]">
            Demonstration project by Lotus Innovations. &quot;Novagait&quot; is
            a fictional brand; all data is synthetic. Not affiliated with any
            real clinic or entity.
          </p>
        </div>
      </footer>
    </div>
  );
}
