/** Vitest-only entry: exports the note DO without the full API Worker graph (KV/D1). */
export { SecureNoteStorageSql } from "../durable_objects/secure_note_storage";

export default {
  async fetch(): Promise<Response> {
    return new Response("vitest stub", { status: 404 });
  },
};
