export const BLUR_BRUSH_SIZES = {
  small: 28,
  medium: 52,
  large: 88,
} as const;

export type BlurBrushSizeKey = keyof typeof BLUR_BRUSH_SIZES;

export function blurBrushRadius(size: BlurBrushSizeKey): number {
  return BLUR_BRUSH_SIZES[size] / 2;
}

export function clampBrushSizeKey(value: string | null | undefined): BlurBrushSizeKey {
  if (value === "small" || value === "large" || value === "medium") return value;
  return "medium";
}

/**
 * Pixel blur radius scaled to image size so small photos still get strong cover-up.
 */
export function blurRadiusForImage(width: number, height: number): number {
  const shortSide = Math.max(1, Math.min(width, height));
  return Math.max(10, Math.min(36, Math.round(shortSide * 0.045)));
}

export function canvasToJpegBlob(canvas: HTMLCanvasElement, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob && blob.size > 0) {
          resolve(blob);
          return;
        }
        canvas.toBlob((png) => {
          if (png && png.size > 0) resolve(png);
          else reject(new Error("Could not export photo"));
        }, "image/png");
      },
      "image/jpeg",
      quality,
    );
  });
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image for blur"));
    image.src = url;
  });
}

/** Draw a soft circular stamp onto a mask canvas (white = show blur). */
export function stampSoftBrush(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
): void {
  const gradient = context.createRadialGradient(x, y, 0, x, y, Math.max(1, radius));
  gradient.addColorStop(0, "rgba(255,255,255,0.85)");
  gradient.addColorStop(0.55, "rgba(255,255,255,0.45)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

/**
 * Build a fully blurred copy of the source image for heal/airbrush compositing.
 */
export function createBlurredCanvas(
  source: CanvasImageSource,
  width: number,
  height: number,
  blurPx = blurRadiusForImage(width, height),
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not prepare blur layer");
  }
  context.filter = `blur(${blurPx}px)`;
  context.drawImage(source, 0, 0, width, height);
  context.filter = "none";
  return canvas;
}
