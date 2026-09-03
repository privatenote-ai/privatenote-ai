import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BLUR_BRUSH_SIZES,
  blurBrushRadius,
  blurRadiusForImage,
  clampBrushSizeKey,
} from "./photoBlur.ts";

describe("photoBlur", () => {
  it("clamps brush size keys", () => {
    assert.equal(clampBrushSizeKey("small"), "small");
    assert.equal(clampBrushSizeKey("large"), "large");
    assert.equal(clampBrushSizeKey("nope"), "medium");
    assert.equal(clampBrushSizeKey(undefined), "medium");
  });

  it("exposes brush radii from size keys", () => {
    assert.equal(blurBrushRadius("small"), BLUR_BRUSH_SIZES.small / 2);
    assert.equal(blurBrushRadius("medium"), BLUR_BRUSH_SIZES.medium / 2);
    assert.equal(blurBrushRadius("large"), BLUR_BRUSH_SIZES.large / 2);
  });

  it("scales image blur radius with short side", () => {
    assert.ok(blurRadiusForImage(200, 200) >= 10);
    assert.ok(blurRadiusForImage(2000, 2000) <= 36);
    assert.ok(blurRadiusForImage(2000, 2000) > blurRadiusForImage(200, 200));
  });
});
