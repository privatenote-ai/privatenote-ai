/**
 * Serve the SPA shell for /note/:id (encrypted note viewer).
 *
 * Splat rules in `_redirects` are not applied when deploying with `wrangler pages deploy`
 * — see cloudflare/workers-sdk#2671.
 */
import { serveSpaShell } from "../_shared/serveSpaShell";

export const onRequest = serveSpaShell;
