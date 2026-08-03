# How to Share Photos Securely (Reduce Persistent Copies and Metadata Exposure)

Published slug: `how-to-share-photos-securely`

Canonical article lives in:

- `client/src/components/blog/locale/howToSharePhotosSecurely.en.ts`
- `client/src/components/blog/HowToSharePhotosSecurelyPost.tsx`

## Meta

- **Title:** How to Share Photos Securely
- **Subtitle:** Reduce Persistent Copies and Metadata Exposure
- **Description:** Share sensitive photos with fewer persistent copies. Remove common metadata locally, encrypt before upload, protect the full link, and limit access time.
- **Category:** secrets
- **Published:** 2026-08-01

## Product claim (EXIF)

PrivateNote offers **Remove location & photo metadata** for JPEG/PNG/WebP/HEIC attachments (note + secure file transfer). Default on; client-side re-encode before encryption (HEIC → JPEG). Safari/iOS uses native decode; other browsers lazy-load heic2any. Not a premium-gated feature—paid plans raise attachment size limits only.

Re-encoding removes common embedded metadata but does not anonymize identifying details visible in the pixels. JPEG/WebP may be recompressed. If conversion fails, the upload stops. Sending the encrypted original then requires the sender to turn metadata removal off deliberately and submit again.

## Access semantics

- Opening a read-once note consumes the note read.
- Attachments remain downloadable for the configured post-open window: 15 minutes by default, with eligible plans offering 30 minutes or 1 hour.
- The complete URL normally carries decryption-key material and must be treated as a bearer secret.
- Expiry stops PrivateNote from serving the encrypted handoff; it cannot erase copies already saved by the recipient.
