import type { ShareSshKeysSecurelyArticleCopy } from "./shareSshKeysSecurely.types";

export const shareSshKeysSecurelyEn: ShareSshKeysSecurelyArticleCopy = {
  heroAlt:
    "Developer working at a desk with a laptop open to code—where SSH key handoffs often start",
  heroCaption:
    "SSH private keys belong in encrypted, short-lived handoffs—not Slack, email, or git history. Image: programming desk via Pixabay.",
  intro: [
    "A teammate needs onto the staging box. A contractor needs a deploy key for the weekend. Someone’s laptop died and the only remaining access is the private key on your machine.",
    "The fastest path is usually the same bad habit: paste the PEM block into Slack, email it “just this once,” or drop it into a ticket. That message syncs to phones, lands in search indexes, and can sit in backups long after the emergency is over.",
    "SSH private keys are high blast-radius secrets. One leaked key can mean full shell access. This guide covers when you should share a private key at all, what never to paste into chat, and how to hand one off with a burn-after-reading encrypted link—plus the PrivateNote developer extensions that make the secure path the fast one.",
  ],
  sections: [
    {
      title: "Public key vs private key (30 seconds of clarity)",
      paragraphs: [
        "An SSH key pair has two halves. The **public** key is designed to be shared: you add it to `~/.ssh/authorized_keys`, a cloud console, or a GitHub deploy key. Sending someone’s public key in chat is normal.",
        "The **private** key (`id_ed25519`, `id_rsa`, a `.pem` file) is the secret. Anyone who has it can authenticate as that identity until you revoke access. Treat it like a password that unlocks a server—because that is what it is.",
        "If your instinct is “we need to share the private key,” pause. In many cases you should share the **public** key instead: the recipient generates their own pair locally and you authorize their public key on the host.",
      ],
      calloutTitle: "Rule of thumb",
      callout:
        "Prefer adding their public key over sending your private key. Private-key handoffs are for break-glass and legacy cases—not default onboarding.",
    },
    {
      title: "Prefer not sharing the private key",
      paragraphs: [
        "Before you encrypt and send anything, ask whether the private key must move at all:",
      ],
      subsections: [
        {
          title: "Add their public key",
          paragraphs: [
            "Have them run `ssh-keygen`, send you the `.pub` file (safe in chat), and append it to `authorized_keys` or the provider’s SSH settings. They keep the private half; you never see it.",
          ],
        },
        {
          title: "Use a purpose-built deploy key",
          paragraphs: [
            "For CI or a single repo, create a dedicated deploy key with the minimum scope. Avoid reusing a personal laptop key across systems.",
          ],
        },
        {
          title: "Prefer short-lived access",
          paragraphs: [
            "Where your stack supports it—SSH certificates, bastion jump hosts, Tailscale SSH, cloud IAM roles—prefer time-bounded access over copying long-lived private keys.",
          ],
        },
        {
          title: "When private-key handoff is justified",
          paragraphs: [
            "Break-glass recovery, a legacy host that cannot enroll new keys quickly, or an emergency where only one passphrase-protected key exists. Even then: encrypt the transfer, keep expiry short, confirm receipt, then rotate or revoke.",
          ],
        },
      ],
    },
    {
      title: "Where SSH keys die in the wild",
      paragraphs: [
        "The same channels that leak [API keys](blog:how-to-share-api-key-securely) and [passwords](blog:how-to-share-a-password-securely) leak SSH material—often with worse consequences.",
      ],
      comparisonTable: {
        headers: ["Channel", "Why it fails", "What attackers get"],
        rows: [
          [
            "Slack, Teams, Discord",
            "Searchable history, device sync, workspace exports",
            "Full private key in plaintext forever",
          ],
          [
            "Email",
            "Inboxes, archives, mobile sync, forwards",
            "A durable copy you cannot reliably erase",
          ],
          [
            "Tickets & docs",
            "Jira, Notion, Confluence, GitHub issues",
            "Keys in backups, AI search, and audit trails",
          ],
          [
            "Git repositories",
            "History is sticky; “delete and push” does not erase",
            "Scanners find PEMs in minutes on public repos",
          ],
        ],
        after: [
          "If the secret has already appeared in chat or git, assume it is burned. Revoke the key, generate a new pair, and deliver the replacement through a [one-time encrypted link](blog:one-time-secret-links)—not another paste. For pipeline and `.env` leaks, see [secrets in CI/CD and GitHub](blog:secrets-in-cicd-env-github-leaks).",
        ],
      },
    },
    {
      title: "A safer SSH private-key handoff",
      paragraphs: [
        "When you must move a private key, treat the transfer as temporary delivery—not storage. The same pattern used for passwords and API keys applies: encrypt locally, send a link, burn after read, then rotate.",
        "PrivateNote encrypts in the browser (or in your editor/CLI) with AES-256-GCM before anything reaches the network. The decryption key lives only in the URL fragment—the `#…` part browsers never send to servers. Details: [what end-to-end encryption means here](blog:what-is-end-to-end-encryption) and [how to make a private note](blog:how-to-make-a-private-note).",
      ],
      flowIntro: "A practical break-glass workflow:",
      flowSteps: [
        {
          step: "Step 1",
          title: "Scope and protect the key",
          body: "Prefer a dedicated key for this host or task. Use a passphrase on the private key. Avoid shipping your daily personal identity key if a narrower key will do.",
        },
        {
          step: "Step 2",
          title: "Encrypt locally",
          body: "Paste only the key material (not a novel of hostnames and usernames) into PrivateNote via the [web app](app:home), [VS Code / Cursor extension](app:developers/vscode), [CLI](app:developers/cli), or [Chrome extension](chrome:extension).",
        },
        {
          step: "Step 3",
          title: "Send the link—not the PEM",
          body: "Share the encrypted link in Slack or email. Optionally enable passphrase wrapping and send that passphrase on a separate channel ([split-channel tip](blog:how-to-share-a-password-securely)). Prefer 15 minutes or 1 hour expiry and burn-after-reading.",
        },
        {
          step: "Step 4",
          title: "Confirm, then rotate",
          body: "Recipient installs the key with correct permissions (`chmod 600`), confirms login, then you revoke the old key or rotate. Treat any key that sat in an AI prompt as seen—rotate it.",
        },
      ],
      midCta: {
        body: "Need to hand off an SSH key now? Create an encrypted one-time note and send the link instead of the private key.",
        button: "Create a private note",
      },
    },
    {
      title: "Developer extensions: share SSH keys from where you work",
      paragraphs: [
        "Handoffs fail when the secure tool is three clicks farther than Slack. PrivateNote integrations keep encryption in your editor, browser, terminal, or agent workflow. Full tour: [PrivateNote for developers](blog:privatenote-for-developers).",
      ],
      useCaseTable: {
        headers: ["Your situation", "Best path"],
        rows: [
          [
            "Key is already open in the editor",
            "VS Code / Cursor / Codex IDE extension — select → share as PrivateNote",
          ],
          [
            "Key is on a webpage or ticket",
            "Chrome extension — highlight → Create PrivateNote",
          ],
          [
            "You are in a terminal",
            "CLI — pipe the file so the PEM never sits in shell history",
          ],
          [
            "You want an agent to produce the link",
            "MCP server — then rotate; prefer the editor extension for private keys",
          ],
          [
            "Recipient is non-technical",
            "Web app link at privatenote.ai",
          ],
        ],
      },
      subsections: [
        {
          title: "VS Code, Cursor, and Codex IDE",
          paragraphs: [
            "Install from the marketplace (`PrivateNote.privatenote-vscode`), select the key block, and use **Share as PrivateNote**—or open the sidebar composer. Encryption runs in the editor host process, so the plaintext never has to enter an AI chat. Setup: [VS Code / Cursor extension](app:developers/vscode).",
          ],
        },
        {
          title: "Chrome extension",
          paragraphs: [
            "When a key appears in a ticket, docs page, or admin console, highlight it and create an encrypted note without copying into Slack first. Install: [Chrome extension](chrome:extension).",
          ],
        },
        {
          title: "CLI",
          paragraphs: [
            "Pipe from a file so the secret is not an `echo` argument in shell history: `cat id_ed25519 | npx privatenote-cli --expire 15m --output-url-only`. Docs: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "MCP for Cursor, Claude, and Codex",
          paragraphs: [
            "Agents can call `create_private_note` after you install [privatenote-mcp](app:developers/mcp). Useful for orchestration—but if you paste the private key into the agent prompt, the model provider may see it before encryption. For SSH private keys, prefer the editor or Chrome extension. Codex-specific setup: [PrivateNote with Codex](blog:privatenote-codex).",
          ],
        },
      ],
      calloutTitle: "Honest caveat",
      callout:
        "MCP encrypts after the agent reads the prompt. Persistent chat/email exposure is gone; AI-provider visibility is not. For private keys, use the VS Code or Chrome extension so plaintext never leaves your machine until it is already ciphertext.",
    },
    {
      title: "Best practices and pitfalls",
      subsections: [
        {
          title: "Never commit private keys",
          paragraphs: [
            "Keep `id_*` and `*.pem` out of repos. Add them to `.gitignore`. If a key hit git history, rotate it—rewriting history is not enough once the repo was cloned or scanned.",
          ],
        },
        {
          title: "Fix file permissions",
          paragraphs: [
            "Private keys should be `chmod 600` (or `400`). SSH will refuse overly permissive key files on many systems—and world-readable keys on shared machines are an own-goal.",
          ],
        },
        {
          title: "Do not put context inside the note",
          paragraphs: [
            "Put only the key material in the encrypted note. Send hostname, username, and port in a separate message. If the link leaks, the attacker should not also get a labeled map of what it unlocks.",
          ],
        },
        {
          title: "Passphrase and split channels",
          paragraphs: [
            "Passphrase-protect the key file itself, and optionally wrap the PrivateNote with a separate passphrase sent on another channel. Same guidance as [secure password sharing](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Agent forwarding is not a sharing strategy",
          paragraphs: [
            "SSH agent forwarding can reduce key copies on remote hosts, but it is not a substitute for careful key distribution—and it expands trust to every hop you forward through. Use it deliberately, not as an excuse to email PEMs.",
          ],
        },
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Is it safe to send a public key in Slack?",
          answer:
            "Yes. Public keys are meant to be distributed. Still avoid dumping entire `~/.ssh` directories—people accidentally include private files.",
        },
        {
          question: "Can I put an SSH private key in a password manager?",
          answer:
            "For long-term storage of keys you keep, a password manager or hardware-backed agent is appropriate. Use a one-time encrypted link for the human-to-human delivery moment—then the recipient stores the key properly. PrivateNote is delivery, not a secrets vault.",
        },
        {
          question: "Should I share the key and the passphrase together?",
          answer:
            "No. That recreates a single point of failure. Send the encrypted link on one channel and any passphrase on another—or have the recipient set their own passphrase after install and rotate.",
        },
        {
          question: "What expiry should I use?",
          answer:
            "For live coordination, 15 minutes with burn-after-reading. For async contractor handoffs, 1 hour or 1 day at most. Prefer shorter whenever the recipient is reachable.",
        },
        {
          question: "Is PrivateNote a replacement for Vault or cloud secret managers?",
          answer:
            "No. Use Vault, AWS Secrets Manager, and similar tools for machine-to-machine storage and injection. Use PrivateNote for the person-to-person moment when a key must cross chat or email without becoming a permanent archive. Same distinction as in the [API key guide](blog:how-to-share-api-key-securely).",
        },
      ],
    },
    {
      title: "Final thoughts",
      paragraphs: [
        "Most SSH “sharing” problems are really enrollment problems: add a public key, use a deploy key, or issue short-lived access. When a private key must move, do not leave it in [chat history](blog:secrets-never-send-in-chat) or [email](blog:why-email-is-worst-for-secrets).",
        "Encrypt locally, send a self-destructing link, confirm install, then rotate. Wire the [developer tools](app:developers) you already use so the secure path is also the path of least resistance.",
      ],
    },
  ],
  ctaTitle: "Share the link—not the private key",
  ctaBody:
    "Create a browser-encrypted PrivateNote with short expiry and burn-after-reading. Or encrypt from the VS Code extension, CLI, or Chrome extension so the PEM never lands in Slack as plaintext.",
  ctaButton: "Create a private note",
};
