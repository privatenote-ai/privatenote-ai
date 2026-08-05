import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  D1Database,
  D1PreparedStatement,
} from "@cloudflare/workers-types";
import {
  buildBillingNotificationContent,
  processBillingCommunications,
} from "./billingCommunications";
import type { Env } from "./types";

describe("billing customer communications", () => {
  const accountUrl = "https://privatenote.ai/account/subscription";
  const deadline = "2026-08-01T12:00:00.000Z";

  for (const [type, subjectText, actionText] of [
    ["payment_failed", "Payment failed", "Update your payment method"],
    ["trial_ending", "trial is ending", "Review your subscription"],
    ["grace_ending", "grace period is ending", "Fix billing"],
    ["cancellation_confirmed", "cancellation is confirmed", "View subscription"],
  ] as const) {
    it(`builds a useful ${type} message`, () => {
      const content = buildBillingNotificationContent(type, deadline, accountUrl);
      assert.match(content.subject, new RegExp(subjectText, "i"));
      assert.match(content.text, new RegExp(actionText, "i"));
      assert.match(content.text, /August 1, 2026/);
      assert.match(content.html, /account\/subscription/);
    });
  }

  it("queues grace-ending warnings only for past-due or unpaid subscriptions", async () => {
    const queries: Array<{ sql: string; bindings: unknown[] }> = [];
    const db = {
      prepare(sql: string) {
        let bindings: unknown[] = [];
        const statement = {
          bind(...values: unknown[]) {
            bindings = values;
            return statement;
          },
          async all() {
            queries.push({ sql, bindings });
            return { success: true, results: [], meta: {} };
          },
          async run() {
            return { success: true, results: [], meta: { changes: 0 } };
          },
        };
        return statement as unknown as D1PreparedStatement;
      },
    } as unknown as D1Database;

    await processBillingCommunications(
      { AUTH_DB: db } as unknown as Env,
      { now: new Date("2026-07-29T12:00:00.000Z") },
    );
    const graceQuery = queries.find(
      ({ sql }) => sql.includes("subscription_grace_period_end"),
    );
    assert.ok(graceQuery);
    assert.match(graceQuery.sql, /subscription_status IN \(\?, \?\)/);
    assert.deepEqual(graceQuery.bindings.slice(-2), ["past_due", "unpaid"]);
  });

  it("skips a previously queued grace warning after the subscription recovers", async () => {
    const updates: Array<{ sql: string; bindings: unknown[] }> = [];
    const db = {
      prepare(sql: string) {
        let bindings: unknown[] = [];
        const statement = {
          bind(...values: unknown[]) {
            bindings = values;
            return statement;
          },
          async first() {
            if (sql.includes("FROM billing_customer_notifications n")) {
              return {
                id: "notification-1",
                user_id: "user-1",
                email: "paid@example.com",
                email_verified: 1,
                subscription_status: "active",
                notification_type: "grace_ending",
                effective_at: "2026-07-30T12:00:00.000Z",
                status: "pending",
                attempts: 0,
              };
            }
            return null;
          },
          async all() {
            if (sql.includes("SELECT notification_key")) {
              return {
                success: true,
                results: [{ notification_key: "grace:queued" }],
                meta: {},
              };
            }
            return { success: true, results: [], meta: {} };
          },
          async run() {
            updates.push({ sql, bindings });
            return { success: true, results: [], meta: { changes: 1 } };
          },
        };
        return statement as unknown as D1PreparedStatement;
      },
    } as unknown as D1Database;
    let emailSent = false;

    await processBillingCommunications(
      {
        AUTH_DB: db,
        RESEND_API_KEY: "test",
        AUTH_EMAIL_FROM: "PrivateNote <test@example.com>",
      } as unknown as Env,
      {
        now: new Date("2026-07-29T12:00:00.000Z"),
        fetchImpl: async () => {
          emailSent = true;
          return Response.json({ id: "email-1" });
        },
      },
    );

    assert.equal(emailSent, false);
    const skipped = updates.find(
      ({ sql }) =>
        sql.includes("status = 'skipped'") &&
        sql.includes("subscription_state_changed"),
    );
    assert.ok(skipped);
  });
});
