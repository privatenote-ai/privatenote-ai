import { useCallback, useEffect, useRef, useState } from "react";
import {
  FULL_IMAGE_CROP,
  clampCropRect,
  type ImageCropRect,
} from "@/utils/photoCrop";

type DragMode =
  | "move"
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw";

type DisplayRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type PhotoCropEditorProps = {
  imageUrl: string;
  crop: ImageCropRect;
  onCropChange: (crop: ImageCropRect) => void;
  ariaLabel?: string;
};

function measureContainRect(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
): DisplayRect {
  if (containerWidth <= 0 || containerHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }
  const scale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    left: (containerWidth - width) / 2,
    top: (containerHeight - height) / 2,
    width,
    height,
  };
}

export function PhotoCropEditor({
  imageUrl,
  crop,
  onCropChange,
  ariaLabel = "Crop photo",
}: PhotoCropEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{
    mode: DragMode;
    startX: number;
    startY: number;
    origin: ImageCropRect;
    display: DisplayRect;
  } | null>(null);

  const [display, setDisplay] = useState<DisplayRect>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const recomputeDisplay = useCallback(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;
    const next = measureContainRect(
      container.clientWidth,
      container.clientHeight,
      image.naturalWidth || naturalSize.width,
      image.naturalHeight || naturalSize.height,
    );
    setDisplay(next);
  }, [naturalSize.height, naturalSize.width]);

  useEffect(() => {
    recomputeDisplay();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => recomputeDisplay());
    observer.observe(container);
    return () => observer.disconnect();
  }, [recomputeDisplay, imageUrl]);

  const onImageLoad = () => {
    const image = imageRef.current;
    if (!image) return;
    setNaturalSize({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
    if (crop.width <= 0 || crop.height <= 0) {
      onCropChange(FULL_IMAGE_CROP);
    }
    requestAnimationFrame(() => recomputeDisplay());
  };

  const onCropChangeRef = useRef(onCropChange);
  onCropChangeRef.current = onCropChange;

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.display.width <= 0 || drag.display.height <= 0) return;
      event.preventDefault();

      const dx = (event.clientX - drag.startX) / drag.display.width;
      const dy = (event.clientY - drag.startY) / drag.display.height;
      const origin = drag.origin;
      let next: ImageCropRect = { ...origin };

      switch (drag.mode) {
        case "move":
          next = { ...origin, x: origin.x + dx, y: origin.y + dy };
          break;
        case "n":
          next = { ...origin, y: origin.y + dy, height: origin.height - dy };
          break;
        case "s":
          next = { ...origin, height: origin.height + dy };
          break;
        case "e":
          next = { ...origin, width: origin.width + dx };
          break;
        case "w":
          next = { ...origin, x: origin.x + dx, width: origin.width - dx };
          break;
        case "ne":
          next = {
            x: origin.x,
            y: origin.y + dy,
            width: origin.width + dx,
            height: origin.height - dy,
          };
          break;
        case "nw":
          next = {
            x: origin.x + dx,
            y: origin.y + dy,
            width: origin.width - dx,
            height: origin.height - dy,
          };
          break;
        case "se":
          next = { ...origin, width: origin.width + dx, height: origin.height + dy };
          break;
        case "sw":
          next = {
            x: origin.x + dx,
            y: origin.y,
            width: origin.width - dx,
            height: origin.height + dy,
          };
          break;
      }

      onCropChangeRef.current(clampCropRect(next));
    };
    const onPointerUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const beginDrag = (mode: DragMode, event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: crop,
      display,
    };
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  const cropLeft = display.left + crop.x * display.width;
  const cropTop = display.top + crop.y * display.height;
  const cropWidth = crop.width * display.width;
  const cropHeight = crop.height * display.height;

  const handleClass =
    "absolute z-20 h-3.5 w-3.5 rounded-full border-2 border-white bg-primary shadow touch-none";

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 touch-none select-none"
      role="group"
      aria-label={ariaLabel}
    >
      <img
        ref={imageRef}
        src={imageUrl}
        alt=""
        draggable={false}
        onLoad={onImageLoad}
        className="absolute inset-0 h-full w-full object-contain"
      />

      {display.width > 0 ? (
        <>
          <div
            className="pointer-events-none absolute bg-black/55"
            style={{
              left: display.left,
              top: display.top,
              width: display.width,
              height: Math.max(0, cropTop - display.top),
            }}
          />
          <div
            className="pointer-events-none absolute bg-black/55"
            style={{
              left: display.left,
              top: cropTop + cropHeight,
              width: display.width,
              height: Math.max(
                0,
                display.top + display.height - (cropTop + cropHeight),
              ),
            }}
          />
          <div
            className="pointer-events-none absolute bg-black/55"
            style={{
              left: display.left,
              top: cropTop,
              width: Math.max(0, cropLeft - display.left),
              height: cropHeight,
            }}
          />
          <div
            className="pointer-events-none absolute bg-black/55"
            style={{
              left: cropLeft + cropWidth,
              top: cropTop,
              width: Math.max(
                0,
                display.left + display.width - (cropLeft + cropWidth),
              ),
              height: cropHeight,
            }}
          />

          <div
            className="absolute cursor-move border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
            style={{
              left: cropLeft,
              top: cropTop,
              width: cropWidth,
              height: cropHeight,
            }}
            onPointerDown={(event) => beginDrag("move", event)}
          >
            <div className="pointer-events-none absolute inset-x-0 top-1/3 border-t border-white/40" />
            <div className="pointer-events-none absolute inset-x-0 top-2/3 border-t border-white/40" />
            <div className="pointer-events-none absolute inset-y-0 left-1/3 border-l border-white/40" />
            <div className="pointer-events-none absolute inset-y-0 left-2/3 border-l border-white/40" />

            <button
              type="button"
              aria-label="Resize crop from top edge"
              className="absolute left-1/2 top-0 h-3 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize touch-none"
              onPointerDown={(event) => beginDrag("n", event)}
            />
            <button
              type="button"
              aria-label="Resize crop from bottom edge"
              className="absolute bottom-0 left-1/2 h-3 w-10 -translate-x-1/2 translate-y-1/2 cursor-ns-resize touch-none"
              onPointerDown={(event) => beginDrag("s", event)}
            />
            <button
              type="button"
              aria-label="Resize crop from left edge"
              className="absolute left-0 top-1/2 h-10 w-3 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none"
              onPointerDown={(event) => beginDrag("w", event)}
            />
            <button
              type="button"
              aria-label="Resize crop from right edge"
              className="absolute right-0 top-1/2 h-10 w-3 -translate-y-1/2 translate-x-1/2 cursor-ew-resize touch-none"
              onPointerDown={(event) => beginDrag("e", event)}
            />

            <button
              type="button"
              aria-label="Resize crop from top-left"
              className={`${handleClass} left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize`}
              onPointerDown={(event) => beginDrag("nw", event)}
            />
            <button
              type="button"
              aria-label="Resize crop from top-right"
              className={`${handleClass} right-0 top-0 -translate-y-1/2 translate-x-1/2 cursor-nesw-resize`}
              onPointerDown={(event) => beginDrag("ne", event)}
            />
            <button
              type="button"
              aria-label="Resize crop from bottom-left"
              className={`${handleClass} bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize`}
              onPointerDown={(event) => beginDrag("sw", event)}
            />
            <button
              type="button"
              aria-label="Resize crop from bottom-right"
              className={`${handleClass} bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize`}
              onPointerDown={(event) => beginDrag("se", event)}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
