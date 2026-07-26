"use client";

/**
 * V1 (seeded): every input is placeholder-labeled only; there is not a
 * single <label> on this form (axe: label / select-name).
 * V10 (seeded): validation failures are shown by turning the field border
 * red. No text, no aria-invalid, no announcement: color alone.
 * V12 (seeded): the form re-asks for the name and phone number it already
 * collected ("confirm" fields), violating WCAG 2.2 3.3.7 Redundant Entry.
 */

import { useState } from "react";
import { locations, services } from "@/content/site";

const inputClass =
  "mt-4 block w-full rounded-md border px-3 py-2 text-[#1a2233]";

export function BeforeForm() {
  const [bad, setBad] = useState<Set<string>>(new Set());
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextBad = new Set<string>();
    for (const key of [
      "name",
      "nameConfirm",
      "phone",
      "phoneConfirm",
      "service",
      "location",
    ]) {
      if (!String(data.get(key) ?? "").trim()) nextBad.add(key);
    }
    setBad(nextBad);
    if (nextBad.size === 0) setSent(true);
  }

  const border = (key: string) =>
    bad.has(key) ? "border-[#dc2626] border-2" : "border-[#d8dce4]";

  if (sent) {
    return (
      <p className="rounded-md bg-[#f4f6f9] p-6 font-semibold text-[#1a2233]">
        Thanks! We got your request.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <input
        name="name"
        type="text"
        placeholder="Name"
        className={`${inputClass} ${border("name")}`}
      />
      {/* V12: re-asking for information just provided. */}
      <input
        name="nameConfirm"
        type="text"
        placeholder="Confirm your name"
        className={`${inputClass} ${border("nameConfirm")}`}
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone"
        className={`${inputClass} ${border("phone")}`}
      />
      {/* V12: and again. */}
      <input
        name="phoneConfirm"
        type="tel"
        placeholder="Re-enter phone"
        className={`${inputClass} ${border("phoneConfirm")}`}
      />
      <select
        name="service"
        defaultValue=""
        className={`${inputClass} ${border("service")}`}
      >
        <option value="" disabled>
          Service
        </option>
        {services.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
      </select>
      <select
        name="location"
        defaultValue=""
        className={`${inputClass} ${border("location")}`}
      >
        <option value="" disabled>
          Location
        </option>
        {locations.map((l) => (
          <option key={l.slug} value={l.slug}>
            {l.name}
          </option>
        ))}
      </select>
      <textarea
        name="notes"
        placeholder="Notes"
        rows={4}
        className={`${inputClass} border-[#d8dce4]`}
      />
      <button
        type="submit"
        className="mt-6 rounded-md bg-[#4338ca] px-6 py-3 font-semibold text-white"
      >
        Submit
      </button>
    </form>
  );
}
