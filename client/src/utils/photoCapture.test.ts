import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  attachStreamToVideoElement,
  buildPhotoFileName,
  countVideoInputDevices,
  createPhotoFile,
  extensionForImageMime,
  isCapturedPhotoFile,
  shouldFallbackToBasicVideoConstraints,
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

  it("retries unconstrained getUserMedia only for constraint errors", () => {
    assert.equal(shouldFallbackToBasicVideoConstraints({ name: "OverconstrainedError" }), true);
    assert.equal(shouldFallbackToBasicVideoConstraints({ name: "NotAllowedError" }), false);
    assert.equal(shouldFallbackToBasicVideoConstraints({ name: "NotFoundError" }), false);
    assert.equal(shouldFallbackToBasicVideoConstraints({ name: "NotReadableError" }), false);
  });

  it("attaches a stream and plays once metadata is already available", async () => {
    const attributes: string[] = [];
    let playCount = 0;
    const video = {
      readyState: 1,
      srcObject: null as MediaStream | null,
      muted: false,
      defaultMuted: false,
      playsInline: false,
      autoplay: false,
      setAttribute(name: string) {
        attributes.push(name);
      },
      addEventListener() {},
      removeEventListener() {},
      play: async () => {
        playCount += 1;
      },
    };
    const stream = { id: "camera" } as MediaStream;
    await attachStreamToVideoElement(video as unknown as HTMLVideoElement, stream);
    assert.equal(video.srcObject, stream);
    assert.equal(video.muted, true);
    assert.equal(video.playsInline, true);
    assert.equal(playCount, 1);
    assert.ok(attributes.includes("muted"));
    assert.ok(attributes.includes("playsinline"));
  });

  it("waits for loadedmetadata before calling play", async () => {
    let onMetadata: (() => void) | undefined;
    let playCount = 0;
    const video = {
      readyState: 0,
      srcObject: null as MediaStream | null,
      muted: false,
      defaultMuted: false,
      playsInline: false,
      autoplay: false,
      setAttribute() {},
      addEventListener(type: string, handler: () => void) {
        if (type === "loadedmetadata") onMetadata = handler;
      },
      removeEventListener() {},
      play: async () => {
        playCount += 1;
      },
    };
    const pending = attachStreamToVideoElement(
      video as unknown as HTMLVideoElement,
      { id: "camera" } as MediaStream,
      { metadataTimeoutMs: 5_000 },
    );
    assert.equal(playCount, 0);
    assert.equal(typeof onMetadata, "function");
    onMetadata?.();
    await pending;
    assert.equal(playCount, 1);
  });

  it("does not reject when video.play fails", async () => {
    const video = {
      readyState: 1,
      srcObject: null as MediaStream | null,
      muted: false,
      defaultMuted: false,
      playsInline: false,
      autoplay: false,
      setAttribute() {},
      addEventListener() {},
      removeEventListener() {},
      play: async () => {
        throw new Error("NotAllowedError");
      },
    };
    await attachStreamToVideoElement(
      video as unknown as HTMLVideoElement,
      { id: "camera" } as MediaStream,
    );
    assert.equal((video.srcObject as { id: string }).id, "camera");
  });
});
