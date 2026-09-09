import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatMcpUserCode,
  generateMcpUserCode,
  isMcpDeviceAuthRecord,
  mcpDeviceCodeKvKey,
  mcpDeviceVerificationPath,
  mcpUserCodeKvKey,
  normalizeMcpUserCode,
} from "./mcpDeviceAuth.ts";

describe("mcpDeviceAuth", () => {
  it("normalizes dashed and lowercase user codes", () => {
    const code = generateMcpUserCode(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]));
    const formatted = formatMcpUserCode(code);
    assert.match(formatted, /^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    assert.equal(normalizeMcpUserCode(formatted), code);
    assert.equal(normalizeMcpUserCode(code.toLowerCase()), code);
  });

  it("rejects invalid user codes", () => {
    assert.equal(normalizeMcpUserCode(""), null);
    assert.equal(normalizeMcpUserCode("ABC"), null);
    assert.equal(normalizeMcpUserCode("ABCD-EFGHI"), null);
    assert.equal(normalizeMcpUserCode("IIII-OOOO"), null);
  });

  it("builds verification path and kv keys", () => {
    assert.equal(mcpDeviceVerificationPath("ABCD2345"), "/auth/device?user_code=ABCD-2345&client=mcp");
    assert.equal(
      mcpDeviceVerificationPath("ABCD2345", "chrome"),
      "/auth/device?user_code=ABCD-2345&client=chrome",
    );
    assert.equal(mcpDeviceCodeKvKey("hash"), "mcp_device:dc:hash");
    assert.equal(mcpUserCodeKvKey("ABCD2345"), "mcp_device:uc:ABCD2345");
  });

  it("validates stored records", () => {
    assert.equal(
      isMcpDeviceAuthRecord({
        v: 1,
        userCode: "ABCD2345",
        status: "pending",
        createdAt: "2026-01-01T00:00:00.000Z",
        expiresAt: "2026-01-01T00:10:00.000Z",
        clientName: "privatenote-mcp",
      }),
      true,
    );
    assert.equal(isMcpDeviceAuthRecord({ v: 1, status: "pending" }), false);
  });
});
