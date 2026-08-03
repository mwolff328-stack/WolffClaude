---
name: project_survivorpulse_shared_query_key_shape
description: SurvivorPulse react-query bug class — two surfaces sharing one cache key but storing different SHAPES; staleTime Infinity means first loader wins and the other renders blank
metadata: 
  node_type: memory
  type: project
  originSessionId: 9ccf1a79-b7be-465d-bb85-c2dee0f12911
  modified: 2026-07-22T14:28:38.520Z
---

Third query-key incident in SurvivorPulse (see [[project_survivorpulse_mypools_entry_sync_and_label]] for the scoping variant). This one is about SHAPE, not scope.

`GET /api/games/with-spreads` was read by 4 surfaces under the identical key `["/api/games/with-spreads", week, season, scheduleType]`. Game Plan's Season Grid / Week View projected the response INSIDE its queryFn (stored `CockpitScheduleGame[]`), while Games & Spreads and Data Import expected the `{games, lastUpdatedAt}` envelope. With the app default `staleTime: Infinity`, whichever surface loaded first won the cache entry and the others silently rendered empty. Symptom the founder saw (2026-07-22): Games & Spreads blank until you press Refresh (Refresh re-ran that page's own queryFn and rewrote the entry).

**Why:** nothing throws. A wrong-shape read yields `undefined` and the empty state, so it reads as "no data" not "bug". A cold page load works fine — it only breaks on SPA navigation from the surface that wrote first, which is why it survived tests and casual checks.

**How to apply:**
- One endpoint = one owner module = one cached shape. Canonical example now in repo: `client/src/lib/gamesWithSpreadsQuery.ts` (key factory + envelope fetcher + shared query options), enforced by `tests/gamesWithSpreadsQueryContract.test.ts`.
- Narrow with react-query `select` (per-observer, never touches the shared entry) — NEVER inside the queryFn.
- Declare selectors at MODULE SCOPE. An inline/unstable `select` hands every render a new array, which re-fires any effect keyed on the result (same trap as [[project_survivorpulse_dnd_table_and_mock_loop]]).
- Repro test must simulate the OTHER surface loading first via the real producer (`fetchQuery(<theirQueryOptions>)`), not a hand-made fixture — otherwise it can't catch a reintroduced projection.

**Ruled out (and a live example of the wrong-host trap):** the local dev Neon (ep-flat-rice) has 2026 weeks 2-18 but ZERO week-1 game rows, which looked like it could be the real cause. Founder ran psql in the Repl on 2026-07-22: helium has all 16 Wk1 games. The gap is LOCAL ONLY. Exactly why CLAUDE.md forbids declaring a dev-app data blocker from a local SQL check — the cache-shape bug above was the sole cause.
