import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SAFARI_ATTACHMENT_CHUNK_BYTES,
  SAFARI_SINGLE_BLOB_MAX_BYTES,
  SINGLE_BLOB_PROGRESS_FRAME_BYTES,
  setSafariChunkingEnabledForTests,
} from "../lib/safariSafeChunkUpload.ts";
import { arrayBufferToBase64, deriveNoteRootKeys, generateRootKeyBytes } from "./encryption.ts";
import {
  decryptSodiumAttachmentChunks,
  decryptSodiumAttachmentMetadata,
  encryptFileToSodiumBlob,
  encryptFileToSodiumChunks,
  type AttachmentDecryptProgress,
  type SodiumAttachmentChunk,
} from "./libsodiumFileAttachment.ts";

(globalThis as unknown as { window: typeof globalThis }).window = globalThis;

// Multi-chunk frames are Safari-only when temporary chunking is enabled.
Object.defineProperty(globalThis, "navigator", {
  value: {
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  },
  configurable: true,
});
setSafariChunkingEnabledForTests(true);

const NOTE_ID = "00000000-0000-4000-8000-000000044444";

/** Just over the Safari single-Blob cap → few ~4 MiB secretstream frames. */
function buildTestFile(): File {
  const bytes = new Uint8Array(SAFARI_SINGLE_BLOB_MAX_BYTES + 97);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = i % 251;
  }
  return new File([bytes], "chunked.bin", { type: "application/octet-stream" });
}

function expectedSafariChunkCount(fileSize: number): number {
  return Math.max(1, Math.ceil(fileSize / SAFARI_ATTACHMENT_CHUNK_BYTES));
}

