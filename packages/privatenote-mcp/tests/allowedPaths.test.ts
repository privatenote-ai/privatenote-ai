import assert from "node:assert/strict";
import { mkdir, mkdtemp, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it } from "node:test";
import {
  NO_ALLOWED_ROOTS_MESSAGE,
  PATH_NOT_ALLOWED_MESSAGE,
  PathNotAllowedError,
  assertReadableSecretPath,
  defaultAllowedRoots,
  isPathInsideRoot,
  parseAllowedRootsEnv,
} from "../src/allowedPaths.ts";

describe("parseAllowedRootsEnv", () => {
  it("splits on colon and semicolon on posix", () => {
    if (process.platform === "win32") return;
    assert.deepEqual(parseAllowedRootsEnv("/a:/b;/c"), ["/a", "/b", "/c"]);
  });

  it("does not split Windows drive letters", () => {
    if (process.platform !== "win32") return;
    assert.deepEqual(parseAllowedRootsEnv("C:\\work;D:\\inbox"), ["C:\\work", "D:\\inbox"]);
  });
});

describe("isPathInsideRoot", () => {
  it("accepts the root itself and descendants", () => {
    assert.equal(isPathInsideRoot("/work", "/work"), true);
    assert.equal(isPathInsideRoot("/work/secret.txt", "/work"), true);
  });

  it("rejects a sibling prefix", () => {
    assert.equal(isPathInsideRoot("/work-evil/secret.txt", "/work"), false);
    assert.equal(isPathInsideRoot("/etc/passwd", "/work"), false);
  });

  it("rejects allowed-root prefix confusion such as /workspace-safe vs /workspace", () => {
    assert.equal(isPathInsideRoot("/workspace-safe/file.pdf", "/workspace"), false);
    assert.equal(isPathInsideRoot("/workspace/file.pdf", "/workspace"), true);
  });
});

describe("defaultAllowedRoots", () => {
  it("uses cwd when it is not home or filesystem root", () => {
    const cwd = join(tmpdir(), "project");
    const home = join(tmpdir(), "home");
    assert.deepEqual(defaultAllowedRoots({ cwd, home, env: {} }), [resolve(cwd)]);
  });

  it("fails closed when cwd is the home directory", () => {
    const home = join(tmpdir(), "home-closed");
    assert.deepEqual(defaultAllowedRoots({ cwd: home, home, env: {} }), []);
  });

  it("fails closed when cwd is filesystem root", () => {
    const home = join(tmpdir(), "home");
    const root = process.platform === "win32" ? "C:\\" : "/";
    assert.deepEqual(defaultAllowedRoots({ cwd: root, home, env: {} }), []);
  });

  it("honors PRIVATENOTE_MCP_ALLOWED_ROOTS including home", () => {
    const home = join(tmpdir(), "home-explicit");
    const inbox = join(tmpdir(), "inbox");
    const splitter = process.platform === "win32" ? ";" : ":";
    assert.deepEqual(
      defaultAllowedRoots({
        cwd: home,
        home,
        env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: `${home}${splitter}${inbox}` },
      }),
      [resolve(home), resolve(inbox)],
    );
  });
});

