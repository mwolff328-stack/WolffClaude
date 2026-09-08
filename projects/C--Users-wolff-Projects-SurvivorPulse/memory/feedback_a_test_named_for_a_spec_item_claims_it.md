---
name: feedback_a_test_named_for_a_spec_item_claims_it
description: "A test whose describe() cites a TC/AC number silently marks that item done, even when it measures something the spec forbids."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 386dc302-d37e-4bed-820b-27161b9c1bda
  modified: 2026-09-08T00:37:36.404Z
---

Naming a test after a spec item is an ownership claim, and auditors read it as one. On SST-1512 Phase A, `sst1512.rhoSweep.test.ts` was filed under `describe('SST-1512 TC-9: ...')` but measured portfolio CE from a provider that correlated **pool-level outcomes directly** — the exact construction AC-14 forbids ("correlation arises from sharing real games, never from directly correlating pool-level outcomes"). It also used a different ρ grid than the pinned one, dropping `RHO_UNIFORM=0.08`, the calibrated operating point the optimizer actually consumes. The suite was green, so TC-9 and AC-13 both looked discharged. They were untouched, and AC-14 was actively violated.

**Why:** a green test named for a requirement is the strongest "done" signal a reviewer sees, and it is checked by nobody — the test name is not compared against the requirement's text by any tool. This is the inverse of [[feedback_an_ac_with_no_test_citing_it]]: there the AC has no guard; here the guard exists, cites the AC, and guards something else. Both fail silently, but this one fails *while looking finished*, which is worse.

**How to apply:** before citing a TC/AC number in a `describe`, re-read that item's text and confirm three things match — the **statistic** measured, the **mechanism** used to produce it, and any **pinned constants** (grids, thresholds, fixture parameters). If the test is worth keeping but doesn't match, rename it to a neutral diagnostic name with an explicit "NOT TC-x, NOT AC-y" line, and leave the spec item open. When auditing a phase, never accept a test name as evidence an item is done — diff the test against the spec text. Related: [[feedback_a_green_test_certifies_its_stale_comments]], [[feedback_proving_a_test_is_load_bearing]].
