import assert from "node:assert/strict";
import { pickActive, isAtBottom, type SpyEntry } from "./scroll-spy.ts";

const e = (id: string, isIntersecting: boolean, top: number): SpyEntry => ({
  id,
  isIntersecting,
  top,
});

// Single section in the band → that one.
assert.equal(pickActive([e("a", true, 40)], "overview"), "a");

// Two in the band → the higher one (smaller top) wins.
assert.equal(
  pickActive([e("a", true, 120), e("b", true, 20)], "overview"),
  "b",
);

// Non-intersecting sections are ignored even when they're higher up.
assert.equal(
  pickActive([e("a", false, -400), e("b", true, 60)], "overview"),
  "b",
);

// Nothing in the band → hold the previous value, don't flicker to empty.
assert.equal(pickActive([e("a", false, -900)], "stack"), "stack");
assert.equal(pickActive([], "stack"), "stack");

// Ties resolve deterministically to the first entry in document order.
assert.equal(pickActive([e("a", true, 50), e("b", true, 50)], "x"), "a");

// Bottom detection, including the fractional-pixel slack.
assert.equal(isAtBottom(0, 800, 2000), false);
assert.equal(isAtBottom(1200, 800, 2000), true);
assert.equal(isAtBottom(1199, 800, 2000), true); // within 2px slack
assert.equal(isAtBottom(1100, 800, 2000), false);

console.log("scroll-spy: all checks passed");
