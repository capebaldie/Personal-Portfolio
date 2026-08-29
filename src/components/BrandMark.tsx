import * as si from "simple-icons";

/**
 * Brand marks, drawn from `simple-icons` so the paths are the official ones
 * rather than something approximated by hand.
 *
 * Keys are the strings used in `content.ts` — anything not listed here simply
 * renders without a mark, which is the correct outcome for the entries that
 * have no brand at all ("Zero-dep", "TUI") and for Codex, whose icon OpenAI
 * never accepted into the set.
 *
 * The map only needs `path` and `hex`, which is what lets LinkedIn be
 * vendored below as a literal — its icon was removed from simple-icons at
 * LinkedIn's request, so the path comes from their own brand resources.
 */
const ICONS: Record<string, Pick<si.SimpleIcon, "path" | "hex"> | undefined> = {
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
  // GLSL is the OpenGL Shading Language — the OpenGL mark is its brand.
  GLSL: si.siOpengl,
  GitHub: si.siGithub,
  LinkedIn: {
    hex: "0A66C2",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  },
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
