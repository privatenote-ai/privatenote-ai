import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deriveNoteRootKeys, generateRootKeyBytes } from "./encryption.ts";
import {
  decryptSodiumAttachmentChunks,
  encryptFileToSodiumChunks,
  SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES,
  type SodiumAttachmentChunk,
} from "./libsodiumFileAttachment.ts";

(globalThis as unknown as { window: typeof globalThis }).window = globalThis;

function buildTestFile(): File {
  const bytes = new Uint8Array(SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES + 97);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = i % 251;
  }
  return new File([bytes], "chunked.bin", { type: "application/octet-stream" });
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
  it("encrypts and decrypts a multi-chunk file", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { fileWrapKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);
    const file = buildTestFile();
    const encryptedChunks = new Map<number, Uint8Array>();

    const metadata = await encryptFileToSodiumChunks(
      file,
      fileWrapKey,
      "00000000-0000-4000-8000-000000044444",
      async (chunk) => {
        encryptedChunks.set(chunk.index, chunk.encryptedBytes);
      },
    );

    assert.equal(metadata.totalChunks, 2);
    assert.equal(encryptedChunks.size, 2);

    const decryptedChunks = await decryptSodiumAttachmentChunks(
      metadata,
      fileWrapKey,
      async (index) => encryptedChunks.get(index)!,
    );
    assert.deepEqual(join(decryptedChunks), new Uint8Array(await file.arrayBuffer()));
  });

  it("rejects out-of-order chunks", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { fileWrapKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);
    const encryptedChunks = new Map<number, Uint8Array>();
    const metadata = await encryptFileToSodiumChunks(
      buildTestFile(),
      fileWrapKey,
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

  it("rejects truncated chunks", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { fileWrapKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);
    const encryptedChunks = new Map<number, Uint8Array>();
    const metadata = await encryptFileToSodiumChunks(
      buildTestFile(),
      fileWrapKey,
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
