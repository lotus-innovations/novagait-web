import { BeforeServiceCards } from "@/components/before/before-service-cards";
import { services } from "@/content/site";

/**
 * BEFORE services page. Seeded violations on this page:
 * - V2: clickable <div> cards with no role or keyboard support
 * - V6 continues: heading levels jump around
 */
export default function BeforeServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#1a2233]">
        Services
      </h1>
      <BeforeServiceCards />
      <div className="mt-14 space-y-10">
        {services.map((s) => (
          <div key={s.slug} id={s.slug}>
            <h4 className="text-2xl font-bold text-[#1a2233]">{s.name}</h4>
            <p className="mt-3 max-w-prose text-[#5a6478]">{s.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
