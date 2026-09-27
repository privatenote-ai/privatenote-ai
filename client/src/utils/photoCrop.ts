/** Normalized crop rectangle in image-space units (0–1). */
export type ImageCropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const FULL_IMAGE_CROP: ImageCropRect = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
};

const MIN_CROP_RATIO = 0.08;

export function clampCropRect(rect: ImageCropRect): ImageCropRect {
  const width = Math.min(1, Math.max(MIN_CROP_RATIO, rect.width));
  const height = Math.min(1, Math.max(MIN_CROP_RATIO, rect.height));
  const x = Math.min(1 - width, Math.max(0, rect.x));
  const y = Math.min(1 - height, Math.max(0, rect.y));
  return { x, y, width, height };
}

export function isFullImageCrop(rect: ImageCropRect, epsilon = 0.002): boolean {
  return (
    rect.x <= epsilon &&
    rect.y <= epsilon &&
    rect.width >= 1 - epsilon &&
    rect.height >= 1 - epsilon
  );
}

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image for cropping"));
    };
    image.src = url;
  });
}

/**
 * Crops an image blob to the given normalized rectangle and re-encodes as JPEG
 * (PNG fallback). Re-encoding also drops any leftover container metadata.
 */
export async function cropImageBlob(
  source: Blob,
  crop: ImageCropRect,
  quality = 0.92,
): Promise<Blob> {
  const rect = clampCropRect(crop);
  if (isFullImageCrop(rect) && source.type === "image/jpeg" && source.size > 0) {
    return source;
  }

  const image = await loadImageFromBlob(source);
  const naturalWidth = image.naturalWidth || image.width;
  const naturalHeight = image.naturalHeight || image.height;
  if (naturalWidth <= 0 || naturalHeight <= 0) {
    throw new Error("Image has no dimensions");
  }

  const sx = Math.round(rect.x * naturalWidth);
  const sy = Math.round(rect.y * naturalHeight);
  const sw = Math.max(1, Math.round(rect.width * naturalWidth));
  const sh = Math.max(1, Math.round(rect.height * naturalHeight));
  const width = Math.min(sw, naturalWidth - sx);
  const height = Math.min(sh, naturalHeight - sy);
  if (width <= 0 || height <= 0) {
    throw new Error("Invalid crop size");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not crop photo");
  }
  context.drawImage(image, sx, sy, width, height, 0, 0, width, height);

  const jpeg = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((next) => resolve(next), "image/jpeg", quality);
  });
  if (jpeg && jpeg.size > 0) return jpeg;

  const png = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((next) => resolve(next), "image/png");
  });
  if (png && png.size > 0) return png;
  throw new Error("Could not crop photo");
}
