import type { SharePasswordSecurelyArticleCopy } from "./sharePasswordSecurely.types";

export const sharePasswordSecurelyEn: SharePasswordSecurelyArticleCopy = {
  heroAlt:
    "Laptop on a desk showing a PrivateNote.ai secure link ready to copy, with one-view expiry and passphrase enabled",
  heroCaption:
    "Share a secure link—not the password itself—with short expiry, one-time viewing, and an optional passphrase.",
  intro: [
    "Sharing a password seems like a minor, everyday task—until something goes wrong.",
    "Whether a colleague needs temporary access to an internal tool, a customer support representative asks for system access, or you need to send Wi-Fi credentials to a visitor, the fastest option often feels like pasting the plaintext password into a Microsoft Teams chat, a WhatsApp message, or a quick email.",
    "Unfortunately, that convenience leaves behind a permanent digital paper trail. Once a secret enters these channels, it is synchronized across devices, indexable via search functions, stored in automated mailbox backups, and retained in corporate message archives indefinitely. A password that was meant to be temporary becomes a permanent liability.",
    "Fortunately, there is a better way to protect your credentials.",
  ],
  sections: [
    {
      title: "The core problem with plaintext sharing",
      paragraphs: [
        "Email and chat applications are excellent collaboration platforms, but they were never designed to hold onto secrets. While modern systems usually encrypt data during transmission, they fall short on ephemerality—ensuring secrets disappear once they have served their purpose.",
        "When you paste a password into a standard chat or email thread, you immediately lose control of its lifecycle. It remains stored in mailboxes, searchable in chat logs years later, and visible in device notifications or lock screens. If either your account or the recipient's account is ever compromised down the road, those plaintext chat histories become a goldmine for attackers.",
      ],
    },
    {
      title: "GDPR (DSGVO) and compliance risks in Europe",
      paragraphs: [
        "For European organisations, this isn’t just a security concern—it’s a compliance risk. Under the General Data Protection Regulation (GDPR / DSGVO), companies are legally required to protect access to personal data using state-of-the-art technical and organisational measures.",
        "Pasting active credentials into US-hosted cloud chat logs or unencrypted email servers without dedicated end-to-end encryption can increase compliance exposure, especially if those passwords grant access to databases containing customer or employee data.",
        "Using local, browser-side encryption drastically reduces where credentials can linger, keeping day-to-day handoffs aligned with a privacy-first approach. This is not legal advice; treat secure credential sharing as one part of broader access control, password management, and rotation policy.",
      ],
    },
    {
      title: "How browser-side encrypted links work",
      paragraphs: [
        "For quick, one-off password sharing, browser-encrypted one-time links are among the safest and most efficient options. Rather than sending the credential itself, you send a unique, temporary link to an encrypted note. [What a one-time secret link is](blog:one-time-secret-links) explains the model behind that handoff.",
        "Your browser performs the heavy lifting: the password is encrypted locally before upload, so the intermediary server stores ciphertext—not your raw password. The decryption key typically stays in the link fragment, which browsers do not send to the server.",
      ],
      flowIntro: "To share a secret using a temporary, self-destructing link, follow these four steps:",
      flowSteps: [
        {
          step: "Step 1",
          title: "Input and local encryption",
          body: "Enter the password into a secure tool. Your browser encrypts it locally using a key that never leaves your machine as plaintext.",
        },
        {
          step: "Step 2",
          title: "Generate the link",
          body: "The tool uploads only the encrypted payload to a zero-knowledge server and builds a unique sharing link. The decryption material stays with the link—not in a server-side vault of readable secrets.",
        },
        {
          step: "Step 3",
          title: "Send the link",
          body: "Copy and send the link via Microsoft Teams, email, or WhatsApp. The chat platform sees a URL, not your password.",
        },
        {
          step: "Step 4",
          title: "Reveal and self-destruction",
          body: "The recipient’s browser decrypts the content locally. Depending on the sharing policy, the encrypted payload can then be purged from the server after viewing or after a short expiry window.",
        },
      ],
      midCta: {
        body: "Need to share a password now? Create an encrypted one-time note and send the secure link instead of the password itself.",
        button: "Create a private note",
      },
    },
    {
      title: "High-security tip: split-channel sharing",
      paragraphs: [
        "An encrypted link is only as secure as the channel you use to send it. If a malicious third party gains access to your Teams or email inbox, they could intercept the link before your recipient opens it.",
        "Many secure sharing tools—including PrivateNote.ai—offer an optional setting to wrap the note with an additional password (passphrase wrapping). This is not enabled by default: you turn it on when you create the note, choose a passphrase, and the recipient must enter it before the secret is revealed.",
        "To prevent a single point of failure (SPoF) for highly sensitive credentials, use that option for split-channel sharing: generate the encrypted link with passphrase protection enabled, send the link via your primary channel (for example, Microsoft Teams), and send the passphrase through a completely different channel—preferably a privacy-focused messenger like Signal or Threema, or a short phone call.",
      ],
      callout:
        "An attacker would need both the link and the passphrase. That separation is what makes split-channel sharing effective.",
    },
    {
      title: "Password manager sharing vs. one-time links",
      paragraphs: [
        "Both methods can be highly secure, but they serve different purposes. Choosing the right tool depends on how long the recipient needs access.",
      ],
      comparisonTable: {
        headers: ["Category", "Best for", "Technical limitations"],
        rows: [
          [
            "Email, Teams, or WhatsApp",
            "Not recommended for passwords",
            "Leaves permanent, searchable plaintext copies in backups and archives",
          ],
          [
            "Password managers",
            "Ongoing access: sharing vaults with family members, internal departments, or trusted core teams",
            "Requires both parties to maintain active, compatible password manager accounts",
          ],
          [
            "One-time encrypted links",
            "Temporary access: freelancers, customer support, visitors, and one-off handoffs",
            "Anyone with the link can read the secret unless protected by a secondary passphrase",
          ],
        ],
        after: [
          "As a rule of thumb: use a **password manager** for ongoing shared access, and a **one-time encrypted link** when the credential should change soon after the handoff.",
        ],
      },
    },
    {
      title: "When to use a one-time password link",
      paragraphs: [
        "One-time password sharing is ideal for transactional credentials that only need to be communicated once. Common European workplace examples include:",
      ],
      useCaseTable: {
        headers: ["Department", "Common use cases"],
        rows: [
          [
            "Administration & office",
            "Router or office guest Wi-Fi passwords, printer admin credentials, or smart office settings",
          ],
          [
            "Finance & business",
            "Credentials for your tax advisor or external financial auditors",
          ],
          [
            "IT & operations",
            "Onboarding temporary external IT service providers, or sharing temporary contractor logins",
          ],
          [
            "Technical teams",
            "Database credentials, API keys, SSH keys, or cloud platform passwords with developers",
          ],
        ],
      },
    },
    {
      title: "Best practices and pitfalls to avoid",
      subsections: [
        {
          title: "Enforce rotation",
          paragraphs: [
            "Whenever you share a password, treat it as temporary. Ask the recipient to change it as soon as they log in, and confirm the rotation is complete before you consider the handoff finished.",
          ],
        },
        {
          title: "Generate strong, local passwords",
          paragraphs: [
            "Do not invent passwords yourself. Use a local tool such as PrivateNote’s [password generator](app:password-generator), or [passwords.lu](https://passwords.lu) for passphrase and PIN options. Both run locally—nothing is uploaded. For the technical model, see [How We Generate Secure Passwords](blog:how-we-generate-passwords).",
          ],
        },
        {
          title: "Keep expiration times short",
          paragraphs: [
            "Most passwords only need to exist for a few minutes or hours. Prefer a single view or a short window such as two hours when that still fits the recipient’s workflow.",
          ],
        },
        {
          title: "Do not put passwords in titles or subject lines",
          paragraphs: [
            "Never place plaintext passwords in email subject lines, ticketing system titles, Teams channel names, WhatsApp group titles, document names, or calendar invitations. Those fields are rarely treated with the same care as message bodies—and they persist in search indexes.",
          ],
        },
        {
          title: "Keep context out of the secure note",
          paragraphs: [
            "If you are sharing a database password, do not write “Database password for production CRM: MySecret123!” inside the note. Put only the raw secret in the encrypted link. If the link is intercepted, the attacker should not also learn which account or system it unlocks.",
          ],
        },
      ],
      calloutTitle: "Common mistake",
      callout:
        "Sending both the encrypted link and its passphrase in the same Teams message, WhatsApp chat, or email defeats split-channel sharing and recreates a single point of failure.",
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Is Microsoft Teams or WhatsApp safer than email?",
          answer:
            "Their transmission protocols are generally secure, but they still function as long-term chat archives. Any password pasted into a thread can remain searchable indefinitely, which makes it a persistent vulnerability.",
        },
        {
          question: "Does GDPR (DSGVO) affect how I share passwords?",
          answer:
            "Under GDPR Article 32, organisations must implement appropriate technical and organisational measures to secure personal data. Storing plaintext passwords in cloud backups or open email chains increases compliance exposure. Zero-knowledge, self-destructing links keep the credential footprint smaller.",
        },
        {
          question: "Should I send the link and the passphrase together?",
          answer:
            "No. Sending both pieces in the same message defeats split-channel sharing. Send the passphrase through a separate medium—preferably Signal or Threema, or a phone call.",
        },
        {
          question: "Should I use a password manager or a one-time link?",
          answer:
            "Use a password manager for long-term shared access. Use a browser-encrypted one-time link when you only need to communicate a password once.",
        },
        {
          question: "Do I still need a password manager?",
          answer:
            "Yes. Password managers remain the right place to store and manage credentials you keep. One-time encrypted links complement them for controlled, temporary handoffs.",
        },
      ],
    },
    {
      title: "Final thoughts",
      paragraphs: [
        "Secure password sharing does not have to be a bottleneck for your workflow. It simply requires a small habit change: stop leaving sensitive data permanently resting in chat logs and inbox histories.",
        "By using local, browser-side encryption and self-destructing links, you reduce organisational security and compliance risk while keeping handoffs fast and practical.",
        "The next time you need to share a password, avoid copy-pasting it into Microsoft Teams, WhatsApp, or email. Create an encrypted one-time note, send the link instead of the password, and let the note expire after it has served its purpose.",
      ],
    },
  ],
  ctaTitle: "Ready to share securely?",
  ctaBody:
    "Create a private note on PrivateNote.ai to encrypt credentials in your browser before upload. Notes can expire automatically or after reading, optional passphrase protection adds another layer, and encrypted note data is handled under EU jurisdiction.",
  ctaButton: "Create a private note",
};
