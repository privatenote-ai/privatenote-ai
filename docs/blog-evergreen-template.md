# PrivateNote Evergreen Blog Template

Use this for informational / problem-aware “how to share X securely” guides.
Cut optional sections rather than padding.

---

## Brief (fill before writing)

| Field | Value |
|-------|-------|
| **Primary keyword** | [e.g. how to share an API key securely] |
| **Secondary keywords** | [3–5 related terms] |
| **Search intent** | Informational / Problem-aware |
| **Target reader** | [One primary audience — e.g. developers, HR, lawyers] |
| **Secret type** | [password / API key / document / SSH key / other] |
| **Canonical slug** | [kebab-case] |
| **Category** | secrets · encryption · privacy · ai · developers |
| **Target length** | Default **1200–1800** · Short **900–1200** · Comprehensive **1800–2500** |
| **Internal links** | See rules below (plan 2–4 before writing) |

### Schema

Wire these for every guide post:

- [x] **Article**
- [x] **FAQPage** (when the post includes an FAQ)
- [x] **Breadcrumb**

### Hero image

Every PrivateNote article has a distinctive visual style. Hero should be:

- Natural photography or a realistic illustration
- No stock padlocks
- No generic shields
- Minimal or no text on the image
- PrivateNote blue palette
- Optimised for web (**under 200 KB**)

### Internal links

| Rule | Target |
|------|--------|
| **Minimum** | 2 |
| **Maximum** | 4 |

Include when natural:

- One **concept** article (e.g. E2EE definition, one-time links)
- One **related guide** (same secret type or adjacent workflow)
- One **tool or product page** (home, password generator, secure file transfer) — only if it fits

Do not stuff links; prefer contextual anchors over “read more” dumps.

**Voice rules**
- Practical and calm — explain retention risk, don’t scare.
- Introduce PrivateNote once mid-article, naturally (methods section), plus a soft final CTA.
- Prefer specific, evergreen titles over year-stuffed ones.
- Key takeaways: **exactly 4** short bullets (site chrome).

---

## H1 options

Prefer a specific how-to (ages better):

> How to [Action] Securely

Alternatives when search intent is doubt/fear:

> Is It Safe to [Action]? What You Should Do Instead

> [Thing] Sharing: What Actually Keeps It Confidential

Avoid defaulting to `(2026)` in the title unless ranking data shows year modifiers win.

**Meta title:** ≤ ~60 characters · include primary keyword  
**Meta description:** 140–160 characters · answer + benefit, no hype

---

## Article structure

Map each major section to an **H2** (feeds the sticky TOC). Keep H3s for sub-risks and steps.

| Section | Required? | Notes |
|---------|-----------|-------|
| Quick answer (TL;DR) | Yes | 2–3 sentences above the fold |
| Why this matters | Yes | Short — 1 screen max |
| Who this is for | Optional | **4–5 items** for *this* secret only |
| Common risks | Yes | Only channels readers actually use |
| Choosing a method | Yes | Recommend one-time links; mention alternatives fairly |
| Step-by-step | Yes | Adapt steps to secret type (see optional flags) |
| Comparison table | Optional | Keep if methods section is long |
| Common mistakes | Optional | Merge into checklist if short on space |
| Checklist | Yes | Actionable; tick-box style |
| FAQ | Yes | **3–4** high-intent questions |
| Key takeaways | Yes | Exactly 4 bullets |
| Further reading | Optional | 2–4 links max |
| Final thoughts + CTA | Yes | Soft product close |

Skip an explicit “In This Guide” list — the TOC already covers navigation.

---

# Quick Answer (TL;DR)

Answer the query in **2–3 sentences**. Name the safer pattern (encrypt + expire / one-time access). Do not pitch the product yet.

Example:

> The safest way to send sensitive information is to avoid plain email and chat paste. Use end-to-end encrypted sharing with automatic expiration or one-time access so copies don’t pile up in inboxes, backups, and cloud drives.

---

# Why This Matters

Cover in plain language:

1. Why people default to email / chat / Drive  
2. Why convenience creates **long-term retention** (the real risk)  
3. Why this secret type deserves a different channel  

Tone: matter-of-fact, not fear-based.

---

# Who This Guide Is For *(optional)*

List **only** items relevant to this post (max 5). Pull from:

- Passwords / recovery codes  
- API keys / tokens  
- SSH / signing keys  
- Contracts / tax / HR docs  
- Medical or financial records  
- Confidential business notes  

Opening line pattern:

> This guide is for anyone who needs to hand off [secret type] once — not store it forever.

---

# Common Risks

Only include channels your reader actually uses for *this* secret.

### Email
Inbox retention · backups · forwarding · search · compromised accounts

### Messaging apps
Chat history · cloud backups · screenshots · “temporary” chats that aren’t

### Cloud storage
Forgotten permissions · permanent links · duplicate copies · collaboration vs one-off secrets

Keep each subsection to a short paragraph + bullets. No threat-theater.

---

# Choosing the Right Sharing Method

### One-time encrypted links *(recommended)*

Best for temporary confidential handoffs and recipients without accounts.

Call out:

- Client-side encryption  
- Automatic expiration / burn-after-read  
- Optional passphrase  
- Minimal retention on the server  

**PrivateNote:** one natural sentence here — what it does, not a feature dump.

### Password-protected archives *(when needed)*

