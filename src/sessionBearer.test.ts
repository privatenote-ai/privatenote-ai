import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readBearerToken, readSessionIdFromRequest } from "./sessionBearer.ts";

describe("readSessionIdFromRequest", () => {
  it("prefers the session cookie over Authorization Bearer", () => {
    const request = new Request("https://privatenote.ai/api/notes/reserve", {
      headers: { Authorization: "Bearer plugin-token" },
    });
    const found = readSessionIdFromRequest(request, "pn_session", { pn_session: "cookie-session" });
    assert.deepEqual(found, { sessionId: "cookie-session", fromBearer: false });
  });

  it("reads Bearer when no cookie is present", () => {
    const request = new Request("https://privatenote.ai/api/notes/reserve", {
      headers: { Authorization: "Bearer plugin-token" },
    });
    const found = readSessionIdFromRequest(request, "pn_session", {});
    assert.deepEqual(found, { sessionId: "plugin-token", fromBearer: true });
    assert.equal(readBearerToken(request), "plugin-token");
  });

  it("returns null when neither cookie nor Bearer is present", () => {
    const request = new Request("https://privatenote.ai/api/notes/reserve");
    assert.equal(readSessionIdFromRequest(request, "pn_session", {}), null);
  });
});
