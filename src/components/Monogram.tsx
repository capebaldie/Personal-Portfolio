import { profile } from "@/data/content";

/**
 * Initials in the display face, interlocked, in a hairline square. It sits in
 * the sidebar's empty lower rail purely to give that end of the column some
 * weight — it's an anchor, not a feature, so it never animates and never
 * becomes a link.
 *
 * Typographic rather than a drawn SVG on purpose: the identity already has a
 * display face with a point of view, and a hand-drawn mark would only compete
 * with it.
 */
export function Monogram() {
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <span
      aria-hidden="true"
      className="display flex h-10 w-10 items-center justify-center border border-line text-sm tracking-[-0.08em] text-muted"
    >
      {initials}
    </span>
  );
}
