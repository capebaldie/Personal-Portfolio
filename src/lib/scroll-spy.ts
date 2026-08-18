/**
 * Which sidebar entry is highlighted as you scroll.
 *
 * The DOM half is a plain IntersectionObserver; the decision half is the pure
 * `pickActive` below, so the tricky part is testable without a browser
 * (see scroll-spy.test.ts).
 */

/** The subset of IntersectionObserverEntry this logic actually reads. */
export type SpyEntry = {
  id: string;
  isIntersecting: boolean;
  /** Distance from the viewport top. Negative once a section scrolls past it. */
  top: number;
};

/**
 * Given every observed section's latest state, return the id to highlight.
 *
 * The observer's rootMargin narrows the viewport to a band near the top, so
 * "intersecting" already means "roughly at the reading position". Among those,
 * the highest one wins. When nothing is in the band — mid-scroll through a
 * section taller than the band — we hold the previous value rather than
 * flickering to nothing.
 */
export function pickActive(entries: SpyEntry[], previous: string): string {
  const inBand = entries.filter((e) => e.isIntersecting);
  if (inBand.length === 0) return previous;
  return inBand.reduce((a, b) => (a.top <= b.top ? a : b)).id;
}

/**
 * The last section is usually too short to reach the band, so it would never
 * highlight. Once the page is scrolled to the bottom, the final entry wins
 * regardless of geometry.
 */
export function isAtBottom(
  scrollY: number,
  innerHeight: number,
  scrollHeight: number,
): boolean {
  // 2px of slack: fractional device pixel ratios mean the sum rarely lands
  // exactly on scrollHeight.
  return scrollY + innerHeight >= scrollHeight - 2;
}
