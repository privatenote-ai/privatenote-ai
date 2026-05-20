# Self-Hosted Docker Compose Preview

This is the first self-hosted packaging step for PrivateNote. It runs the current Cloudflare-compatible application locally in containers.

Important limitation: this is a **self-host preview**, not the final enterprise runtime. The API container uses Wrangler's local runtime for Cloudflare Worker bindings, Durable Objects, KV, and D1. The enterprise target is a native API container backed by standard on-premise services such as PostgreSQL and Redis.

## Files

- `Dockerfile.self-host`: Node-based image used by both services.
- `docker-compose.yml`: local web/API composition.
- `.env.self-host.example`: override template.
- `docs/enterprise-docker-compose-plan.md`: product and implementation roadmap.

## Quick Start

```bash
cp .env.self-host.example .env.self-host
docker compose --env-file .env.self-host up --build
```

Open:

- Web app: `http://localhost:5173/`
- API runtime: `http://localhost:8787/`

Stop:

```bash
docker compose down
```

Remove local persisted Wrangler state:

```bash
docker compose down -v
```

## Services

### `web`

Runs the Vite development server on port `5173`.

Default environment:

- `VITE_API_URL=http://localhost:8787`
- `VITE_DEV_HTTP=1`
- `VITE_DISABLE_TURNSTILE=1`

### `api`

Runs:

```bash
npx wrangler dev --local --ip 0.0.0.0 --port 8787 --persist-to /data/wrangler
```

The `/data/wrangler` path is backed by the `privatenote_wrangler_state` Docker volume.

## Configuration

Copy `.env.self-host.example` to `.env.self-host` and edit values there. Do not commit `.env.self-host`.

Development defaults are intentionally weak and must not be used for a shared deployment:

- `AUTH_SECRET_KEY`
- `TOTP_ENCRYPTION_KEY`
- `AUTH_ALLOW_UNSIGNED_MAGIC_LINK=1`

For any shared or production-like environment:

- set strong random secrets;
- set `AUTH_ALLOW_UNSIGNED_MAGIC_LINK=0`;
- configure an email provider;
- run behind HTTPS;
- review trusted origins.

## What Works In This Preview

- Local web app in a container.
- Local API runtime in a container.
- Local Durable Object/KV/D1-compatible persistence through Wrangler.
- Basic health checks.
- Repeatable local environment for development and demos.

## What Is Not Enterprise-Ready Yet

- No native PostgreSQL/Redis persistence adapter.
- No production static web image.
- No OIDC/SAML SSO.
- No organization/team model.
- No image signing or SBOM pipeline.
- No Helm chart.
- No documented backup/restore for a native enterprise database.

## Enterprise Runtime Direction

The final on-premise edition should replace Wrangler local runtime with standard services:

```text
browser
  -> reverse proxy / TLS
  -> web static container
  -> api container
  -> PostgreSQL for auth, notes metadata, audit logs
  -> Redis or equivalent for short-lived TTL/rate-limit state
```

The API should keep the same cryptographic boundary: encrypted note content and metadata only; decryption keys stay in URL fragments and never reach the server.
