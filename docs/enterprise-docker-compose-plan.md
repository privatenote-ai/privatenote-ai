# PrivateNote Enterprise Docker Compose Plan

This document defines the path from the current Cloudflare-hosted PrivateNote application to an enterprise self-hosted edition that companies can run on-premise.

## Current Status

The repository now includes a Docker Compose preview that runs the existing application in containers:

- `web`: Vite development server for the React app.
- `api`: Wrangler local runtime for the existing Cloudflare Worker, Durable Objects, KV, and D1 bindings.
- persistent local Wrangler state in a Docker volume.

This is useful for development, demos, and internal validation. It is not yet the final bank/law-firm enterprise runtime because the API still depends on Cloudflare-compatible local bindings through Wrangler.

## Target Product

PrivateNote Enterprise should be a self-hosted deployment that preserves the core privacy model:

- plaintext encryption happens client-side before upload;
- the server stores ciphertext and note metadata;
- the decryption key remains in the URL fragment and is not sent to the server;
- administrators can control users, retention, deployment boundaries, and audit visibility.

The product pitch should be:

> PrivateNote reduces the amount of sensitive temporary information that ends up in email, chat, ticketing systems, and long-lived collaboration history.

## Five Implementation Tracks

### 1. Single-Node Docker Compose

Implemented now as a preview:

- `Dockerfile.self-host`
- `docker-compose.yml`
- `.env.self-host.example`
- persistent Wrangler state volume
- local web/API ports
- health checks

Target enterprise version:

- production static web container instead of Vite;
- native API container instead of Wrangler local runtime;
- PostgreSQL or SQLite-backed note/auth storage;
- Redis or another TTL store for rate limits and short-lived auth state.

### 2. Self-Host Configuration

Implemented now:

- browser/API ports;
- public web origin;
- local API URL;
- auth secret placeholders;
- TOTP encryption key placeholder;
- local Turnstile disable switch;
- local email-provider placeholder.

Target enterprise configuration:

- `PRIVATENOTE_PUBLIC_URL`
- `PRIVATENOTE_API_URL`
- `DATABASE_URL`
- `REDIS_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`
- `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`
- `NOTE_DEFAULT_TTL_SECONDS`
- `NOTE_MAX_BYTES`
- `AUDIT_RETENTION_DAYS`
- `DISABLE_OUTBOUND_NETWORK`
- `TRUSTED_ORIGINS`

### 3. Enterprise Security Basics

Implemented now as planning/scaffold:

- account types already exist in the auth schema: `free`, `personal_premium`, `business_premium`;
- audit-log routes and account activity already exist in the Cloudflare runtime;
- Compose includes secret placeholders and a private-local Turnstile posture.

Target enterprise features:

- SSO through OIDC first, SAML later if required;
- admin-managed user lifecycle;
- organization/team model;
- audit logs exportable to SIEM;
- configurable retention and note limits;
- no sensitive plaintext in logs;
- explicit outbound-network inventory.

### 4. Deployment Hardening

Implemented now as documentation targets:

- Docker Compose baseline;
- health checks;
- persistent local state;
- environment example.

Target enterprise release:

- signed container images;
- SBOM generation;
- vulnerability scans in CI;
- pinned base images;
- non-root container users;
- read-only root filesystem where practical;
- backup/restore guide;
- upgrade/rollback guide;
- Kubernetes/Helm deployment option.

### 5. Enterprise Positioning

Recommended packaging:

- **Community/self-host preview:** local/internal Compose deployment for technical evaluation.
- **Personal Premium:** higher usage limits and larger on-device AI capacity.
- **Business Premium:** SSO, audit history, admin controls, support, and enterprise deployment help.
- **Private deployment:** paid on-premise or customer-cloud installation with support.

Premium should not change the encryption promise. Premium should add capacity, governance, deployment control, and support.

## Recommended Sequencing

1. Keep the current Compose preview working.
2. Add a native Node API adapter for note create/read/delete without Cloudflare Durable Objects.
3. Move auth persistence from D1 APIs to a database abstraction.
4. Add PostgreSQL for enterprise data and Redis for TTL/rate-limit state.
5. Add production web image with Nginx/Caddy serving built assets.
6. Add OIDC login and organization-aware users.
7. Add signed images, SBOM, and CI security checks.
8. Add Helm chart after Compose is stable.

## Acceptance Criteria For A Real Enterprise Beta

- Runs with `docker compose up` without Cloudflare account credentials.
- Stores all data in customer-controlled volumes/databases.
- Can run with no outbound network access after image pull.
- Supports HTTPS behind a customer reverse proxy.
- Supports OIDC.
- Provides admin audit logs.
- Has backup and restore documentation.
- Has image signing, SBOM, and vulnerability scan outputs.
- Clearly documents what metadata is stored server-side.
