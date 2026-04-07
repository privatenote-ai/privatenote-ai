/**
 * Generate a minimal single-page PDF containing a clickable link.
 * No external dependencies — builds raw PDF 1.4 syntax.
 */
export function createLinkPdf(url: string): File {
  const title = "PrivateNote.ai";
  const subtitle = "Someone shared a secure encrypted note with you.";
  const instruction = "Open the link below to read it:";
  const footer1 = "This note is end-to-end encrypted and will self-destruct after reading.";
  const footer2 = "Powered by privatenote.ai";
  const siteUrl = "https://privatenote.ai";

  const escapePdf = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

  const safeUrl = escapePdf(url);
  const safeTitle = escapePdf(title);
  const safeSub = escapePdf(subtitle);
  const safeInst = escapePdf(instruction);
  const safeFooter1 = escapePdf(footer1);
  const safeFooter2 = escapePdf(footer2);
  const safeSiteUrl = escapePdf(siteUrl);

  // 0.36 0.36 0.36 rg = dark gray for body text; 0 0 0 rg = black for title
  const stream = [
    `BT /F1 24 Tf 0 0 0 rg 72 700 Td (${safeTitle}) Tj ET`,
    `BT /F2 13 Tf 0.36 0.36 0.36 rg 72 668 Td (${safeSub}) Tj ET`,
    `BT /F2 12 Tf 0.36 0.36 0.36 rg 72 644 Td (${safeInst}) Tj ET`,
    `BT /F2 10 Tf 0 0 0.8 rg 72 618 Td (${safeUrl}) Tj ET`,
    `0.85 0.85 0.85 RG 0.5 w 72 570 m 540 570 l S`,
    `BT /F3 9 Tf 0.5 0.5 0.5 rg 72 550 Td (${safeFooter1}) Tj ET`,
    `BT /F1 10 Tf 0.5 0.5 0.5 rg 72 532 Td (${safeFooter2}) Tj ET`,
  ].join("\n");

  const urlWidth = Math.min(safeUrl.length * 5.5, 468);

  const noteAnnot = [
    `6 0 obj`,
    `<< /Type /Annot /Subtype /Link`,
    `   /Rect [72 613 ${72 + urlWidth} 631]`,
    `   /Border [0 0 0]`,
    `   /A << /Type /Action /S /URI /URI (${safeUrl}) >>`,
    `>>`,
    `endobj`,
  ].join("\n");

  const siteAnnot = [
    `9 0 obj`,
    `<< /Type /Annot /Subtype /Link`,
    `   /Rect [72 528 220 543]`,
    `   /Border [0 0 0]`,
    `   /A << /Type /Action /S /URI /URI (${safeSiteUrl}) >>`,
    `>>`,
    `endobj`,
  ].join("\n");

  const objects: string[] = [];
  const offsets: number[] = [];
  let pos = 0;

  const header = "%PDF-1.4\n";
  pos += header.length;

  const addObj = (content: string) => {
    offsets.push(pos);
    objects.push(content);
    pos += content.length + 1;
  };

  addObj(
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`,
  );
  addObj(
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`,
  );
  addObj(
    [
      `3 0 obj`,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]`,
      `   /Contents 4 0 R`,
      `   /Resources << /Font << /F1 5 0 R /F2 7 0 R /F3 8 0 R >> >>`,
      `   /Annots [6 0 R 9 0 R]`,
      `>>`,
      `endobj`,
    ].join("\n"),
  );
  addObj(
    `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
  );
  addObj(
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`,
  );
  addObj(noteAnnot);
  addObj(
    `7 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`,
  );
  addObj(
    `8 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj`,
  );
  addObj(siteAnnot);

  const body = objects.join("\n") + "\n";
  const xrefOffset = header.length + body.length;
  const numObjs = offsets.length + 1;

  const xref = [
    `xref`,
    `0 ${numObjs}`,
    `0000000000 65535 f `,
    ...offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n `),
  ].join("\n");

  const trailer = [
    `trailer`,
    `<< /Size ${numObjs} /Root 1 0 R >>`,
    `startxref`,
    `${xrefOffset}`,
    `%%EOF`,
  ].join("\n");

  const pdf = header + body + xref + "\n" + trailer + "\n";

  return new File([new Blob([pdf], { type: "application/pdf" })], "privatenote-link.pdf", {
    type: "application/pdf",
    lastModified: Date.now(),
  });
}
