import type { HowToMakeAPrivateNoteArticleCopy } from "./howToMakeAPrivateNote.types";

export const howToMakeAPrivateNoteEn: HowToMakeAPrivateNoteArticleCopy = {
  heroAlt:
    "Laptop on a desk showing a private note creation screen with burn-after-reading and expiration settings, beside a locked leather notebook",
  intro: [
    "You want to write something sensitive—a [password](app:password-generator), a recovery code, a confidential message, or a personal note—and keep it private. Maybe you searched for \"how to make a note private\" and found generic advice about locking an app, hiding a local folder, or toggling a device privacy setting.",
    "Those steps help with casual, over-the-shoulder privacy. They do **not** solve the harder problem: sharing a note with another person without leaving a permanent, searchable copy sitting on a third-party server.",
    "A truly private note requires three distinct pillars: **encryption before upload**, **tight access control**, and **planned ephemerality**—a mechanism to disappear. Here is how to achieve that in practice.",
  ],
  sections: [
    {
      title: "What \"private\" actually means",
      paragraphs: [
        "In everyday applications, \"private\" usually means hidden from other physical people picking up your device, protected by a phone passcode, or locked behind a premium app subscription. That is highly useful—but it is not the same as cryptographic privacy.",
        "When you share sensitive information across the web, the real question is: **who can read the note after it leaves your hands?**",
        "Can the service provider read it? Can an unauthorized party who gains access to a cloud backup read it? Can a future teammate search old chat histories and find it months later?",
        "A private note, in the strict security sense, is one where only the intended recipient can read the contents, the hosting service never sees the underlying plaintext, and the note does not live online forever.",
      ],
    },
    {
      title: "Why regular note apps fall short",
      paragraphs: [
        "Apple Notes, Google Keep, Notion, and Evernote are excellent tools for personal organization, but they are generally the wrong choice for distributing one-time secrets due to several inherent traits:",
      ],
      bullets: [
        "**Sync and backups** — Your note is silently copied across multiple devices, cloud storage accounts, and long-term history archives you do not directly control.",
        "**Search and sharing** — Accidental public sharing, broad workspace searches, or a single compromised account can expose historical notes months after the fact.",
        "**Provider access** — Unless the app explicitly offers end-to-end encryption for that specific note, the provider retains the technical ability to read your content on their servers.",
        "**No burn-after-reading** — Most organizational apps are structurally engineered to store information indefinitely, not to purge it after a single read.",
      ],
      callout:
        "For long-term personal journaling, standard notes apps are ideal. For passwords, recovery codes, and confidential handoffs, you need an ephemeral tool built for [one-time secret delivery](blog:one-time-secret-links)—not permanent storage.",
    },
    {
      title: "How to make a private note: step by step",
      paragraphs: [
        "You do not need to register an account to send a secure, one-time private note. The structured workflow below outlines what browser-encrypted services are designed to execute securely.",
      ],
      flowDiagramCaption: "Private note workflow at a glance",
      flowSteps: [
        {
          step: "Step 1",
          title: "Draft the message inside your browser",
          body: "Open [PrivateNote](app:home) and type your message directly. Already in another tab? The [Chrome extension](chrome:extension) encrypts selected text in place—the same client-side flow, without opening the site first. Avoid pasting the raw secret into standard email clients or unencrypted text threads beforehand. You can also use [Write with Private AI](app:home) to draft locally on your device before encryption.",
        },
        {
          step: "Step 2",
          title: "Configure your ephemeral privacy settings",
          body: "Set an expiration window that fits the task. Enable burn-after-reading if the note should completely vanish after the first successful open, and add an optional passphrase for highly sensitive content.",
        },
        {
          step: "Step 3",
          title: "Let the browser execute local encryption",
          body: "When you click create, encryption happens entirely client-side. Only ciphertext is uploaded. The decryption key remains embedded in the URL fragment—the portion following `#`—which modern web browsers do not transmit to hosting web servers.",
        },
        {
          step: "Step 4",
          title: "Isolate your sharing channels",
          body: "Transmit the generated secure link to your recipient through your preferred channel. If you configured a manual password, share that out-of-band—via a phone call, Signal, or securely in person.",
        },
        {
          step: "Step 5",
          title: "Confirm delivery and clear local state",
          body: "Use optional delivery notifications to verify when the note was successfully opened or expired. Once consumed, no lingering plaintext copy remains sitting in your outbox or historical chat logs.",
        },
      ],
    },
    {
      title: "Privacy settings worth turning on",
      paragraphs: [
        "Small architectural adjustments yield massive security gains. When creating an ephemeral note, maximize your defenses by utilizing these configurations:",
      ],
      bullets: [
        "**Burn-after-reading** — The gold standard for passwords and credentials. The underlying ciphertext is wiped from the server the moment it is successfully read once.",
        "**Short expiration windows** — If your recipient does not need to open the data instantly, limit the exposure window to hours or days—never leave it open-ended.",
        "**Layered passwords** — Adds a crucial second factor. An attacker would need to compromise both the link transport channel and obtain the separate password to read the contents.",
      ],
    },
    {
      title: "What not to put in a web-based private note",
      paragraphs: [
        "Browser-encrypted links are outstanding for temporary or replaceable secrets—such as Wi‑Fi credentials, API tokens, and corporate messages. They have limits.",
      ],
      callout:
        "**Critical safety rule:** Never type a cryptocurrency seed phrase, master hardware wallet backup, or root private key into any website. Irreplaceable master assets justify local terminal-based encryption with age or OpenSSL before transmission. For that architecture, read [crypto seed phrases and one-time links](blog:crypto-seed-phrase-one-time-link).",
    },
    {
      title: "When a private note is the right tool",
      paragraphs: [
        "Reach for a dedicated private note instead of standard email or chat tools when handing off sensitive information:",
      ],
      table: [
        {
          dataType: "Credentials",
          scenario: "Passing a [password or recovery code](blog:how-we-generate-passwords) to a trusted family member or colleague.",
        },
        {
          dataType: "Access keys",
          scenario: "Distributing an [API key or webhook signing secret](blog:how-to-share-api-key-securely) during developer onboarding.",
        },
        {
          dataType: "Physical access",
          scenario: "Sharing temporary door codes, alarm PIN numbers, or guest Wi‑Fi credentials.",
        },
        {
          dataType: "Corporate communications",
          scenario: "Sending a confidential business message that should not be indexed by [enterprise chat or email archives](blog:workplace-texts-private-note).",
        },
      ],
    },
    {
      title: "Our philosophy at PrivateNote",
      paragraphs: [
        "We engineered PrivateNote to shift the trust balance back to the user. By handling cryptographic operations entirely inside your browser before the payload hits our infrastructure, our servers remain structurally blind to your plaintext secrets.",
        "We also believe in clear transparency regarding product limitations. If you are sending a temporary access token to a peer, an encrypted one-time link is an outstanding tool. If you are dealing with your life savings, encrypt locally on an offline machine first.",
        "Security is not about finding a magic, one-size-fits-all tool. It is about matching your workflow to the value of what you are protecting. For the technical model behind browser encryption, read [how PrivateNote works](app:how-it-works) and [what client-side end-to-end encryption means](blog:what-is-end-to-end-encryption).",
      ],
    },
  ],
  tableHeaders: {
    dataType: "Data type",
    scenario: "Ideal sharing scenario",
  },
  closingTitle: "Create a private note now",
  closingBody: [
    "No account required. Write your note, configure your privacy settings, and share a secure link in under a minute.",
  ],
  fileSharingNote:
    "Need to share documents too? [Secure file transfer](app:secure-file-transfer) uses the same browser-side encryption model. Sending requires a free account; recipients can open links without signing up.",
  chromeExtensionNote:
    "Use PrivateNote often? The [Chrome extension](chrome:extension) adds encrypt-and-share to your toolbar or right-click menu—handy when a password or API key shows up mid-conversation.",
  tagline: "Encrypt first. Share a link. Let it expire.",
  relatedReading: "Related reading",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb: "Burn-after-reading links, the URL fragment, and why ephemerality beats email or Slack for one-time secrets.",
    },
    {
      slug: "why-email-is-worst-for-secrets",
      blurb: "Why email creates long-lived copies of secrets—and what to use instead for confidential handoffs.",
    },
    {
      slug: "how-to-share-api-key-securely",
      blurb: "A safer workflow for API keys: scope tightly, encrypt locally, send the link—not the raw secret.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb: "What client-side E2EE actually means, and how it differs from transport security alone.",
    },
  ],
};
