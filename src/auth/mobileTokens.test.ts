import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyRefreshTokenRow,
  isCompactJwt,
  MOBILE_ACCESS_TOKEN_TTL_SECONDS,
  parseMobileClientType,
  signMobileAccessToken,
  verifyMobileAccessToken,
} from "./mobileTokens.ts";

const SECRET = "test-mobile-auth-secret-key-32b!!";

describe("parseMobileClientType", () => {
  it("accepts ios", () => {
    assert.equal(parseMobileClientType("ios"), "ios");
    assert.equal(parseMobileClientType("IOS"), "ios");
  });

  it("rejects web and unknown clients", () => {
    assert.equal(parseMobileClientType("web"), null);
    assert.equal(parseMobileClientType("android"), null);
    assert.equal(parseMobileClientType(""), null);
    assert.equal(parseMobileClientType(null), null);
  });
});

describe("mobile access JWT", () => {
  it("round-trips a valid token", async () => {
    const token = await signMobileAccessToken(SECRET, { sub: "user-1", sid: "session-row-1" });
    assert.equal(isCompactJwt(token), true);
    const claims = await verifyMobileAccessToken(SECRET, token);
    assert.ok(claims);
    assert.equal(claims.sub, "user-1");
    assert.equal(claims.sid, "session-row-1");
    assert.equal(claims.typ, "pn_mobile_access");
    assert.equal(claims.exp - claims.iat, MOBILE_ACCESS_TOKEN_TTL_SECONDS);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signMobileAccessToken(SECRET, { sub: "user-1", sid: "session-row-1" });
    assert.equal(await verifyMobileAccessToken("other-secret", token), null);
  });

  it("rejects an expired token", async () => {
    const nowMs = 1_700_000_000_000;
    const token = await signMobileAccessToken(SECRET, {
      sub: "user-1",
      sid: "session-row-1",
      nowMs,
      ttlSeconds: 900,
    });
    assert.equal(await verifyMobileAccessToken(SECRET, token, nowMs + 901_000), null);
    assert.ok(await verifyMobileAccessToken(SECRET, token, nowMs + 1000));
  });

  it("does not treat opaque session ids as JWTs", () => {
    assert.equal(isCompactJwt("abc"), false);
    assert.equal(isCompactJwt("a.b"), false);
  });
});

describe("classifyRefreshTokenRow", () => {
  const now = Date.parse("2026-09-07T12:00:00.000Z");

  it("accepts an unrevoked unexpired token", () => {
    assert.equal(
      classifyRefreshTokenRow(
        { expires_at: "2026-10-07T12:00:00.000Z", revoked_at: null, replaced_by_id: null },
        now,
      ),
      "ok",
    );
  });

  it("flags reuse of a rotated token", () => {
    assert.equal(
      classifyRefreshTokenRow(
        {
          expires_at: "2026-10-07T12:00:00.000Z",
          revoked_at: "2026-09-07T11:00:00.000Z",
          replaced_by_id: "next-id",
        },
        now,
      ),
      "reuse",
    );
  });

  it("flags logout/revoke without replacement as revoked", () => {
    assert.equal(
      classifyRefreshTokenRow(
        {
          expires_at: "2026-10-07T12:00:00.000Z",
          revoked_at: "2026-09-07T11:00:00.000Z",
          replaced_by_id: null,
        },
        now,
      ),
      "revoked",
    );
  });

  it("flags expiry", () => {
    assert.equal(
      classifyRefreshTokenRow(
        { expires_at: "2026-09-07T11:59:59.000Z", revoked_at: null, replaced_by_id: null },
        now,
      ),
      "expired",
    );
  });
});
