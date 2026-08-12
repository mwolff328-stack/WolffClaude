---
name: feedback_a_third_verdict_can_silence_a_signal
description: "A relabel can destroy a warning signal while provably never returning the \"silent\" verdict — guard the user-visible meaning, not the enum."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2993dd74-1b19-4302-9b8a-6bd5b31d6e47
  modified: 2026-08-12T16:25:56.299Z
---

Splitting a boolean warning into a three-way verdict (`none` / `stale` /
`other-archetype`) invites a guard of the shape *"this resolver never returns
`none` where the old predicate returned true."* That guard can be
**structurally provable, tested over every combination of inputs, and still
useless** — because the signal is destroyed by the THIRD verdict, not by the
silent one.

SST-1333: the orange stale-dot relabel established only WHO wrote a Proposed
pick, then told the user *"The pick is not out of date."* Apply Max Equity,
let the odds move Max Equity itself off that team, then view 80/20 Blend: the
pick is genuinely stale, and the user got a calm blue ring saying it was fine.
The dot became **unreachable** for every cell whose writer differed from the
archetype on screen — the normal way the chooser is used. A property test
asserting "never `none`" passed the whole time, because `other-archetype` is
not `none`.

**Why:** and the founder's constraint was *"do not make the dot fire less."*
The letter held. The spirit did not, because a warning rewritten into a
reassurance is the warning not firing.

**How to apply:** when a fix replaces one verdict with N, partition by what the
USER is told, not by the enum: which verdicts warn, and which reassure? Then
assert the warning set is not shrinking. Concretely, any branch whose copy
asserts a fact ("not out of date", "safe", "up to date") must be able to CHECK
that fact — if the data to check it isn't in scope, either thread it in or drop
the claim and say only what is known. A reassurance the code never verified is
a lie with good intentions. Related: [[feedback_survivorpulse_gate_page_not_viewer]],
[[feedback_renaming_for_clarity_can_recreate_the_defect]].
