# Withdrawal refunds (manual runbook)

How to handle a customer who asks for their money back. Done by hand in the Stripe
Dashboard — there is deliberately no self-serve refund in the product, because the
amounts are €4–€120 and the expected volume does not justify a code path that moves
money out.

Requests arrive at **support@privatenote.ai**, which `/terms` names as the withdrawal
channel. That inbox has to be monitored: the 14-day reimbursement deadline below
starts when the customer writes, not when we notice.

## 1. Does the statutory right apply?

Two different things get called "cancellation". Only the first one involves money
going back:

| Situation | What they get |
|---|---|
| EU/EEA **consumer**, within 14 days of the subscription starting | Refund of the period paid for, minus the part already used (§2) |
| Anyone, more than 14 days in | Nothing back. Cancellation stops the next renewal and access runs to the end of the paid period |
| Renewal charge (2nd period onward) | Nothing back. The withdrawal right attaches to entering the contract, not to each renewal |
| **Business** customer (any date) | No statutory right. Refund only as goodwill, if you choose |

"Consumer" means a natural person not acting for their trade or business. The plan
name is irrelevant — a sole trader on Starter can be a business, and a private person
on Business is still a consumer. The practical signal is the VAT ID: Checkout collects
one (`tax_id_collection`), so a customer who entered one is acting as a business.

When it is genuinely borderline, refund. The amounts are too small to argue over and
a complaint costs more than €120.

## 2. The amount

The customer owes the proportion of the service already supplied, so:

```
refund = paid × (1 − days_used ÷ days_in_period)
```

`days_used` runs from the period start to the day their email arrived, inclusive.
Round down to the cent. No VAT is charged today (Luxembourg small-business exemption,
see the tax note on `/terms`), so the amount paid is the gross amount and there is
nothing to apportion.

| Paid | Request arrives | Refund |
|---|---|---|
| Starter monthly €4 (31-day period) | day 3 | €3.61 |
| Starter yearly €40 | day 5 | €39.45 |
| Business yearly €120 | day 12 | €116.05 |

Stripe's own "cancel immediately and refund the unused time" proration computes the
same figure from the other direction, so if the Dashboard offers it, take it and use
the formula as a sanity check.

If Stripe Tax is ever switched on, stop using a plain refund for these: issue a
**credit note** against the invoice instead, so the tax and revenue reporting are
adjusted along with the cash.

## 3. Steps

1. Find the customer in Stripe by email. Confirm the subscription start date and the
   invoice actually paid.
2. Compute the amount (§2).
3. On the paid payment, **Refund** the computed amount, reason *requested by customer*.
   Stripe returns it to the original card, which is what the law requires.
4. Cancel the subscription **immediately** — not at period end. They withdrew from the
   contract, so access stops now; leaving it running would mean they keep the paid
   period *and* the money.
5. Add a note on the Stripe customer: date of the request, days used, amount, and that
   it was an EU withdrawal rather than goodwill.
6. Reply to the customer confirming the amount and that access has ended.

Deadline: the refund must be issued within **14 days** of them telling us they
withdraw. Steps 1–4 take about two minutes, so just do it when the mail arrives.

Nothing needs doing in our own database. Cancelling in Stripe fires
`customer.subscription.deleted`, which the webhook already processes to drop the
account back to free. The refund itself fires no event we consume, and does not need
to — entitlements follow the cancellation, not the money.

## 4. Reply template

> Thanks for letting us know. I've cancelled your subscription and refunded
> €AMOUNT to the card you paid with, which is the DAYS days remaining of the period
> you'd paid for. Card refunds usually land in 5–10 business days depending on your
> bank. Your account still works — it's back on the free plan, and your existing
> notes are unaffected.

## 5. When to build the automation instead

Reasons to stop doing this by hand:

- More than a couple of requests a month, so the manual work stops being trivial.
- Price points high enough that the exposure per request matters.
- Evidence of the obvious abuse pattern — subscribe, use heavily for 13 days,
  withdraw, repeat with a new account. Watch for it; the current process has no
  automatic guard against it.

Until one of those happens, this document *is* the refund path, and that satisfies the
obligation. The right is honoured by acting on requests, not by automating them.

Most of the exposure sits in the yearly plans, where €40–€120 is collected up front
against a 14-day right. Anything that steers people toward monthly first reduces the
size of the refunds this runbook has to process.
