---
name: feedback_check_write_path_reachability_before_assuming_read_logic_is_broken
description: "A \"X doesn't detect Y\" bug report can mean the WRITE path for Y was never wired to any UI, not that the read/display gate is broken — check reachability first."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 43b08822-567e-4b30-b201-1e1e1efe82dc
  modified: 2026-09-23T01:48:01.568Z
---

SST-1714: founder reported "Actual pick view doesn't detect available planned buybacks" —
looked like a click-gating/detection defect. A server route
(`poolEntryReviveHandler`, `POST /api/pools/:poolId/entries/:entryId/revive`) already existed
and was fully correct, but grep across `client/src` found **zero callers** — confirmed
independently by the codebase's own comment (`entryPills.ts`): `entries.revivals` is "the count
only ever incremented by the **currently-unwired** POST /revive route." Actual's click-gate was
never broken; it correctly refuses to *assume* a live buyback happened (founder ruling, past-season
only). The real gap was one layer deeper: no UI control had ever called the write path at all.

**Why:** the first, plausible-but-wrong hypothesis (a bad boolean in a click-gate,
`PickGrid.tsx:4513`) was in dead code — never even reached in production. Only tracing the
actual render path (`SeasonGridSection.tsx` / `WeekViewSection.tsx` → `isCellEditable` →
`entries.eliminationWeek`) led to the real question: "is there a way to record this action at
all," not "is the display logic correct."

**How to apply:** when a report says a surface "doesn't detect" or "doesn't recognize" some
state that requires a real action to have happened (revive, confirm, activate, etc.), check
whether the WRITE PATH for that action is (a) implemented and (b) actually called from any
client code, before assuming the read/display gate is misconfigured. `grep` for the route
string finding a handler is not proof of reachability — grep for callers too.

Second lesson from the same ticket, live-testing round: a first cut passed a full green
component-test suite and still had a real UX defect (a button crowding the sticky entry-name
column) that no test fixture exercised, because the fixture never modeled real data density.
Live verification against the deployed app is not optional polish — it found what the test
suite could not. See [[project_survivorpulse_sst1714_buyback_unwired_revive_route]] (if written)
for the ticket-specific detail.
