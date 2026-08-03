---
name: project-survivorpulse-shared-pool-week-context
description: "optimizerService.buildSharedPoolWeekContext already isolates the pool/week-level work from the genuinely per-entry work — reach for it before assuming a batch endpoint must share one entry's numbers with its siblings."
metadata: 
  node_type: memory
  type: project
  originSessionId: 934ead4d-d534-45a5-b163-a22e49249c1a
  modified: 2026-08-01T22:52:43.730Z
---

`server/services/optimizerService.ts` exposes `buildSharedPoolWeekContext(poolId,
week, season, scheduleType)`, and `getWeeklyRecommendationsForEntry(...)` takes it
as an optional 6th arg. Its doc comment states the split precisely:

- **Shared (zero entry dependence):** games by week, pick popularity, odds
  snapshots, all 32 teams, pool dynamics, and the pool/week-level slice of
  poolPicksEstimationService.
- **Still per-entry, never shared:** the `usedTeams`-derived `include` flags in
  `collectWeeklyData`, and poolPicksEstimationService's Steps 9/10
  masking/renormalization — which is why **Field% legitimately differs between
  two entries in the same pool and week**.

That distinction is the answer to "can we batch this?": you cannot serve one
entry's payload to its siblings (their Field% really does differ), but you can
build the expensive shared half once and loop the cheap per-entry half. SST-1120
used exactly this for `POST /api/optimizer/entry-recommendations/batch`, turning
the Season Grid's ~90–270 simultaneous requests (one per entry per visible week)
into one per (pool, week) with per-entry values intact.

`portfolioRecommendation.ts:1196` was the only prior consumer — worth checking
for others before assuming a hot optimizer path is unavoidably N+1.

Related gap found the same day, now **RESOLVED** (verified 2026-08-01): the single-entry `GET
/api/optimizer/entry-recommendations` had no auth middleware and read any `entryId` from the
query string. It now requires `requireUnifiedAuth` (`server/routes.ts:8961`); the route comment
notes the ownership check itself is intentionally left to the caller (Season Grid), since it's
already scoped to the caller's own entries.

Related: [[project_survivorpulse_entry_recommendations_payload]]
