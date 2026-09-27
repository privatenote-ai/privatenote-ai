import assert from "node:assert/strict";
import { describe, it, after, beforeEach } from "node:test";
import { mkdtemp, unlink, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  MAX_PENDING_CREATES,
  PENDING_CREATE_TTL_MS,
  clearPendingCreates,
  expirePendingCreateForTests,
  pendingCreateCount,
  putPendingCreate,
} from "../src/pendingCreates.ts";
import {
  freezeMcpRuntimeConfig,
  resetFrozenMcpRuntimeConfigForTests,
} from "../src/config.ts";
import { FILE_CHANGED_AFTER_PREVIEW_MESSAGE } from "../src/boundFile.ts";
import { handleCreatePrivateNote, createPrivateNoteSchema } from "../src/tools/createPrivateNote.ts";
import { handleConfirmPrivateNote, confirmPrivateNoteSchema } from "../src/tools/confirmPrivateNote.ts";
import { formatNotePreviewMessage, previewPrivateNote } from "../src/createNote.ts";

const TEST_NOTE_ID = "00000000-0000-0000-0000-000000000009";
const SECRET = "preview-should-never-upload-this";

type RequestBody = Record<string, unknown>;
let fetchCalls: { url: string; body: RequestBody | null }[] = [];
let globalFetchOriginal: typeof globalThis.fetch | undefined;
let failCreate = false;

