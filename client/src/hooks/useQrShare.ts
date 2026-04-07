import { useRef, useEffect } from "react";
import type { RefObject } from "react";
import { createQrPngFileFromSvgData, getQrSvgDataFromDom } from "@/utils/qrPngFile";
import { useToast } from "@/hooks/use-toast";

interface UseQrShareOptions {
  noteUrl: string | null;
  showSuccessQr: boolean;
  successQrSectionRef: RefObject<HTMLDivElement>;
}

export function useQrShare({ noteUrl, showSuccessQr, successQrSectionRef }: UseQrShareOptions) {
  const qrSharePngRef = useRef<File | null>(null);
  const { toast } = useToast();

  /** Prefetch PNG as soon as the QR section renders so share() has the file ready immediately. */
  useEffect(() => {
    if (!showSuccessQr || !noteUrl) {
      qrSharePngRef.current = null;
      return;
    }
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void (async () => {
          if (cancelled) return;
          const svgData = getQrSvgDataFromDom("note-qr-code");
          if (!svgData || cancelled) return;
          const file = await createQrPngFileFromSvgData(svgData);
          if (!cancelled) qrSharePngRef.current = file;
        })();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [showSuccessQr, noteUrl]);

  useEffect(() => {
    if (!showSuccessQr) return;
    const el = successQrSectionRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [showSuccessQr, successQrSectionRef]);

  const downloadQrCode = async () => {
    try {
      const svgData = getQrSvgDataFromDom("note-qr-code");
      if (!svgData) throw new Error("QR code not available.");
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const DOMURL = window.URL || window.webkitURL || window;
      const url = DOMURL.createObjectURL(svgBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "privatenote-qr.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => DOMURL.revokeObjectURL(url), 100);

      toast({
        title: "QR Code Downloaded",
        description: "Attach the file manually in your email.",
      });
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast({
        title: "Error",
        description: "Could not download QR code. Try using the link instead.",
        variant: "destructive",
      });
    }
  };

  /** Single share() call with PNG file. Never chain multiple share() — each opens a new sheet. */
  const shareQrCode = async () => {
    if (!noteUrl) return;

    let pngFile = qrSharePngRef.current;
    if (!pngFile) {
      const svgData = getQrSvgDataFromDom("note-qr-code");
      if (svgData) {
        pngFile = await createQrPngFileFromSvgData(svgData);
        if (pngFile) qrSharePngRef.current = pngFile;
      }
    }

    if (pngFile && typeof navigator.share === "function") {
      try {
        await navigator.share({ files: [pngFile] });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }

    if (
      pngFile &&
      typeof navigator.clipboard?.write === "function" &&
      typeof ClipboardItem !== "undefined"
    ) {
      try {
        const textBlob = new Blob([noteUrl], { type: "text/plain" });
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": pngFile, "text/plain": textBlob }),
        ]);
        toast({
          title: "QR and link copied",
          description: "Paste into Mail or another app.",
        });
        return;
      } catch {
        // fall through
      }
    }

    try {
      await navigator.clipboard.writeText(noteUrl);
      toast({
        title: "Link copied",
        description: "Use Copy Link or Download QR Code to share the image.",
      });
    } catch {
      toast({
        title: "Sharing unavailable",
        description: "Use Copy Link or Download QR Code below.",
        variant: "destructive",
      });
    }
  };

  return { downloadQrCode, shareQrCode };
}
