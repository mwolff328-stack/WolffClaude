---
name: project_survivorpulse_route_auth_is_opt_in
description: "Express route auth in this repo is opt-in per registration, so a missing middleware argument is invisible; prefix-scoped guard tests keep missing whole classes"
metadata: 
  node_type: memory
  type: project
  originSessionId: 37e1cee1-018e-4c70-ae1e-44cfdee4fea1
  modified: 2026-07-31T00:53:32.629Z
---

`customSessionMiddleware` only **populates** `req.customUser` — it never rejects — and there is
**no blanket `/api` auth middleware**. So a route registered with no middleware argument is
anonymous-reachable. The defect is one missing word on one registration line in a 15k-line file.

Measured 2026-07-31 across `server/routes.ts` + `server/index.ts`: **221** `/api` registrations,
70 with no guard middleware, 49 of those with no in-handler auth either.

**Prefix-scoped guard tests keep missing whole classes.** `adminRoutesRequireAdminGuard` scans
`/api/admin/*` and `optimizerRoutesRequireAuthGuard` scans `/api/optimizer/*`. Both passed while
`POST /api/v1/admin/games/update-win-probabilities` sat completely unauthenticated — it is
admin-**named** but `/api/v1/admin/…` doesn't match the `/api/admin/*` prefix. Proven by
reverting the fix and watching the admin guard still pass 2/2.

`tests/apiRoutesRequireAuthGuard.test.ts` now covers **all** registrations in **both** files.
Each must be guarded, in `PUBLIC_ROUTES` (blessed, with a reason), or in `QUARANTINE` — a
**shrink-only** backlog with ratchet counters, so a new unguarded route can't be waved through
by appending to it. Unguarded writes get a separate, tighter counter.

**Why:** an allowlist entry reads as "this is fine". Quarantine keeps "known and unfixed"
distinguishable from "decided to be safe" — which matters when several sessions are draining
the same list concurrently.

**How to apply:**
- Assert on the **registration line's first argument only**. Text-matching the handler body for
  auth markers produced false "authorised" verdicts three times, matching neighbouring comment
  prose that merely mentioned `requireUnifiedAuth`. See [[feedback_survivorpulse_source_text_guards_fooled_by_text]].
- Pool-data **reads** authorise with `canParticipateInPool` via the `requirePoolParticipant`
  middleware; **mutations** use owner-only `canAccessPool`. Swapping them silently 403s everyone
  who joined a pool rather than creating it.
- Never guess the ratchet constants — both hand-guessed values were wrong and the test caught
  each. Derive from a run.
- **Route-auth changes have invisible local fallout.** Suites gated on
  `RUN_DB_REGRESSION_TESTS=1` (set only in `.github/workflows/pre-publish.yml`) self-skip
  locally, so CI is their first execution. Two hit routes gated here: one would have hard-failed
  and one would have passed **vacuously**, since a 401 satisfies neither branch of
  `if (response.status === 400) {...}`. Grep supertest calls for every route you gate.

Related: [[project_survivorpulse_split_route_registration]],
[[feedback_sweep_for_the_class_not_the_change]],
[[feedback_grep_callers_before_changing_a_shared_resolver]],
[[project_survivorpulse_prepublish_gate_mechanism]].
