import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { WaveformAudioPlayer } from "@/components/note/WaveformAudioPlayer";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Lock,
  Maximize2,
  Minimize2,
  Paperclip,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { Translations } from "@/utils/translations/types";
import {
  formatTextPreview,
  TEXT_PREVIEW_MAX_BYTES,
  type AttachmentPreviewKind,
} from "@/utils/attachmentPreviewKind";

const PdfSecureViewer = lazy(() =>
  import("@/components/note/PdfSecureViewer").then((mod) => ({ default: mod.PdfSecureViewer })),
);

export type SecureAttachmentViewerItem = {
  fileName: string;
  kind: AttachmentPreviewKind | null;
  objectUrl: string | null;
  blob: Blob | null;
  mimeType: string | null;
  typeLabel: string;
  audioPlaybackUnsupported?: boolean;
};

type SecureAttachmentViewerProps = {
  items: SecureAttachmentViewerItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  allowDownload: boolean;
  accessRemainingLabel: string | null;
  accessExpired: boolean;
  isLoading: boolean;
  isDownloading: boolean;
  onDownload: () => void;
  onClose: () => void;
  t: Translations;
};

export function SecureAttachmentViewer({
  items,
  activeIndex,
  onActiveIndexChange,
  allowDownload,
  accessRemainingLabel,
  accessExpired,
  isLoading,
  isDownloading,
  onDownload,
  onClose,
  t,
}: SecureAttachmentViewerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [textError, setTextError] = useState<string | null>(null);

  const item = items[activeIndex] ?? null;
  const kind = item?.kind ?? null;
  const isDocument = kind === "pdf" || kind === "text";
  const canGoPrev = items.length > 1;
  const canGoNext = items.length > 1;

  useEffect(() => {
    setPage(1);
    setPageCount(1);
    setScale(1);
    setTextContent(null);
    setTextError(null);
  }, [activeIndex, item?.objectUrl, item?.blob]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = rootRef.current;
    node?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (kind !== "text" || !item?.blob) {
      setTextContent(null);
      setTextError(null);
      return;
    }
    if (item.blob.size > TEXT_PREVIEW_MAX_BYTES) {
      setTextContent(null);
      setTextError(
        t.secureViewerTextTooLarge ?? "This file is too large to preview here. Download it to read the full contents.",
      );
      return;
    }
    let cancelled = false;
    void item.blob.text().then((raw) => {
      if (cancelled) return;
      setTextContent(formatTextPreview(raw, item.mimeType ?? undefined, item.fileName));
    });
    return () => {
      cancelled = true;
    };
  }, [item?.blob, item?.fileName, item?.mimeType, kind, t.secureViewerTextTooLarge]);

  const goPrev = useCallback(() => {
    if (items.length < 2) return;
    onActiveIndexChange((activeIndex - 1 + items.length) % items.length);
  }, [activeIndex, items.length, onActiveIndexChange]);

  const goNext = useCallback(() => {
    if (items.length < 2) return;
    onActiveIndexChange((activeIndex + 1) % items.length);
  }, [activeIndex, items.length, onActiveIndexChange]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  const toggleFullscreen = useCallback(async () => {
    const node = rootRef.current;
    if (!node) return;
    try {
      if (document.fullscreenElement === node) {
        await document.exitFullscreen();
      } else {
        await node.requestFullscreen();
      }
    } catch {
      // Fullscreen can be denied; the in-page overlay still works.
    }
  }, []);

  const mediaControls = allowDownload ? undefined : "nodownload noremoteplayback noplaybackrate";
  const policy = allowDownload
    ? (t.secureViewerDownloadPolicy ?? "You may download this document during the secure access window.")
    : (t.secureViewerViewOnlyPolicy ?? "Downloading has been disabled by the sender.");
  const positionLabel = (t.secureViewerPosition ?? "{current} of {total}")
    .replace("{current}", String(activeIndex + 1))
    .replace("{total}", String(Math.max(items.length, 1)));
  const pdfPageLabel =
    kind === "pdf" && pageCount > 0
      ? (t.secureViewerPages ?? "{page} / {total}")
          .replace("{page}", String(page))
          .replace("{total}", String(pageCount))
      : null;
  const zoomPercent = `${Math.round(scale * 100)}%`;

  const overlay = (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={item?.fileName ?? (t.secureViewerTitle ?? "Attachment viewer")}
      tabIndex={-1}
      className={`fixed inset-0 z-[80] flex flex-col outline-none ${
        isDocument
          ? "bg-[#f4f1ea] text-gray-900 dark:bg-gray-950 dark:text-gray-100"
          : "bg-black text-white"
      }`}
    >
      <header
        className={`flex items-center gap-2 px-3 py-2 sm:px-4 ${
          isDocument
            ? "border-b border-black/10 bg-white/90 dark:border-white/10 dark:bg-gray-900/90"
            : "bg-black/55"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isDocument
              ? "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
          aria-label={t.secureViewerClose ?? "Close viewer"}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold">{item?.fileName ?? "—"}</p>
        {pdfPageLabel ? (
          <p className="hidden shrink-0 text-xs text-gray-500 sm:block dark:text-gray-400">{pdfPageLabel}</p>
        ) : (
          <p className={`shrink-0 text-xs ${isDocument ? "text-gray-500 dark:text-gray-400" : "text-white/70"}`}>
            {positionLabel}
          </p>
        )}
        {kind === "pdf" ? (
          <div className="hidden items-center gap-1 sm:flex">
            <IconButton
              tone={isDocument ? "light" : "dark"}
              label={t.secureViewerZoomOut ?? "Zoom out"}
              onClick={() => setScale((value) => Math.max(0.5, Math.round((value - 0.15) * 100) / 100))}
            >
              <ZoomOut className="h-4 w-4" aria-hidden />
            </IconButton>
            <span className="min-w-[3.25rem] text-center text-xs tabular-nums text-gray-500 dark:text-gray-400">
              {zoomPercent}
            </span>
            <IconButton
              tone={isDocument ? "light" : "dark"}
              label={t.secureViewerZoomIn ?? "Zoom in"}
              onClick={() => setScale((value) => Math.min(3, Math.round((value + 0.15) * 100) / 100))}
            >
              <ZoomIn className="h-4 w-4" aria-hidden />
            </IconButton>
          </div>
        ) : null}
        {allowDownload ? (
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading || accessExpired || !item}
            className={`hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex ${
              isDocument
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            {isDownloading ? "…" : (t.secureViewerDownload ?? "Download")}
          </button>
        ) : null}
      </header>

      <div className="relative min-h-0 flex-1">
        {isLoading || !item ? (
          <ViewerLoading light={isDocument} />
        ) : kind === "pdf" && item.blob ? (
          <Suspense fallback={<ViewerLoading />}>
            <PdfSecureViewer
              blob={item.blob}
              fileName={item.fileName}
              scale={scale}
              page={page}
              onPageCount={setPageCount}
              onPageChange={setPage}
            />
          </Suspense>
        ) : kind === "image" && item.objectUrl ? (
          <div className="flex h-full items-center justify-center overflow-auto px-4 py-6">
            <img
              src={item.objectUrl}
              alt={item.fileName}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : kind === "video" && item.objectUrl ? (
          <div className="flex h-full items-center justify-center bg-black px-3 py-4">
            <video
              key={item.objectUrl}
              controls
              autoPlay
              controlsList={mediaControls}
              disablePictureInPicture={!allowDownload}
              src={item.objectUrl}
              className="max-h-full max-w-full"
              preload="metadata"
            />
          </div>
        ) : kind === "audio" && item.objectUrl && !item.audioPlaybackUnsupported ? (
          <div className="flex h-full items-center justify-center px-4 py-10">
            <WaveformAudioPlayer
              src={item.objectUrl}
              blob={item.blob}
              className="w-full max-w-xl"
            />
          </div>
        ) : kind === "audio" && item.audioPlaybackUnsupported ? (
          <p className="px-4 py-8 text-center text-sm text-white/80">
            {t.voiceMessagePlaybackUnsupported ??
              "This browser can’t play this voice message inline. Download it to listen."}
          </p>
        ) : kind === "text" ? (
          <div className="h-full overflow-auto bg-[#f7f4ee] px-4 py-4 dark:bg-gray-950">
            {textError ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">{textError}</p>
            ) : textContent == null ? (
              <ViewerLoading light />
            ) : (
              <pre className="m-0 max-w-none whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-gray-800 dark:text-gray-100">
                {textContent}
              </pre>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            {kind === "pdf" ? (
              <FileText className="h-10 w-10 text-white/50" aria-hidden />
            ) : (
              <Paperclip className="h-10 w-10 text-white/50" aria-hidden />
            )}
            <p className={`text-sm ${isDocument ? "text-gray-600 dark:text-gray-300" : "text-white/80"}`}>
              {t.secureViewerUnsupported ?? "This file type cannot be previewed in the secure viewer."}
            </p>
            {item.typeLabel ? (
              <p className="text-xs text-white/50">{item.typeLabel}</p>
            ) : null}
          </div>
        )}

        {canGoPrev ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/65 sm:left-4"
            aria-label={t.secureViewerPrevAttachment ?? "Previous attachment"}
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
        ) : null}
        {canGoNext ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/65 sm:right-4"
            aria-label={t.secureViewerNextAttachment ?? "Next attachment"}
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        ) : null}
      </div>

      <footer
        className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[11px] ${
          isDocument
            ? "border-t border-black/10 bg-white/90 text-gray-500 dark:border-white/10 dark:bg-gray-900/90 dark:text-gray-400"
            : "bg-black/55 text-white/70"
        }`}
      >
        <p className="m-0 inline-flex items-center gap-1.5">
          <Lock className="h-3 w-3" aria-hidden />
          {t.secureViewerDecryptedLocally ?? "Decrypted locally"}
        </p>
        <div className="flex items-center gap-2">
          {allowDownload ? (
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading || accessExpired || !item}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 sm:hidden ${
                isDocument
                  ? "bg-primary text-white"
                  : "bg-white/15 text-white"
              }`}
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              {t.secureViewerDownload ?? "Download"}
            </button>
          ) : null}
          <IconButton
            tone={isDocument ? "light" : "dark"}
            label={
              isFullscreen
                ? (t.secureViewerExitFullscreen ?? "Exit fullscreen")
                : (t.secureViewerFullscreen ?? "Fullscreen")
            }
            onClick={() => void toggleFullscreen()}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" aria-hidden />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden />
            )}
          </IconButton>
        </div>
        <p className="m-0 w-full text-right sm:w-auto">
          {accessExpired
            ? (t.secureViewerAccessExpired ?? "Access expired")
            : accessRemainingLabel
              ? (t.secureViewerAccessExpires ?? "Access expires in {time}").replace(
                  "{time}",
                  accessRemainingLabel,
                )
              : policy}
        </p>
      </footer>
    </div>
  );

  if (typeof document === "undefined") return overlay;
  return createPortal(overlay, document.body);
}

function ViewerLoading({ light = false }: { light?: boolean }) {
  return (
    <div className="flex h-full items-center justify-center py-16">
      <div
        className={`h-8 w-8 animate-spin rounded-full border-2 ${
          light ? "border-primary/20 border-t-primary" : "border-white/20 border-t-white"
        }`}
        aria-hidden
      />
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
  tone = "dark",
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
        tone === "light"
          ? "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
