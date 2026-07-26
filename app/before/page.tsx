import Link from "next/link";
import { BeforeCarousel } from "@/components/before/before-carousel";
import { BeforeNewsletterModal } from "@/components/before/before-newsletter-modal";
import { journey, locations, services } from "@/content/site";

/**
 * BEFORE home page. Seeded violations on this page:
 * - V3: hero text contrast (inside the carousel slides)
 * - V6: heading hierarchy jumps straight from h1 to h4
 * - V7: newsletter popup with a keyboard trap
 * - V8: auto-playing carousel ignoring prefers-reduced-motion
 */
export default function BeforeHomePage() {
  return (
    <>
      <BeforeNewsletterModal />
      <h1 className="sr-only">Novagait Physical Therapy</h1>
      <BeforeCarousel />

      <section className="bg-[#f4f6f9] py-14">
        <div className="mx-auto max-w-6xl px-6">
          {/* V6: h4 directly under the page h1; no h2/h3 anywhere. */}
          <h4 className="text-2xl font-bold text-[#1a2233]">Our services</h4>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.slug}
                className="rounded-lg border border-[#d8dce4] bg-white p-6"
              >
                <h4 className="text-lg font-bold text-[#1a2233]">{s.name}</h4>
                <p className="mt-2 text-[#5a6478]">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <h4 className="text-2xl font-bold text-[#1a2233]">What to expect</h4>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {journey.map((j, i) => (
              <div key={j.step} className="rounded-lg bg-[#f4f6f9] p-6">
                <p className="text-sm font-semibold text-[#5a6478]">
                  Step {i + 1}
                </p>
                <h4 className="mt-1 text-lg font-bold text-[#1a2233]">
                  {j.step}
                </h4>
                <p className="mt-2 text-[#5a6478]">{j.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f6f9] py-14">
        <div className="mx-auto max-w-6xl px-6">
          <h4 className="text-2xl font-bold text-[#1a2233]">Locations</h4>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {locations.map((l) => (
              <div
                key={l.slug}
                className="rounded-lg border border-[#d8dce4] bg-white p-6"
              >
                <h4 className="text-lg font-bold text-[#1a2233]">{l.name}</h4>
                <p className="mt-2 whitespace-pre-line text-[#5a6478]">
                  {l.address.join("\n")}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8">
            <Link
              href="/before/contact"
              className="inline-block rounded-md bg-[#4338ca] px-6 py-3 font-semibold text-white no-underline"
            >
              Book now
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
