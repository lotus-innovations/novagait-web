"use client";

/**
 * V2 (seeded): the service cards are clickable <div>s with a cursor and an
 * onClick, but no role, no tabindex, and no keyboard handler. Mouse users
 * navigate fine; keyboard and switch users cannot reach them at all.
 */

import { useRouter } from "next/navigation";
import { services } from "@/content/site";

export function BeforeServiceCards() {
  const router = useRouter();
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          key={s.slug}
          onClick={() => router.push(`/before/services#${s.slug}`)}
          className="cursor-pointer rounded-lg border border-[#d8dce4] bg-white p-6 hover:border-[#4338ca]"
        >
          <h4 className="text-lg font-bold text-[#1a2233]">{s.name}</h4>
          <p className="mt-2 text-[#5a6478]">{s.summary}</p>
          <p className="mt-3 font-semibold text-[#4338ca]">Learn more</p>
        </div>
      ))}
    </div>
  );
}
