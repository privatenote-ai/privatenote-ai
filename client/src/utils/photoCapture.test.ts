import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildPhotoFileName,
  countVideoInputDevices,
  createPhotoFile,
  extensionForImageMime,
  isCapturedPhotoFile,
  toggleCameraFacing,
  videoConstraintsForFacing,
} from "./photoCapture.ts";

describe("photoCapture", () => {
  it("toggles between front and back facing modes", () => {
    assert.equal(toggleCameraFacing("user"), "environment");
    assert.equal(toggleCameraFacing("environment"), "user");
  });

  it("builds a photo filename with a timestamp", () => {
    const name = buildPhotoFileName(new Date("2026-09-02T10:11:12"), "jpg");
    assert.match(name, /^photo-\d{8}-\d{6}\.jpg$/);
  });

  it("maps image mime types to file extensions", () => {
    assert.equal(extensionForImageMime("image/jpeg"), "jpg");
    assert.equal(extensionForImageMime("image/png"), "png");
    assert.equal(extensionForImageMime("image/webp"), "webp");
  });

  it("creates a File with image type and photo name", () => {
    const file = createPhotoFile(new Blob(["abc"], { type: "image/jpeg" }), "image/jpeg");
    assert.equal(file instanceof File, true);
    assert.equal(file.type, "image/jpeg");
    assert.match(file.name, /^photo-.+\.jpg$/);
    assert.equal(isCapturedPhotoFile(file), true);
  });

  it("does not treat unrelated images as captured photos", () => {
    const file = new File(["x"], "holiday.png", { type: "image/png" });
    assert.equal(isCapturedPhotoFile(file), false);
  });

  it("counts video input devices", () => {
    assert.equal(
      countVideoInputDevices([
        { kind: "audioinput" },
        { kind: "videoinput" },
        { kind: "videoinput" },
      ]),
      2,
    );
  });

  it("asks for an ideal facing mode in video constraints", () => {
    const constraints = videoConstraintsForFacing("user");
    assert.deepEqual(constraints.facingMode, { ideal: "user" });
  });
});
