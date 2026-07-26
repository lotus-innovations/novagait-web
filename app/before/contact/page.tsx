import { BeforeForm } from "@/components/before/before-form";
import { clinic } from "@/content/site";

/**
 * BEFORE contact page. Seeded violations on this page:
 * - V1:  inputs with no labels (placeholder-only)
 * - V10: errors shown by border color alone
 * - V12: redundant entry (confirm-name, re-enter-phone)
 */
export default function BeforeContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#1a2233]">
        Contact us
      </h1>
      <p className="mt-3 text-[#5a6478]">
        Fill out the form and our front desk will call you back. Or call{" "}
        {clinic.phone}.
      </p>
      <div className="mt-8">
        <BeforeForm />
      </div>
    </div>
  );
}
