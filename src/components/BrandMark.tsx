import * as si from "simple-icons";

/**
 * Brand marks, drawn from `simple-icons` so the paths are the official ones
 * rather than something approximated by hand.
 *
 * Keys are the strings used in `content.ts` — anything not listed here simply
 * renders without a mark, which is the correct outcome for the entries that
 * have no brand at all ("Zero-dep", "TUI") and for LinkedIn and Codex, whose
 * icons aren't in the set — LinkedIn's was removed at their request, and
 * OpenAI's was never accepted.
 */
const ICONS: Record<string, si.SimpleIcon | undefined> = {
  JavaScript: si.siJavascript,
  HTML: si.siHtml5,
  TypeScript: si.siTypescript,
  React: si.siReact,
  "Next.js": si.siNextdotjs,
  Astro: si.siAstro,
  "Node.js": si.siNodedotjs,
  Python: si.siPython,
  Tailwind: si.siTailwindcss,
  CSS: si.siCss,
  "Framer Motion": si.siFramer,
  Payload: si.siPayloadcms,
  HTMX: si.siHtmx,
  SQLite: si.siSqlite,
  Postgres: si.siPostgresql,
  Redis: si.siRedis,
  FastAPI: si.siFastapi,
  Prisma: si.siPrisma,
  Git: si.siGit,
  Docker: si.siDocker,
  Vercel: si.siVercel,
  Vitest: si.siVitest,
  "Claude Code": si.siClaudecode,
  Figma: si.siFigma,
  Rust: si.siRust,
  WebGL: si.siWebgl,
  GitHub: si.siGithub,
  X: si.siX,
  Cloudflare: si.siCloudflare,
};

/** Perceived lightness, 0–1. Enough to spot the brands drawn in near-black. */
function luminance(hex: string) {
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/**
 * The hover colour, per theme. Roughly a third of these marks are drawn in
 * black or near-black (Next.js, X, Payload, Rust, GitHub, SQLite) and would
 * vanish into the dark ground, so those fall back to the foreground — still a
 * visible change from the muted rest state, just not an invisible one.
 */
function hoverVars(hex: string) {
  const dark = luminance(hex) < 0.12 ? "var(--foreground)" : `#${hex}`;
  return { "--brand-l": `#${hex}`, "--brand-d": dark } as React.CSSProperties;
}

export function BrandMark({
  name,
  size = 14,
}: {
  name: string;
  size?: number;
}) {
  const icon = ICONS[name];
  if (!icon) return null;

  return (
    <svg
      role="img"
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={hoverVars(icon.hex)}
      className={`brand shrink-0`}
    >
      <path d={icon.path} />
    </svg>
  );
}

/** True when a mark exists — lets callers keep spacing honest without one. */
export const hasMark = (name: string) => Boolean(ICONS[name]);
