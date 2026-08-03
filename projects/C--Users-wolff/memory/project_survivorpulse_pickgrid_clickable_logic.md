---
name: survivorpulse-pickgrid-clickable-logic
description: "PickGrid.tsx's actual click-gating formula — already-submitted picks are editable far more broadly than the visual styling implies"
metadata: 
  node_type: memory
  type: project
  originSessionId: 44b0b154-1de0-401c-9b8c-1df6cf97b4bf
---

`client/src/components/PickGrid.tsx`'s cell interactivity formula (as of 2026-07-03, commit `777db894` and later): `clickable = active && (!isCurrentSeason || !isEliminated || !isEmpty)`, where `active = isWeekActive(week)` gates purely on pool-schedule-type coverage (regular season vs. playoffs — NOT a date/kickoff check), and `locked = !active` (styling only).

**Truth table (current season):**
| isEliminated | isEmpty (no pick) | clickable |
|---|---|---|
| alive | has pick | true |
| alive | no pick | true |
| eliminated | has pick | **true** (already editable!) |
| eliminated | no pick | false (correctly — can't "fix" a pick that was never made) |

**Key finding:** `isEliminated` never blocks editing an *existing* pick — it only blocks adding a *new* pick to an empty cell. So already-submitted picks are already clickable/editable in both My Pools and Make Picks, regardless of alive/eliminated status or how far in the past the week is. There is currently no code-level lock on past-submitted-pick editing anywhere in this component.

**Why this matters:** Deb's original wireframe pass (and the founder's request that past picks "should be editable") assumed past-week cells render as visually locked/non-interactive based on styling appearance, not the actual formula — nobody had traced the real logic until SST-705 Slice B investigation (2026-07-03). The functional gate barely exists; what's actually missing is a *visual affordance* (an EDIT badge or similar) signaling to users that an already-submitted past pick is still clickable, since the current styling makes it look locked even when it isn't.

**Why:** this cost three separate stop-and-clarify cycles during SST-705 implementation (see [[project_survivorpulse_make_picks_epic]]) — a costly rediscovery if not remembered.

**How to apply:** before assuming any PickGrid cell is "locked," check the actual `clickable` formula, not the visual styling or a wireframe's assumption about it. When users report "I can't edit X," verify whether it's a real `clickable=false` case or just an affordance/discoverability problem (cell looks locked but isn't).
