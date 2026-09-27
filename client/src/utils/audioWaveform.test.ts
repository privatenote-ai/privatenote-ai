import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  downsamplePeaks,
  peaksFromChannelData,
  peaksFromFrequencyBins,
  placeholderPeaks,
} from "./audioWaveform.ts";

describe("audioWaveform", () => {
  it("returns a quiet floor for empty samples", () => {
    const peaks = peaksFromChannelData(new Float32Array(), 8);
    assert.equal(peaks.length, 8);
    assert.ok(peaks.every((value) => value === 0.08));
  });

  it("normalizes loud buckets toward 1 and keeps a floor", () => {
    const samples = new Float32Array(16);
    for (let i = 8; i < 16; i++) samples[i] = 1;
    const peaks = peaksFromChannelData(samples, 2);
    assert.equal(peaks.length, 2);
    assert.ok(peaks[0]! >= 0.06);
    assert.ok(peaks[1]! > peaks[0]!);
    assert.ok(peaks[1]! <= 1);
  });

  it("downsamples by keeping the loudest value in each bucket", () => {
    const down = downsamplePeaks([0.1, 0.9, 0.2, 0.4], 2);
    assert.deepEqual(down, [0.9, 0.4]);
  });

  it("builds a speech-shaped placeholder that stays in range", () => {
    const peaks = placeholderPeaks(24);
    assert.equal(peaks.length, 24);
    assert.ok(peaks.every((value) => value >= 0.08 && value <= 1));
    const mid = peaks[12]!;
    assert.ok(mid > peaks[0]!);
    assert.ok(mid > peaks[23]!);
  });

  it("maps analyser frequency bins into visible bars", () => {
    const bins = new Uint8Array(32);
    bins.fill(20, 0, 8);
    bins.fill(200, 8, 16);
    const peaks = peaksFromFrequencyBins(bins, 4);
    assert.equal(peaks.length, 4);
    assert.ok(peaks.every((value) => value >= 0.07 && value <= 1));
    assert.ok(peaks[2]! > peaks[0]!);
  });
});
