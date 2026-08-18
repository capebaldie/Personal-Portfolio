/**
 * Refreshes the vendored GitHub contribution chart.
 *
 * Runs as `prebuild`, so every deploy picks up fresh data when the upstream
 * service cooperates. It deliberately never fails the build: ghchart's latency
 * swings from 5s to 110s for the same URL, so on a timeout or an error the
 * committed copy from the last successful run is simply left in place.
 */
import { writeFile } from "node:fs/promises";

const USER = "capebaldie";
const DEST = new URL("../src/data/contributions.svg", import.meta.url);

try {
  const res = await fetch(`https://ghchart.rshah.org/${USER}`, {
    signal: AbortSignal.timeout(25_000),
  });
  const svg = await res.text();
  if (!res.ok || !svg.includes("<svg")) throw new Error(`bad response ${res.status}`);
  await writeFile(DEST, svg);
  console.log(`contribution chart: refreshed (${svg.length} bytes)`);
} catch (err) {
  console.log(`contribution chart: keeping vendored copy (${err.message})`);
}
