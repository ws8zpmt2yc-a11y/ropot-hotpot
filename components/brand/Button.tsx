import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "cream" | "outline" | "ghost" | "ink";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-red-bright text-cream hover:bg-red-glow shadow-[0_10px_26px_-12px_rgba(214,36,36,0.9)]",
  cream:
    "bg-cream text-red-brand hover:bg-warm-white shadow-[0_10px_26px_-14px_rgba(0,0,0,0.6)]",
  outline:
    "border-2 border-current bg-transparent hover:bg-current/10",
  ghost: "bg-black/5 text-ink hover:bg-black/10",
  ink: "bg-ink text-cream hover:bg-ink-soft",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.7rem] tracking-[0.14em]",
  md: "h-12 px-6 text-[0.78rem] tracking-[0.15em]",
  lg: "h-14 px-8 text-[0.85rem] tracking-[0.15em]",
};

const BASE =
  "press inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-current";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & ComponentProps<"button">) {
  return (
    <button
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
