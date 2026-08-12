import { SecureNoteStorage, SecureNoteStorageSql } from "./durable_objects/secure_note_storage";
import { AuthTokenStore } from "./durable_objects/auth_token_store";
import {
  registerRoutes,
  cleanupAuditLogs,
  cleanupExpiredSessions,
  cleanupExpiredNoteFileStorage,
  processExpiredSentNoteNotifications,
  processUnopenedNoteReminders,
  processPendingAccountDeletions,
} from "./routes";
import type { Env } from "./types";
import { getAllowedOriginFromRequest } from "./trustedOrigins";
import {
  buildUploadRelayCorsHeaders,
  getApiContentSecurityPolicy,
  resolveAccessControlAllowHeaders,
  SECURITY_HEADERS,
} from "./httpSecurity";
import { isUploadRelayHostname } from "@shared/apiWorkerOrigin";
import {
  cleanupBillingOperationalHistory,
  reconcileStripeSubscriptions,
} from "./stripeBilling";
import { processBillingCommunications } from "./billingCommunications";

// Export both for migration compatibility
// SecureNoteStorage is deleted in v3 migration but needed for migration history
export { SecureNoteStorage, SecureNoteStorageSql, AuthTokenStore };

const getCorsHeaders = (request: Request): Record<string, string> => {
  const origin = request.headers.get("Origin");
  const allowedOrigin = origin ? getAllowedOriginFromRequest(request) : null;
  let hostname = "";
  try {
    hostname = new URL(request.url).hostname;
  } catch {
    hostname = "";
  }
  // encrypt.lu relay: slim CORS, no Access-Control-Allow-Credentials.
  if (isUploadRelayHostname(hostname)) {
    return buildUploadRelayCorsHeaders(request, allowedOrigin);
  }
  const headers: Record<string, string> = {
    ...SECURITY_HEADERS,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": resolveAccessControlAllowHeaders(request),
    "Access-Control-Allow-Credentials": "true",
    "Content-Security-Policy": getApiContentSecurityPolicy(),
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = allowedOrigin ?? "null";
    headers["Vary"] = "Origin";
  }
  return headers;
};

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    console.log(`[WORKER-ENTRY] ${request.method} ${request.url}`);

    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Handle CORS preflight requests FIRST, before any routing
      if (request.method === "OPTIONS") {
        const origin = request.headers.get('Origin');
        const allowedOrigin = origin ? getAllowedOriginFromRequest(request) : null;

        if (origin && !allowedOrigin) {
          return new Response(JSON.stringify({ error: 'CORS policy: Origin not allowed' }), {
            status: 403,
            headers: {
              "Content-Type": "application/json",
              ...getCorsHeaders(request),
            },
          });
        }

        return new Response(null, {
          status: 204,
          headers: {
            ...getCorsHeaders(request),
            "Access-Control-Max-Age": "86400",
          },
        });
      }

      // Handle model serving routes (before API routes)
      if (pathname.startsWith("/models/")) {
        return await registerRoutes(request, env);
      }

      // Handle API routes
      if (pathname.startsWith("/api")) {
        if (pathname === "/api/health" && request.method === "GET") {
          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...getCorsHeaders(request),
            },
          });
        }
        return await registerRoutes(request, env);
      }

      // For non-API routes, return helpful message (frontend should be served by Cloudflare Pages)
      if (pathname === "/") {
        return new Response(
          JSON.stringify({
            message: "PrivateNote API Worker",
            description: "This Worker handles API requests only. Use /api/* endpoints.",
            endpoints: {
              notes: "/api/notes",
              blog: "/api/blog",
              admin: "/api/admin/*"
            }
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...getCorsHeaders(request),
            }
          }
        );
      }

      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error("Error handling request:", error);
      return new Response(
        JSON.stringify({
          message: error instanceof Error ? error.message : "Internal Server Error"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...getCorsHeaders(request),
          }
        }
      );
    }
  },

  /**
   * Scheduled handler for cron triggers.
   * Runs daily cleanup tasks for GDPR compliance and database maintenance.
   */
  async scheduled(event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    console.log(`[CRON] Scheduled event triggered at ${new Date().toISOString()}`);
    console.log(`[CRON] Cron trigger: ${event.cron}`);

    try {
      // Cleanup audit logs (GDPR compliance - data minimization)
      const auditResult = await cleanupAuditLogs(env);
      console.log(`[CRON] Audit log cleanup: deleted ${auditResult.deleted} entries${auditResult.error ? `, error: ${auditResult.error}` : ''}`);

      // Cleanup expired/revoked sessions
      const sessionResult = await cleanupExpiredSessions(env);
      console.log(`[CRON] Session cleanup: deleted ${sessionResult.deleted} entries${sessionResult.error ? `, error: ${sessionResult.error}` : ''}`);

      const sentNoteResult = await processExpiredSentNoteNotifications(env);
      console.log(
        `[CRON] Sent-note expiry notifications: processed ${sentNoteResult.processed}, notified ${sentNoteResult.notified}${sentNoteResult.error ? `, error: ${sentNoteResult.error}` : ''}`,
      );

      const reminderResult = await processUnopenedNoteReminders(env);
      console.log(
        `[CRON] Unopened reminders: processed ${reminderResult.processed}, notified ${reminderResult.notified}${reminderResult.error ? `, error: ${reminderResult.error}` : ""}`,
      );

      const noteFileStorageResult = await cleanupExpiredNoteFileStorage(env);
      console.log(
        `[CRON] Note file storage cleanup: checked ${noteFileStorageResult.checked}, released ${noteFileStorageResult.released}, abandoned ${noteFileStorageResult.abandoned}, pruned ${noteFileStorageResult.pruned}` +
          `${noteFileStorageResult.error ? `, error: ${noteFileStorageResult.error}` : ""}`,
      );

      const pendingDeleteResult = await processPendingAccountDeletions(env);
      console.log(
        `[CRON] Pending account deletions: finalized ${pendingDeleteResult.finalized}` +
          `${pendingDeleteResult.error ? `, error: ${pendingDeleteResult.error}` : ""}`,
      );

      const billingResult = await reconcileStripeSubscriptions(env);
      console.log(
        `[CRON] Stripe reconciliation: ${billingResult.status}, scanned ${billingResult.scanned}, repaired ${billingResult.repaired}, unchanged ${billingResult.unchanged}, failed ${billingResult.failed}`,
      );

      const billingCommunicationResult = await processBillingCommunications(env);
      console.log(
        `[CRON] Billing communications: queued ${billingCommunicationResult.queued}, sent ${billingCommunicationResult.sent}, failed ${billingCommunicationResult.failed}`,
      );

      const billingRetentionResult = await cleanupBillingOperationalHistory(env);
      console.log(
        `[CRON] Billing retention: deleted ${billingRetentionResult.webhookEvents} webhooks, ` +
          `${billingRetentionResult.reconciliationRuns} runs, ` +
          `${billingRetentionResult.reconciliationFailures} failures, ` +
          `${billingRetentionResult.customerNotifications} notifications`,
      );

      console.log(`[CRON] Scheduled tasks completed successfully`);
    } catch (error) {
      console.error(`[CRON] Error in scheduled handler:`, error);
    }
  },
};
