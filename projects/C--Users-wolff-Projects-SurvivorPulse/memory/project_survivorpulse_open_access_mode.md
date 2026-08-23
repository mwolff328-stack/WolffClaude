---
name: project_survivorpulse_open_access_mode
description: OPEN_ACCESS_MODE in shared/accessMode.ts is the single switch hiding the beta-code gate and the Stripe paywall; two access primitives are easy to confuse.
metadata: 
  node_type: memory
  type: project
  originSessionId: 606235bf-b91b-432d-b211-7da816a9d0aa
  modified: 2026-08-23T16:31:30.079Z
---

**SST-1097/1098 (2026-07-29, on `2026-v1` @ `cfd6056a`).** `shared/accessMode.ts` exports
`OPEN_ACCESS_MODE = true` — one compile-time constant (deliberately NOT an env var: a
secret missing in one Replit environment would silently re-paywall prod, and
`import.meta.env` vs `process.env` lets client and server disagree). Setting it `false`
restores every app gate. Nothing was deleted.

Gated in only 4 places: `requireActiveSubscription` (after the 401 — never before),
`GET /api/me/subscription` (returns `status:'open_access'`, placed after the ADMIN and
TEST_USER role checks but *before* the beta DB lookup, so no query runs),
`useSubscription` (the SINGLE client cascade point — **nine** components read `isActive`;
patch the hook, never the consumers), and `signup.tsx`.

- **Signup's beta-code hide is DISPLAY-ONLY.** The zod field, the `?code=` prefill and the
  POST payload stay wired so Admin Hub invite links still redeem. Deleting them breaks
  every issued code silently.
- **The homepage copy is NOT behind the flag** — it's a content change; reverting it means
  restoring `BETA_SECTION` + `BetaAccessRequestForm` in `landing.tsx` by hand.
- Behavioural suites pin the mode they test; exactly one test records the shipped value,
  so flipping the flag reddens 1 of 101, by design.

**Two access primitives are easy to confuse** (`canAccessPool` = mutations vs.
`canParticipateInPool` = pool data reads) — full detail lives in
[[project_survivorpulse_route_auth_is_opt_in]], not duplicated here.

Related: [[feedback_sweep_for_the_class_not_the_change]],
[[feedback_check_distribution_before_inferring_convention]],
[[project_survivorpulse_route_auth_is_opt_in]]
