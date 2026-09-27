import type { CicdEnvGithubSecretsArticleCopy } from "./cicdEnvGithubSecrets.types";

export const cicdEnvGithubSecretsEn: CicdEnvGithubSecretsArticleCopy = {
  heroAlt:
    "Developer laptop on a desk at night showing a terminal and configuration files under cool blue desk light",
  heroCaption:
    "Most secret leaks start as convenience: a committed .env, a pasted CI variable, or a key that never left Git history.",
  intro: [
    "API keys do not usually leak through clever cryptography attacks. They leak through developer workflows—`.env` files checked into Git, secrets echoed in CI logs, and credentials pasted into pull requests “just for now.”",
    "If you already know [how to share an API key securely](blog:how-to-share-api-key-securely), this guide is the next layer: where those keys actually escape in modern software delivery, and how to stop GitHub, CI/CD, and local config from becoming a permanent archive of your production access.",
    "The pattern is the same every time. A secret enters a system built to keep history. Months later, a fork, a log export, a compromised laptop, or a public repo scan turns that convenience into an incident.",
  ],
  sections: [
    {
      title: "Why .env files and CI/CD are a developer leak magnet",
      paragraphs: [
        "Local environment files and pipelines exist to move configuration quickly. That speed is useful—and dangerous—because secrets often travel with the same tools you use for code review, build artifacts, and automation.",
        "A `.env` file feels temporary. A secret stored in CI feels “handled.” A debug `echo $DATABASE_URL` feels harmless in a private repo. Attackers—and automated secret scanners—do not care whether the exposure was intentional. They care about permanence, searchability, and blast radius.",
        "Treat every secret that touches Git or CI as if it will eventually be copied, mirrored, or indexed. Design the workflow so that assumption is survivable: short-lived credentials, proper secret stores, and human handoffs that do not leave plaintext in chat or tickets.",
      ],
    },
    {
      title: "How secrets escape through GitHub",
      subsections: [
        {
          title: "Committed .env and config files",
          paragraphs: [
            "The classic leak is still the most common: `cp .env.example .env`, fill in production values, then `git add .` without noticing. Even if you delete the file in the next commit, the secret remains in Git history until you rewrite it—and public repositories may be scanned for exposed credentials very quickly. Rewriting history also does not erase every copy: forks, mirrors, CI caches, and local clones can still hold the old commits.",
            "Variants include `docker-compose.yml` with hardcoded passwords, Terraform state with sensitive outputs, Kubernetes manifests that store base64-encoded “secrets” (base64 is encoding, not encryption—anyone who can read the manifest can decode the value), and notebook cells that print tokens. If it looks like configuration, assume scanners will treat it like a credential dump.",
          ],
        },
        {
          title: "Pull requests, issues, and comments",
          paragraphs: [
            "Developers paste staging keys into PR descriptions to “help the reviewer reproduce the bug.” Ticket comments and GitHub Discussions inherit the same problem: searchable permanence, notifications, email digests, and exports.",
            "Private repositories significantly reduce casual exposure, but they are still not an appropriate secrets store. Access changes, contractors, compromised accounts, clones, backups, and integrations can all resurface historical plaintext. For API-key handoffs between humans, use a [client-side encrypted one-time link](blog:one-time-secret-links)—not a PR comment.",
          ],
        },
        {
          title: "Forks, mirrors, and history that never dies",
          paragraphs: [
            "A key committed once can survive in forks, mirrors, CI caches, and local clones long after the main branch is cleaned. Secret rotation is the real remediation; history rewrite is damage control.",
            "If GitHub Secret Scanning, TruffleHog, gitleaks, or a cloud provider alert fires, rotate first. Then remove the secret from active branches. Only then decide whether history rewrite is worth the coordination cost.",
          ],
        },
      ],
      calloutTitle: "Hard rule",
      callout:
        "Never commit live secrets to Git—even temporary staging credentials. If a secret must move between people, use an appropriate secure delivery channel, such as a client-side encrypted one-time link. If automation needs the secret, use the CI platform’s native secrets mechanism, a dedicated secrets manager, or preferably short-lived credentials obtained through workload identity or OIDC—not the repository.",
    },
    {
      title: "How secrets escape through CI/CD",
      subsections: [
        {
          title: "Plaintext in workflow files",
          paragraphs: [
            "Putting `API_KEY: sk-...` directly in `.github/workflows/*.yml`, GitLab CI YAML, or CircleCI config is just committing a secret with extra steps. Workflow files are code. They are reviewed, cloned, and retained forever.",
            "Use the platform’s native secrets mechanism (GitHub Actions secrets, GitLab CI/CD variables, and equivalents) and reference them as environment bindings—not hardcoded YAML. Native CI secrets are far better than the repository, but they are not magic: malicious workflow logic, compromised dependencies, and careless logging can still expose values at runtime. Prefer OIDC or other workload identity federation to cloud providers so you do not need long-lived cloud keys in CI at all.",
          ],
        },
        {
          title: "Pipeline logs and debug output",
          paragraphs: [
            "Build logs are an underrated archive. Printing env vars “to debug the deploy,” dumping `process.env`, or running verbose Terraform/Helm output can write credentials into log storage that outlives the job.",
            "Assume logs are readable by anyone with CI access—and sometimes by anyone who can download artifacts. Mask secrets, avoid dumping env, and treat a leaked log line like a leaked password: rotate.",
          ],
        },
        {
          title: "Pull requests from forks",
          paragraphs: [
            "Fork PRs are a classic CI trap: untrusted code running with secrets. Most platforms restrict secret availability on fork workflows for exactly this reason. Keep it that way. Never “just enable secrets” for external contributors to make a check green.",
            "For internal repos, still separate privileged deploy jobs from PR checks. Build and test with least privilege; deploy only from trusted branches with explicitly granted secrets.",
          ],
        },
        {
          title: "Shared runners and artifact leakage",
          paragraphs: [
            "Self-hosted runners, shared caches, and uploaded artifacts can retain tokens longer than the job that created them. Scrub workspaces, scope cache keys carefully, and never package `.env` files into build artifacts “for convenience.”",
          ],
        },
      ],
    },
    {
      title: "A safer mental model: three places secrets can live",
      paragraphs: [
        "Confusion happens when teams use one tool for every job. Split the problem by lifecycle.",
      ],
      comparisonTable: {
        headers: ["Place", "Best for", "Not for"],
        rows: [
          [
            "Local .env / dotenv",
            "Local development config that stays on the laptop and is properly gitignored",
            "Sharing with teammates, CI, Git, or long-lived production secrets in plaintext",
          ],
          [
            "CI native secrets / Vault / cloud secret manager",
            "Machine-to-machine runtime and deploy automation",
            "Human chat handoffs or long-lived “pass this to the contractor” messages",
          ],
          [
            "Client-side encrypted one-time note",
            "Human-to-human delivery of a key, token, or .env snippet",
            "Storing production secrets for apps or pipelines",
          ],
        ],
        after: [
          "A gitignored `.env` is fine for local development. Sensitive production secrets ideally should not live indefinitely as plaintext on developer machines either—prefer a password manager or short-lived access where practical. PrivateNote sits in the third row: secure delivery between people. It is not a replacement for GitHub Actions secrets, HashiCorp Vault, AWS Secrets Manager, or your password manager. For day-to-day API-key handoffs, pair this with [how to share an API key securely](blog:how-to-share-api-key-securely).",
        ],
      },
    },
    {
      title: "Practical workflow: keep secrets out of Git and chat",
      flowIntro: "When a teammate, contractor, or client needs a value that will eventually land in CI or a local `.env`, use this sequence:",
      flowSteps: [
        {
          step: "Step 1",
          title: "Create a scoped, short-lived credential",
          body: "Prefer staging keys, read-only scopes, IP allowlists, and expiry. Avoid handing out the primary production key “because it is faster.”",
        },
        {
          step: "Step 2",
          title: "Deliver through a client-side encrypted one-time note",
          body: "Encrypt the secret (or the few `.env` lines required) locally with PrivateNote—via the [web app](app:home), [CLI](app:developers/cli), [VS Code / Cursor extension](app:developers/vscode), or [Chrome extension](chrome:extension). Set a short expiry or burn-after-read, then send the note link—not the plaintext—via Slack, email, or ticket.",
        },
        {
          step: "Step 3",
          title: "Install into the right store",
          body: "The recipient copies the value into a gitignored local `.env` (for development), a password manager, or the CI/cloud secret store. Do not paste it back into the PR, the chat thread, or a shared doc.",
        },
        {
          step: "Step 4",
          title: "Rotate when the job is done",
          body: "Revoke contractor keys, rotate after incidents, and replace any credential that ever appeared in logs, Git, or a ticket. Convenience without rotation is just delayed breach response.",
        },
      ],
      midCta: {
        body: "Need to hand someone a CI token or a few .env lines right now? Send a client-side encrypted one-time note instead of committing or pasting plaintext.",
        button: "Create a private note",
      },
    },
    {
      title: "Share from where you already work",
      paragraphs: [
        "You do not need to leave your terminal, editor, or browser tab to create a client-side encrypted one-time note. Pick the PrivateNote surface that matches the moment—encryption always happens locally on your device before upload. For a fuller walkthrough, see [PrivateNote for developers](blog:privatenote-for-developers).",
      ],
      subsections: [
        {
          title: "CLI",
          paragraphs: [
            "Read from a file or pipe stdin so the secret never sits in shell history as an `echo` argument: `npx privatenote-cli --expire 1h --output-url-only .env.local` or `cat secret.txt | npx privatenote-cli --expire 1h --output-url-only`. Useful in shell workflows, scripts, and quick terminal handoffs. Setup and flags: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "VS Code and Cursor",
          paragraphs: [
            "Install the [VS Code / Cursor extension](app:developers/vscode), then encrypt from the sidebar, editor selection, or context menu—ideal when the secret is already on screen in a `.env` or config file and should never hit Slack as plaintext.",
          ],
        },
        {
          title: "Chrome extension",
          paragraphs: [
            "When the credential shows up in email, docs, or a ticket, the [Chrome extension](chrome:extension) turns selected text into a browser-encrypted one-time note without leaving the tab.",
          ],
        },
      ],
    },
    {
      title: "Developer checklist before every push and pipeline change",
      useCaseTable: {
        headers: ["Checkpoint", "What to verify"],
        rows: [
          [
            "Before git commit",
            "`.env`, `*.pem`, `credentials.json`, and local secret files are gitignored; `git status` shows no surprise additions",
          ],
          [
            "Before opening a PR",
            "No keys in description, screenshots, fixtures, or “temporary” debug files",
          ],
          [
            "Before editing workflows",
            "Secrets come from the platform’s native secrets mechanism or OIDC/workload identity—not hardcoded YAML",
          ],
          [
            "Before debugging CI",
            "No `env`, `printenv`, or verbose dumps that could write secrets into logs",
          ],
          [
            "After any exposure",
            "Rotate first, then clean history/branches; treat scanners as incident triggers",
          ],
        ],
      },
      callout:
        "Add secret scanning to the default path: pre-commit hooks (gitleaks), CI scanning, and GitHub Secret Scanning / push protection. Prevention beats heroic history rewrites.",
    },
    {
      title: "What to do if a secret is already in GitHub",
      paragraphs: [
        "Act in this order: **rotate or revoke** the credential with the provider, **invalidate** dependent sessions or webhooks, **remove** the secret from the default branch, then decide whether a history rewrite is required for compliance or public exposure. Even after a rewrite, assume forks, mirrors, caches, and clones may still hold copies until those are addressed separately.",
        "Notify the owners of any systems the key could reach. Check cloud billing, access logs, and unusual API usage. If the secret was also pasted into Slack or email, assume those archives still contain it—see [why email is the worst place for secrets](blog:why-email-is-worst-for-secrets) and [secrets you should never send in chat](blog:secrets-never-send-in-chat).",
        "For extremely high-value secrets such as cryptocurrency seed phrases, avoid transmitting them whenever possible. For other irreplaceable root credentials, do not type them into a website at all—encrypt locally first and only share ciphertext when you must. That model is covered in our [crypto seed phrase guide](blog:crypto-seed-phrase-one-time-link).",
      ],
    },
    {
      title: "Frequently asked questions",
      faqs: [
        {
          question: "Is a private GitHub repo safe enough for .env files?",
          answer:
            "No. A private repository significantly limits exposure, but it is still not an appropriate secrets store. Access changes, compromised accounts, clones, backups, and third-party integrations can all resurface historical plaintext. Keep secrets out of Git entirely.",
        },
        {
          question: "Are GitHub Actions secrets enough?",
          answer:
            "They are the right place for many CI runtime values—far better than YAML or repo files. They still do not solve human delivery, log leakage, over-broad permissions, fork-PR risks, or exposure through malicious workflow steps and compromised dependencies. Combine the platform’s native secrets mechanism with least privilege, careful logging, and preferably short-lived credentials via OIDC or workload identity.",
        },
        {
          question: "Should I commit a redacted .env.example?",
          answer:
            "Yes. Commit variable names and dummy placeholders only. Never commit real values, “almost real” staging keys, or production connection strings with the password removed but the host and username intact if that combination is sensitive in your threat model.",
        },
        {
          question: "Is a local .env file okay?",
          answer:
            "For local development, yes—when it is properly gitignored and never committed. Sensitive production secrets ideally should not live indefinitely in plaintext `.env` files on developer machines; use a password manager, short-lived access, or a secrets manager where practical.",
        },
        {
          question: "Can PrivateNote replace Vault or GitHub secrets?",
          answer:
            "No. PrivateNote is for secure human-to-human delivery. Use the CI platform’s native secrets mechanism and dedicated secrets managers for automation. Use PrivateNote when a person needs to receive a key, token, or .env snippet without leaving plaintext in Slack, email, or GitHub.",
        },
        {
          question: "What is the fastest safe handoff for a CI token?",
          answer:
            "Create a narrowly scoped token, deliver it through a client-side encrypted one-time note (web, [CLI](app:developers/cli), [VS Code](app:developers/vscode), or [Chrome](chrome:extension)), have the recipient store it in the CI secret store or a password manager, then revoke the token when the work is finished.",
        },
      ],
    },
    {
      title: "Final thoughts",
      paragraphs: [
        "GitHub and CI/CD are excellent at preserving work. That is exactly why they are poor places to preserve secrets.",
        "Keep `.env` files local, gitignored, and limited to development where you can. Put automation credentials in native CI secrets, a secrets manager, or short-lived OIDC credentials. When a human needs a value, use a client-side encrypted one-time note—then rotate.",
        "If your team still pastes keys into PRs or commits “just staging” credentials, start with the [API key sharing workflow](blog:how-to-share-api-key-securely) and the checklist above. For server access material, use [how to share SSH keys securely](blog:how-to-share-ssh-keys-securely). Wire the [CLI](app:developers/cli), [VS Code extension](app:developers/vscode), or [Chrome extension](chrome:extension) into the path of least resistance so the secure option is also the fast one.",
      ],
    },
  ],
  ctaTitle: "Share the secret—not a permanent copy",
  ctaBody:
    "Encrypt a CI token or .env snippet locally with PrivateNote—using the web app, CLI, VS Code / Cursor, or Chrome extension—before it hits chat or Git. Use a short expiry or burn-after-read, send the one-time note link instead of plaintext, and keep Git and pipeline history free of live credentials.",
  ctaButton: "Create a private note",
};
