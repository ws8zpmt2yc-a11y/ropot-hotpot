import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`eyebrow inline-flex items-center gap-2.5 ${className}`}>
      <span className="h-px w-6 bg-current opacity-50" />
      {children}
    </span>
  );
}

export function Chilli({
  filled,
  className = "",
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M12.4 5.6c1.6-2 4.4-2.3 5.6-1 .5.6-.3 1.3-1.2 1-.9-.3-2 .2-2.6 1.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity={filled ? 1 : 0.45}
      />
      <path
        d="M13.8 7.4c2 1.4 2.6 4.6 1.3 7.7-1.4 3.3-4.4 5.4-6.8 4.8-2.2-.6-3-3-2-5.8 1-2.9 4.2-7.5 7.5-6.7Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        opacity={filled ? 1 : 0.45}
      />
    </svg>
  );
}

export function StatusDot({
  busy,
  className = "",
}: {
  busy: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex h-2.5 w-2.5 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <span
        className={`absolute inset-0 rounded-full ${
          busy ? "bg-amber" : "bg-jade"
        }`}
        style={{ animation: "pulse-dot 1.6s ease-in-out infinite" }}
      />
    </span>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <span className={`block h-px w-full bg-current opacity-15 ${className}`} />;
}

/** Big pull-quote style section heading used across the marketing pages. */
export function SectionHeading({
  eyebrow,
  children,
  className = "",
}: {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow ? <Eyebrow className="opacity-70">{eyebrow}</Eyebrow> : null}
      <h2 className="display-lg mt-4 uppercase">{children}</h2>
    </div>
  );
}
