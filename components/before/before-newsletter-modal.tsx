"use client";

/**
 * V7 (seeded): a newsletter popup that appears on its own and traps
 * keyboard focus: Tab and Shift+Tab are swallowed inside the dialog,
 * Escape does nothing, and the close control is a mouse-only span.
 * The dialog also has no accessible name (axe: aria-dialog-name).
 */

import { useEffect, useRef, useState } from "react";

export function BeforeNewsletterModal() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 2500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const box = boxRef.current;
    if (!box) return;
    const input = box.querySelector("input");
    input?.focus();
    function trap(e: KeyboardEvent) {
      // Swallow Tab entirely: focus cannot leave, and Escape is ignored.
      if (e.key === "Tab") {
        e.preventDefault();
      }
    }
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div
        ref={boxRef}
        role="dialog"
        className="w-full max-w-md rounded-lg bg-white p-8"
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <span
          onClick={() => setOpen(false)}
          className="float-right cursor-pointer text-xl leading-none text-[#5a6478]"
        >
          ×
        </span>
        <p className="text-2xl font-extrabold tracking-tight text-[#1a2233]">
          Join our newsletter
        </p>
        <p className="mt-2 text-[#5a6478]">
          Monthly movement tips from the Novagait team.
        </p>
        <div className="mt-5 flex gap-2">
          {/* V1-family styling: placeholder-only input, matching the
              contact form pattern; counted under V7's dialog for the
              reconciliation because it only exists inside this popup. */}
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-md border border-[#d8dce4] px-3 py-2"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md bg-[#4338ca] px-4 py-2 font-semibold text-white"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
