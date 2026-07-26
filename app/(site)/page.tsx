import Link from "next/link";
import { GaitCycle, StrideDivider } from "@/components/stride";
import { Eyebrow, LinkButton, Section } from "@/components/ui";
import { journey, locations, services } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-14 sm:pt-20 lg:grid-cols-[3fr_2fr]">
          <div>
            <Eyebrow>Outpatient physical therapy</Eyebrow>
            <h1
              id="hero-heading"
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            >
              A stronger stride starts here.
            </h1>
            <p className="mt-5 max-w-prose text-lg text-fg-muted">
              Novagait helps you walk, run, lift, and live the way you mean to.
              Evaluation on your first visit, a plan you can explain in one
              sentence, and progress you can measure.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <LinkButton href="/contact">Request an appointment</LinkButton>
              <LinkButton href="/services" variant="quiet">
                Explore services
              </LinkButton>
            </div>
          </div>
          <GaitCycle className="mx-auto w-full max-w-md" />
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src="/before/provider-1.svg" className="h-10 w-16" />
        </div>
      </section>

      {/* Services preview */}
      <Section surface labelledBy="services-heading">
        <Eyebrow>What we treat</Eyebrow>
        <h2
          id="services-heading"
          className="text-3xl font-extrabold tracking-tight"
        >
          Care built around how you move
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li
              key={s.slug}
              className="rounded-lg border border-border bg-bg p-6"
            >
              <h3 className="text-lg font-bold">
                <Link
                  href={`/services#${s.slug}`}
                  className="text-fg no-underline hover:text-primary"
                >
                  {s.name}
                </Link>
              </h3>
              <p className="mt-2 text-fg-muted">{s.summary}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link
            href="/services"
            className="font-semibold text-primary underline"
          >
            See every service in detail
          </Link>
        </p>
      </Section>

      {/* Care journey: a genuine sequence, so it is numbered. */}
      <Section labelledBy="journey-heading">
        <Eyebrow>Your care journey</Eyebrow>
        <h2
          id="journey-heading"
          className="text-3xl font-extrabold tracking-tight"
        >
          Four steps, in order, every time
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((j, i) => (
            <li key={j.step} className="rounded-lg bg-surface p-6">
              <h3 className="text-lg font-bold">
                <span className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  Step {i + 1}
                </span>
                {j.step}
              </h3>
              <p className="mt-2 text-fg-muted">{j.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <StrideDivider />

      {/* Locations preview */}
      <Section labelledBy="locations-heading">
        <Eyebrow>Three clinics</Eyebrow>
        <h2
          id="locations-heading"
          className="text-3xl font-extrabold tracking-tight"
        >
          Close to home, easy to reach
        </h2>
        <ul className="mt-8 grid gap-6 lg:grid-cols-3">
          {locations.map((l) => (
            <li
              key={l.slug}
              className="rounded-lg border border-border bg-bg p-6"
            >
              <h3 className="text-lg font-bold">{l.name}</h3>
              <p className="mt-2 whitespace-pre-line text-fg-muted">
                {l.address.join("\n")}
              </p>
              <p className="mt-3">
                <Link
                  href={`/locations#${l.slug}`}
                  className="font-semibold text-primary underline"
                >
                  Hours and access
                  <span className="sr-only"> for {l.name}</span>
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA band */}
      <section aria-labelledby="cta-heading" className="bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-14">
          <div>
            <h2
              id="cta-heading"
              className="text-2xl font-extrabold tracking-tight"
            >
              Ready to take the first step?
            </h2>
            <p className="mt-2 text-fg-muted">
              Most new patients are seen within two business days.
            </p>
          </div>
          <LinkButton href="/contact">Request an appointment</LinkButton>
        </div>
      </section>
    </>
  );
}
