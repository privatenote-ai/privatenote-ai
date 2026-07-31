import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatAttachmentDisplayName } from "./formatAttachmentDisplayName.ts";

describe("formatAttachmentDisplayName", () => {
  it("returns short names unchanged", () => {
    assert.equal(formatAttachmentDisplayName("photo.jpg"), "photo.jpg");
    assert.equal(formatAttachmentDisplayName("notes.txt"), "notes.txt");
  });

  it("keeps the first few tokens and extension for long names", () => {
    assert.equal(
      formatAttachmentDisplayName(
        "Quarterly Financial Report Draft Final Version 2026.pdf",
      ),
      "Quarterly Financial….pdf",
    );
    assert.equal(
      formatAttachmentDisplayName("my_very_long_backup_archive_name.zip"),
      "my very long….zip",
    );
  });

  it("handles names without an extension", () => {
    assert.equal(
      formatAttachmentDisplayName("extremely_long_single_token_name_without_dots"),
      "extremely long singl…",
    );
  });

  it("hard-truncates long unbroken stems so dialogs stay compact", () => {
    assert.equal(
      formatAttachmentDisplayName(
        "verylongfilenamethatwouldbreaktheencryptingdialoglayout.pdf",
      ),
      "verylongfilenamethat….pdf",
    );
  });
});
