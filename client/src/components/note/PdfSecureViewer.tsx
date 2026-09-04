import { useCallback, useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

type PdfSecureViewerProps = {
  blob: Blob;
  fileName: string;
  scale: number;
  page: number;
  onPageCount: (count: number) => void;
  onPageChange: (page: number) => void;
  className?: string;
};

let workerConfigured = false;

function ensurePdfWorker(): void {
  if (workerConfigured) return;
  GlobalWorkerOptions.workerSrc = pdfWorker;
  workerConfigured = true;
}

export function PdfSecureViewer({
  blob,
  fileName,
  scale,
  page,
  onPageCount,
  onPageChange,
  className,
}: PdfSecureViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [thumbReady, setThumbReady] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;
    ensurePdfWorker();
    const load = async () => {
      setError(null);
      setThumbReady({});
      try {
        const data = new Uint8Array(await blob.arrayBuffer());
        const loadingTask = getDocument({
          data,
          isEvalSupported: false,
          disableStream: true,
          disableRange: true,
          disableAutoFetch: true,
        });
        const pdf = await loadingTask.promise;
        if (cancelled) {
          pdf.destroy();
          return;
        }
        pdfRef.current = pdf;
        setPageCount(pdf.numPages);
        onPageCount(pdf.numPages);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not open this PDF.");
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      const pdf = pdfRef.current;
      pdfRef.current = null;
      void pdf?.destroy();
    };
    // Reload only when the decrypted bytes change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blob]);

  useEffect(() => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas || pageCount < 1) return;
    let cancelled = false;
    const render = async () => {
      renderTaskRef.current?.cancel();
      const pdfPage = await pdf.getPage(page);
      if (cancelled) return;
      const outputScale = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = pdfPage.getViewport({ scale: scale * outputScale });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / outputScale)}px`;
      canvas.style.height = `${Math.floor(viewport.height / outputScale)}px`;
      const context = canvas.getContext("2d");
      if (!context) return;
      const task = pdfPage.render({ canvasContext: context, viewport });
      renderTaskRef.current = task;
      try {
        await task.promise;
      } catch {
        // Cancelled render throws; ignore.
      }
    };
    void render();
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [page, pageCount, scale]);

  const renderThumb = useCallback(
    async (pageNumber: number, target: HTMLCanvasElement) => {
      const pdf = pdfRef.current;
      if (!pdf || thumbReady[pageNumber]) return;
      try {
        const pdfPage = await pdf.getPage(pageNumber);
        const viewport = pdfPage.getViewport({ scale: 0.18 });
        target.width = Math.floor(viewport.width);
        target.height = Math.floor(viewport.height);
        const context = target.getContext("2d");
        if (!context) return;
        await pdfPage.render({ canvasContext: context, viewport }).promise;
        setThumbReady((current) => ({ ...current, [pageNumber]: "1" }));
      } catch {
        // Thumbnail is decorative.
      }
    },
    [thumbReady],
  );

  useEffect(() => {
    const root = thumbsRef.current;
    if (!root || pageCount < 1) return;
    const canvases = Array.from(root.querySelectorAll<HTMLCanvasElement>("[data-pdf-thumb]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const canvas = entry.target as HTMLCanvasElement;
          const pageNumber = Number(canvas.dataset.pdfThumb);
          if (Number.isInteger(pageNumber) && pageNumber > 0) {
            void renderThumb(pageNumber, canvas);
          }
        }
      },
      { root, rootMargin: "120px 0px" },
    );
    for (const canvas of canvases) observer.observe(canvas);
    return () => observer.disconnect();
  }, [pageCount, renderThumb]);

  useEffect(() => {
    const selected = thumbsRef.current?.querySelector(`[data-pdf-thumb-wrap="${page}"]`);
    if (selected instanceof HTMLElement) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [page]);

  if (error) {
    return (
      <p className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-300" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className={`flex min-h-0 min-w-0 flex-1 ${className ?? ""}`}>
      {pageCount > 1 ? (
        <div
          ref={thumbsRef}
          className="hidden w-[7.5rem] shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50/80 px-2 py-2 dark:border-gray-700 dark:bg-gray-950/60 sm:block"
          aria-label="Page thumbnails"
        >
          {Array.from({ length: pageCount }, (_, index) => {
            const pageNumber = index + 1;
            const selected = pageNumber === page;
            return (
              <button
                key={pageNumber}
                type="button"
                data-pdf-thumb-wrap={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`mb-2 w-full overflow-hidden rounded-md border bg-white p-1 text-left dark:bg-gray-900 ${
                  selected
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-gray-200 hover:border-primary/40 dark:border-gray-700"
                }`}
                aria-current={selected ? "page" : undefined}
                aria-label={`Page ${pageNumber}`}
              >
                <canvas data-pdf-thumb={pageNumber} className="mx-auto block max-w-full" />
                <span className="mt-1 block text-center text-[10px] text-gray-500 dark:text-gray-400">
                  {pageNumber}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
      <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#ece9e2] dark:bg-gray-950">
        <div className="flex min-h-full items-start justify-center p-3 sm:p-5">
          <canvas
            ref={canvasRef}
            className="max-w-full bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.55)]"
            aria-label={`${fileName}, page ${page}`}
          />
        </div>
      </div>
    </div>
  );
}
