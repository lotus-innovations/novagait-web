import type { Metadata } from "next";
import { Eyebrow, LinkButton, Section } from "@/components/ui";
import { locations } from "@/content/site";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Novagait Physical Therapy clinics at Crescent Park, Eastbrook, and Harborline: hours, phone numbers, and accessibility details.",
};

export default function LocationsPage() {
  return (
    <>
      <Section labelledBy="locations-heading">
        <Eyebrow>Locations</Eyebrow>
        <h1
          id="locations-heading"
          className="text-4xl font-extrabold tracking-tight"
        >
          Three clinics, all step-free
        </h1>
        <p className="mt-4 max-w-prose text-lg text-fg-muted">
          Every Novagait clinic has a step-free entrance, accessible parking or
          drop-off, and treatment rooms that fit mobility equipment. Tell us
          what you need before your visit and we will have it ready.
        </p>
      </Section>
      {locations.map((l, i) => (
        <section
          key={l.slug}
          id={l.slug}
          aria-labelledby={`${l.slug}-heading`}
          className={i % 2 === 0 ? "bg-surface" : undefined}
        >
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-3">
            <div>
              <h2
                id={`${l.slug}-heading`}
                className="text-2xl font-extrabold tracking-tight"
              >
                {l.name}
              </h2>
              <p className="mt-3 whitespace-pre-line text-fg-muted">
                {l.address.join("\n")}
              </p>
              <p className="mt-2">
                <a
                  href={`tel:+1555${l.phone.replace(/\D/g, "").slice(-7)}`}
                  className="font-semibold text-primary underline"
                >
                  {l.phone}
                  <span className="sr-only"> for {l.name}</span>
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-muted">
                Hours
              </h3>
              <table className="mt-3 w-full border-collapse text-left">
                <caption className="sr-only">
                  Opening hours for {l.name}
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="border-b border-border py-2 pr-4 font-semibold"
                    >
                      Days
                    </th>
                    <th
                      scope="col"
                      className="border-b border-border py-2 font-semibold"
                    >
                      Open
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {l.hours.map((h) => (
                    <tr key={h.days}>
                      <th
                        scope="row"
                        className="border-b border-border py-2 pr-4 font-normal text-fg-muted"
                      >
                        {h.days}
                      </th>
                      <td className="border-b border-border py-2 text-fg-muted">
                        {h.open}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-muted">
                Getting here
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-fg-muted">
                {l.access.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
      <Section labelledBy="locations-cta">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2
            id="locations-cta"
            className="text-2xl font-extrabold tracking-tight"
          >
            Pick a clinic when you book
          </h2>
          <LinkButton href="/contact">Request an appointment</LinkButton>
        </div>
      </Section>
    </>
  );
}