describe("assertReadableSecretPath", () => {
  it("allows a file under the configured root", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-allow-"));
    const file = join(dir, "secret.txt");
    await writeFile(file, "ok", "utf8");
    try {
      const resolved = await assertReadableSecretPath(file, {
        cwd: dir,
        home: join(dir, "home"),
        env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: dir },
      });
      assert.equal(resolved, await realpath(file));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("rejects a file outside the allowlist with a generic error", async () => {
    const allowed = await mkdtemp(join(tmpdir(), "pn-allow-"));
    const other = await mkdtemp(join(tmpdir(), "pn-other-"));
    const file = join(other, "secret.txt");
    await writeFile(file, "steal-me", "utf8");
    try {
      await assert.rejects(
        () =>
          assertReadableSecretPath(file, {
            cwd: allowed,
            home: join(allowed, "home"),
            env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: allowed },
          }),
        (err: unknown) => {
          assert.ok(err instanceof PathNotAllowedError);
          assert.equal(err.message, PATH_NOT_ALLOWED_MESSAGE);
          assert.ok(!err.message.includes("steal-me"));
          assert.ok(!err.message.includes(file));
          return true;
        },
      );
    } finally {
      await rm(allowed, { recursive: true, force: true });
      await rm(other, { recursive: true, force: true });
    }
  });

  it("rejects ~/.ssh even when the allowlist is the home directory", async () => {
    const home = await mkdtemp(join(tmpdir(), "pn-home-"));
    await mkdir(join(home, ".ssh"), { recursive: true });
    const key = join(home, ".ssh", "id_rsa");
    await writeFile(key, "-----BEGIN OPENSSH PRIVATE KEY-----\n", "utf8");
    try {
      await assert.rejects(
        () =>
          assertReadableSecretPath(key, {
            cwd: home,
            home,
            env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: home },
          }),
        (err: unknown) => {
          assert.ok(err instanceof PathNotAllowedError);
          assert.equal(err.message, PATH_NOT_ALLOWED_MESSAGE);
          assert.ok(!err.message.includes("id_rsa"));
          return true;
        },
      );
    } finally {
      await rm(home, { recursive: true, force: true });
    }
  });

  it("rejects the MCP session file even inside an allowed directory", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pn-session-"));
    const sessionPath = join(dir, "mcp-session.json");
    await writeFile(sessionPath, '{"accessToken":"steal-me"}', "utf8");
    try {
      await assert.rejects(
        () =>
          assertReadableSecretPath(sessionPath, {
            cwd: dir,
            home: join(dir, "home"),
            env: {
              PRIVATENOTE_MCP_ALLOWED_ROOTS: dir,
              PRIVATENOTE_MCP_SESSION_PATH: sessionPath,
            },
          }),
        PathNotAllowedError,
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("rejects a symlink from an allowed directory to a denied path", async () => {
    const home = await mkdtemp(join(tmpdir(), "pn-sym-home-"));
    const allowed = await mkdtemp(join(tmpdir(), "pn-sym-allow-"));
    await mkdir(join(home, ".ssh"), { recursive: true });
    const key = join(home, ".ssh", "id_rsa");
    await writeFile(key, "FAKEKEY", "utf8");
    const link = join(allowed, "not-a-key.txt");
    try {
      await symlink(key, link);
    } catch {
      await rm(home, { recursive: true, force: true });
      await rm(allowed, { recursive: true, force: true });
      return;
    }
    try {
      await assert.rejects(
        () =>
          assertReadableSecretPath(link, {
            cwd: allowed,
            home,
            env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: allowed },
          }),
        PathNotAllowedError,
      );
    } finally {
      await rm(home, { recursive: true, force: true });
      await rm(allowed, { recursive: true, force: true });
    }
  });

  it("rejects ../ traversal out of the allowed root", async () => {
    const parent = await mkdtemp(join(tmpdir(), "pn-trav-"));
    const allowed = join(parent, "workspace");
    const other = join(parent, "other");
    await mkdir(allowed, { recursive: true });
    await mkdir(other, { recursive: true });
    const secret = join(other, "secret.txt");
    await writeFile(secret, "steal-me", "utf8");
    try {
      await assert.rejects(
        () =>
          assertReadableSecretPath(join(allowed, "..", "other", "secret.txt"), {
            cwd: allowed,
            home: join(parent, "home"),
            env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: allowed },
          }),
        PathNotAllowedError,
      );
    } finally {
      await rm(parent, { recursive: true, force: true });
    }
  });

  it("rejects a nested symlink that escapes the allowed root", async () => {
    const allowed = await mkdtemp(join(tmpdir(), "pn-nest-allow-"));
    const outside = await mkdtemp(join(tmpdir(), "pn-nest-out-"));
    const secret = join(outside, "secret.txt");
    await writeFile(secret, "outside", "utf8");
    const linkDir = join(allowed, "vendor");
    try {
      await symlink(outside, linkDir);
    } catch {
      await rm(allowed, { recursive: true, force: true });
      await rm(outside, { recursive: true, force: true });
      return;
    }
    try {
      await assert.rejects(
        () =>
          assertReadableSecretPath(join(linkDir, "secret.txt"), {
            cwd: allowed,
            home: join(allowed, "home"),
            env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: allowed },
          }),
        PathNotAllowedError,
      );
    } finally {
      await rm(allowed, { recursive: true, force: true });
      await rm(outside, { recursive: true, force: true });
    }
  });

  it("rejects a symlink to a sensitive file even when the link name looks safe", async () => {
    const home = await mkdtemp(join(tmpdir(), "pn-sens-home-"));
    const allowed = await mkdtemp(join(tmpdir(), "pn-sens-allow-"));
    await mkdir(join(home, ".aws"), { recursive: true });
    const creds = join(home, ".aws", "credentials");
    await writeFile(creds, "[default]\naws_secret_access_key=steal\n", "utf8");
    const link = join(allowed, "notes.txt");
    try {
      await symlink(creds, link);
    } catch {
      await rm(home, { recursive: true, force: true });
      await rm(allowed, { recursive: true, force: true });
      return;
    }
    try {
      await assert.rejects(
        () =>
          assertReadableSecretPath(link, {
            cwd: allowed,
            home,
            env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: allowed },
          }),
        PathNotAllowedError,
      );
    } finally {
      await rm(home, { recursive: true, force: true });
      await rm(allowed, { recursive: true, force: true });
    }
  });

  it("rejects files under a prefix-confused sibling of the allowed root", async () => {
    const parent = await mkdtemp(join(tmpdir(), "pn-prefix-"));
    const workspace = join(parent, "workspace");
    const workspaceSafe = join(parent, "workspace-safe");
    await mkdir(workspace, { recursive: true });
    await mkdir(workspaceSafe, { recursive: true });
    const file = join(workspaceSafe, "secret.txt");
    await writeFile(file, "nope", "utf8");
    try {
      await assert.rejects(
        () =>
          assertReadableSecretPath(file, {
            cwd: workspace,
            home: join(parent, "home"),
            env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: workspace },
          }),
        PathNotAllowedError,
      );
    } finally {
      await rm(parent, { recursive: true, force: true });
    }
  });

  it("rejects blocked cloud credentials and PrivateNote session files on the canonical target", async () => {
    const home = await mkdtemp(join(tmpdir(), "pn-cloud-home-"));
    await mkdir(join(home, ".aws"), { recursive: true });
    await mkdir(join(home, ".config", "gcloud"), { recursive: true });
    await mkdir(join(home, ".config", "privatenote"), { recursive: true });
    const aws = join(home, ".aws", "credentials");
    const gcloud = join(home, ".config", "gcloud", "application_default_credentials.json");
    const session = join(home, ".config", "privatenote", "mcp-session.json");
    await writeFile(aws, "keys", "utf8");
    await writeFile(gcloud, "{}", "utf8");
    await writeFile(session, "{}", "utf8");
    const ctx = {
      cwd: home,
      home,
      env: { PRIVATENOTE_MCP_ALLOWED_ROOTS: home },
    };
    try {
      await assert.rejects(() => assertReadableSecretPath(aws, ctx), PathNotAllowedError);
      await assert.rejects(() => assertReadableSecretPath(gcloud, ctx), PathNotAllowedError);
      await assert.rejects(() => assertReadableSecretPath(session, ctx), PathNotAllowedError);
    } finally {
      await rm(home, { recursive: true, force: true });
    }
  });

  it("fails closed with a distinct message when no roots are configured", async () => {
    await assert.rejects(
      () =>
        assertReadableSecretPath("/tmp/x", {
          cwd: "/Users/me",
          home: "/Users/me",
          env: {},
        }),
      (err: unknown) => {
        assert.ok(err instanceof PathNotAllowedError);
        assert.equal(err.message, NO_ALLOWED_ROOTS_MESSAGE);
        return true;
      },
    );
  });
});
