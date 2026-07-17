import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertStdoutWriteAllowed, stdoutBypassWarnings } from "./stdoutPolicy.ts";

describe("assertStdoutWriteAllowed", () => {
  it("allows writes on a TTY", () => {
    assert.doesNotThrow(() =>
      assertStdoutWriteAllowed({
        isStdoutTty: true,
        json: true,
        forceStdout: false,
        outputUrlOnly: false,
      }),
    );
  });

  it("blocks non-TTY output without an explicit opt-in", () => {
    assert.throws(
      () =>
        assertStdoutWriteAllowed({
          isStdoutTty: false,
          json: false,
          forceStdout: false,
          outputUrlOnly: false,
        }),
      /stdout is not a terminal/,
    );
  });

  it("allows non-TTY output with --force-stdout or --output-url-only", () => {
    assert.doesNotThrow(() =>
      assertStdoutWriteAllowed({
        isStdoutTty: false,
        json: true,
        forceStdout: true,
        outputUrlOnly: false,
      }),
    );
    assert.doesNotThrow(() =>
      assertStdoutWriteAllowed({
        isStdoutTty: false,
        json: false,
        forceStdout: false,
        outputUrlOnly: true,
      }),
    );
  });
});

describe("stdoutBypassWarnings", () => {
  it("returns no warnings on a TTY", () => {
    assert.deepEqual(
      stdoutBypassWarnings({
        isStdoutTty: true,
        json: false,
        forceStdout: true,
        outputUrlOnly: true,
      }),
      [],
    );
  });

  it("warns when bypass flags are used on non-TTY stdout", () => {
    const warnings = stdoutBypassWarnings({
      isStdoutTty: false,
      json: true,
      forceStdout: true,
      outputUrlOnly: true,
    });
    assert.equal(warnings.length, 2);
    assert.match(warnings[0]!, /--output-url-only/);
    assert.match(warnings[1]!, /--force-stdout/);
  });

  it("returns no warnings when non-TTY output is blocked", () => {
    assert.deepEqual(
      stdoutBypassWarnings({
        isStdoutTty: false,
        json: false,
        forceStdout: false,
        outputUrlOnly: false,
      }),
      [],
    );
  });
});
