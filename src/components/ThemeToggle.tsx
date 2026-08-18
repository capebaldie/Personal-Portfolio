"use client";

/**
 * Light/dark switch, styled like every other nav control here: a plain
 * 44px hit target, muted by default, brightens on hover/focus.
 *
 * The icon is one bulb in two states — lit in light mode, filament snapped
 * and glass cracked in dark. Every part renders always; which parts are
 * visible is decided by CSS off [data-theme] (see globals.css), so the
 * correct state is painted by the no-flash script before React hydrates.
 *
 * Deliberately stateless for that reason. Mirroring the mode into React
 * state would mean an empty button until hydration and a server/client
 * markup mismatch to suppress.
 */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode, disabled cookies) — the
      // toggle still works for this visit, it just won't persist.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-foreground"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Glow — retracts into the glass when the bulb goes out. */}
        <g className="bulb-ray">
          <path d="M10 1v1.4" />
          <path d="M3.9 3.9l1 1" />
          <path d="M16.1 3.9l-1 1" />
          <path d="M1.4 10h1.4" />
          <path d="M17.2 10h1.4" />
        </g>

        {/* Glass + screw base — the silhouette never changes, so the state
            reads as "same bulb, broken" rather than "different icon". */}
        <path d="M10 4.2a4.2 4.2 0 0 0-2.4 7.6c.4.3.6.7.6 1.1v.6h3.6v-.6c0-.4.2-.8.6-1.1A4.2 4.2 0 0 0 10 4.2Z" />
        <path d="M8.2 15.4h3.6" />
        <path d="M8.8 17.4h2.4" />

        {/* Filament, taut and lit */}
        <path className="bulb-on" d="M8.5 11.4 9.2 9l.8 1.5.8-1.5.7 2.4" />

        {/* Filament, snapped in two */}
        <g className="bulb-off">
          <path d="M8.5 11.4 9.2 9.6" />
          <path d="M11.5 11.4 10.8 9.8" />
        </g>

        {/* Hairline crack — pathLength=1 normalises the dash maths so it can
            draw itself on with pure CSS, no measuring in JS. */}
        <path
          className="bulb-crack"
          pathLength="1"
          strokeDasharray="1"
          d="M12.9 5.4 11.3 7.2l1.9.5"
        />
      </svg>
    </button>
  );
}
