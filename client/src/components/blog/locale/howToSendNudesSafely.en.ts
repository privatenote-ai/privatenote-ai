import type { HowToSendNudesSafelyCopy } from "./howToSendNudesSafely.types";

export const howToSendNudesSafelyEn: HowToSendNudesSafelyCopy = {
  heroAlt:
    "A smartphone lying face-down on a dark desk beside a small lock, suggesting a private photo that should not linger in chats or cloud backups",
  heroCaption:
    "Treat an intimate photo as a short-lived handoff: less identifying detail, fewer copies, a shorter access window.",
  quickAnswer:
    "There is no risk-free way to send an intimate photo. The safest approach is to remove identifying details, avoid permanent local copies, strip location metadata, and use an encrypted one-time link.",
  consent: {
    title: "Consent first",
    takeaway: "Consent to receive is never consent to redistribute.",
    paragraphs: [
      "Intimate images require explicit consent between adults. Never pressure someone to send one, and never send one to someone who has not asked. Receiving a private image is not a license to keep it, show it around, or post it.",
      "Consent is not transferable. Agreeing to take or receive a photo is never an agreement to pass it on. Sharing intimate media without consent is a privacy violation—and in many places a crime.",
    ],
    warningTitle: "If anyone depicted is under 18",
    warning:
      "The legal line is absolute. Do not create, request, forward, save, or redistribute sexual images of minors. Report through official channels such as [Take It Down](https://takeitdown.ncmec.org/)—do not circulate the file.",
  },
  identify: {
    title: "The bigger risk is identification",
    takeaway: "If someone can prove the photo is you, the rest is much harder to contain.",
    lead: "Nudity is sensitive. From a privacy perspective the sharper question is whether the frame can prove it is you. Clean the pixels before you touch an encryption setting. The same idea applies to [any sensitive photo](blog:how-to-share-photos-securely): crop to what the recipient actually needs.",
    items: [
      "Face, tattoos, birthmarks, scars, or distinctive jewelry",
      "Mail, work badges, school papers, or nameplates",
      "Mirrors, TVs, or glass reflecting off-camera details",
      "A recognizable window view or a room that is clearly yours",
    ],
    after: "",
  },
  rules: {
    title: "How to send nudes safely in practice",
    takeaway: "Sanitize the frame, keep originals off your camera roll, and send a short-lived link—not a chat souvenir.",
    groups: [
      {
        heading: "Clean the frame",
        paragraphs: [
          "**Keep your face out of frame.** Removing your face strips the single strongest piece of identifying data—the detail that makes a leftover copy useful for extortion or forwarding.",
          "**Clean the background.** A plain wall is better than a room full of clues. Move work badges, mail, family photos, and distinctive décor out of shot.",
          "**Check reflections.** A mirror or television can reveal a person or a room you thought was out of frame. Glance at glass and screens before you send.",
        ],
      },
      {
        heading: "Keep copies off your devices",
        paragraphs: [
          "**Bypass the permanent camera roll.** Taking the photo in your regular camera app often backs it up to iCloud or Google Photos and leaves a local original. **Take photo** in the PrivateNote composer uses the live camera in the browser, so the JPEG is created in memory and encrypted before upload. Picking an existing library picture does not give you that benefit.",
          "**Strip location and device metadata.** Photos often store EXIF data—GPS, timestamps, and phone model. Encryption does not remove that; it only scrambles the file as-is. PrivateNote can [re-encode supported images in the browser](blog:how-to-share-photos-securely) to drop common embedded metadata before encryption. Leave that toggle on.",
          "**Resize the file.** You do not need a 48-megapixel original for a phone-sized view. Downsizing reduces leftover detail from zooming and often drops hidden metadata with it.",
        ],
      },
      {
        heading: "Send a handoff, not a souvenir",
        paragraphs: [
          "**Do not confuse encryption with disappearance.** [End-to-end encryption](blog:what-is-end-to-end-encryption) protects an image in transit and, in PrivateNote’s model, keeps plaintext off the server. It does not govern what the recipient does after they decrypt and view it. The same gap exists in encrypted chats—see [why secrets do not belong in chat](blog:secrets-never-send-in-chat).",
          "**Treat view-once as risk reduction, not DRM.** [One-time secret links](blog:one-time-secret-links) keep photos from sitting in a thread for years. They cannot stop someone photographing the screen with another device.",
          "**Verify who you are actually talking to.** Sextortion typically starts with a fake profile obtaining an explicit photo, then threatening exposure. Never send intimate media to someone you have not independently verified. A [recipient verification code](blog:recipient-verification-code-before-reveal) helps when the delivery channel itself may be weak, but it does not prove identity.",
          "**Keep the accompanying text anonymous.** A sanitized photo next to “Hey, it’s Sarah from accounting” undoes the prep work. Consider the entire payload: image, caption, and profile handle.",
        ],
      },
    ],
    midCtaBody:
      "Capture in the composer, encrypt in the browser, and share a link that burns after it is opened.",
    midCtaButton: "Create a private note",
  },
  screenshot: {
    title: "Screenshots are not a solved problem",
    takeaway: "If someone can see a photo, they can capture the screen. Disappearing delivery still matters.",
    paragraphs: [
      "Screenshot warnings add friction. They are not a security boundary. Disappearing photos are valuable because they stop material lingering in chat logs—not because they block a determined recipient.",
      "PrivateNote is explicit: [click-to-reveal](blog:click-to-reveal-private-notes) makes opening deliberate, expiry limits leftover service copies, and [revoking an unopened note](blog:revoke-unopened-note-proof-of-access) can stop a mistaken send. None of those remotely delete a copy already saved.",
    ],
    calloutTitle: "What expiration actually does",
    callout:
      "It stops PrivateNote from serving the encrypted handoff. It does not erase a screenshot, a download, or a photo of the screen. Design the send so a leftover copy is less identifying—not so you can pretend copies are impossible.",
  },
  workflow: {
    title: "The safest way to send an intimate photo",
    takeaway: "Setup, capture, inspect, deliver, then clean up local leftovers.",
    steps: [
      {
        label: "Setup",
        action: "Clear the background, remove identifying items, check reflections.",
        why: "Most identification leaks are in the pixels, not the transport.",
      },
      {
        label: "Capture",
        action: "Use Take photo in PrivateNote so the image is created in the browser.",
        why: "Avoids iCloud / Google Photos backups of the original.",
      },
      {
        label: "Inspect",
        action: "Take ten seconds on the edges of the frame before you send.",
        why: "A badge, a mirror, or a window view is easier to fix now than later.",
      },
      {
        label: "Deliver",
        action: "Send a browser-encrypted, single-view link. Optionally add a separately delivered verification code.",
        why: "The server stores ciphertext. The complete URL is a bearer secret.",
      },
      {
        label: "Cleanup",
        action: "Clear drafts, downloads, and working copies you do not need to keep.",
        why: "Your own devices are often the longest-lived copy.",
      },
    ],
    after:
      "For ID scans or documents rather than intimate photos, use the same pattern in [how to share photos securely](blog:how-to-share-photos-securely) and [encrypted vs “secure” file sharing](blog:encrypted-vs-secure-file-sharing).",
  },
  product: {
    title: "How PrivateNote handles this",
    takeaway: "Encrypt locally and make service access temporary. The recipient can still save what they see.",
    paragraphs: [
      "Some information only needs to exist long enough to be delivered. **Take photo** encodes a JPEG in the browser, then encrypts it on your device before upload—so the original stays out of your photo library. Recipients open a unique link, decrypt locally, and the note follows its burn and expiry policy.",
      "Add [click-to-reveal](blog:click-to-reveal-private-notes) so a mis-tap does not decrypt, a [verification code](blog:recipient-verification-code-before-reveal) on a separate channel, and [open alerts](blog:know-when-secret-link-opened) for status only—never the photo. Sent to the wrong person and still unopened? [Revoke it](blog:revoke-unopened-note-proof-of-access).",
      "Treat the **complete URL as a bearer secret**. It normally carries the decryption key after `#`. Do not paste the photo into the chat alongside the link.",
    ],
    calloutTitle: "Honest limit",
    callout:
      "PrivateNote reduces unnecessary retention and cannot read the image on our servers. It cannot prevent a recipient from photographing a screen, and it cannot un-send a copy they already saved.",
  },
  incident: {
    title: "If a photo is shared without consent",
    takeaway: "Keep evidence, do not pay, cut off contact, use hash-based removal. Do not send more images.",
    lead: "If an intimate photo escapes or is being used for extortion:",
    items: [
      "**Do not panic-delete the thread.** Keep messages, account details, and headers as evidence for law enforcement or platform moderators.",
      "**Do not pay.** Paying or sending further material rarely stops extortion. Cut off contact and report the account.",
      "**Use removal tools.** For adults, [StopNCII.org](https://stopncii.org/) hashes the photo on your device so participating platforms can block uploads without taking the original.",
      "**For minors:** [Take It Down](https://takeitdown.ncmec.org/) uses the same device-side hashing idea. Report through official channels; do not circulate the file.",
    ],
    after:
      "Use platform removal forms in parallel with law enforcement if you are being threatened. In the United States, covered platforms must provide a removal process for non-consensual intimate images.",
  },
  sources: {
    title: "Official resources and further help",
    intro:
      "These resources explain photo metadata, image-based abuse, and device-side hashing in more detail.",
    items: [
      {
        label: "FTC: Image-Based Abuse",
        description:
          "Official guidance on documenting abuse, ignoring extortion demands, reporting threats, and requesting removal.",
        href: "https://consumer.ftc.gov/articles/image-based-abuse-what-know-and-do",
      },
      {
        label: "StopNCII.org: How It Works",
        description:
          "Explains how participating platforms use a hash created on your device without receiving the original image.",
        href: "https://stopncii.org/how-it-works/",
      },
      {
        label: "Apple: Manage location metadata in Photos",
        description:
          "Instructions for viewing, removing, and preventing location metadata in photos on Apple devices.",
        href: "https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web",
      },
      {
        label: "NCMEC: Take It Down",
        description:
          "A device-side hashing service for images taken when the person depicted was under 18.",
        href: "https://takeitdown.ncmec.org/",
      },
    ],
  },
  faqs: {
    title: "Frequently asked questions",
    items: [
      {
        question: "What is the safest way to send nudes?",
        answer:
          "There is no completely safe method. Reduce the risk by removing your face and other identifiers, stripping location metadata, keeping the original out of cloud-backed photo libraries, and using a browser-encrypted one-time link. Assume the recipient can still save what they see.",
      },
      {
        question: "Can a disappearing photo stop screenshots?",
        answer:
          "No. Warnings add friction. If the recipient can see the image, they can capture the screen. Use disappearing delivery to keep the photo out of chat history—not as a promise that copies are impossible.",
      },
      {
        question: "Is Snapchat or iMessage view-once enough?",
        answer:
          "Those settings shorten how long the photo sits in the thread. They do not reliably prevent saves, another camera, or cloud backups of the original on your device. A browser-encrypted one-time link plus in-app capture is a tighter handoff.",
      },
      {
        question: "Does PrivateNote save the photo to my camera roll?",
        answer:
          "Not if you use Take photo in the composer: the JPEG is created in the browser and encrypted before upload. Choosing a picture that already lives in Photos does not remove that library copy or its backups.",
      },
      {
        question: "Should I send nudes to someone I have only met online?",
        answer:
          "Not until you have independently verified who they are. Financially motivated extortion depends on obtaining an identifying explicit photo from a stranger. Verification codes protect the link; they do not prove identity.",
      },
      {
        question: "What if I sent the link to the wrong person?",
        answer:
          "If they have not opened it, revoke the unopened note. After reveal, assume they may have a copy. That is why keeping your face and other identifiers out of the frame still matters after a mistake.",
      },
      {
        question: "Does encryption mean PrivateNote cannot see the photo?",
        answer:
          "In PrivateNote’s model, encryption happens in the browser before upload. The service stores ciphertext, not a readable image. See [encrypted vs “secure” file sharing](blog:encrypted-vs-secure-file-sharing) for the architectural distinction.",
      },
    ],
  },
  close: {
    title: "The bottom line",
    takeaway: "Less identifying detail, fewer copies, a shorter window—without pretending the recipient cannot capture a screen.",
    paragraphs: [
      "Adults can share intimate photos more safely by treating the send as a temporary handoff: sanitize the frame, strip metadata, keep the original off the camera roll, and deliver through a browser-encrypted one-time link.",
      "The goal is not a magical un-send. It is to leave less proof, fewer leftover copies, and less time for the image to sit where you did not mean it to live.",
    ],
  },
  ctaTitle: "Send the photo as a one-time encrypted handoff.",
  ctaBody:
    "Capture in the composer, encrypt in the browser, and share a link that expires after it is opened. Protect the complete URL—and remember that a trusted recipient can still save what they see.",
  ctaButton: "Create a private note",
};
