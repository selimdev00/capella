import type { CSSProperties } from "react";

/**
 * Counts from 0 to `value` purely in CSS (animated @property integer rendered
 * via a counter). Because it is CSS, the count starts on first paint - in sync
 * with the mount reveal - with no JS, no hydration delay, and no flash.
 * The real value is exposed to assistive tech via aria-label.
 */
export function CountUp({ value }: { value: number }) {
  return (
    <span
      className="countup"
      style={{ "--count-target": value } as CSSProperties}
      aria-label={String(value)}
    />
  );
}
