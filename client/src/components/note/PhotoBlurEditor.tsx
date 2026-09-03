import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  blurBrushRadius,
  canvasToJpegBlob,
  createBlurredCanvas,
  loadImageFromUrl,
  stampSoftBrush,
  type BlurBrushSizeKey,
} from "@/utils/photoBlur";

export type PhotoBlurEditorHandle = {
  exportJpeg: () => Promise<Blob>;
  reset: () => void;
  hasEdits: () => boolean;
};

type PhotoBlurEditorProps = {
  imageUrl: string;
  brushSize: BlurBrushSizeKey;
  ariaLabel?: string;
  onDirtyChange?: (dirty: boolean) => void;
};

type DisplayRect = {
  left: number;
  top: number;
  width: number;
  height: number;
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

export const PhotoBlurEditor = forwardRef<PhotoBlurEditorHandle, PhotoBlurEditorProps>(
  function PhotoBlurEditor(
    { imageUrl, brushSize, ariaLabel = "Blur details", onDirtyChange },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const sharpCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const blurCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawingRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);
    const dirtyRef = useRef(false);
    const brushSizeRef = useRef(brushSize);
    brushSizeRef.current = brushSize;

    const [display, setDisplay] = useState<DisplayRect>({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    });
    const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
    const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
    const [ready, setReady] = useState(false);

    const setDirty = (dirty: boolean) => {
      dirtyRef.current = dirty;
      onDirtyChange?.(dirty);
    };

    const composite = useCallback(() => {
      const view = viewCanvasRef.current;
      const sharp = sharpCanvasRef.current;
      const blurred = blurCanvasRef.current;
      const mask = maskCanvasRef.current;
      if (!view || !sharp || !blurred || !mask) return;
      const context = view.getContext("2d");
      if (!context) return;

      context.clearRect(0, 0, view.width, view.height);
      context.drawImage(sharp, 0, 0);

      const masked = document.createElement("canvas");
      masked.width = view.width;
      masked.height = view.height;
      const maskedContext = masked.getContext("2d");
      if (!maskedContext) return;
      maskedContext.drawImage(blurred, 0, 0);
      maskedContext.globalCompositeOperation = "destination-in";
      maskedContext.drawImage(mask, 0, 0);
      maskedContext.globalCompositeOperation = "source-over";

      context.drawImage(masked, 0, 0);
    }, []);

    const paintAt = useCallback(
      (imageX: number, imageY: number) => {
        const mask = maskCanvasRef.current;
        if (!mask) return;
        const context = mask.getContext("2d");
        if (!context) return;
        const displayWidth = display.width || naturalSize.width;
        const scale = naturalSize.width > 0 && displayWidth > 0 ? naturalSize.width / displayWidth : 1;
        const radius = blurBrushRadius(brushSizeRef.current) * Math.max(scale, 0.75);
        stampSoftBrush(context, imageX, imageY, radius);
        setDirty(true);
        composite();
      },
      [composite, display.width, naturalSize.width],
    );

    const paintStroke = useCallback(
      (from: { x: number; y: number } | null, to: { x: number; y: number }) => {
        if (!from) {
          paintAt(to.x, to.y);
          return;
        }
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(distance / 4));
        for (let i = 1; i <= steps; i += 1) {
          const t = i / steps;
          paintAt(from.x + dx * t, from.y + dy * t);
        }
      },
      [paintAt],
    );

    const pointerToImage = (clientX: number, clientY: number) => {
      const canvas = viewCanvasRef.current;
      if (!canvas || display.width <= 0 || display.height <= 0 || naturalSize.width <= 0) {
        return null;
      }
      const bounds = canvas.getBoundingClientRect();
      const localX = clientX - bounds.left;
      const localY = clientY - bounds.top;
      if (localX < 0 || localY < 0 || localX > bounds.width || localY > bounds.height) {
        return null;
      }
      return {
        x: (localX / bounds.width) * naturalSize.width,
        y: (localY / bounds.height) * naturalSize.height,
        cursorX: localX,
        cursorY: localY,
      };
    };

    const resetCanvases = useCallback(async () => {
      setReady(false);
      setDirty(false);
      setCursor(null);
      lastPointRef.current = null;
      drawingRef.current = false;

      const image = await loadImageFromUrl(imageUrl);
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      if (width <= 0 || height <= 0) {
        throw new Error("Image has no dimensions");
      }

      const sharp = document.createElement("canvas");
      sharp.width = width;
      sharp.height = height;
      const sharpContext = sharp.getContext("2d");
      if (!sharpContext) throw new Error("Could not prepare photo canvas");
      sharpContext.drawImage(image, 0, 0, width, height);

      const mask = document.createElement("canvas");
      mask.width = width;
      mask.height = height;

      const view = viewCanvasRef.current;
      if (!view) return;
      view.width = width;
      view.height = height;

      sharpCanvasRef.current = sharp;
      blurCanvasRef.current = createBlurredCanvas(sharp, width, height);
      maskCanvasRef.current = mask;
      setNaturalSize({ width, height });
      setReady(true);
      composite();
    }, [composite, imageUrl]);

    useEffect(() => {
      void resetCanvases().catch(() => {
        setReady(false);
      });
    }, [resetCanvases]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const update = () => {
        setDisplay(
          measureContainRect(
            container.clientWidth,
            container.clientHeight,
            naturalSize.width,
            naturalSize.height,
          ),
        );
      };
      update();
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(update);
      observer.observe(container);
      return () => observer.disconnect();
    }, [naturalSize.height, naturalSize.width]);

    useImperativeHandle(
      ref,
      () => ({
        exportJpeg: async () => {
          const view = viewCanvasRef.current;
          if (!view) throw new Error("Blur editor is not ready");
          return canvasToJpegBlob(view);
        },
        reset: () => {
          void resetCanvases();
        },
        hasEdits: () => dirtyRef.current,
      }),
      [resetCanvases],
    );

    useEffect(() => {
      const onPointerMove = (event: PointerEvent) => {
        if (!drawingRef.current) return;
        event.preventDefault();
        const point = pointerToImage(event.clientX, event.clientY);
        if (!point) return;
        setCursor({ x: point.cursorX, y: point.cursorY });
        paintStroke(lastPointRef.current, { x: point.x, y: point.y });
        lastPointRef.current = { x: point.x, y: point.y };
      };
      const onPointerUp = () => {
        drawingRef.current = false;
        lastPointRef.current = null;
      };
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      };
      // pointerToImage/paintStroke close over latest display/naturalSize via render; rebind when those change
    });

    const beginPaint = (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!ready) return;
      event.preventDefault();
      const point = pointerToImage(event.clientX, event.clientY);
      if (!point) return;
      drawingRef.current = true;
      lastPointRef.current = { x: point.x, y: point.y };
      setCursor({ x: point.cursorX, y: point.cursorY });
      paintAt(point.x, point.y);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    };

    const brushDiameter = blurBrushRadius(brushSize) * 2;

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 touch-none select-none"
        role="group"
        aria-label={ariaLabel}
      >
        <canvas
          ref={viewCanvasRef}
          className="absolute cursor-none touch-none"
          style={{
            left: display.left,
            top: display.top,
            width: display.width || "100%",
            height: display.height || "100%",
          }}
          onPointerDown={beginPaint}
          onPointerEnter={(event) => {
            const point = pointerToImage(event.clientX, event.clientY);
            if (point) setCursor({ x: point.cursorX, y: point.cursorY });
          }}
          onPointerMove={(event) => {
            const point = pointerToImage(event.clientX, event.clientY);
            if (point) setCursor({ x: point.cursorX, y: point.cursorY });
          }}
          onPointerLeave={() => {
            if (!drawingRef.current) setCursor(null);
          }}
        />
        {cursor && display.width > 0 ? (
          <div
            className="pointer-events-none absolute rounded-full border border-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
            style={{
              left: display.left + cursor.x - brushDiameter / 2,
              top: display.top + cursor.y - brushDiameter / 2,
              width: brushDiameter,
              height: brushDiameter,
            }}
          />
        ) : null}
      </div>
    );
  },
);
