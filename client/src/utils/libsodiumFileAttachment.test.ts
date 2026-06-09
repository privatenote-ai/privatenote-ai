import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { arrayBufferToBase64, deriveNoteRootKeys, generateRootKeyBytes } from "./encryption.ts";
import {
  decryptSodiumAttachmentChunks,
  decryptSodiumAttachmentMetadata,
  encryptFileToSodiumChunks,
  SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES,
  type SodiumAttachmentChunk,
} from "./libsodiumFileAttachment.ts";

(globalThis as unknown as { window: typeof globalThis }).window = globalThis;

const NOTE_ID = "00000000-0000-4000-8000-000000044444";

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
  it("keeps upload chunks below proxy-sensitive sizes while supporting 1 GB files", () => {
    assert.equal(SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES, 2 * 1024 * 1024);
    assert.ok(Math.ceil((1024 * 1024 * 1024) / SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES) <= 999);
  });

  it("encrypts and decrypts a multi-chunk file", async () => {
    const { rootKeyBytes } = generateRootKeyBytes();
    const { fileWrapKey, metadataKey } = await deriveNoteRootKeys(rootKeyBytes);
    rootKeyBytes.fill(0);
    const file = buildTestFile();
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

    assert.equal(metadata.totalChunks, 2);
    assert.ok(metadata.encryptedMetadata);
    assert.equal(encryptedChunks.size, 2);
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
