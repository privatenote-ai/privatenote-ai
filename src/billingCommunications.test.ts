import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  D1Database,
  D1PreparedStatement,
} from "@cloudflare/workers-types";
import {
  buildBillingNotificationContent,
  processBillingCommunications,
  queueBillingNotification,
} from "./billingCommunications";
import type { Env } from "./types";

describe("billing customer communications", () => {
  const accountUrl = "https://privatenote.ai/account";
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
      assert.match(content.html, new RegExp(`href="${accountUrl}"`));
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

  it("links the payment-failure email at a route that exists", async () => {
    const db = {
      prepare(sql: string) {
        const statement = {
          bind() {
            return statement;
          },
          async first() {
            if (sql.includes("FROM billing_customer_notifications n")) {
              return {
                id: "notification-2",
                user_id: "user-2",
                email: "declined@example.com",
                email_verified: 1,
                subscription_status: "past_due",
                notification_type: "payment_failed",
                effective_at: "2026-08-01T12:00:00.000Z",
                status: "pending",
                attempts: 0,
              };
            }
            return null;
          },
          async all() {
            return { success: true, results: [], meta: {} };
          },
          async run() {
            return { success: true, results: [], meta: { changes: 1 } };
          },
        };
        return statement as unknown as D1PreparedStatement;
      },
    } as unknown as D1Database;
    let sentBody: { html?: string; text?: string } | null = null;

    const delivered = await queueBillingNotification(
      {
        AUTH_DB: db,
        AUTH_EMAIL_PROVIDER: "resend",
        RESEND_API_KEY: "test",
        AUTH_EMAIL_FROM: "PrivateNote <test@example.com>",
        PUBLIC_WEB_APP_ORIGIN: "https://privatenote.ai",
      } as unknown as Env,
      {
        key: "payment_failed:sub_1:2026-08-01T12:00:00.000Z",
        userId: "user-2",
        subscriptionId: "sub_1",
        type: "payment_failed",
        effectiveAt: "2026-08-01T12:00:00.000Z",
      },
      async (_input, init) => {
        sentBody = JSON.parse(String(init?.body ?? "{}"));
        return Response.json({ id: "email-2" });
      },
    );

    assert.equal(delivered, true);
    const body = sentBody as { html?: string; text?: string } | null;
    assert.ok(body);
    // /account/subscription is not a route: linking it 404s the only remedy a
    // customer with a declined card is given.
    assert.doesNotMatch(String(body?.html), /\/account\/subscription/);
    assert.doesNotMatch(String(body?.text), /\/account\/subscription/);
    assert.match(String(body?.html), /href="https:\/\/privatenote\.ai\/account"/);
  });
});
