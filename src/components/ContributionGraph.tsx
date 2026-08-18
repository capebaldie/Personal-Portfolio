import { readFile } from "node:fs/promises";
import path from "node:path";
import { profile } from "@/data/content";

const USERNAME = new URL(profile.socials[0].href).pathname.replace("/", "");
const VENDORED = path.join(process.cwd(), "src/data/contributions.svg");

/**
 * ghchart hands back a fixed-size SVG in GitHub's green, with a hardcoded
 * light-grey for empty days — correct on the light ground, a bright grid on
 * the dark one. So rather than hotlinking it as an <img>, the SVG is read on
 * the server and its six fills are rewritten to CSS variables: both themes
 * correct, and no third-party asset loading in the visitor's browser.
 *
 * It reads from disk rather than fetching, because the upstream service is
 * unreliable — the same URL measured 5s and 110s minutes apart, and a build
 * that fetched it either stalled for minutes or timed out and silently
 * dropped the section. `scripts/refresh-chart.mjs` runs as `prebuild` and
 * updates the vendored copy whenever the service cooperates, so the graph is
 * always present and at worst as old as the last successful refresh.
 */
const FILL_MAP: Record<string, string> = {
  "#eeeeee": "var(--chart-0)", // no contributions
  "#c6e48b": "var(--chart-1)",
  "#7bc96f": "var(--chart-2)",
  "#239a3b": "var(--chart-3)",
  "#196127": "var(--chart-4)", // busiest
  "#767676": "var(--muted)", // month and weekday labels
};

async function loadChart() {
  try {
    const raw = await readFile(VENDORED, "utf8");
    return raw.includes("<svg") ? raw : null;
  } catch {
    // No vendored copy yet — render nothing rather than a broken figure.
    return null;
  }
}

function prepare(raw: string) {
  const svg = raw
    // Inline SVG in an HTML document takes no XML prolog or doctype.
    .replace(/<\?xml[^>]*\?>/, "")
    .replace(/<!DOCTYPE[^>]*>/, "")
    // The source has fixed width/height and no viewBox, so it can't scale.
    .replace(
      /<svg([^>]*?)width="(\d+)"\s+height="(\d+)"/,
      '<svg$1viewBox="0 0 $2 $3" width="100%" height="auto" preserveAspectRatio="xMinYMid meet"',
    );

  const recoloured = Object.entries(FILL_MAP).reduce(
    (acc, [hex, token]) => acc.replaceAll(hex, token),
    svg,
  );

  const activeDays = [...raw.matchAll(/data-score="([1-9])"/g)].length;
  return { svg: recoloured, activeDays };
}

export async function ContributionGraph() {
  const raw = await loadChart();
  if (!raw) return null;

  const { svg, activeDays } = prepare(raw);

  return (
    <figure className="mt-12">
      <figcaption className="font-mono text-xs text-muted">
        Contribution activity · past year
      </figcaption>
      <div
        role="img"
        aria-label={`GitHub contribution graph for ${USERNAME}: ${activeDays} days with contributions in the past year.`}
        // Horizontal scroll on narrow screens rather than squashing 53 weeks
        // of cells into 320px, where they'd stop being readable.
        className="mt-3 -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="mt-3 font-mono text-xs text-muted">
        {activeDays} active days ·{" "}
        <a
          href={profile.socials[0].href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-foreground"
        >
          @{USERNAME}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>
    </figure>
  );
}
