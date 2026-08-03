---
name: project-survivorpulse-past-season-apply-cascades
description: Widening a write path to touch COMPLETED weeks inherits every cascade obligation the narrower path never had — past-season Game Plan Apply needed the SST-430 elimination recompute and eliminated-entry inclusion that sibling routes already had.
metadata: 
  node_type: memory
  type: project
  originSessionId: 934ead4d-d534-45a5-b163-a22e49249c1a
  modified: 2026-07-29T23:17:40.941Z
---

Enabling Game Plan Apply for past seasons (SST-1112, 2026-07-29) took three
server changes beyond the obvious client gate, two of which only a review caught:

1. **Kickoff-lock bypass** (`server/routes.ts`, the `/api/me/gameplan/apply`
   loop). Every game in a concluded season has kicked off, so
   `computeLockedTeamIds` would mark every changed cell `skipped-locked` and the
   apply would write nothing. Bypassed at the ROUTE level for past seasons only —
   the exact pattern the single pick-save route already used (~line 6140).
   `computeLockedTeamIds` stays season-agnostic; other call sites are untouched.
2. **SST-430 elimination cascade** (missed initially). Apply previously wrote only
   not-yet-locked weeks, whose games have no results — so no recompute was ever
   needed. Once it can overwrite a COMPLETED week, a written pick can flip a known
   outcome, and `entries.isAlive` / `eliminationWeek` must follow. Both sibling
   routes (single pick-save, batch) already did this. Added per written entry,
   past-season only, log-and-continue (never roll back a committed pick).
   Note `clearPicksService` deliberately does NOT recompute — both directions have
   precedent, so state the choice explicitly.
3. **Eliminated-entry inclusion** (missed initially). `buildRealMultiPoolEntries`
   filtered to `r.isAlive`; in a real concluded pool most entries are eliminated,
   so the common case yielded zero entries → `CockpitNoEntriesError` → 404 and the
   feature was unreachable. Now takes an explicit `includeEliminated` (true only
   for past seasons), matching `isCellEditable`'s existing past-season bypass.
   ⚠️ Load-bearing coupling: the resulting `EntryContext` hardcodes
   `isAlive: true`, which is what lets those rows survive
   `buildDistinctEntryPlans`' own `entries.filter(e => e.isAlive)`. Don't "fix"
   that hardcode to read the row without revisiting this path.

**Testing note:** the row-level integration proof cannot run locally — the
`dbHostGuard` correctly refuses integration runs against any non-disposable host
(including `ep-flat-rice`, the documented local dev DB). It executes only on the
CI Pre-Publish Gate. Say which one you actually ran.

⚠️ **The CI database carries a FULL 2025 season.** A past-season integration test
that seeds its own synthetic games is therefore working alongside ~272 real ones,
and any expectation derived from "my fixture" is wrong there. This cost a gate
failure (run 30497639231): `determineCurrentWeek` correctly returned 18 (the last
week WITH GAMES in the DB) while the test asserted its own 4 seeded weeks. Two
sibling assertions had the same flaw — a winner set built only from the seeded
game IDs, and a `toContain(1)` that assumed week 1 resolves `odds`. Derive every
expectation from the database (`MAX(week)` for the season; win/loss over all the
season's completed games) and state the requirement rather than a number — e.g.
"the minimum written week is EARLIER than the natural week", which is impossible
before the fix (the window collapses to `[18,18]`) and independent of which weeks
happen to have spread coverage.

Related: [[project_survivorpulse_planning_override_leaks_as_truth]]
