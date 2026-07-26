import { providers } from "@/content/site";

/**
 * BEFORE providers page. Seeded violations on this page:
 * - V5: images with missing or junk alt text. Two <img> elements have no
 *   alt attribute at all; one carries a filename as alt. (The images are
 *   abstract art standing in for the staff photos a real site would use.)
 */
export default function BeforeProvidersPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#1a2233]">
        Our team
      </h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p, i) => (
          <div
            key={p.slug}
            className="rounded-lg border border-[#d8dce4] bg-white p-6"
          >
            {i < 2 ? (
              // V5: no alt attribute at all.
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img
                src={`/before/provider-${i + 1}.svg`}
                className="h-32 w-full rounded-md object-cover"
              />
            ) : i === 2 ? (
              // V5: alt is a junk filename, worse than nothing.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/before/provider-3.svg"
                alt="IMG_4821.JPG"
                className="h-32 w-full rounded-md object-cover"
              />
            ) : (
              // Remaining cards: decorative image handled correctly even in
              // the before-variant, so the violation count stays at exactly
              // three affected images.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/before/provider-${(i % 3) + 1}.svg`}
                alt=""
                className="h-32 w-full rounded-md object-cover"
              />
            )}
            <h4 className="mt-4 text-lg font-bold text-[#1a2233]">
              {p.name}, {p.credentials}
            </h4>
            <p className="mt-1 text-sm font-medium text-[#5a6478]">{p.role}</p>
            <p className="mt-3 text-[#5a6478]">{p.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
