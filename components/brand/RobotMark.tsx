/**
 * The RoPot face mark: a rounded head with side lugs, two eyes knocked out of
 * the shell, and chopsticks. Drawn as one shape in `currentColor` with the
 * eyes as holes, so it stays correct at any colour or opacity.
 */
// Traced from the "o" of the RoPot wordmark: a wide rounded shell with small
// lugs on each side and two round eyes set low and wide.
const HEAD_AND_EYES = [
  // Shell.
  "M31 26 H69 A23 23 0 0 1 92 49 V52 A6.5 6.5 0 0 1 92 65 V67",
  "A23 23 0 0 1 69 90 H31 A23 23 0 0 1 8 67 V65 A6.5 6.5 0 0 0 8 52 V49",
  "A23 23 0 0 1 31 26 Z",
  // Left eye.
  "M38.5 47.5 a10.5 10.5 0 1 0 0.1 0 Z",
  // Right eye.
  "M61.5 47.5 a10.5 10.5 0 1 0 0.1 0 Z",
].join(" ");

export function RobotMark({
  className,
  withChopsticks = true,
  title,
}: {
  className?: string;
  withChopsticks?: boolean;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      {title ? <title>{title}</title> : null}
      {withChopsticks ? (
        <>
          <rect
            x="47"
            y="0"
            width="5"
            height="30"
            rx="2.5"
            transform="rotate(-26 49.5 15)"
          />
          <rect
            x="57"
            y="0"
            width="5"
            height="30"
            rx="2.5"
            transform="rotate(-11 59.5 15)"
          />
        </>
      ) : null}
      <path fillRule="evenodd" clipRule="evenodd" d={HEAD_AND_EYES} />
    </svg>
  );
}

/** The same head, smiling. Used where the brand gets to be friendlier. */
export function RobotFaceHappy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <rect x="12" y="26" width="76" height="54" rx="24" fill="currentColor" />
      <path
        d="M28 56a8 8 0 0 1 16 0M56 56a8 8 0 0 1 16 0"
        stroke="var(--ropot-eye, #FFF1DE)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}
