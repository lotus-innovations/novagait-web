import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
      {children}
    </p>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "quiet";
}) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-6 py-3 font-semibold no-underline";
  if (variant === "quiet") {
    return (
      <Link
        href={href}
        className={`${base} border border-border text-primary hover:text-primary-hover hover:border-primary`}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} bg-button text-on-primary hover:bg-button-hover`}
    >
      {children}
    </Link>
  );
}

export function Section({
  children,
  surface = false,
  labelledBy,
}: {
  children: ReactNode;
  surface?: boolean;
  labelledBy: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={surface ? "bg-surface py-16 sm:py-20" : "py-16 sm:py-20"}
    >
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}
