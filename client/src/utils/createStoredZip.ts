const ZIP_LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
const ZIP_CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const ZIP_END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;

const textEncoder = new TextEncoder();

let crc32Table: Uint32Array | null = null;

function getCrc32Table(): Uint32Array {
  if (crc32Table) return crc32Table;
  const table = new Uint32Array(256);
  for (let i = 0; i < table.length; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  crc32Table = table;
  return table;
}

function crc32(bytes: Uint8Array): number {
  const table = getCrc32Table();
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = table[(crc ^ bytes[i]!) & 0xff]! ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function sanitizeZipPath(path: string): string {
  return path
    .replace(/\\/g, "/")
    .split("/")
    .filter((part) => part && part !== "." && part !== "..")
    .join("/");
}

function dosDateTime(date: Date): { date: number; time: number } {
  const year = Math.max(1980, Math.min(2107, date.getFullYear()));
  return {
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
  };
}

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value >>> 0, true);
}

function fileNameFromFolder(files: readonly File[]): string {
  const firstPath = files[0] ? sanitizeZipPath((files[0] as File & { webkitRelativePath?: string }).webkitRelativePath || files[0].name) : "";
  const root = firstPath.split("/")[0]?.trim();
  return `${root || "folder"}.zip`;
}

export async function createStoredZipFromFiles(files: readonly File[]): Promise<File> {
  const localParts: BlobPart[] = [];
  const centralParts: BlobPart[] = [];
  let offset = 0;

  for (const file of files) {
    const relativePath =
      sanitizeZipPath((file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name) ||
      file.name;
    if (!relativePath) continue;

    const nameBytes = textEncoder.encode(relativePath);
    const fileBytes = new Uint8Array(await file.arrayBuffer());
    const checksum = crc32(fileBytes);
    const { date, time } = dosDateTime(new Date(file.lastModified || Date.now()));

    const localHeader = new ArrayBuffer(30 + nameBytes.byteLength);
    const localView = new DataView(localHeader);
    writeUint32(localView, 0, ZIP_LOCAL_FILE_HEADER_SIGNATURE);
    writeUint16(localView, 4, 20);
    writeUint16(localView, 6, 0x0800);
    writeUint16(localView, 8, 0);
    writeUint16(localView, 10, time);
    writeUint16(localView, 12, date);
    writeUint32(localView, 14, checksum);
    writeUint32(localView, 18, fileBytes.byteLength);
    writeUint32(localView, 22, fileBytes.byteLength);
    writeUint16(localView, 26, nameBytes.byteLength);
    writeUint16(localView, 28, 0);
    new Uint8Array(localHeader, 30).set(nameBytes);
    localParts.push(localHeader, fileBytes);

    const centralHeader = new ArrayBuffer(46 + nameBytes.byteLength);
    const centralView = new DataView(centralHeader);
    writeUint32(centralView, 0, ZIP_CENTRAL_DIRECTORY_SIGNATURE);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, 0x0800);
    writeUint16(centralView, 10, 0);
    writeUint16(centralView, 12, time);
    writeUint16(centralView, 14, date);
    writeUint32(centralView, 16, checksum);
    writeUint32(centralView, 20, fileBytes.byteLength);
    writeUint32(centralView, 24, fileBytes.byteLength);
    writeUint16(centralView, 28, nameBytes.byteLength);
    writeUint16(centralView, 30, 0);
    writeUint16(centralView, 32, 0);
    writeUint16(centralView, 34, 0);
    writeUint16(centralView, 36, 0);
    writeUint32(centralView, 38, 0);
    writeUint32(centralView, 42, offset);
    new Uint8Array(centralHeader, 46).set(nameBytes);
    centralParts.push(centralHeader);

    offset += localHeader.byteLength + fileBytes.byteLength;
  }

  const centralDirectorySize = centralParts.reduce(
    (total, part) => total + (part instanceof ArrayBuffer ? part.byteLength : 0),
    0,
  );
  const endRecord = new ArrayBuffer(22);
  const endView = new DataView(endRecord);
  writeUint32(endView, 0, ZIP_END_OF_CENTRAL_DIRECTORY_SIGNATURE);
  writeUint16(endView, 4, 0);
  writeUint16(endView, 6, 0);
  writeUint16(endView, 8, centralParts.length);
  writeUint16(endView, 10, centralParts.length);
  writeUint32(endView, 12, centralDirectorySize);
  writeUint32(endView, 16, offset);
  writeUint16(endView, 20, 0);

  return new File([...localParts, ...centralParts, endRecord], fileNameFromFolder(files), {
    type: "application/zip",
    lastModified: Date.now(),
  });
}
