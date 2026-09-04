---
name: project_survivorpulse_identity_scope_guard_data_vs_actor
description: tests/supportSessionRouteCoverage.test.ts fires only on routes with NO url param that read a bare identity id; the right fix depends on whether the id scopes DATA (resolve it) or charges an ACTOR (classify it).
metadata: 
  node_type: memory
  type: project
  originSessionId: 860729f1-0a0d-4f1a-8b78-46c21be5b732
  modified: 2026-09-04T22:51:36.153Z
---

**SST-1439's Support Mode guard, `tests/supportSessionRouteCoverage.test.ts`.** Scans
`server/routes.ts` and flags any route that reads a bare identity id without resolving it
through the support-session resolver. Adding a rate limiter to a previously-anonymous route
is enough to trip it (measured: SST-1426 slice A, `GET /api/backtester/sweep`).

**The offender predicate's FIRST clause is `!r.hasUrlParam`.** A route with a URL param
(`/api/pools/:poolId/...`) falls out of that specific test entirely, no matter what it reads.
I warned a peer session their pool-scoped routes would trip it; they read the full predicate
and I had not. Grepping the middle of a filter and reasoning from it is how that happens —
read the whole predicate before telling anyone what it catches.

A "resolver call" is matched by regex `/resolveEffectiveUser(?:Id|Role)?\(req\)/`, so
`resolveEffectiveUserId(req)` satisfies it and a bare `req.customUser.id` does not.

## The question that decides the fix

When it fires, there are two correct answers and they are opposites. Ask: **does the id scope
DATA, or charge an ACTOR?**

- **Scopes data** → call `resolveEffectiveUserId(req)`. An admin in Support Mode viewing a
  user should see *that user's* rows. (SE-101's per-pool popularity overrides are this case.)
- **Charges an actor** → read `req.customUser.id` directly and classify the route in
  `AUTHORIZATION_AND_AUDIT_ONLY` with a stated reason. Rate limits, audit attribution, and
  authorization checks are this case. Resolving a *limiter* would let an admin drain a
  supported user's quota and reset their own by entering a support session.

Same guard, opposite right answers. Escape hatches: `IDENTITY_SCOPED_BLOCKLIST`,
`AUTHORIZATION_AND_AUDIT_ONLY`, `AUTH_ACTOR_SCOPED` (authRoutes acting on the caller's own
credentials).

## Trap when classifying

A second test reconciles the union of those lists against the scanned routes, so **adding the
justifying comment without adding the array element still fails** — and the failure looks
identical to not having classified at all. It caught exactly that mistake on the first attempt.
Grep for the entry as CODE (`^  'GET /api/...',`) not as prose before believing it landed.

Related: [[project_survivorpulse_support_mode_is_server_side]],
[[feedback_guard_the_wire_not_just_the_helper]],
[[feedback_source_scanning_guards_need_three_meta_tests]].
