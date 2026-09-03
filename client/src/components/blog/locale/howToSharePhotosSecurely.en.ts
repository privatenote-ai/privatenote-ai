import type { HowToSharePhotosSecurelyArticleCopy } from "./howToSharePhotosSecurely.types";

export const howToSharePhotosSecurelyEn: HowToSharePhotosSecurelyArticleCopy = {
  heroAlt:
    "Person holding a phone showing PrivateNote’s secure file-transfer success screen with a copyable encrypted link",
  heroCaption:
    "Re-encode supported photos locally, encrypt in the browser, and limit how long PrivateNote keeps the encrypted handoff available.",
  intro: [
    "Sharing photos takes only a few taps, but when an image contains your passport, driver’s licence, medical record, tax document, or financial paperwork, convenience can quickly become a privacy risk.",
    "Interception is only one risk. Email may use TLS between servers, and some messaging apps provide end-to-end encryption, but a protected journey does not guarantee short retention. A photo sent today can remain in sent folders, chat histories, downloads, cloud backups, and old devices for years.",
    "A safer handoff limits both who can decrypt the file and how long the service keeps it available. That means sharing only what is needed, removing common embedded metadata, encrypting before upload, and setting a short access window. [PrivateNote’s secure file transfer](app:secure-file-transfer) is designed for that temporary handoff—not for remotely deleting copies a recipient has already saved.",
  ],
  sections: [
    {
      title: "Why everyday sharing tools fall short",
      takeaway: "Most tools optimise for convenience and long-term access—not temporary delivery.",
      paragraphs: [
        "None of these services are inherently insecure—they simply optimise for convenience and long-term access. That’s ideal for everyday photos, but not for documents that may still be sensitive years from now. The same retention problem shows up when people [send documents by email](blog:why-email-is-worst-for-secrets) or [paste secrets into chat](blog:secrets-never-send-in-chat).",
      ],
      comparisonTable: {
        headers: ["Method", "Who can normally decrypt?", "Does service access expire?", "The main downside"],
        rows: [
          [
            "Email attachment",
            "Sender, recipient, and usually mail providers",
            "No",
            "Leaves permanent copies in both sender and recipient inboxes.",
          ],
          [
            "Messaging apps (WhatsApp, iMessage)",
            "Endpoints for E2EE chats; configuration matters",
            "Sometimes",
            "Disappearing-message settings do not erase downloads, screenshots, or every backup.",
          ],
          [
            "Cloud storage (Google Drive, Dropbox)",
            "Account holders and usually the provider",
            "Not by default",
            "Shared links often remain accessible long after they’ve been forgotten.",
          ],
          [
            "One-time encrypted links",
            "Anyone holding the complete link; a separate passphrase can add protection",
            "Yes, on the service",
            "Expiration cannot erase a file the recipient already downloaded or captured.",
          ],
        ],
        after: [
          "For a deeper comparison of collaboration storage versus temporary handoffs, see [Google Drive vs one-time encrypted links](blog:google-drive-vs-one-time-encrypted-links).",
        ],
      },
    },
    {
      title: "Don’t overlook hidden metadata",
      takeaway:
        "EXIF can reveal GPS, timestamps, and device details—PrivateNote can strip them in your browser before encryption.",
      paragraphs: [
        "A photo can reveal far more than what’s visible on the screen.",
        "Many phones can embed metadata such as **EXIF** fields inside an image. Depending on the device, format, and settings, this may include GPS coordinates, capture time, orientation, and camera details. A passport photographed at home could reveal a location; a medical document photographed at a clinic could reveal where it was captured.",
        "Encryption alone does **not** remove that metadata—it only scrambles the file as-is. If GPS is still inside the plaintext, GPS is still inside the ciphertext until someone decrypts it.",
        "PrivateNote handles common embedded metadata in the product: for JPEG, PNG, WebP, and iPhone HEIC/HEIF attachments, **Remove location & photo metadata** is available and on by default. Your browser decodes and re-encodes the pixels locally before encryption, which drops common metadata fields such as GPS, timestamps, and camera details. HEIC/HEIF becomes JPEG; JPEG and WebP may be recompressed. If conversion fails, PrivateNote stops the upload. To send the exact original, you must deliberately turn metadata removal off and submit again; the original is still encrypted before upload.",
        "Re-encoding is not a forensic-anonymisation guarantee. It cannot remove an address printed in the image, a face in the background, a barcode, a reflection, or a landmark from which someone can infer location. Review the visible pixels separately. Turn metadata removal off when exact original bytes, original quality, or evidentiary integrity must be preserved.",
        "Client-side encryption still matters next: once the cleaned file is encrypted in the browser, the service stores ciphertext rather than a readable photo. That is the model behind [encrypted vs “secure” file sharing](blog:encrypted-vs-secure-file-sharing).",
      ],
      calloutTitle: "Rule of thumb",
      callout:
        "If you would not publish the photo’s location and timestamp on a public map, leave PrivateNote’s metadata toggle on (or strip EXIF yourself) before you encrypt and send.",
    },
    {
      title: "Sharing sensitive photos more safely",
      takeaway: "Crop first, strip metadata, encrypt in the browser, then make access temporary.",
      paragraphs: [
        "Good security starts before you press Send.",
        "Take a moment to look at the image itself. Does the recipient need the entire document, or would a cropped version be enough? Removing background details, obscuring unrelated personal information, or blurring irrelevant faces reduces exposure. Keep an appropriate original where records, evidence, or future use require it; remove only unnecessary working copies.",
        "Next, clear hidden location data. On PrivateNote that step is built in for common photo formats—leave the metadata toggle on when you attach the file.",
        "Then encrypt before the photo leaves your device. Client-side encryption transforms the image into unreadable ciphertext locally, so the storage server never receives the original file. Even if the server were compromised, the encrypted data would remain unintelligible without the decryption key.",
        "[PrivateNote’s secure file transfer](app:secure-file-transfer) combines those steps: optional in-browser re-encoding for JPEG/PNG/WebP/HEIC, encryption before upload, ciphertext-only storage, a note read limit, and a timed attachment-download window. Recipients can open the link without creating an account; sending a file requires a free PrivateNote account.",
        "PrivateNote also uses click-to-reveal by default, so a mis-tap on the note page does not immediately decrypt the content.",
        "Finally, treat service access as temporary. Opening a read-once PrivateNote consumes the note read, but its attachment remains downloadable during the configured post-open window: **15 minutes by default**, with eligible plans offering 30 minutes or 1 hour. The recipient may download more than once during that window. Expiration then removes access through PrivateNote; it does not delete copies already saved on the recipient’s device.",
        "Treat the **complete PrivateNote URL as a bearer secret**. It normally contains decryption-key material in the URL fragment, so anyone who obtains the full link before it expires may be able to open the handoff. If you add a passphrase, send it through a different channel. Sending the link and passphrase in the same thread collapses the two layers into one—see [how to share a password securely](blog:how-to-share-a-password-securely).",
        "For passports, medical images, financial records, or evidence, first confirm that the organisation accepts this delivery method. A government agency, bank, insurer, or healthcare provider may require its own authenticated upload portal or retention process.",
      ],
      midCta: {
        body: "Ready to send a confidential photo with common embedded metadata removed and a shorter service-access window?",
        button: "Start a secure file transfer",
      },
    },
    {
      title: "Best practices checklist",
      takeaway: "A short routine before Send cuts most long-term exposure.",
      checklist: [
        "Verify the recipient and channel",
        "Crop or blur anything the recipient does not need",
        "Leave PrivateNote’s “Remove location & photo metadata” on for JPEG/PNG/WebP/HEIC",
        "Encrypt in the browser before upload",
        "Set a short note expiry and attachment access window",
        "Treat the complete URL like the sensitive file",
        "Share any passphrase on a separate channel",
        "Remove unnecessary working copies—not an original you are required to retain",
      ],
    },
    {
      title: "Know what this workflow protects",
      takeaway: "It reduces retained service copies and metadata exposure; it does not make an untrusted endpoint safe.",
      paragraphs: [
        "This workflow helps when the main risks are forgotten inbox attachments, long-lived cloud links, readable server-side storage, and common embedded photo metadata. Browser-side encryption means PrivateNote receives encrypted file data rather than the readable image, and expiration limits how long that encrypted handoff remains retrievable.",
        "It does **not** protect against malware or a compromised browser on either device, a malicious or mistaken recipient, exposure of the complete link before expiry, or a recipient saving the decrypted image. Because the web application performs encryption, the code delivered to your browser is also part of the trust model. Use a managed or otherwise trusted device for high-sensitivity documents.",
      ],
    },
    {
      title: "Common mistakes",
      takeaway: "Most photo leaks are leftover access—not Hollywood hacking.",
      paragraphs: [
        "The most common mistakes are surprisingly ordinary. People often leave location data embedded in photos taken at home, assume the recipient will remember to delete the file, or keep permanent cloud-sharing links active long after the exchange is finished. Another frequent error is sending both the encrypted link and its passphrase in the same message, giving an attacker everything they need if that conversation is ever compromised.",
        "A relationship is not standing consent, and consent to receive is never consent to redistribute.",
        "It’s also worth remembering that no sharing method can prevent a recipient from taking a screenshot or saving the image after opening it. Secure sharing reduces unnecessary copies and limits long-term exposure, but it cannot control what someone does once they have legitimate access.",
      ],
      bullets: [
        "Leaving GPS on for home, school, or clinic photos (or turning PrivateNote’s strip toggle off without a reason)",
        "Sending the passphrase in the same thread as the link",
        "Using a permanent Drive or Photos link “because it’s easier”",
        "Assuming the recipient will delete the download",
        "Sending the full frame when a crop would do",
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Is it safe to email a passport photo?",
          answer:
            "Email usually protects the journey with TLS, but the attachment tends to live in both mailboxes indefinitely. Prefer a browser-encrypted, expiring link for ID and similar images.",
        },
        {
          question: "Does “the chat is encrypted” mean the photo is safe?",
          answer:
            "End-to-end encryption can keep the service from reading message content, but it does not guarantee short retention. Media may remain in history, downloads, screenshots, or backups depending on the app and settings. A short-lived handoff can reduce service-side availability, but it still cannot erase a recipient’s copy.",
        },
        {
          question: "Does PrivateNote remove GPS and other EXIF metadata from photos?",
          answer:
            "For JPEG, PNG, WebP, and iPhone HEIC/HEIF attachments, PrivateNote offers **Remove location & photo metadata**, on by default. The browser re-encodes the image before encryption to drop common embedded metadata. HEIC/HEIF becomes JPEG, and lossy formats may be recompressed. This does not remove identifying information visible in the pixels. GIF, SVG, and unsupported formats are not re-encoded this way.",
        },
        {
          question: "Does a one-time link mean the attachment can be downloaded only once?",
          answer:
            "No. Opening a read-once note consumes its read, but the attachment remains downloadable during its post-open access window—15 minutes by default, or longer where the account plan allows. The recipient can save copies during that window. Once the window closes, PrivateNote stops serving the attachment; it cannot delete copies already saved.",
        },
        {
          question: "Is the complete PrivateNote link sensitive?",
          answer:
            "Yes. The complete URL normally carries decryption-key material in its fragment. Treat it like the file itself: share it only with the intended recipient, keep its lifetime short, and consider a separately delivered passphrase if the link-delivery channel may be exposed.",
        },
        {
          question: "Is photo metadata stripping a paid feature?",
          answer:
            "No. It runs entirely in your browser and is included whenever you can attach a supported image. Paid plans raise attachment size limits; they are not required for EXIF stripping.",
        },
        {
          question: "Can PrivateNote stop someone from screenshotting the photo?",
          answer:
            "No. Once a trusted recipient can view the image, they can capture the screen. Secure sharing reduces accidental leftover copies and server-side access—not DRM against the person you intentionally shared with.",
        },
      ],
    },
    {
      title: "The bottom line",
      takeaway: "Minimise copies and service-access time without promising remote deletion.",
      paragraphs: [
        "When sharing sensitive photos, the goal isn’t simply to encrypt the connection—it’s to minimise how many copies exist and how long they survive.",
        "Cropping unnecessary details, re-encoding supported images to remove common metadata, encrypting before upload, and setting short access windows reduce long-term exposure. They do not guarantee that no trace remains: the recipient can retain the decrypted image, and the complete delivery link must itself be protected.",
        "The same approach works for [sensitive documents](blog:send-sensitive-documents-securely) of any kind—not only photos. For intimate images between adults, see [how to send nudes safely](blog:how-to-send-nudes-safely).",
      ],
    },
  ],
  ctaTitle: "Share the photo with fewer persistent copies.",
  ctaBody:
    "PrivateNote can re-encode supported photos to remove common embedded metadata, encrypts files locally, and limits how long the encrypted handoff remains available. Protect the complete link, and remember that recipients can save what they open.",
  ctaButton: "Share a photo securely",
};
