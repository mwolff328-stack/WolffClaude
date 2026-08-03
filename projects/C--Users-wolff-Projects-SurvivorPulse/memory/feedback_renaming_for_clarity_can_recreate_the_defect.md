---
name: feedback_renaming_for_clarity_can_recreate_the_defect
description: "A chokepoint rename that makes semantics explicit can still lie on one branch, and the tripwire guarding it can be fail-open on the very method it protects."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: edd6897b-aa09-4075-be87-3d101c9fd280
  modified: 2026-08-01T03:39:28.044Z
---

When you split an ambiguous accessor into explicitly-named ones, two failures survive the rename and neither shows up in tests:

1. **The new name can lie on a branch you didn't read.** `getTeamsUsedFromPicks(..., beforeWeek?)` became `getTeamsUsedBeforeWeek(..., beforeWeek: number)`. But the body short-circuits on `scheduleType !== 'regular'` and returns the season-wide set, so for `playoffs` the name *asserts* directional and delivers the opposite — the exact defect class, re-created under a better name. The old signature's doc block had documented that scoping; the split dropped the caveat. **Carry forward every caveat the old signature carried, and check each branch honours the new name before trusting it.**

2. **A guard against an omission shape can be fail-open on its own subject.** The tripwire asserted `getTeamsUsedSeasonWideForPlanner` EXISTS by name — so re-adding `beforeWeek?: number` to it restored the entire omission shape with every test green. Asserting a thing exists is not asserting its defining property. **Pin the property, not the name.**

Both were caught only by an adversarial independent review, not by 6026 passing tests. The review's framing is the reusable one: *a story premised on "N tickets from one re-implemented rule" that consolidates one of three implementations has not closed the class.* Count the implementations first; if you leave some, say so explicitly rather than claiming the chokepoint. In this case the build's own tripwire named the other two implementations as parser **decoys** — it looked straight at them and classified them as collision hazards rather than instances of the defect.

**How to apply:** after any consolidation, ask (a) does every branch honour the new name, (b) does the guard fail if the defining property is removed — mutate it and watch, and (c) how many other implementations of this rule exist, named individually. See [[project_survivorpulse_per_call_site_rules_recur]] for why this rule in particular keeps recurring, and [[feedback_proving_a_test_is_load_bearing]] for the mutation discipline.

Also from this run: a `*/` inside a doc comment (a glob like `**/*.test.ts`) closes the block early and the file fails to parse — reword rather than escape. And on Windows, vitest rewrites snapshot files with CRLF, so `git status` shows CA1 golden snapshots as modified when `git diff --numstat` is empty; check content before believing engine output changed.
