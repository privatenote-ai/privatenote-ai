import assert from "node:assert/strict";
import { mkdtemp, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  FILE_CHANGED_AFTER_PREVIEW_MESSAGE,
  inspectBoundFile,
  reopenAndVerifyBoundFile,
} from "../src/boundFile.ts";

describe("bound file identity", () => {
  it("inspect then reopen succeeds when the file is unchanged", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-bound-ok-"));
    const file = join(dir, "a.txt");
    await writeFile(file, "same-bytes", "utf8");
    const ctx = { cwd: dir, home: join(dir, "home"), env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: dir } };
    try {
      const inspected = await inspectBoundFile(file, "contentFilePath", ctx);
      assert.equal(inspected.fileSizeBytes, 10);
      assert.match(inspected.contentSha256, /^[0-9a-f]{64}$/);
      const bytes = await reopenAndVerifyBoundFile(inspected, ctx);
      assert.equal(Buffer.from(bytes).toString("utf8"), "same-bytes");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("rejects content modified after preview, including same-size replacement", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-bound-mod-"));
    const file = join(dir, "a.txt");
    await writeFile(file, "aaaaaaaaaa", "utf8");
    const ctx = { cwd: dir, home: join(dir, "home"), env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: dir } };
    try {
      const inspected = await inspectBoundFile(file, "contentFilePath", ctx);
      await writeFile(file, "bbbbbbbbbb", "utf8");
      await assert.rejects(
        () => reopenAndVerifyBoundFile(inspected, ctx),
        (err: unknown) => {
          assert.ok(err instanceof Error);
          assert.equal(err.message, FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
          return true;
        },
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("rejects a replaced file whose inode changed", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-bound-ino-"));
    const file = join(dir, "a.txt");
    await writeFile(file, "original", "utf8");
    const ctx = { cwd: dir, home: join(dir, "home"), env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: dir } };
    try {
      const inspected = await inspectBoundFile(file, "contentFilePath", ctx);
      await unlink(file);
      await writeFile(file, "original", "utf8");
      await assert.rejects(
        () => reopenAndVerifyBoundFile(inspected, ctx),
        (err: unknown) => {
          assert.ok(err instanceof Error);
          assert.equal(err.message, FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
          return true;
        },
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("rejects a path deleted before confirmation", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-bound-del-"));
    const file = join(dir, "a.txt");
    await writeFile(file, "gone-soon", "utf8");
    const ctx = { cwd: dir, home: join(dir, "home"), env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: dir } };
    try {
      const inspected = await inspectBoundFile(file, "contentFilePath", ctx);
      await unlink(file);
      await assert.rejects(
        () => reopenAndVerifyBoundFile(inspected, ctx),
        (err: unknown) => {
          assert.ok(err instanceof Error);
          assert.equal(err.message, FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
          return true;
        },
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
