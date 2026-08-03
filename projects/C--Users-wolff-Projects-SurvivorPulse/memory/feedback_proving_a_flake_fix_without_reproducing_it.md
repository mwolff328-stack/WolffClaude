---
name: feedback-proving-a-flake-fix-without-reproducing-it
description: "When a flake won't reproduce, measure its precursor; if that also won't fire, prove the causal chain deterministically and delete the precondition rather than widening a timeout."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 88e4656c-59db-42c0-8330-9ee749022a9b
  modified: 2026-07-30T18:22:32.902Z
---

A flake fix you cannot demonstrate is a guess — but "demonstrate" does not have to mean
"reproduce the flake". Escalate in this order (SST-1126):

1. **Measure the precursor, not the event.** The compound failure (`advanceToStep5` fails)
   needed *both* keystrokes of `"50"` to drop — far too rare to sample. The precursor
   ("does the field hold what the test typed?") is the actual defect and is orders of
   magnitude cheaper to sample. 240 compound samples got 0; switching to precursor
   sampling gave 650 samples in less time.
2. **If even the precursor won't fire, prove the chain deterministically.** Find the
   existing test that already pins each link. Here TC-6 already proved "empty entryFee ⇒
   blocked on Step 4", which *is* the reported symptom — no new nondeterminism needed.
3. **Delete the precondition, don't widen the window.** The helper cleared a valid default
   and then raced to retype it. The interaction was never needed. Removing it makes the
   failing state unreachable instead of less likely.
4. **Report a zero before-rate as a zero.** Don't launder "I couldn't reproduce it" into
   "it's fixed." State the sample count and the stressors tried.

The cheapest tell that an interaction is unnecessary: **a sibling spec already crosses the
same gate without it** (`PoolCreationWizardSlice4`'s `navigateToStep5` never touched the fee).
Look for that before theorising about timing.

Corollary on scope: the same per-keystroke defect had been diagnosed and fixed **three
separate times in three files** over eight days, each fix landing in one file only, because
seven specs had each re-derived the helper. When a fix note says "only this file showed this
failure mode", that is a prompt to check the other copies, not a scope boundary.

Related: [[feedback_proving_a_test_is_load_bearing]],
[[feedback_sweep_for_the_class_not_the_change]].
