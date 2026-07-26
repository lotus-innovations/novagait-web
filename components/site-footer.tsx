import Link from "next/link";
import { clinic, locations } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold tracking-tight">Novagait</p>
          <p className="mt-2 text-fg-muted">{clinic.tagline}</p>
          <p className="mt-2">
            <a href={`tel:+15550104820`} className="text-primary">
              {clinic.phone}
            </a>
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-muted">
            Visit
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/services" className="text-primary">
                Services
              </Link>
            </li>
            <li>
              <Link href="/providers" className="text-primary">
                Providers
              </Link>
            </li>
            <li>
              <Link href="/locations" className="text-primary">
                Locations
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary">
                Request an appointment
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-muted">
            Clinics
          </h2>
          <ul className="mt-3 space-y-2">
            {locations.map((l) => (
              <li key={l.slug}>
                <Link href={`/locations#${l.slug}`} className="text-primary">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="About this demo">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-muted">
            About this demo
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/accessibility-demo" className="text-primary">
                Accessibility exhibit
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/lotus-innovations/novagait-web"
                className="text-primary"
              >
                Source on GitHub
              </a>
            </li>
            <li>
              <a href="https://lotusinnovations.io" className="text-primary">
                Lotus Innovations
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-6 py-6 text-sm text-fg-muted">
          {clinic.disclaimer}
        </p>
      </div>
    </footer>
  );
}
