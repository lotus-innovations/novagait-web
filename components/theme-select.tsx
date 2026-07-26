"use client";

import { useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";

const THEME_EVENT = "novagait-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Theme {
  const stored = window.localStorage.getItem("novagait-theme");
  return stored === "light" || stored === "dark" ? stored : "system";
}

export function ThemeSelect() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "system");

  function apply(next: Theme) {
    const root = document.documentElement;
    if (next === "system") {
      root.removeAttribute("data-theme");
      window.localStorage.removeItem("novagait-theme");
    } else {
      root.setAttribute("data-theme", next);
      window.localStorage.setItem("novagait-theme", next);
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="text-sm text-fg-muted">
        Theme
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => apply(e.target.value as Theme)}
        className="min-h-11 rounded-md border border-border bg-bg px-2 text-sm text-fg"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
