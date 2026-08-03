---
name: project_survivorpulse_clear_picks_zero_gate
description: "Founder ruling 2026-07-23 on zero-pick clear-all controls; per-entry gated client-side, pool-wide CANNOT be and needs a server-side canWriteEntry-scoped count"
metadata: 
  node_type: memory
  type: project
  originSessionId: 60fa159e-1df8-4a9c-b629-67a48d1f7cf4
  modified: 2026-07-23T14:03:56.885Z
---

Founder ruling 2026-07-23 (shipped e76e0507, 2026-v1): a clear-all control offered on something with nothing to clear must be DISABLED, matching the per-week Clear's pre-existing `persistedTeamIds.length > 0` gate. Disabled, never hidden.

**Per-entry: done.** `EntryActionButtons` takes `clearAllDisabled`; both Season Grid and Week View feed it from `useEntryManagement.entryPickCount` — the SAME function that supplies the confirmation's count, so gate and number cannot drift.

**Pool-wide (PoolSettingsTab Danger Zone `btn-clear-all-picks`): still ungated, and this is NOT an oversight.** It cannot be fixed client-only:
- `RawEntry` from `GET /api/pools/:poolId/entries` carries no pick data at all.
- For an ADMIN the server's clear scope is every member's picks (`canWriteEntry`), which that surface never sees.
- `pool_team_picks` / `weekly_stats` are popularity aggregates, NOT the picks the clear route deletes — wrong predicate, don't reach for them.
- Gating on any available narrower predicate would block an admin whose own entries are empty from clearing a pool that isn't. Wrong direction to be wrong in.

**To actually close it:** add a server-side pick count scoped by the same `canWriteEntry` predicate the clear route uses. Until then the residual is handled via the server's own post-hoc `totalCleared`: `presentClearOutcome` returns `NOTHING_TO_CLEAR_NOTIFICATION` ("There were no picks to clear.") instead of a default-toast "Cleared 0 picks." — deliberately NOT applied to the partial-failure path, where nothing-cleared may mean everything errored.

Relates to [[project_survivorpulse_se91_batch2_outcome]] (same "client number must derive from the SAME predicate as the server action" family) and [[feedback_survivorpulse_hollow_fixtures]].
