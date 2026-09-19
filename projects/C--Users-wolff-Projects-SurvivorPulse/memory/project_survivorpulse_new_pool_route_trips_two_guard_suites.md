---
name: survivorpulse-new-pool-route-trips-two-guard-suites
description: "Adding a pool-scoped route that reads the override resolver, or a per-pool client fetch, turns the Pre-Publish Gate red on two suites authors don't run locally (SST-1549 tripwire, SST-959 TC-4 belt)"
metadata: 
  node_type: memory
  type: project
  originSessionId: c9ab76e2-3a95-49c9-bce6-b72b1b340791
  modified: 2026-09-19T06:57:07.257Z
---

Two guard suites went red in CI on SST-1626 because the author ran only neighbouring route/auth/cockpit suites:

- `tests/pickPopularityOverrideExclusion.sst1549.test.ts`: any production file that imports the override resolver (`resolveEffectivePopularity`) must be on `OVERRIDE_ALLOWLIST` and `DIRECT_RESOLVER_CALLERS`, AND the allowlist must equal the set of files that mention an override symbol. Fix is a decision-log entry (D22 for effective-range, HONOUR) plus the allowlist lines. Also raise the route-count floor in `tests/supportSessionRouteCoverage.test.ts` and add the route to its effective-user-resolver table.
- `client/src/pages/__tests__/game-plan.poolSettings.test.tsx` (SST-959 TC-4): its belt `unexpectedPoolSubpathCalls` flags any `/api/pools/...` request whose URL lacks `picks`. A new read-only per-pool grid fetch needs a narrow, non-empty-id exclusion (the SST-1287 `/proposed-picks` precedent).

**Why:** both are CI-only surprises; `client/src/pages` and the SST-1549 suite are outside the usual cockpit/lib runs.

**How to apply:** before the first push of any story that adds a `/api/pools/:id/...` route or a client fetch to one, grep `tests/` and `client/src/**/__tests__` for the URL shape and the resolver/override symbols and run that whole family, plus `client/src/pages`.

Also: a route test that stubs an ADMIN cannot detect a missing `requirePoolParticipant` (ADMIN short-circuits `canParticipateInPool`). Pin the wiring with a source-shape assertion in `tests/poolDataReadAccessGuard.test.ts`.
