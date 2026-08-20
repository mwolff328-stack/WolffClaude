---
name: feedback_a_helper_can_implement_half_a_rule
description: A pure helper can implement HALF a rule and silently rely on its caller for the other half — moving it to a new call site breaks it with no type error and no failing existing test.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d82d8712-5081-4ef9-b4b9-148894d49e43
  modified: 2026-08-20T15:45:44.314Z
---

**SurvivorPulse, SST-1416, 2026-08-20.** `computeProposedPeriodsToClearForReapply`
takes `isPastSeasonApply` and `completedWeeks`. Founder RULING 1 is that a
past-season run ignores BOTH gates — manual locks and completed weeks.

The helper implements only the first half: it nulls the manual override itself
when `isPastSeasonApply` is true, but takes `completedWeeks` **at face value**.
The other half lived in the caller — Apply's route does
`completedWeeksForApply = isPastSeasonApply ? [] : await storage.getCompletedWeeks(...)`
*before* calling it.

That split is invisible from the helper's signature. It accepts both arguments,
its doc comment reads as complete, and it typechecks perfectly at a new call
site. Reusing it from the new decoupled clear endpoint produced a wrong answer
immediately: a locked, completed cell on a **concluded** season came back
`preserved` when the ruling says a past-season run clears both gates freely.

**Why:** a helper that takes a mode flag (`isPastSeasonApply`, `isDryRun`,
`isAdmin`) creates an expectation that it handles that mode *completely*. When
it handles the mode for one input and the caller pre-processes another input for
the same mode, the rule has two homes and only one of them is discoverable from
the call site. Nothing catches it — not the compiler, not the helper's own
tests (they were written against a caller that already did the pre-processing),
and not the existing caller (which still works).

**How to apply:**

1. **When reusing a pure helper at a NEW call site, do not port only its
   arguments — port the CALLER'S PRE-PROCESSING too.** Read what the original
   caller does to each argument before passing it. `git show`-ing the original
   call site is the cheap check; reading the helper alone is not.
2. **A mode flag in a signature is a claim the helper owns that mode.** If it
   only partly owns it, that is a latent bug, not a style issue. Either move
   the remaining pre-processing inside, or rename the parameter so it stops
   implying ownership.
3. **Close the gap at the new call site rather than editing a helper you were
   told to reuse verbatim.** Here the AC required the helper be recovered
   verbatim from a reverted commit, so the fix went in the new wrapper
   (`planProposedCellClear` empties `completedWeeks` itself and every downstream
   read uses that value). That keeps the verbatim-recovery requirement AND makes
   the new front door self-contained.
4. **The test that found it was a past-season case, not a code read.** Three
   prior sessions on this same ticket produced three confidently wrong answers
   by reasoning from source. Write the mode-flag test even when the helper
   "obviously" handles the mode.

Related: [[feedback_guard_the_wire_not_just_the_helper]] — that one is about a
helper being tested but never CALLED; this one is about a helper being called
correctly and still being wrong because half its rule stayed behind.
Also [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]].
