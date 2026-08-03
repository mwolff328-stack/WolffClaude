---
name: pickgrid-dead-seasongrid-shared
description: "PickGrid.tsx's grid has zero production renderers; SeasonGridSection/WeekViewSection are the one shared implementation across Game Plan AND My Pools"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3b43334a-7525-4812-8158-2457ca752407
  modified: 2026-08-03T15:17:58.850Z
---

As of 2026-08-03 (verified by whole-repo grep + reading `router-v1.tsx`, not inferred from tickets): `client/src/components/PickGrid.tsx`'s grid (the `<PickGrid>` export) has **zero production renderers**. Every route that used to reach it — `/picks`, `/my-picks`, `/the-call`, `/week`, `/strategy` — now redirects to `/game-plan`. Its only production-used exports are `TeamPickerModal` and `SelectedCell` (imported by `SeasonGridSection.tsx`/`WeekViewSection.tsx`) and the `Team` type. The file still contains real, working win/loss shading + score-line code (`TeamBadge`, `cellBg()`, `cellBorderBottom()`, `PickRow.result/score` — built for SST-656) — it's a valid **porting source**, not a live surface to modify.

The real, current, shared pick-grid/pick-card surfaces are `client/src/components/cockpit/SeasonGridSection.tsx` (grid) and `WeekViewSection.tsx` (cards). Since SST-1043 (2026-07-27), these exact component instances are reused across **four render sites**, not duplicated:
- Game Plan Season View → `SeasonGridSection` directly
- Game Plan Week View → `WeekViewSection` directly
- My Pools Pool Detail (`client/src/pages/my-pools-detail.tsx`) → `PoolSeasonGridPanel` → `SeasonGridSection`
- My Pools hub (`client/src/pages/pools.tsx`) → `PoolEntryCardsPanel` → `WeekViewSection`

Both panel wrappers fall back to a separate read-only `PickSummaryStrip` (current-week-only, 3 facts, zero interactivity) ONLY when the live recommendation is unavailable (concluded/loading edge cases) — that strip is a distinct, minimal component, not a target for grid/card feature work.

**Why this matters:** a feature built once in `SeasonGridSection.tsx`/`WeekViewSection.tsx` automatically covers Game Plan AND both My Pools surfaces — no porting needed. Conversely, building or fixing anything in `PickGrid.tsx` itself ships to nowhere.

**History note, since Notion ticket history on this exact question is treacherous and self-contradicting across time:** SST-656 (Done) built win/loss shading targeting `PickGrid.tsx` while it was still My Pools' live grid. SST-1001 (Done 2026-07-23) then removed `PickGrid` from Pool Detail, replacing it with `PickSummaryStrip`, making SST-656's work unreachable. SST-1026 then SST-1043 (2026-07-27, "founder ask") replaced that strip-only state with the current shared `SeasonGridSection`/`WeekViewSection` reuse described above. SST-1113 (Done 2026-07-29, hover shading) explicitly scoped itself OUT of "Pool Details / My Picks PickGrid (different surface)" — that framing is now stale; there is no separate surface left to exclude, because Pool Detail renders the exact same components SST-1113 already touched. **Do not trust any single ticket's architecture claim without re-verifying against current code — three consecutive tickets each describe a materially different reality, all correct for their own moment.**

See also [[project_survivorpulse_multipick_past_variant_only]] for a related SeasonGridSection/WeekViewSection rendering-branch fact.
