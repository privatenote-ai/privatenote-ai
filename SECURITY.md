# Security Policy

## Reporting a vulnerability

If you believe you have found a security issue in PrivateNote (web app, API, or extensions), please report it responsibly.

**Email:** security@privatenote.ai

Please include:

- A clear description of the issue
- Steps to reproduce
- Impact assessment (what an attacker could do)
- Affected component (web, API, Chrome extension, VS Code extension, etc.)

We aim to acknowledge reports within **3 business days**.

Please do **not** open public GitHub issues for undisclosed security vulnerabilities.

## Scope

In scope:

- privatenote.ai web application and API
- Official PrivateNote browser and editor extensions in this repository
- Encryption, note access controls, and file attachment handling

Out of scope (generally):

- Social engineering of users
- Issues in third-party browsers or extensions not maintained by us
- Denial of service without demonstrated security impact

## Safe harbor

We support good-faith security research. Do not access other users' data, degrade service availability, or publicly disclose issues before we have had a reasonable time to fix them.

## Encryption notes

PrivateNote is designed so note and file plaintext is encrypted client-side before upload. Reports that assume server-side plaintext storage may reflect a misunderstanding of the architecture — but genuine breaks of client-side crypto, key handling, or access controls are in scope.
