import Link from "next/link";
import { ThemeSelect } from "./theme-select";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/providers", label: "Providers" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Request an appointment" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-bg">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 text-xl font-extrabold tracking-tight text-fg no-underline"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-primary"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M2 18 C 7 18 8 8 12 8 S 17 18 22 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <ellipse cx="12" cy="19" rx="2" ry="3" fill="currentColor" />
          </svg>
          Novagait
          <span className="sr-only">Physical Therapy, home</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-x-1 gap-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-md px-3 py-2 font-medium text-fg no-underline hover:bg-surface hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeSelect />
      </div>
    </header>
  );
}
