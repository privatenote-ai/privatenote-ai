import { serveSpaShell } from "./_shared/serveSpaShell";

/** Magic-link landing (`/magic?t=…`). Not prerendered; needs explicit SPA shell. */
export const onRequest = serveSpaShell;
