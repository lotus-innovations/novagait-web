import { locations } from "@/content/site";

/**
 * BEFORE locations page. No page-specific seeded violations; the
 * chrome-level ones (V3b, V4, V9, V11) apply here as everywhere. This page
 * exists so the sticky-header focus-obscuring (V11) has a long page of
 * links to demonstrate against.
 */
export default function BeforeLocationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#1a2233]">
        Locations
      </h1>
      <div className="mt-8 space-y-12">
        {locations.map((l) => (
          <div key={l.slug} id={l.slug}>
            <h4 className="text-2xl font-bold text-[#1a2233]">{l.name}</h4>
            <p className="mt-2 whitespace-pre-line text-[#5a6478]">
              {l.address.join("\n")}
            </p>
            <p className="mt-1 text-[#5a6478]">{l.phone}</p>
            <table className="mt-4 w-full max-w-md border-collapse text-left">
              <tbody>
                {l.hours.map((h) => (
                  <tr key={h.days}>
                    <td className="border-b border-[#d8dce4] py-2 pr-4 text-[#5a6478]">
                      {h.days}
                    </td>
                    <td className="border-b border-[#d8dce4] py-2 text-[#5a6478]">
                      {h.open}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
