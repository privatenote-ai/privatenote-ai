import type { DurableObjectNamespace } from "@cloudflare/workers-types";
import type { SecureNoteStorageSql } from "../durable_objects/secure_note_storage";

declare module "cloudflare:test" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ProvidedEnv {
    SECURE_NOTES: DurableObjectNamespace<SecureNoteStorageSql>;
  }
}
