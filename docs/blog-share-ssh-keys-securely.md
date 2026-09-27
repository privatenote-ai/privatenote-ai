# How to Share SSH Keys Securely

*Public keys are safe to share. Private keys are not. Prefer enrollment over handoffs—and when a PEM must move, encrypt it locally and burn the link.*

---

A teammate needs onto the staging box. A contractor needs a deploy key for the weekend. Someone’s laptop died and the only remaining access is the private key on your machine.

The fastest path is usually the same bad habit: paste the PEM into Slack, email it “just this once,” or drop it into a ticket. That message syncs to phones, lands in search indexes, and can sit in backups long after the emergency is over.

This post is the production article at `/blog/how-to-share-ssh-keys-securely` (component `ShareSshKeysSecurelyPost`).

## Internal links used in the article

- `blog:how-to-share-api-key-securely`
- `blog:how-to-share-a-password-securely`
- `blog:one-time-secret-links`
- `blog:secrets-in-cicd-env-github-leaks`
- `blog:what-is-end-to-end-encryption`
- `blog:how-to-make-a-private-note`
- `blog:privatenote-for-developers`
- `blog:privatenote-codex`
- `blog:secrets-never-send-in-chat`
- `blog:why-email-is-worst-for-secrets`
- `app:home`, `app:developers`, `app:developers/vscode`, `app:developers/cli`, `app:developers/mcp`
- `chrome:extension`

## Reciprocal links added

- API key article → SSH keys
- CI/CD secrets article → SSH keys
- PrivateNote for developers → SSH keys (+ API keys)
