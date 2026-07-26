"use client";

/**
 * V8 (seeded): auto-playing hero carousel that ignores
 * prefers-reduced-motion, with no pause control. The prev/next buttons are
 * icon-only with no accessible name (axe: button-name), which is how these
 * usually ship in the wild.
 */

import { useRef } from "react";

const slides = [
  {
    heading: "Feel better, move better",
    text: "Personalized physical therapy for every stage of recovery.",
    tint: "#e8ebf5",
  },
  {
    heading: "Now offering weekend hours",
    text: "Saturday appointments at our Crescent Park clinic.",
    tint: "#e5f0ee",
  },
  {
    heading: "Ask about our running lab",
    text: "Video gait analysis with same-week reports.",
    tint: "#f3ece5",
  },
];

export function BeforeCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  function nudge(direction: number) {
    // Restart the animation from the clicked slide; deliberately crude.
    const track = trackRef.current;
    if (!track) return;
    track.style.animationDelay = `${direction * -3}s`;
  }

  return (
    <div className="relative overflow-hidden">
      <div ref={trackRef} className="before-carousel-track flex w-full">
        {slides.map((s) => (
          <div
            key={s.heading}
            className="w-full shrink-0 px-6 py-16"
            style={{ backgroundColor: s.tint }}
          >
            <div className="mx-auto max-w-6xl">
              {/* V3: hero text at roughly 2.2:1 on the light slide tints. */}
              <p className="text-4xl font-extrabold tracking-tight text-[#b6bcc9]">
                {s.heading}
              </p>
              <p className="mt-3 max-w-xl text-lg text-[#c3c9d4]">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        onClick={() => nudge(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2"
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5" focusable="false">
          <path
            d="M12 4 L6 10 L12 16"
            fill="none"
            stroke="#1a2233"
            strokeWidth="2.5"
          />
        </svg>
      </button>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        onClick={() => nudge(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2"
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5" focusable="false">
          <path
            d="M8 4 L14 10 L8 16"
            fill="none"
            stroke="#1a2233"
            strokeWidth="2.5"
          />
        </svg>
      </button>
    </div>
  );
}