function join(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

describe("libsodium attachment chunk encryption", () => {
  it("keeps upload chunks below proxy-sensitive sizes while supporting 1 GB files", () => {
    assert.ok(SAFARI_ATTACHMENT_CHUNK_BYTES >= Math.ceil((1024 * 1024 * 1024) / 1024));
    assert.ok(Math.ceil((1024 * 1024 * 1024) / SAFARI_ATTACHMENT_CHUNK_BYTES) <= 1024);
  });

  it("encrypts and decrypts a multi-chunk file", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { fileWrapKey, metadataKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);
    const file = buildTestFile();
    const expectedChunks = expectedSafariChunkCount(file.size);
    const encryptedChunks = new Map<number, Uint8Array>();

    const metadata = await encryptFileToSodiumChunks(
      file,
      fileWrapKey,
      metadataKey,
      NOTE_ID,
      async (chunk) => {
        encryptedChunks.set(chunk.index, chunk.encryptedBytes);
      },
    );

    assert.equal(metadata.totalChunks, expectedChunks);
    assert.ok(expectedChunks > 1);
    assert.ok(metadata.encryptedMetadata);
    assert.match(metadata.encryptedContentSha256, /^[a-f0-9]{64}$/);
    assert.equal(encryptedChunks.size, expectedChunks);
    assert.deepEqual(await decryptSodiumAttachmentMetadata(metadata, metadataKey, NOTE_ID), {
      name: "chunked.bin",
      type: "application/octet-stream",
      size: file.size,
    });

    const decryptedChunks = await decryptSodiumAttachmentChunks(
      metadata,
      fileWrapKey,
      async (index) => encryptedChunks.get(index)!,
    );
    assert.deepEqual(join(decryptedChunks), new Uint8Array(await file.arrayBuffer()));
  });

  it("rejects encrypted metadata when AAD does not match the note", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { fileWrapKey, metadataKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);
    const encryptedChunks = new Map<number, Uint8Array>();
    const metadata = await encryptFileToSodiumChunks(
      buildTestFile(),
      fileWrapKey,
      metadataKey,
      NOTE_ID,
      async (chunk) => {
        encryptedChunks.set(chunk.index, chunk.encryptedBytes);
      },
    );
    const tampered = {
      ...metadata,
      encryptedMetadata: {
        ...metadata.encryptedMetadata!,
        aad: arrayBufferToBase64(
          new TextEncoder().encode(
            JSON.stringify({
              v: 1,
              purpose: "privatenote-attachment-metadata",
              alg: "libsodium-secretstream-xchacha20poly1305",
              noteId: "00000000-0000-4000-8000-000000099999",
              totalChunks: metadata.totalChunks,
            }),
          ),
        ),
      },
    };

    await assert.rejects(
      () => decryptSodiumAttachmentMetadata(tampered, metadataKey, NOTE_ID),
      /authentication data does not match/i,
    );
  });

  it("rejects decrypted attachment metadata over wire limits", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { fileWrapKey, metadataKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);
    const metadata = await encryptFileToSodiumChunks(
      buildTestFile(),
      fileWrapKey,
      metadataKey,
      NOTE_ID,
      async () => {},
    );
    const aad = new TextEncoder().encode(
      JSON.stringify({
        v: 1,
        purpose: "privatenote-attachment-metadata",
        alg: "libsodium-secretstream-xchacha20poly1305",
        noteId: NOTE_ID,
        totalChunks: metadata.totalChunks,
      }),
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
        additionalData: aad,
        tagLength: 128,
      },
      metadataKey,
      new TextEncoder().encode(
        JSON.stringify({
          name: "a".repeat(256),
          type: "application/octet-stream",
          size: 1,
        }),
      ),
    );
    const tampered = {
      ...metadata,
      encryptedMetadata: {
        alg: "AES-GCM" as const,
        iv: arrayBufferToBase64(iv),
        aad: arrayBufferToBase64(aad),
        ciphertext: arrayBufferToBase64(new Uint8Array(ciphertext)),
      },
    };

    await assert.rejects(
      () => decryptSodiumAttachmentMetadata(tampered, metadataKey, NOTE_ID),
      /metadata is invalid/i,
    );
  });

  it("rejects out-of-order chunks", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { fileWrapKey, metadataKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);
    const encryptedChunks = new Map<number, Uint8Array>();
    const metadata = await encryptFileToSodiumChunks(
      buildTestFile(),
      fileWrapKey,
      metadataKey,
      "00000000-0000-4000-8000-000000055555",
      async (chunk: SodiumAttachmentChunk) => {
        encryptedChunks.set(chunk.index, chunk.encryptedBytes);
      },
    );

    await assert.rejects(
      () =>
        decryptSodiumAttachmentChunks(metadata, fileWrapKey, async (index) =>
          encryptedChunks.get(index === 0 ? 1 : 0)!,
        ),
      /authentication|sequence/i,
    );
  });

  it("reports linear decrypt progress for single-blob multi-frame files", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { fileWrapKey, metadataKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);

    // Large enough for multiple ~4 MiB secretstream frames inside one Blob.
    const bytes = new Uint8Array(SINGLE_BLOB_PROGRESS_FRAME_BYTES + 64 * 1024);
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = i % 251;
    }
    const file = new File([bytes], "single-blob.bin", { type: "application/octet-stream" });
    const encrypted = await encryptFileToSodiumBlob(file, fileWrapKey, metadataKey, NOTE_ID);
    assert.equal(encrypted.metadata.totalChunks, 1);

    const encryptedBytes = new Uint8Array(await encrypted.blob.arrayBuffer());
    const ratios: number[] = [];
    const phases: Array<"download" | "decrypt"> = [];
    const decrypted = await decryptSodiumAttachmentChunks(
      encrypted.metadata,
      fileWrapKey,
      async () => encryptedBytes,
      (progress: AttachmentDecryptProgress) => {
        assert.ok(progress.phase === "download" || progress.phase === "decrypt");
        assert.equal(typeof progress.ratio, "number");
        ratios.push(progress.ratio!);
        phases.push(progress.phase);
      },
    );

    assert.deepEqual(join(decrypted), bytes);
    assert.ok(ratios.length >= 2, `expected multiple progress ticks, got ${ratios.length}`);
    assert.ok(
      phases.includes("download"),
      "expected download-phase progress so the bar moves during fetch",
    );
    assert.ok(phases.includes("decrypt"), "expected decrypt-phase progress");
    for (let i = 1; i < ratios.length; i += 1) {
      assert.ok(ratios[i]! + 1e-9 >= ratios[i - 1]!, `progress went backwards at ${i}`);
    }
    assert.equal(ratios[ratios.length - 1], 1);
    // Download should claim a meaningful share before decrypt finishes the bar.
    const firstDecryptIdx = phases.indexOf("decrypt");
    assert.ok(firstDecryptIdx > 0, "decrypt should follow download ticks");
    assert.ok(
      ratios[firstDecryptIdx - 1]! >= 0.5,
      `expected download to cover most of the early bar, got ${ratios[firstDecryptIdx - 1]}`,
    );
  });

  it("rejects truncated chunks", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { fileWrapKey, metadataKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);
    const encryptedChunks = new Map<number, Uint8Array>();
    const metadata = await encryptFileToSodiumChunks(
      buildTestFile(),
      fileWrapKey,
      metadataKey,
      "00000000-0000-4000-8000-000000066666",
      async (chunk) => {
        encryptedChunks.set(chunk.index, chunk.encryptedBytes);
      },
    );
    const first = encryptedChunks.get(0)!;
    encryptedChunks.set(0, first.subarray(0, first.byteLength - 1));

    await assert.rejects(
      () =>
        decryptSodiumAttachmentChunks(
          metadata,
          fileWrapKey,
          async (index) => encryptedChunks.get(index)!,
        ),
      /authentication|invalid/i,
    );
  });
});
