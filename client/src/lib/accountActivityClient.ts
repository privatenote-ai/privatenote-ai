import { apiRequest } from "@/lib/queryClient";

/** Best-effort: records metadata-only “note opened” when the viewer is signed in. */
export function reportNoteOpenedIfSignedIn(noteId: string): void {
  void (async () => {
    try {
      await apiRequest("/api/auth/account/activity", "POST", {
        event: "note_opened",
        noteId,
      });
    } catch {
      /* unsigned in or offline */
    }
  })();
}
