import type { E2eeDefinitionArticleCopy } from "./endToEndEncryptionDefinition.types";

export const endToEndEncryptionDefinitionEn: E2eeDefinitionArticleCopy = {
  intro: [
    "End-to-end encryption is one of the most repeated phrases in security marketing. It is also one of the easiest to dilute. The real definition is not that data is encrypted somewhere. The real definition is about who can decrypt it.",
    "If the service provider has the keys, can recover the keys, or receives plaintext during normal operation, the system may still be encrypted, but it is not end-to-end encrypted in the strict sense.",
  ],
  definitionTitle: "The shortest useful definition",
  definitionBody:
    "End-to-end encryption means only the endpoints have the keys required to decrypt the data. The service provider may store or relay ciphertext, but it should not possess the keys or plaintext.",
  tableHeaders: ["Model", "Encryption", "Server sees plaintext?", "Server has keys?"],
  tableRows: [
    { model: "Transport security (TLS)", happens: "Between browser and server", plaintext: "Yes, on the server", keys: "Yes, for server-side processing" },
    { model: "Flawed client-side encryption", happens: "On the device", plaintext: "Maybe", keys: "Yes, if keys are uploaded or recoverable" },
    { model: "True E2EE", happens: "At the endpoints", plaintext: "No", keys: "No" },
  ],
  flowNodes: [
    { title: "Sender browser", body: "Encrypts locally before upload" },
    { title: "PrivateNote storage", body: "Stores ciphertext only" },
    { title: "Recipient browser", body: "Decrypts with the fragment key" },
  ],
  sections: [
    {
      title: "Encryption is not the same as end-to-end encryption",
      paragraphs: [
        "Most serious web services use TLS. That matters: TLS protects data while it travels between your browser and the server, and it prevents local-network attackers from reading the connection.",
        "But TLS terminates at the server. Once the request arrives, the service can usually see the plaintext. The provider may then store it, scan it, index it, process it, or encrypt it again at rest with keys the provider controls.",
        "That is encrypted transport. It is not, by itself, end-to-end encryption.",
      ],
      callout: "The practical test is simple: can the provider obtain the decryption key or the plaintext? If yes, the system is not truly end-to-end encrypted.",
    },
    {
      title: "The cryptographer's definition",
      paragraphs: [
        "A precise definition of E2EE starts with key possession. In a true end-to-end system, encryption and decryption keys are created and held by the endpoints, not by the delivery service.",
        "The server can route, store, rate-limit, and delete ciphertext. It can operate the service. But it does not hold the key material required to turn ciphertext back into readable content.",
        "Matthew Green's well-known analysis of Zoom's encryption controversy makes this point clearly: the core property is not just that encryption exists, but that decryption keys are unavailable to the provider.",
      ],
      bullets: [
        "The sender endpoint can encrypt the data.",
        "The recipient endpoint can decrypt the data.",
        "The intermediary server only handles ciphertext.",
        "A server compromise should not expose plaintext content.",
      ],
    },
    {
      title: "Client-side encryption can still fall short",
      paragraphs: [
        "Client-side encryption means the cryptographic operation happens locally before upload. That is necessary for many E2EE designs, but it is not sufficient on its own.",
        "A service could encrypt data in the browser and then upload both the ciphertext and the matching key to its backend. The encryption happened client-side, but the provider still has the key. That breaks the end-to-end boundary.",
        "The meaningful distinction is exclusive key possession. If the provider can access, recover, rotate, escrow, or regenerate the usable key, the user is still trusting the provider with plaintext access.",
      ],
    },
    {
      title: "How URL-fragment notes fit the model",
      paragraphs: [
        "PrivateNote uses a browser-based version of this architecture for one-time notes. The sender's browser encrypts the note locally. The encrypted payload is uploaded to storage. The decryption key is placed in the URL fragment: the part after the # symbol.",
        "Browsers do not send the URL fragment to the server in the HTTP request. That means the server receives the ciphertext, but not the key. When the recipient opens the link, their browser has the fragment locally and can decrypt the note after the reveal step.",
        "This is not the same topology as Signal or MLS, where endpoints are usually account-bound devices with persistent public keys. But the central security property is the same: the storage provider does not possess the key needed to decrypt the content.",
      ],
    },
    {
      title: "The delivery channel still matters",
      paragraphs: [
        "A one-time encrypted link is powerful, but the full link becomes sensitive because it carries the decryption key in the fragment. If you paste that link into a channel that logs messages, syncs history, or is monitored by an administrator, that channel may expose the secret before it is opened.",
        "This is why expiration, one-time reads, and optional passwords are operationally important. They do not change the definition of E2EE, but they reduce the damage if a link is forwarded, logged, or previewed by software.",
        "For highly sensitive material, send the link through one channel and share the optional password through a different channel. That separates possession of the encrypted payload from possession of the human secret.",
      ],
    },
    {
      title: "The offline brute-force caveat",
      paragraphs: [
        "Password protection adds defense in depth, but it has a real cryptographic caveat. If an attacker obtains the full link and downloads the ciphertext before it expires, password guessing can become an offline attack. The server's rate limits no longer help, because the attacker can try guesses against the ciphertext locally.",
        "PrivateNote uses Argon2id for password-protected notes. Argon2id is a memory-hard key derivation function, which raises the cost of each password guess, especially for GPU-heavy brute-force attacks.",
        "That does not make weak passwords safe. A short or reused password can still fail. The stronger the optional password, the more useful this second layer becomes.",
      ],
    },
    {
      title: "Why the architecture matters",
      paragraphs: [
        "E2EE changes the trust model. With ordinary encrypted-at-rest storage, users rely on provider policy, employee controls, legal handling, and breach prevention. With end-to-end encryption, the provider is structurally limited: it can store encrypted data, but it cannot decrypt it.",
        "That does not eliminate every risk. Endpoint malware, malicious browser extensions, copied links, weak passwords, and unsafe delivery channels still matter. Cryptography narrows the trust boundary; it does not remove operational judgment.",
        "The value is still significant: a database breach should expose unreadable ciphertext rather than message content. That is the difference between promising not to read data and being unable to read it in the first place.",
      ],
    },
  ],
  continueReadingTitle: "Continue reading",
  referencesTitle: "References",
  references: [
    { label: "Matthew Green, “Does Zoom use end-to-end encryption?”", href: "https://blog.cryptographyengineering.com/2020/04/03/does-zoom-use-end-to-end-encryption/" },
    { label: "Signal, The X3DH Key Agreement Protocol", href: "https://signal.org/docs/specifications/x3dh/" },
    { label: "IETF RFC 9420, The Messaging Layer Security Protocol", href: "https://www.rfc-editor.org/rfc/rfc9420.html" },
    { label: "Unger et al., SoK: Secure Messaging", href: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a232.pdf" },
  ],
};
