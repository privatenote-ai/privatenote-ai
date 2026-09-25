import type { OnetimesecretVsPrivateNoteArticleCopy } from "./onetimesecretVsPrivateNote.types";

export const onetimesecretVsPrivateNoteEn: OnetimesecretVsPrivateNoteArticleCopy = {
  intro: [
    "OneTimeSecret and PrivateNote solve the same practical problem: moving a password, API key, recovery code, or confidential note through a temporary link rather than leaving plaintext in email or chat. The recipient opens the link, and the stored payload can disappear after it is read or when its expiry time is reached.",
    "Both products encrypt the payload. The important difference is where encryption happens.",
    "OneTimeSecret describes its architecture as server-side encryption. The plaintext reaches OneTimeSecret before it is encrypted. PrivateNote encrypts locally first, so the service receives ciphertext rather than the plaintext payload. That difference determines the cryptographic trust boundary.",
  ],
  sections: [
    {
      title: "Two ways to build the same link",
      paragraphs: [
        "In **server-side encryption**, the sender submits the secret to the service over TLS. The service receives the plaintext, encrypts it, and stores ciphertext. It can then store the payload, deliver it, expire it, and delete it. The application server is part of the encryption process because plaintext crosses into the service before becoming ciphertext.",
        "In **client-side encryption**, the sender’s device encrypts first. The service receives and stores ciphertext. That upload travels over TLS. The service does not receive the key needed to decrypt a standard payload. The recipient’s device decrypts locally. The service can still store, deliver, expire, and delete the payload without needing access to its plaintext.",
        "Both designs can provide temporary links, limited access, and expiry. Both can accurately be described as encrypted. OneTimeSecret uses the first architecture; PrivateNote uses the second. The relevant question is therefore not simply whether a one-time link is encrypted, but which systems must have access to plaintext for that link to work.",
      ],
    },
    {
      title: "OneTimeSecret: server-side encryption",
      paragraphs: [
        "In the ordinary OneTimeSecret flow, the sender submits the secret over TLS. The application receives the plaintext, encrypts it on the server, and stores the encrypted payload.",
        "This provides meaningful protection for stored data. Obtaining encrypted storage alone does not necessarily reveal its contents when the material required for decryption is unavailable to the attacker.",
        "The architectural trade-off occurs before storage. TLS protects the secret while it travels between the browser and OneTimeSecret, but the application must process the plaintext in order to encrypt it. The application server therefore sits inside the cryptographic trust boundary.",
        "A malicious or compromised application process at that moment could access the secret before it is encrypted for storage. Client-side encryption removes this particular dependency by encrypting the secret before it reaches the service.",
      ],
    },
    {
      title: "OneTimeSecret’s passphrase does not change the encryption boundary",
      paragraphs: [
        "OneTimeSecret’s documentation describes an optional passphrase. When a passphrase is used, OneTimeSecret says the secret is encrypted on its servers using the passphrase supplied by the sender. It says it does not store the passphrase itself; instead, it retains a bcrypt hash used to verify the passphrase during retrieval. According to its documentation, that hash cannot itself decrypt the secret, and the stored passphrase-protected secret cannot be decrypted without the original passphrase.",
        "Retrieval uses the same server-side boundary. The recipient supplies the passphrase to OneTimeSecret over TLS. The service verifies it and performs the decryption on the server before returning the plaintext.",
        "This means the application process has access to the secret and passphrase when encryption occurs and again processes the passphrase and resulting plaintext during retrieval. A malicious or compromised application process operating at either point could potentially capture that information. This is a consequence of where encryption and decryption execute, not a claim that OneTimeSecret records or misuses those values.",
        "OneTimeSecret’s public documentation does not, by itself, establish every detail of its internal key hierarchy—for example, precisely how server-side key material, per-secret keys, key derivation, and the supplied passphrase are combined. There is no need to speculate about those implementation details for this comparison. The relevant documented property is that encryption and decryption take place on the service side.",
      ],
      diagrams: [
        {
          label: "OneTimeSecret",
          caption:
            "The secret you want to send, and the passphrase when you set one, both travel to the server over TLS. Encryption runs on that server. What remains in storage is ciphertext.",
          columns: [
            [
              { text: "Secret + passphrase", via: "TLS" },
              { text: "Server", via: "Encrypt" },
              { text: "Ciphertext" },
            ],
          ],
        },
      ],
    },
    {
      title: "Self-hosting can make that server trust reasonable",
      paragraphs: [
        "OneTimeSecret is open source. An organization can run its own instance inside an enterprise security perimeter, rather than sending secrets to the public service.",
        "In that deployment, trusting the application server is trusting infrastructure the organization already operates. The plaintext still reaches that server, because encryption still happens there. The party on the other side of the boundary is the organization’s own hosts, operators, and backups. For a team that already accepts those systems as part of the path a secret takes, server-side encryption can be a reasonable choice. It narrows the gap between the server-side and client-side threat models, because the operator is no longer an outside service.",
      ],
    },
    {
      title: "PrivateNote encrypts before upload",
      paragraphs: [
        "A standard PrivateNote is encrypted before upload. The sender’s browser, or a local [CLI](app:developers/cli), [Chrome extension](app:developers/chrome), [editor extension](app:developers/vscode), or [MCP](app:developers/mcp) process, generates a random key and encrypts the payload with AES-256-GCM. Only ciphertext is uploaded. TLS carries that ciphertext from the browser to PrivateNote’s Cloudflare worker. The decryption key is placed in the URL fragment, the part after `#`, for example `https://privatenote.ai/note/abc123#…`. The fragment is handled client-side and is not included in the HTTPS request ([RFC 3986, §3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5); [URL Standard](https://url.spec.whatwg.org/#concept-url-fragment)). The worker receives a note identifier and returns ciphertext over the same TLS connection. The browser keeps the fragment and decrypts locally.",
      ],
    },
    {
      title: "A passphrase protects the key if the link’s channel is compromised",
      paragraphs: [
        "A passphrase on PrivateNote does a different job from a passphrase on OneTimeSecret. The note is already ciphertext before it leaves the device. If you add a passphrase, the browser derives a wrapping key from it with Argon2id and uses that wrapping key to encrypt the note’s key. The URL fragment then holds the wrapped key. The recipient needs the link and the passphrase. The browser unwraps the key locally and only then decrypts the note.",
        "PrivateNote does not receive the passphrase. The create request carries ciphertext, a salt, and the parameters the recipient’s browser needs to try the passphrase locally. There is no server-side hash whose job is to verify the passphrase. A wrong passphrase fails decryption on the device.",
        "The passphrase additionally protects the client-side key locally if the channel carrying the link is compromised. That channel then sees a wrapped key, not a key that can open the note by itself. It is not the mechanism that keeps PrivateNote outside the plaintext path. That separation is already there on a standard note, passphrase or not. Share the passphrase on a different channel from the link. The same message collapses the two layers into one — the same rule as [sharing a password securely](blog:how-to-share-a-password-securely).",
      ],
      diagrams: [
        {
          label: "PrivateNote",
          caption:
            "Local encryption produces the client-side key and the ciphertext. Argon2id wraps that key, and the wrapped key stays in the URL fragment. TLS carries only the ciphertext to the Cloudflare worker.",
          columns: [
            [
              { text: "Secret" },
              { text: "Local encryption" },
              { text: "Ciphertext", via: "TLS" },
              { text: "Server" },
            ],
            [
              { text: "Passphrase" },
              { text: "Local Argon2id" },
              { text: "Wrap key" },
              { text: "URL fragment" },
            ],
          ],
        },
      ],
      comparisonTable: {
        lead: "The same split, one property at a time.",
        headers: ["", "OneTimeSecret + passphrase", "PrivateNote + passphrase"],
        rows: [
          ["Payload encryption", "Server", "Sender’s device"],
          ["Plaintext reaches service", "Yes", "No"],
          ["Passphrase reaches service", "Yes", "No"],
          [
            "Passphrase role",
            "Participates in server-side protection",
            "Derives a local wrapping key",
          ],
          [
            "Stored verifier or material",
            "bcrypt verifier and encrypted payload, per OneTimeSecret’s docs",
            "Salt, Argon2id wrap parameters, and ciphertext",
          ],
          ["Where decryption executes", "OneTimeSecret application server", "Recipient device"],
        ],
      },
      paragraphsAfterTable: [
        "PrivateNote’s key handling is described on [How it works](app:how-it-works): the content key is wrapped with Argon2id, and the wrapped key travels in the link.",
      ],
    },
    {
      title: "The remaining web-client trust assumption",
      paragraphs: [
        "Client-side encryption in a browser is not a trustless web application. The cryptography can run locally while the JavaScript that implements it is delivered by the site. The browser trusts the code it receives for that session.",
        "Someone who can alter that JavaScript — through the application, a CDN, or the deployment pipeline — could change the client and capture keys in a future browser session. That is a different failure from stealing a database. A storage compromise exposes ciphertext. Malicious code delivery attacks the endpoint while the key is actually present.",
        "A later database dump cannot manufacture client-side keys that were never stored there. An actively compromised client can attack secrets handled during that session. The same assumption is written into PrivateNote’s threat model: the delivered application code has not been maliciously modified, and the sender’s and recipient’s devices are trusted at the moment of encryption and decryption.",
        "Installed software narrows that dependence on a freshly downloaded page. A CLI, an editor extension, or a native app runs code you installed. Those clients still depend on the operating system, signing, dependencies, and the update channel. The [developer tools](app:developers) use the same split as the browser: encrypt locally, upload ciphertext, leave the key in the fragment.",
      ],
    },
    {
      title: "Lifetime and confidentiality",
      paragraphs: [
        "A one-time link answers two separate questions. How long should the encrypted payload exist? And who can decrypt it while it exists? Destroying it after retrieval or expiry shortens the window. It does not decide who could read it during that window. Lifetime and confidentiality support each other. One does not stand in for the other.",
        "The distinction is sharpest when the payload is authority: API keys, database credentials, cloud tokens, recovery codes, infrastructure passwords. A secret-sharing service exists because the sender wants fewer systems entrusted with that information. If the intermediary only has to carry an opaque encrypted object, enforce expiry, and delete it, the server can do that work without receiving the secret or the key that opens it.",
      ],
    },
    {
      title: "Where the boundary sits",
      paragraphs: [
        "“Encrypted” does not tell you where the trust boundary sits. The standard worth using is a minimal trust boundary: the principle of least privilege applied to who must see plaintext. In modern cryptographic engineering, the goal is not merely trusting that a server behaves, but reducing the mathematical necessity for trust in the first place.",
        "OneTimeSecret describes a server-side encrypted system. With passphrase protection, it says the stored secret cannot subsequently be decrypted without the passphrase, and that a server compromise would leave the secret secure as long as that passphrase stays unknown. A weak passphrase can be brute-forced. If it is weak, that compromise can still leave the secret recoverable. The plaintext and the passphrase reach OneTimeSecret at creation, because encryption happens on its servers, and the passphrase is sent back at retrieval so those servers can decrypt.",
        "PrivateNote makes a different architectural choice. The payload is encrypted before it reaches the service, and the standard payload key remains client-side. A passphrase, when you set one, additionally protects that client-side key locally if the channel carrying the link is compromised. It is not sent to PrivateNote.",
        "OneTimeSecret encrypts your secret. The client using PrivateNote’s service encrypts it before the service receives it. That distinction does not depend on assuming that either provider is malicious. It reduces the question to architecture: how many systems need access to plaintext for the service to work?",
      ],
    },
    {
      title: "Common questions",
      faqs: [
        {
          question: "Does OneTimeSecret store the secret in plaintext?",
          answer:
            "Their documentation says no. They encrypt on their servers. With a passphrase, they say they store the encrypted secret and a bcrypt hash of the passphrase, not the passphrase, and that the hash cannot decrypt the secret.",
        },
        {
          question: "If I set a passphrase on OneTimeSecret, is the secret hidden from their servers?",
          answer:
            "Not during creation, and not at retrieval. OneTimeSecret says the secret and passphrase are supplied to its server so that the server can perform encryption. When the recipient opens the link, they send the passphrase back over TLS, and decryption runs on OneTimeSecret’s servers before the plaintext is returned. After encryption, OneTimeSecret says it discards the plaintext passphrase, retains only a bcrypt hash, and cannot decrypt the stored secret without the original passphrase.",
        },
        {
          question: "What does a PrivateNote passphrase protect?",
          answer:
            "The client-side key, if the channel carrying the link is compromised. The note itself is already encrypted on your device with AES-256-GCM. Argon2id derives a wrapping key from the passphrase locally, and that wrapping key encrypts the note’s key. The link then holds a wrapped key. PrivateNote receives ciphertext and a salt. It does not receive the passphrase or the raw key. A standard note is encrypted before upload even without a passphrase. Send the passphrase on a separate channel from the link.",
        },
        {
          question: "Can client-side encryption protect against a compromised PrivateNote server?",
          answer:
            "A stored-data or API compromise: yes, in the sense that client-side encryption isolates unread payloads, because the server does not have the standard payload key. A later database dump cannot manufacture keys that were never stored there. Malicious client-code delivery: no. An attacker who can change the JavaScript delivered to a future browser session could attempt to capture the key while it is present. Installed clients reduce that dependence on a freshly downloaded page.",
        },
      ],
    },
    {
      title: "Primary sources",
      paragraphs: [
        "Architecture information about OneTimeSecret was reviewed against its public documentation on September 23, 2026. Product implementations and documentation may change.",
      ],
      bullets: [
        "[OneTimeSecret documentation](https://docs.onetimesecret.com/)",
        "[OneTimeSecret on security and passphrases](https://onetimesecret.com/en/about)",
        "[OneTimeSecret source code](https://github.com/onetimesecret/onetimesecret)",
        "[How PrivateNote encryption works](app:how-it-works)",
        "[PrivateNote for developers](blog:privatenote-for-developers), including the CLI",
        "[RFC 3986, section 3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5), which separates the fragment from the URI before dereference",
        "[URL Standard, fragment](https://url.spec.whatwg.org/#concept-url-fragment), on client-side handling of the fragment",
      ],
    },
  ],
  ctaTitle: "Encrypt before the secret leaves the device",
  ctaBody:
    "Write the note in the browser. The client encrypts it locally, puts the key in the link, and can protect that key with a passphrase the server never receives.",
  ctaPrimary: "Create a private note",
  ctaSecondary: "See how encryption works",
};
