---
name: project_survivorpulse_pool_cockpit_wrapper_global_nav_trap
description: "Reusing the shared cockpit Week View / Season Grid per-pool — the wrapper must NOT seed global top-nav week when many pools render at once, or N pools fight over one shared week."
metadata: 
  node_type: memory
  type: project
  originSessionId: e4e7aa75-240d-4154-93b2-2ed0f2801add
  modified: 2026-07-27T17:55:16.932Z
---

The shared cockpit leaves `WeekViewSection` (entry cards) and `SeasonGridSection` (season grid) in `client/src/components/cockpit/` are the reuse seam — reuse them (never fork) so a change propagates to Game Plan + Pool Detail + My Pools. Both are driven by `useCockpitEntries(season)` + `useCockpitRecommendation(season)`; narrow to one pool's group.

**The trap (SST-1043):** a per-pool wrapper that seeds/bounds the GLOBAL top-nav Season/Week selector (`setSelectedSeason`/`setSelectedWeek`/`setPoolWeekBounds`) is a *single-pool-page* behavior (Pool Detail). On My Pools, which stacks N pool cards, N such wrappers each seeding the shared week collide — worst with mixed regular (weeks 1-18) vs playoffs_only (19-22) domains, where each pool's out-of-domain snap-back rewrites the shared week in a loop.

**The split:** `PoolSeasonGridPanel` (Pool Detail, one pool/page) seeds the nav; `PoolEntryCardsPanel` (My Pools, N pools) uses LOCAL per-pool `focusWeek` and never touches global nav. A test asserts `setSelectedSeason`/`setPoolWeekBounds` are NEVER called for the My Pools wrapper. Both live in `client/src/components/pool-shared/` with a shared `usePoolCockpitData(poolId, season)` hook.

Local dev DB (ep-flat-rice / helium-local) lacks 2026 forward odds, so the recommendation is unavailable → both surfaces render the read-only `PickSummaryStrip` fallback. The interactive happy-path is verifiable ONLY on deployed dev. See the sp-live-verify skill and [[project_survivorpulse_per_user_client_persistence_late_auth_trap]].
