import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { medianSecondsFromHistogram, addEngagedMsToHistogram, emptyEngagedHistogram } from "./engagedTime";

describe("engaged-time histogram", () => {
  it("approximates a median without storing per-visit durations", () => {
    let histogram = emptyEngagedHistogram();
    histogram = addEngagedMsToHistogram(histogram, 2_000);
    histogram = addEngagedMsToHistogram(histogram, 4_000);
    histogram = addEngagedMsToHistogram(histogram, 20_000);
    histogram = addEngagedMsToHistogram(histogram, 40_000);
    histogram = addEngagedMsToHistogram(histogram, 120_000);
    const median = medianSecondsFromHistogram(histogram);
    assert.ok(median != null);
    assert.ok(median >= 5 && median <= 60);
  });

  it("returns null for an empty histogram", () => {
    assert.equal(medianSecondsFromHistogram(emptyEngagedHistogram()), null);
  });
});
