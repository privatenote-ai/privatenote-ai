# Auth Testing Checklist

## Auth Entry (Unified)
- [ ] Email submit returns generic "Check your email" for valid + invalid inputs
- [ ] Response timing looks similar for valid/invalid emails
- [ ] "Didn’t receive email? Check for typos." returns to form

## Magic Link
- [ ] Existing email → magic link signs in
- [ ] New email → user created pending, magic link activates to active
- [ ] Token reuse fails
- [ ] Expired token returns "expired/invalid"
- [ ] Resend delivery works (email received)

## Passkeys
- [ ] Passkey register after magic link (nudge on /auth/magic)
- [ ] Passkey login works from /auth
- [ ] Step-up passkey works for sensitive actions
- [ ] Hybrid flow (QR / cross-device) succeeds
- [ ] Passkey labels: internal → Local Device, usb/nfc/ble → Security Key

## Recovery
- [ ] Generate recovery codes after step-up
- [ ] Codes shown once (refresh hides them)
- [ ] Valid recovery code signs in
- [ ] Reuse code fails
- [ ] Backup email works for recovery (if set)

## Backup Email
- [ ] Add backup email requires step-up
- [ ] Backup email verify link works
- [ ] Backup email shows verified in Security Settings

## Sessions
- [ ] Session created on magic link login
- [ ] Session created on passkey login
- [ ] Session list shows device + geo + last active
- [ ] Revoke session works (current session logs out)
- [ ] Sliding TTL extends on activity
- [ ] Absolute TTL enforced (simulate by DB edit)

## Security Dashboard
- [ ] /account/security loads signed-in
- [ ] Unauthenticated → prompt to sign in
- [ ] Reset passkeys requires step-up and removes all passkeys
- [ ] Recovery codes shows remaining + last generated

## Regression
- [ ] Note create/read still works
- [ ] CORS works for Pages domain + Worker
