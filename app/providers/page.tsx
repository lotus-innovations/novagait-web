import type { Metadata } from "next";
import { Eyebrow, Section } from "@/components/ui";
import { providers } from "@/content/site";

export const metadata: Metadata = {
  title: "Providers",
  description:
    "Meet the licensed physical therapists of Novagait: orthopedic, neurologic, sports, geriatric, and pelvic health specialists.",
};

export default function ProvidersPage() {
  return (
    <Section labelledBy="providers-heading">
      <Eyebrow>Providers</Eyebrow>
      <h1
        id="providers-heading"
        className="text-4xl font-extrabold tracking-tight"
      >
        The people behind the plans
      </h1>
      <p className="mt-4 max-w-prose text-lg text-fg-muted">
        Six licensed physical therapists across three clinics. Each profile
        lists board specialties so you can ask for the right match, or let the
        front desk pair you.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <li
            key={p.slug}
            className="rounded-lg border border-border bg-bg p-6"
          >
            {/* Abstract monogram avatar: decorative, no fake photography. */}
            <div
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-button text-xl font-extrabold text-on-primary"
            >
              {p.initials}
            </div>
            <h2 className="mt-4 text-lg font-bold">
              {p.name}, {p.credentials}
            </h2>
            <p className="mt-1 text-sm font-medium text-accent">{p.role}</p>
            <p className="mt-3 text-fg-muted">{p.bio}</p>
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-fg-muted">
              Focus areas
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {p.focus.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-border px-3 py-1 text-sm text-fg-muted"
                >
                  {f}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
