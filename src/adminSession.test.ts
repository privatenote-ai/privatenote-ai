import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { KVNamespace } from "@cloudflare/workers-types";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_KV_PREFIX,
  ADMIN_SESSION_TTL_SECONDS,
  adminSessionCookie,
  adminSessionIsValid,
  adminSessionKvKey,
  clearAdminSessionCookie,
  createAdminSession,
  revokeAdminSession,
  sha256Base64Url,
} from "./adminSession.ts";

class FakeKv {
  public store = new Map<string, { value: string; expirationTtl?: number }>();

  async get(key: string, typeOrOptions?: string | { type?: string }): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    const type = typeof typeOrOptions === "string" ? typeOrOptions : typeOrOptions?.type;
    if (type === "json") return JSON.parse(entry.value);
    return entry.value;
  }

  async put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> {
    this.store.set(key, { value, expirationTtl: options?.expirationTtl });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

function kv(): KVNamespace {
  return new FakeKv() as unknown as KVNamespace;
}

const ADMIN_TOKEN = "long-lived-admin-secret";

describe("admin session cookies", () => {
  it("sets an opaque session id, not ADMIN_TOKEN", async () => {
    const store = kv();
    const sessionId = await createAdminSession(store, ADMIN_TOKEN);
    const cookie = adminSessionCookie(sessionId);

    assert.notEqual(sessionId, ADMIN_TOKEN);
    assert.equal(cookie.includes(ADMIN_TOKEN), false);
    assert.match(cookie, new RegExp(`^${ADMIN_SESSION_COOKIE_NAME}=`));
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /Secure/);
    assert.match(cookie, /SameSite=Strict/);
    assert.match(cookie, /Path=\/api\/admin/);
    assert.match(cookie, new RegExp(`Max-Age=${ADMIN_SESSION_TTL_SECONDS}`));
    assert.match(clearAdminSessionCookie(), /Max-Age=0/);
  });

  it("stores only the hashed session id in KV", async () => {
    const store = new FakeKv();
    const sessionId = await createAdminSession(store as unknown as KVNamespace, ADMIN_TOKEN);
    const sessionIdHash = await sha256Base64Url(sessionId);
    const keys = [...store.store.keys()];

    assert.deepEqual(keys, [adminSessionKvKey(sessionIdHash)]);
    assert.equal(keys[0]!.startsWith(ADMIN_SESSION_KV_PREFIX), true);
    assert.equal(keys.some((key) => key.includes(sessionId)), false);
    assert.equal(JSON.stringify([...store.store.values()]).includes(sessionId), false);
    assert.equal(JSON.stringify([...store.store.values()]).includes(ADMIN_TOKEN), false);
    assert.equal(store.store.get(keys[0]!)?.expirationTtl, ADMIN_SESSION_TTL_SECONDS);
  });

  it("accepts the opaque cookie and rejects the raw ADMIN_TOKEN", async () => {
    const store = kv();
    const sessionId = await createAdminSession(store, ADMIN_TOKEN);

    assert.equal(await adminSessionIsValid(store, sessionId, ADMIN_TOKEN), true);
    assert.equal(await adminSessionIsValid(store, ADMIN_TOKEN, ADMIN_TOKEN), false);
    assert.equal(await adminSessionIsValid(store, "forged-session", ADMIN_TOKEN), false);
  });

  it("invalidates sessions after logout or ADMIN_TOKEN rotation", async () => {
    const store = kv();
    const sessionId = await createAdminSession(store, ADMIN_TOKEN);

    await revokeAdminSession(store, sessionId);
    assert.equal(await adminSessionIsValid(store, sessionId, ADMIN_TOKEN), false);

    const rotated = await createAdminSession(store, ADMIN_TOKEN);
    assert.equal(await adminSessionIsValid(store, rotated, "rotated-admin-token"), false);
    assert.equal(await adminSessionIsValid(store, rotated, ADMIN_TOKEN), true);
  });
});
