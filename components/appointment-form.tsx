"use client";

import { useEffect, useRef, useState } from "react";
import { locations, providers, services } from "@/content/site";

type FieldErrors = Partial<Record<FieldName, string>>;
type FieldName = "name" | "phone" | "service" | "location" | "timeWindow";

const fieldLabels: Record<FieldName, string> = {
  name: "Your name",
  phone: "Phone number",
  service: "Service",
  location: "Clinic",
  timeWindow: "Preferred time of day",
};

const timeWindows = [
  { value: "mornings", label: "Mornings (before 12 pm)" },
  { value: "afternoons", label: "Afternoons (12 pm to 5 pm)" },
  { value: "evenings", label: "Evenings (after 5 pm)" },
  { value: "any", label: "Any time works" },
];

export function AppointmentForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "success"; reference: string }
    | { kind: "failed" }
  >({ kind: "idle" });
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorCount = Object.keys(errors).length;

  // Focus management runs after commit so the target node exists: the
  // error summary on failed validation, the confirmation heading on success.
  useEffect(() => {
    if (errorCount > 0) summaryRef.current?.focus();
  }, [errorCount, errors]);
  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
  }, [status.kind]);

  function validate(data: FormData): FieldErrors {
    const next: FieldErrors = {};
    if (!String(data.get("name") ?? "").trim()) {
      next.name = "Enter your name so we know who to call back.";
    }
    const phone = String(data.get("phone") ?? "").trim();
    if (!phone) {
      next.phone = "Enter a phone number so we can reach you.";
    } else {
      const digits = phone.replace(/\D/g, "");
      if (
        digits.length < 7 ||
        digits.length > 15 ||
        /[^\d\s+().-]/.test(phone)
      ) {
        next.phone =
          "Enter a phone number using digits, for example (555) 010-4820.";
      }
    }
    if (!String(data.get("service") ?? "")) {
      next.service = "Choose the service you are looking for.";
    }
    if (!String(data.get("location") ?? "")) {
      next.location = "Choose the clinic you want to visit.";
    }
    if (!String(data.get("timeWindow") ?? "")) {
      next.timeWindow = "Choose the time of day that usually works for you.";
    }
    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ kind: "idle" });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      const json = (await res.json()) as { ok: boolean; reference?: string };
      if (!res.ok || !json.ok || !json.reference) {
        setStatus({ kind: "failed" });
        return;
      }
      setStatus({ kind: "success", reference: json.reference });
    } catch {
      setStatus({ kind: "failed" });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="rounded-lg border border-border bg-surface p-8">
        <h2
          ref={successRef}
          tabIndex={-1}
          className="text-2xl font-extrabold tracking-tight"
        >
          Request received: reference {status.reference}
        </h2>
        <p className="mt-3 max-w-prose text-fg-muted">
          Thank you. The front desk will call you within one business day to
          confirm a time. Keep the reference number handy if you call us first.
        </p>
        <p className="mt-3 max-w-prose text-sm text-fg-muted">
          This is a demonstration: no appointment was created and nothing you
          entered was stored.
        </p>
      </div>
    );
  }

  const errorEntries = Object.entries(errors) as [FieldName, string][];

  return (
    <form onSubmit={onSubmit} noValidate>
      {errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-8 rounded-lg border-2 border-error p-5"
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-error">
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M10 2 L19 17 H1 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M10 8 v4 M10 14.5 v.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            There{" "}
            {errorEntries.length === 1
              ? "is 1 problem"
              : `are ${errorEntries.length} problems`}{" "}
            with your request
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a href={`#field-${field}`} className="text-error underline">
                  {fieldLabels[field]}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status.kind === "failed" && (
        <div role="alert" className="mb-8 rounded-lg border-2 border-error p-5">
          <p className="font-bold text-error">
            Your request did not go through. Nothing was saved. Please try
            again, or call us at (555) 010-4820.
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="field-name" className="block font-semibold">
            Your name
          </label>
          <input
            id="field-name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "error-name" : undefined}
            className="mt-2 block min-h-11 w-full rounded-md border border-border bg-bg px-3 py-2"
          />
          {errors.name && (
            <p
              id="error-name"
              className="mt-2 flex items-start gap-1 text-sm font-semibold text-error"
            >
              Error: {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="field-phone" className="block font-semibold">
            Phone number
          </label>
          <p id="hint-phone" className="mt-1 text-sm text-fg-muted">
            We confirm every request by phone.
          </p>
          <input
            id="field-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-describedby={
              errors.phone ? "hint-phone error-phone" : "hint-phone"
            }
            aria-invalid={errors.phone ? true : undefined}
            className="mt-2 block min-h-11 w-full rounded-md border border-border bg-bg px-3 py-2"
          />
          {errors.phone && (
            <p
              id="error-phone"
              className="mt-2 flex items-start gap-1 text-sm font-semibold text-error"
            >
              Error: {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="field-service" className="block font-semibold">
            Service
          </label>
          <select
            id="field-service"
            name="service"
            defaultValue=""
            aria-invalid={errors.service ? true : undefined}
            aria-describedby={errors.service ? "error-service" : undefined}
            className="mt-2 block min-h-11 w-full rounded-md border border-border bg-bg px-3 py-2"
          >
            <option value="" disabled>
              Choose a service
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
            <option value="unsure">Not sure, help me choose</option>
          </select>
          {errors.service && (
            <p
              id="error-service"
              className="mt-2 flex items-start gap-1 text-sm font-semibold text-error"
            >
              Error: {errors.service}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="field-location" className="block font-semibold">
            Clinic
          </label>
          <select
            id="field-location"
            name="location"
            defaultValue=""
            aria-invalid={errors.location ? true : undefined}
            aria-describedby={errors.location ? "error-location" : undefined}
            className="mt-2 block min-h-11 w-full rounded-md border border-border bg-bg px-3 py-2"
          >
            <option value="" disabled>
              Choose a clinic
            </option>
            {locations.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.name}
              </option>
            ))}
          </select>
          {errors.location && (
            <p
              id="error-location"
              className="mt-2 flex items-start gap-1 text-sm font-semibold text-error"
            >
              Error: {errors.location}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="field-provider" className="block font-semibold">
            Provider preference{" "}
            <span className="font-normal text-fg-muted">(optional)</span>
          </label>
          <select
            id="field-provider"
            name="provider"
            defaultValue=""
            className="mt-2 block min-h-11 w-full rounded-md border border-border bg-bg px-3 py-2"
          >
            <option value="">No preference</option>
            {providers.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}, {p.credentials}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="font-semibold">Preferred time of day</legend>
          <div
            aria-describedby={
              errors.timeWindow ? "error-timeWindow" : undefined
            }
            className="mt-2 space-y-1"
          >
            {timeWindows.map((t) => (
              <label
                key={t.value}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 hover:bg-surface"
              >
                <input
                  type="radio"
                  name="timeWindow"
                  value={t.value}
                  id={t.value === "mornings" ? "field-timeWindow" : undefined}
                  className="h-5 w-5 accent-[var(--button-bg)]"
                />
                {t.label}
              </label>
            ))}
          </div>
          {errors.timeWindow && (
            <p
              id="error-timeWindow"
              className="mt-2 flex items-start gap-1 text-sm font-semibold text-error"
            >
              Error: {errors.timeWindow}
            </p>
          )}
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="field-notes" className="block font-semibold">
            Anything else{" "}
            <span className="font-normal text-fg-muted">(optional)</span>
          </label>
          <p id="hint-notes" className="mt-1 text-sm text-fg-muted">
            Please do not include medical details here; save those for your
            first visit.
          </p>
          <textarea
            id="field-notes"
            name="notes"
            rows={4}
            aria-describedby="hint-notes"
            className="mt-2 block w-full rounded-md border border-border bg-bg px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status.kind === "submitting"}
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-button px-6 py-3 font-semibold text-on-primary hover:bg-button-hover disabled:opacity-60"
      >
        {status.kind === "submitting" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
