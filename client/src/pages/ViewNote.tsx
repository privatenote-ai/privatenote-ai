import React, { useEffect } from 'react';
import { useRoute } from 'wouter';
import { NoteDisplay } from '@/components/note/NoteDisplay';
import { isLikelyTruncatedNoteUrlFragmentKey } from '@shared/urlFragmentKey';

type NoteLinkCapture = { encryptionKey: string | null; linkKeyMissing: boolean };

/** Per-note id: snapshot fragment on first read so React Strict Mode remounts still see the original hash after replaceState clears it. */
const noteLinkCaptureByNoteId = new Map<string, NoteLinkCapture>();

function snapshotNoteLink(noteId: string): NoteLinkCapture {
  let snap = noteLinkCaptureByNoteId.get(noteId);
  if (!snap) {
    const raw = window.location.hash;
    const hadFragment = raw.length > 1;
    snap = {
      encryptionKey: hadFragment ? raw.slice(1) : null,
      linkKeyMissing: !hadFragment,
    };
    noteLinkCaptureByNoteId.set(noteId, snap);
  }
  return snap;
}

const ViewNote: React.FC = () => {
  const [match, params] = useRoute('/note/:id');

  const { encryptionKey, linkKeyMissing } =
    match && params.id ? snapshotNoteLink(params.id) : { encryptionKey: null, linkKeyMissing: true };

  const linkKeyTruncated =
    encryptionKey != null &&
    encryptionKey.length > 0 &&
    !linkKeyMissing &&
    isLikelyTruncatedNoteUrlFragmentKey(encryptionKey);

  useEffect(() => {
    if (!match || !params?.id) return;
    if (encryptionKey) {
      history.replaceState(null, '', window.location.pathname);
    }
  }, [match, params?.id, encryptionKey]);

  if (!match || !params.id) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Note Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            The note you're looking for doesn't exist or has already been read.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-w-0 overflow-x-clip pb-20 pt-24">
      <NoteDisplay
        id={params.id}
        encryptionKey={encryptionKey}
        linkKeyMissing={linkKeyMissing}
        linkKeyTruncated={linkKeyTruncated}
      />
    </div>
  );
};

export default ViewNote;
