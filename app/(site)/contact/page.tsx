import type { Metadata } from "next";
import { AppointmentForm } from "@/components/appointment-form";
import { Eyebrow, Section } from "@/components/ui";
import { clinic } from "@/content/site";

export const metadata: Metadata = {
  title: "Request an appointment",
  description:
    "Request a physical-therapy appointment at Novagait. We confirm every request by phone within one business day.",
};

export default function ContactPage() {
  return (
    <Section labelledBy="contact-heading">
      <div className="mx-auto max-w-3xl">
        <Eyebrow>Contact</Eyebrow>
        <h1
          id="contact-heading"
          className="text-4xl font-extrabold tracking-tight"
        >
          Request an appointment
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Tell us once. We will not ask you to repeat any of this when we call
          back. Prefer to talk now? Call{" "}
          <a
            href="tel:+15550104820"
            className="font-semibold text-primary underline"
          >
            {clinic.phone}
          </a>
          .
        </p>
        <div className="mt-10">
          <AppointmentForm />
        </div>
      </div>
    </Section>
  );
}