function mockFetch() {
  fetchCalls = [];
  failCreate = false;
  globalFetchOriginal = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    let parsed: RequestBody | null = null;
    if (init?.body && typeof init.body === "string") {
      parsed = JSON.parse(init.body) as RequestBody;
    }
    fetchCalls.push({ url, body: parsed });
    if (url.includes("/api/notes/reserve")) {
      return new Response(JSON.stringify({ id: TEST_NOTE_ID }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.includes("/api/notes")) {
      if (failCreate) {
        return new Response(JSON.stringify({ error: "nope" }), { status: 500 });
      }
      return new Response(JSON.stringify({ id: TEST_NOTE_ID }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Not found", { status: 404 });
  };
}

function restoreFetch() {
  if (globalFetchOriginal) globalThis.fetch = globalFetchOriginal;
}

function parseToolJson(result: { content: Array<{ text?: string }> }): Record<string, unknown> {
  const text = result.content[0]?.text ?? "";
  return JSON.parse(text) as Record<string, unknown>;
}

async function withEnv<T>(
  updates: Record<string, string | undefined>,
  fn: () => Promise<T>,
): Promise<T> {
  const previous: Record<string, string | undefined> = {};
  for (const key of Object.keys(updates)) {
    previous[key] = process.env[key];
    const value = updates[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return await fn();
  } finally {
    for (const key of Object.keys(updates)) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key]!;
    }
  }
}

describe("create/confirm confirmation flow", () => {
  beforeEach(() => {
    clearPendingCreates();
    resetFrozenMcpRuntimeConfigForTests();
    delete process.env["PRIVATENOTE_MCP_ALLOW_ONE_SHOT"];
    delete process.env["PRIVATENOTE_MCP_ONE_SHOT"];
  });

  after(restoreFetch);

  it("preview does not read secret bytes as a returned field and create_private_note does not upload", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-mcp-preview-"));
    const contentPath = join(dir, "secret.txt");
    await writeFile(contentPath, SECRET, "utf8");
    mockFetch();
    try {
      await withEnv({ PRIVATENOTE_MCP_ALLOWED_ROOTS: dir }, async () => {
        const preview = await previewPrivateNote({ contentFilePath: contentPath });
        assert.equal(preview.contentFromFile, true);
        assert.ok(!JSON.stringify(preview).includes(SECRET));

        const tool = await handleCreatePrivateNote({ contentFilePath: contentPath });
        const payload = parseToolJson(tool);
        assert.equal(payload["status"], "pending_confirmation");
        assert.match(String(payload["confirmationId"]), /^cnfg_[0-9a-f]{64}$/);
        assert.equal(payload["secureUrl"], undefined);
        assert.equal(fetchCalls.length, 0);
        assert.ok(!JSON.stringify(payload).includes(SECRET));
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("confirm_private_note creates the URL only after consume", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-mcp-confirm-"));
    const contentPath = join(dir, "secret.txt");
    await writeFile(contentPath, SECRET, "utf8");
    mockFetch();
    try {
      await withEnv({ PRIVATENOTE_MCP_ALLOWED_ROOTS: dir }, async () => {
        const prepared = parseToolJson(
          await handleCreatePrivateNote({ contentFilePath: contentPath, expiresIn: "15m" }),
        );
        const confirmationId = String(prepared["confirmationId"]);
        assert.equal(fetchCalls.length, 0);

        const created = parseToolJson(
          await handleConfirmPrivateNote({ confirmationId }),
        );
        assert.equal(created["status"], "created");
        assert.equal(created["sendAuthorized"], false);
        assert.match(String(created["secureUrl"]), /\/note\/[0-9a-f-]{36}#/);
        assert.equal(fetchCalls.length, 2);
        assert.ok(!JSON.stringify(created).includes(SECRET));
        assert.ok(!JSON.stringify(fetchCalls[1]!.body).includes(SECRET));

        await assert.rejects(
          () => handleConfirmPrivateNote({ confirmationId }),
          /invalid or expired/i,
        );
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("creation without send intent returns sendAuthorized false", async () => {
    mockFetch();
    const prepared = parseToolJson(await handleCreatePrivateNote({ content: SECRET }));
    const created = parseToolJson(
      await handleConfirmPrivateNote({ confirmationId: String(prepared["confirmationId"]) }),
    );
    assert.equal(created["sendAuthorized"], false);
    const summary = formatNotePreviewMessage(
      prepared["preview"] as Parameters<typeof formatNotePreviewMessage>[0],
    );
    assert.match(summary, /not requested/i);
  });

  it("preview summary groups files, note options, and send policy", () => {
    const summary = formatNotePreviewMessage({
      contentFromFile: false,
      contentFromChat: false,
      contentBytes: null,
      contentFilePath: null,
      attachedFiles: [
        {
          path: "/abs/blog-click-to-reveal-hero.jpg",
          name: "blog-click-to-reveal-hero.jpg",
          bytes: 93939,
          contentSha256: "a".repeat(64),
        },
        {
          path: "/abs/blog-encrypted-file-sharing-hero.png",
          name: "blog-encrypted-file-sharing-hero.png",
          bytes: 1_894_108,
          contentSha256: "b".repeat(64),
        },
      ],
      passwordProtected: false,
      passwordFromFile: false,
      expiresIn: "24h",
      burnAfterReading: true,
      title: null,
      recipientEmail: null,
      requireRecipientVerification: false,
      notifyOnOpen: false,
      label: null,
      sendChannel: null,
      sendRecipient: null,
      accountBranding: false,
    });
    assert.match(summary, /^Create an encrypted PrivateNote link\?\n\nFiles \(2\)/m);
    assert.match(summary, /blog-click-to-reveal-hero\.jpg\n    92 KB\n    \/abs\//);
    assert.match(summary, /blog-encrypted-file-sharing-hero\.png\n    1\.8 MB\n    \/abs\//);
    assert.match(summary, /\nNote\n  Body {14}none \(files only\)/);
    assert.match(summary, /Destroy after {5}first access/);
    assert.match(summary, /Branding {10}none/);
    assert.match(summary, /\nSend\n  Status {12}not requested/);
    assert.match(summary, /The agent must not send this URL/);
    assert.ok(!summary.includes("93939 bytes"));
  });

  it("send channel and recipient are bound at preview and shown exactly", async () => {
    mockFetch();
    const prepared = parseToolJson(
      await handleCreatePrivateNote({
        content: SECRET,
        sendChannel: "email",
        sendRecipient: "alice@example.com",
      }),
    );
    const preview = prepared["preview"] as Record<string, unknown>;
    assert.equal(preview["sendChannel"], "email");
    assert.equal(preview["sendRecipient"], "alice@example.com");
    const summary = String(prepared["summary"]);
    assert.match(summary, /Create and send secure handoff/);
    assert.match(summary, /Via\s+Email/);
    assert.match(summary, /Recipient\s+alice@example.com/);
    const created = parseToolJson(
      await handleConfirmPrivateNote({ confirmationId: String(prepared["confirmationId"]) }),
    );
    assert.equal(created["sendAuthorized"], true);
  });

  it("confirm schema accepts only confirmationId so options cannot change after preview", () => {
    const parsed = confirmPrivateNoteSchema.parse({
      confirmationId: "cnfg_abc",
      allowSend: true,
      expiresIn: "30d",
      burnAfterReading: false,
      sendRecipient: "bob@example.com",
      sendChannel: "slack",
      contentFilePath: "/tmp/other.pdf",
    });
    assert.deepEqual(Object.keys(parsed).sort(), ["confirmationId"]);
    assert.equal(parsed.confirmationId, "cnfg_abc");
    assert.equal("allowSend" in parsed, false);
  });

  it("expired confirmation cannot create a note", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-mcp-expire-"));
    const contentPath = join(dir, "secret.txt");
    await writeFile(contentPath, SECRET, "utf8");
    mockFetch();
    try {
      await withEnv({ PRIVATENOTE_MCP_ALLOWED_ROOTS: dir }, async () => {
        const prepared = parseToolJson(
          await handleCreatePrivateNote({ contentFilePath: contentPath }),
        );
        const confirmationId = String(prepared["confirmationId"]);
        expirePendingCreateForTests(confirmationId);
        await assert.rejects(
          () => handleConfirmPrivateNote({ confirmationId }),
          /invalid or expired/i,
        );
        assert.equal(fetchCalls.length, 0);
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("confirmation TTL is 5 minutes", () => {
    assert.equal(PENDING_CREATE_TTL_MS, 5 * 60 * 1000);
  });

  it("concurrent confirmation calls result in at most one success", async () => {
    mockFetch();
    const prepared = parseToolJson(await handleCreatePrivateNote({ content: SECRET }));
    const confirmationId = String(prepared["confirmationId"]);
    const results = await Promise.allSettled([
      handleConfirmPrivateNote({ confirmationId }),
      handleConfirmPrivateNote({ confirmationId }),
    ]);
    const created = results.filter(
      (result) =>
        result.status === "fulfilled" && parseToolJson(result.value)["status"] === "created",
    );
    const rejected = results.filter((result) => result.status === "rejected");
    assert.equal(created.length, 1);
    assert.equal(rejected.length, 1);
  });

  it("failed confirmation burns the token", async () => {
    mockFetch();
    const prepared = parseToolJson(await handleCreatePrivateNote({ content: SECRET }));
    const confirmationId = String(prepared["confirmationId"]);
    failCreate = true;
    await assert.rejects(() => handleConfirmPrivateNote({ confirmationId }));
    failCreate = false;
    await assert.rejects(
      () => handleConfirmPrivateNote({ confirmationId }),
      /invalid or expired/i,
    );
  });

  it("changed file after preview requires a new confirmation", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-mcp-changed-"));
    const contentPath = join(dir, "secret.txt");
    await writeFile(contentPath, "aaaaaaaaaa", "utf8");
    mockFetch();
    try {
      await withEnv({ PRIVATENOTE_MCP_ALLOWED_ROOTS: dir }, async () => {
        const prepared = parseToolJson(
          await handleCreatePrivateNote({ contentFilePath: contentPath }),
        );
        const confirmationId = String(prepared["confirmationId"]);
        await writeFile(contentPath, "bbbbbbbbbb", "utf8");
        await assert.rejects(
          () => handleConfirmPrivateNote({ confirmationId }),
          (err: unknown) => {
            assert.ok(err instanceof Error);
            assert.equal(err.message, FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
            return true;
          },
        );
        await assert.rejects(
          () => handleConfirmPrivateNote({ confirmationId }),
          /invalid or expired/i,
        );
        assert.equal(fetchCalls.length, 0);
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("deleted file after preview requires a new confirmation", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-mcp-del-"));
    const contentPath = join(dir, "secret.txt");
    await writeFile(contentPath, SECRET, "utf8");
    mockFetch();
    try {
      await withEnv({ PRIVATENOTE_MCP_ALLOWED_ROOTS: dir }, async () => {
        const prepared = parseToolJson(
          await handleCreatePrivateNote({ contentFilePath: contentPath }),
        );
        await unlink(contentPath);
        await assert.rejects(
          () => handleConfirmPrivateNote({ confirmationId: String(prepared["confirmationId"]) }),
          (err: unknown) => {
            assert.ok(err instanceof Error);
            assert.equal(err.message, FILE_CHANGED_AFTER_PREVIEW_MESSAGE);
            return true;
          },
        );
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("host elicitation approve creates immediately; decline does not", async () => {
    mockFetch();
    const declined = parseToolJson(
      await handleCreatePrivateNote(
        { content: SECRET, sendChannel: "email", sendRecipient: "alice@example.com" },
        { elicitConfirm: async () => ({ approved: false }) },
      ),
    );
    assert.equal(declined["status"], "cancelled");
    assert.equal(declined["secureUrl"], undefined);
    assert.equal(fetchCalls.length, 0);

    const created = parseToolJson(
      await handleCreatePrivateNote(
        { content: SECRET, sendChannel: "email", sendRecipient: "alice@example.com" },
        { elicitConfirm: async () => ({ approved: true }) },
      ),
    );
    assert.equal(created["status"], "created");
    assert.equal(created["sendAuthorized"], true);
    assert.match(String(created["secureUrl"]), /#/);
    assert.equal(fetchCalls.length, 2);
  });

  it("confirm without send does not re-prompt after the user already approved", async () => {
    mockFetch();
    const prepared = parseToolJson(
      await handleCreatePrivateNote({ content: SECRET }),
    );
    const created = parseToolJson(
      await handleConfirmPrivateNote(
        { confirmationId: String(prepared["confirmationId"]) },
        { elicitConfirm: async () => ({ approved: false }) },
      ),
    );
    assert.equal(created["status"], "created");
    assert.equal(created["sendAuthorized"], false);
    assert.match(String(created["secureUrl"]), /#/);
  });

  it("confirm still re-prompts when sending was requested", async () => {
    mockFetch();
    const prepared = parseToolJson(
      await handleCreatePrivateNote({
        content: SECRET,
        sendChannel: "email",
        sendRecipient: "alice@example.com",
      }),
    );
    const declined = parseToolJson(
      await handleConfirmPrivateNote(
        { confirmationId: String(prepared["confirmationId"]) },
        { elicitConfirm: async () => ({ approved: false }) },
      ),
    );
    assert.equal(declined["status"], "cancelled");
    assert.equal(declined["secureUrl"], undefined);
    assert.equal(fetchCalls.length, 0);

    const preparedAgain = parseToolJson(
      await handleCreatePrivateNote({
        content: SECRET,
        sendChannel: "email",
        sendRecipient: "alice@example.com",
      }),
    );
    const created = parseToolJson(
      await handleConfirmPrivateNote(
        { confirmationId: String(preparedAgain["confirmationId"]) },
        { elicitConfirm: async () => ({ approved: true }) },
      ),
    );
    assert.equal(created["status"], "created");
    assert.equal(created["sendAuthorized"], true);
    assert.match(String(created["secureUrl"]), /#/);
  });

  it("elicitation unavailable falls back to pending confirmation", async () => {
    mockFetch();
    const prepared = parseToolJson(
      await handleCreatePrivateNote(
        { content: SECRET },
        { elicitConfirm: async () => null },
      ),
    );
    assert.equal(prepared["status"], "pending_confirmation");
    assert.equal(fetchCalls.length, 0);
  });

  it("PRIVATENOTE_MCP_ALLOW_ONE_SHOT creates the URL in one call", async () => {
    mockFetch();
    await withEnv({ PRIVATENOTE_MCP_ALLOW_ONE_SHOT: "1" }, async () => {
      freezeMcpRuntimeConfig();
      const created = parseToolJson(
        await handleCreatePrivateNote(
          { content: SECRET },
          { elicitConfirm: async () => ({ approved: false }) },
        ),
      );
      assert.equal(created["status"], "created");
      assert.equal(created["oneShot"], true);
      assert.equal(created["sendAuthorized"], false);
      assert.match(String(created["secureUrl"]), /#/);
      assert.equal(fetchCalls.length, 2);
    });
  });

  it("one-shot cannot be enabled through tool arguments", async () => {
    mockFetch();
    freezeMcpRuntimeConfig();
    const parsed = createPrivateNoteSchema.parse({
      content: SECRET,
      oneShot: true,
      skipConfirm: true,
      allowOneShot: true,
    });
    assert.equal("oneShot" in parsed, false);
    const prepared = parseToolJson(await handleCreatePrivateNote(parsed));
    assert.equal(prepared["status"], "pending_confirmation");
    assert.equal(fetchCalls.length, 0);
  });

  it("runtime mutation of process.env cannot enable one-shot", async () => {
    mockFetch();
    freezeMcpRuntimeConfig();
    process.env["PRIVATENOTE_MCP_ALLOW_ONE_SHOT"] = "1";
    const prepared = parseToolJson(await handleCreatePrivateNote({ content: SECRET }));
    assert.equal(prepared["status"], "pending_confirmation");
    delete process.env["PRIVATENOTE_MCP_ALLOW_ONE_SHOT"];
  });

  it("one-shot still refuses paths outside the allowlist", async () => {
    const allowed = await mkdtemp(join(tmpdir(), "pn-mcp-oneshot-allow-"));
    const other = await mkdtemp(join(tmpdir(), "pn-mcp-oneshot-other-"));
    const filePath = join(other, "secret.txt");
    await writeFile(filePath, SECRET, "utf8");
    mockFetch();
    try {
      await withEnv(
        {
          PRIVATENOTE_MCP_ALLOW_ONE_SHOT: "true",
          PRIVATENOTE_MCP_ALLOWED_ROOTS: allowed,
        },
        async () => {
          freezeMcpRuntimeConfig();
          await assert.rejects(
            () => handleCreatePrivateNote({ contentFilePath: filePath }),
            /not allowed/i,
          );
          assert.equal(fetchCalls.length, 0);
        },
      );
    } finally {
      await rm(allowed, { recursive: true, force: true });
      await rm(other, { recursive: true, force: true });
    }
  });

  it("caps pending confirmations and does not store file plaintext", async () => {
    mockFetch();
    const dir = await mkdtemp(join(tmpdir(), "pn-mcp-cap-"));
    const contentPath = join(dir, "secret.txt");
    await writeFile(contentPath, SECRET, "utf8");
    try {
      await withEnv({ PRIVATENOTE_MCP_ALLOWED_ROOTS: dir }, async () => {
        for (let i = 0; i < MAX_PENDING_CREATES + 3; i += 1) {
          const payload = parseToolJson(
            await handleCreatePrivateNote({ contentFilePath: contentPath }),
          );
          assert.equal(payload["status"], "pending_confirmation");
          assert.ok(!JSON.stringify(payload).includes(SECRET));
        }
        assert.equal(pendingCreateCount(), MAX_PENDING_CREATES);
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("putPendingCreate never retains file bytes on the stored record", () => {
    const stored = putPendingCreate({
      input: { content: "chat-only" },
      preview: {
        contentFromFile: false,
        contentFromChat: true,
        contentBytes: 9,
        contentFilePath: null,
        attachedFiles: [],
        passwordProtected: false,
        passwordFromFile: false,
        expiresIn: "24h",
        burnAfterReading: true,
        title: null,
        recipientEmail: null,
        requireRecipientVerification: false,
        notifyOnOpen: false,
        label: null,
        sendChannel: null,
        sendRecipient: null,
        accountBranding: false,
      },
      boundFiles: [],
      options: {
        expiresIn: "24h",
        burnAfterReading: true,
        title: null,
        recipientEmail: null,
        requireRecipientVerification: false,
        notifyOnOpen: false,
        label: null,
        accountBranding: false,
      },
      sendAuthorization: { requested: false },
    });
    assert.equal("bytes" in stored, false);
    assert.deepEqual(stored.boundFiles, []);
  });
});
