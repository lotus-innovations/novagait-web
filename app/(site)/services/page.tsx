import type { Metadata } from "next";
import { Eyebrow, LinkButton, Section } from "@/components/ui";
import { services } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Orthopedic rehab, post-surgical recovery, balance training, sports injury care, gait analysis, and pelvic health at Novagait Physical Therapy.",
};

export default function ServicesPage() {
  return (
    <>
      <Section labelledBy="services-heading">
        <Eyebrow>Services</Eyebrow>
        <h1
          id="services-heading"
          className="text-4xl font-extrabold tracking-tight"
        >
          What we treat, and how
        </h1>
        <p className="mt-4 max-w-prose text-lg text-fg-muted">
          Every service below starts the same way: a thorough evaluation and a
          plan with a goal you chose. If we are not the right fit, we say so at
          the first visit and point you to someone who is.
        </p>
      </Section>
      {services.map((s, i) => (
        <section
          key={s.slug}
          id={s.slug}
          aria-labelledby={`${s.slug}-heading`}
          className={i % 2 === 0 ? "bg-surface" : undefined}
        >
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[2fr_1fr]">
            <div>
              <h2
                id={`${s.slug}-heading`}
                className="text-2xl font-extrabold tracking-tight"
              >
                {s.name}
              </h2>
              <p className="mt-3 max-w-prose text-fg-muted">{s.detail}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Often helps with
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-fg-muted">
                {s.goodFor.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
      <Section labelledBy="services-cta">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2
            id="services-cta"
            className="text-2xl font-extrabold tracking-tight"
          >
            Not sure which service fits?
          </h2>
          <LinkButton href="/contact">
            Request an appointment and we will triage
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
