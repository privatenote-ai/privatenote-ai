import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { WaveformAudioPlayer } from "@/components/note/WaveformAudioPlayer";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  Maximize2,
  Minimize2,
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

type SecureAttachmentViewerProps = {
  kind: AttachmentPreviewKind;
  fileName: string;
  objectUrl: string | null;
  blob: Blob | null;
  mimeType: string | null;
  allowDownload: boolean;
  accessRemainingLabel: string | null;
  accessExpired: boolean;
  isDownloading: boolean;
  audioPlaybackUnsupported?: boolean;
  onDownload: () => void;
  onClose: () => void;
  t: Translations;
};

export function SecureAttachmentViewer({
  kind,
  fileName,
  objectUrl,
  blob,
  mimeType,
  allowDownload,
  accessRemainingLabel,
  accessExpired,
  isDownloading,
  audioPlaybackUnsupported = false,
  onDownload,
  onClose,
  t,
}: SecureAttachmentViewerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [scale, setScale] = useState(1.15);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [textError, setTextError] = useState<string | null>(null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (kind !== "text" || !blob) {
      setTextContent(null);
      setTextError(null);
      return;
    }
    if (blob.size > TEXT_PREVIEW_MAX_BYTES) {
      setTextContent(null);
      setTextError(
        t.secureViewerTextTooLarge ?? "This file is too large to preview here. Download it to read the full contents.",
      );
      return;
    }
    let cancelled = false;
    void blob.text().then((raw) => {
      if (cancelled) return;
      setTextContent(formatTextPreview(raw, mimeType ?? undefined, fileName));
    });
    return () => {
      cancelled = true;
    };
  }, [blob, fileName, kind, mimeType, t.secureViewerTextTooLarge]);

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
      // Fullscreen can be denied; the in-page viewer still works.
    }
  }, []);

  const mediaControls = allowDownload ? undefined : "nodownload noremoteplayback noplaybackrate";
  const policy = allowDownload
    ? (t.secureViewerDownloadPolicy ?? "You may download this document during the secure access window.")
    : (t.secureViewerViewOnlyPolicy ?? "Downloading has been disabled by the sender.");

  const pageLabel =
    kind === "pdf" && pageCount > 0
      ? (t.secureViewerPages ?? "{page} / {total}")
          .replace("{page}", String(page))
          .replace("{total}", String(pageCount))
      : null;

  return (
    <div
      ref={rootRef}
      className="flex min-h-[min(78vh,46rem)] flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white dark:border-gray-700 dark:bg-gray-900"
    >
      <header className="flex items-center gap-2 border-b border-gray-200 px-2 py-2 sm:px-3 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          aria-label={t.secureViewerClose ?? "Close viewer"}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
          {fileName}
        </p>
        {pageLabel ? (
          <p className="hidden shrink-0 text-xs text-gray-500 sm:block dark:text-gray-400">{pageLabel}</p>
        ) : null}
        <div className="flex shrink-0 items-center gap-1">
          {kind === "pdf" || kind === "image" ? (
            <>
              <IconButton
                label={t.secureViewerZoomOut ?? "Zoom out"}
                onClick={() => setScale((value) => Math.max(0.5, Math.round((value - 0.15) * 100) / 100))}
              >
                <ZoomOut className="h-3.5 w-3.5" aria-hidden />
              </IconButton>
              <IconButton
                label={t.secureViewerZoomIn ?? "Zoom in"}
                onClick={() => setScale((value) => Math.min(3, Math.round((value + 0.15) * 100) / 100))}
              >
                <ZoomIn className="h-3.5 w-3.5" aria-hidden />
              </IconButton>
            </>
          ) : null}
          {kind === "pdf" && pageCount > 1 ? (
            <>
              <IconButton
                label={t.secureViewerPrevPage ?? "Previous page"}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              </IconButton>
              <IconButton
                label={t.secureViewerNextPage ?? "Next page"}
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
              >
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </IconButton>
            </>
          ) : null}
          <IconButton
            label={
              isFullscreen
                ? (t.secureViewerExitFullscreen ?? "Exit fullscreen")
                : (t.secureViewerFullscreen ?? "Fullscreen")
            }
            onClick={() => void toggleFullscreen()}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" aria-hidden />
            )}
          </IconButton>
          {allowDownload ? (
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading || accessExpired}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              {isDownloading ? "…" : (t.secureViewerDownload ?? "Download")}
            </button>
          ) : (
            <p className="hidden max-w-[12rem] text-right text-[11px] leading-snug text-gray-500 sm:block dark:text-gray-400">
              {t.secureViewerDownloadDisabled ?? "Downloading has been disabled by the sender."}
            </p>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        {kind === "pdf" && blob ? (
          <Suspense fallback={<ViewerLoading />}>
            <PdfSecureViewer
              blob={blob}
              fileName={fileName}
              scale={scale}
              page={page}
              onPageCount={setPageCount}
              onPageChange={setPage}
            />
          </Suspense>
        ) : kind === "image" && objectUrl ? (
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[#ece9e2] p-3 dark:bg-gray-950">
            <img
              src={objectUrl}
              alt={fileName}
              style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
              className="max-h-[min(64vh,720px)] max-w-full object-contain"
            />
          </div>
        ) : kind === "video" && objectUrl ? (
          <div className="flex flex-1 items-center justify-center bg-black p-3">
            <video
              controls
              controlsList={mediaControls}
              disablePictureInPicture={!allowDownload}
              src={objectUrl}
              className="max-h-[min(64vh,720px)] w-full"
              preload="metadata"
            />
          </div>
        ) : kind === "audio" && objectUrl && !audioPlaybackUnsupported ? (
          <div className="flex flex-1 items-center justify-center px-4 py-10">
            <WaveformAudioPlayer src={objectUrl} blob={blob} className="w-full max-w-xl" />
          </div>
        ) : kind === "audio" && audioPlaybackUnsupported ? (
          <p className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-300">
            {t.voiceMessagePlaybackUnsupported ??
              "This browser can’t play this voice message inline. Download it to listen."}
          </p>
        ) : kind === "text" ? (
          <div className="min-h-0 flex-1 overflow-auto bg-[#f7f4ee] px-4 py-4 dark:bg-gray-950">
            {textError ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">{textError}</p>
            ) : textContent == null ? (
              <ViewerLoading />
            ) : (
              <pre className="m-0 max-w-none whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-gray-800 dark:text-gray-100">
                {textContent}
              </pre>
            )}
          </div>
        ) : (
          <p className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-300">
            {t.secureViewerUnsupported ?? "This file type cannot be previewed in the secure viewer."}
          </p>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 px-3 py-2 text-[11px] text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <p className="m-0 inline-flex items-center gap-1.5">
          <Lock className="h-3 w-3" aria-hidden />
          {t.secureViewerDecryptedLocally ?? "Decrypted locally"}
        </p>
        <p className="m-0">
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
}

function ViewerLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" aria-hidden />
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    >
      {children}
    </button>
  );
}
