/** DOM + canvas helpers for sharing a QR as PNG (kept out of CreateNote so we can prefetch in useEffect). */

export function getQrSvgDataFromDom(containerId: string): string | null {
  const qrCodeElement = document.getElementById(containerId);
  const svgElement = qrCodeElement?.querySelector("svg") as SVGSVGElement | null;
  if (!svgElement) return null;

  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  if (!svgClone.getAttribute("xmlns")) {
    svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  const viewBox = svgClone.getAttribute("viewBox");
  let size = 180;
  if (viewBox) {
    const parts = viewBox.split(" ").map((part) => Number(part));
    if (parts.length === 4 && Number.isFinite(parts[2])) {
      size = parts[2] || size;
    }
  }
  if (!svgClone.getAttribute("width")) svgClone.setAttribute("width", String(size));
  if (!svgClone.getAttribute("height")) svgClone.setAttribute("height", String(size));
  return new XMLSerializer().serializeToString(svgClone);
}

async function rasterizeQrSvgToPngBlob(svgData: string): Promise<Blob | null> {
  const loadImage = (src: string, revoke?: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        if (revoke) URL.revokeObjectURL(revoke);
        resolve(image);
      };
      image.onerror = () => {
        if (revoke) URL.revokeObjectURL(revoke);
        reject(new Error("Failed to render QR SVG"));
      };
      image.src = src;
    });

  let image: HTMLImageElement;
  try {
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
    image = await loadImage(dataUrl);
  } catch {
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(svgBlob);
    image = await loadImage(objectUrl, objectUrl);
  }

  const size = Math.max(image.naturalWidth || 0, image.naturalHeight || 0, 256);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(image, 0, 0, size, size);

  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob((blob) => resolve(blob), "image/png"),
  );
}

export async function createQrPngFileFromSvgData(svgData: string): Promise<File | null> {
  try {
    const pngBlob = await rasterizeQrSvgToPngBlob(svgData);
    if (!pngBlob) return null;
    return new File([pngBlob], "privatenote-qr.png", {
      type: "image/png",
      lastModified: Date.now(),
    });
  } catch {
    return null;
  }
}
