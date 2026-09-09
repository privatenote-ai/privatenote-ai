import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FULL_IMAGE_CROP,
  clampCropRect,
  isFullImageCrop,
} from "./photoCrop.ts";

describe("photoCrop", () => {
  it("clamps crop rectangles into the image bounds", () => {
    assert.deepEqual(
      clampCropRect({ x: -0.2, y: 0.1, width: 1.5, height: 0.5 }),
      { x: 0, y: 0.1, width: 1, height: 0.5 },
    );
  });

  it("enforces a minimum crop size", () => {
    const clamped = clampCropRect({ x: 0.4, y: 0.4, width: 0.01, height: 0.01 });
    assert.ok(clamped.width >= 0.08);
    assert.ok(clamped.height >= 0.08);
    assert.ok(clamped.x + clamped.width <= 1);
    assert.ok(clamped.y + clamped.height <= 1);
  });

  it("detects a full-image crop", () => {
    assert.equal(isFullImageCrop(FULL_IMAGE_CROP), true);
    assert.equal(isFullImageCrop({ x: 0.1, y: 0, width: 0.9, height: 1 }), false);
  });
});
