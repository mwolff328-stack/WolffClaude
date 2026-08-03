---
name: feedback_rounding_a_display_input_destroys_ordering
description: "One formula computed at two precisions diverges exactly where the gap is smallest, and an alphabetical tie-break then decides it."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b5b8e6fe-2bd9-492a-9191-e67ceb5e9a4b
  modified: 2026-08-03T00:54:43.595Z
---

SST-1241: the Game Plan modal ranked BAL #5 above CIN #6 at an identical Rank
Score of 67.8, while the allocator picked CIN. Same 80/20 formula both sides —
`scoreTeamForStrategy` on raw fractions, `computeRowRankScore` on integers
rounded FIRST. BAL field 1.43%, CIN 1.28%, identical raw win probability. Both
rounded to "1%", so the only separating signal was destroyed, an exact tie was
manufactured, and `teamId.localeCompare` (B before C) then chose the pick.

**Why:** rounding an input before a comparison does not blur the ordering, it
DELETES it and silently hands the decision to the tie-break. The damage is
invisible in testing because it only appears where two values are close — the
exact region no hand-written fixture explores, and where "they're basically the
same" feels true. It also inverts the usual instinct: the surface showing the
tie looked authoritative and the allocator looked broken, when the reverse held.

**How to apply:**
- Two surfaces computing "the same" quantity must share ONE function AND one
  precision. Equal-today-by-coincidence is the defect waiting to happen; five
  prior tickets (SST-901/1179/1183/1189/1220) circled this same code without
  closing it because each unified the formula while leaving precision forked.
- Round for DISPLAY only, at the cell, AFTER the order is fixed. Any rounding
  upstream of a comparison is a bug.
- "Exact recompute-from-screen" and "ordering matches the engine" are MUTUALLY
  EXCLUSIVE at integer display precision. Pick one deliberately and write down
  which; SST-901 had picked the former without noticing it cost the latter.
- A tie-break that is load-bearing "in roughly a third of cases" is a signal the
  KEY is too coarse, not that the tie-break is working.
- Test the near-tie, not the comfortable margin. Build the fixture from real
  production values where the gap is 0.15pp, and assert the OLD implementation
  returns a DIFFERENT TEAM — a fixture that only changes the number passes under
  both. See [[feedback_proving_a_test_is_load_bearing]].
- When a fixture-quality guard (e.g. "the generator must produce >500 ties")
  trips after the fix, fix the GENERATOR to match reality, never lower the floor.
  Here win probabilities cluster hard because they derive from a discrete spread
  ladder — five of nine top teams sat at exactly 0.6.
- Related: [[feedback_derive_from_the_quantity_the_reader_validates]].