Use when the recipient can’t open a link or the payload is an offline package.

Always: send the password on a **separate channel**.

Note pros/cons briefly (offline-friendly vs password handling).

### Secure cloud storage *(collaboration)*

Drive / OneDrive / Dropbox — fine for ongoing collaboration; weak for short-lived secrets unless permissions and cleanup are strict.

---

# Step-by-Step Guide

Adapt steps to the secret. Mark metadata steps **documents-only**.

### Step 1 — Prepare
Verify contents · strip unnecessary pages · compress if needed  

> **Tip:** Send the minimum required — nothing extra.

### Step 2 — Remove metadata *(documents / images)*
Author names · revision history · GPS · hidden properties  

> **Pro tip:** Office files and PDFs often leak more than the visible pages.

Skip for API keys, passwords, and short text secrets.

### Step 3 — Encrypt before sharing
Explain client-side encryption in one plain paragraph: ciphertext leaves the device; the server shouldn’t see the plaintext.

### Step 4 — Choose an expiration
Read once · hours · a few days — pick the **shortest practical** lifetime.

### Step 5 — Out-of-band (OOB) delivery *(if using a passphrase)*

- Channel A: encrypted link  
- Channel B: passphrase only (SMS, Signal, phone)  

> **Security tip:** If one channel is compromised, the attacker still lacks the second piece.

> **Pro tip:** Don’t text “password for the file I emailed.” Send the passphrase alone.

### Step 6 — Verify the recipient
Confirm address / number / identity **before** sending.

---

# Comparison Table *(optional)*

| Method | Best for | E2E encrypted | Auto expires | Account required | Main drawback |
|--------|----------|---------------|--------------|------------------|---------------|
| Email | Non-sensitive mail | No | No | No | Permanent copies |
| Messaging apps | Everyday chat | Varies | Rarely | Usually | Long history |
| Cloud storage | Collaboration | Varies | Rarely | Usually | Permission drift |
| Password ZIP | Offline transfer | Yes* | No | No | Password handling |
| One-time encrypted link | Temporary secrets | Yes | Yes | No | Not for long-term collab |

\*Depends on how the archive is created and where the password lives.

---

# Common Mistakes *(optional)*

- Password in the same email as the file/link  
- Skipping metadata cleanup on documents  
- Permanent cloud links / open shared folders  
- Screenshots of secrets  
- Personal email for business secrets  
- Not verifying the recipient  

> Most leaks happen because data stays reachable **after** it was needed.

---

# Best Practices Checklist

Before sending:

- [ ] Verify the recipient  
- [ ] Remove metadata *(if a document)*  
- [ ] Encrypt before upload  
- [ ] Set a short expiration  
- [ ] Use OOB delivery for passphrases  
- [ ] Delete leftover local copies  
- [ ] Revoke or burn access when the handoff is done  

---

# Frequently Asked Questions

Write **3–4** questions people actually search. Prefer:

1. **Is it safe to email / chat [this]?** — short practical no + better pattern  
2. **Does “encrypted email” fix it?** — TLS vs end-to-end  
3. **What happens when a one-time link expires?** — simple retention answer  
4. **Wrong recipient?** — passphrase + expiry + destroy-before-open  
5. **GDPR / compliance?** — reduces exposure; doesn’t replace policy/legal controls  

Drop questions that don’t fit this secret type.

---

# Key Takeaways

Exactly **four** bullets. Concrete and scannable. Example pattern:

- Encrypt before the secret leaves the device.  
- Avoid permanent email or chat copies.  
- Use the shortest practical expiration.  
- Prefer one-time links for temporary confidential handoffs.  

Swap in OOB / recipient verification when that is the post’s main lesson.

---

# Further Reading *(optional)*

Keep this short. Prefer internal concept/guide links already planned in the brief; add at most one external authority link here if it helps the reader go deeper.

---

# Final Thoughts + CTA

Close on **access + retention**, then one soft product line:

> Most exposure lasts longer than the handoff. Limiting both who can open the secret and how long it exists cuts that risk sharply.
>
> PrivateNote creates end-to-end encrypted, one-time links in the browser — no account required for the recipient.

**CTA:** Create a secure one-time link → `/` or secure-file-transfer as appropriate

---

## References

Whenever practical, support technical or regulatory claims with authoritative sources such as:

- NIST  
- ENISA  
- CISA  
- OWASP  
- RFCs  
- Official vendor documentation  

Cite inline or in Further Reading — don’t invent compliance guarantees. Secure sharing reduces exposure; it does not replace legal or organisational obligations.

---

## Author checklist (before publish)

- [ ] Primary keyword in H1, meta title, and first paragraph  
- [ ] Target word count chosen and hit (default 1200–1800)  
- [ ] TL;DR answers the query without fluff  
- [ ] TOC H2s match the finished outline  
- [ ] Exactly 4 key takeaways  
- [ ] Schema: Article + Breadcrumb (+ FAQPage if FAQ present)  
- [ ] Hero image meets visual rules (under 200 KB, no padlocks/shields)  
- [ ] PrivateNote mentioned once mid-article + once in CTA  
- [ ] Internal links: 2–4 (concept + related guide + tool if natural)  
- [ ] Technical/regulatory claims backed by authoritative sources when practical  
- [ ] No fearmongering; retention risk is clear  
- [ ] Optional sections cut if the draft overshoots the chosen length band  

