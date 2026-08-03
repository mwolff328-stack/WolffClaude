---
name: feedback-read-the-querys-own-loading-state
description: "A guard asking \"has X loaded?\" must read X's own fetch state — inferring it from a sibling query breaks precisely when the one event that invalidates both fires."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 934ead4d-d534-45a5-b163-a22e49249c1a
  modified: 2026-07-30T13:23:43.158Z
---

SurvivorPulse's Game Plan grid had a carefully-reasoned, well-commented guard
(`seasonGridCell.ts`, the "DIVERGENT STATE" block) meant to stop a click landing
on a cell whose picks had not loaded — the picker prefills with the archetype's
suggestion and saves on FIRST click, so such a click silently destroys a real
pick. The guard inferred "picks not loaded yet" from `entry.pickedWeeks`, which
comes from the **entries** query, not the picks query.

Apply invalidates BOTH queries at once. So in the one scenario the guard existed
for, both were stale, the condition never fired, and the cell rendered as an
empty clickable `no-pick` with the plan's suggestion armed. The founder reported
it as "after I clicked into a few cells, the picks changed" — the clicks were
doing the writing.

Two follow-on traps when fixing it (SST-1118):

- `isSuccess` is the wrong signal too. react-query keeps it TRUE during a
  background refetch while serving stale cached rows — exactly the post-Apply
  window. And for a disabled query (`enabled: poolId != null`) it never becomes
  true at all, which would freeze the UI permanently inert. `!isFetching` is the
  signal that answers the actual question.
- The same hazard existed in a sibling component (Week View) that the bug report
  never mentioned. Grep for the prefill pattern, not just the reported surface.

**How to apply:** when a guard's premise is "data D has arrived", read D's own
loading state. A proxy derived from different data is a coincidence that holds
until the moment both go stale together — and that moment is usually the exact
one the guard was written for. Extra suspicion is warranted when the proxy and
the real thing are invalidated by the same event.

Related: the sp-live-verify skill
