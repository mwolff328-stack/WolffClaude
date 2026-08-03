---
name: feedback_a_doc_saying_code_was_deleted_is_not_evidence
description: "CLAUDE.md stated a resolver was dead code deleted in an earlier story; it was live and was the ONLY path the optimizer used — the doc's confidence is what kept anyone from checking."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c5af6e0a-2dbe-4f57-bcbd-437e2e737b83
  modified: 2026-08-01T08:08:50.332Z
---

SurvivorPulse's `CLAUDE.md` said, of the Canonical Spread Contract: *"a third,
`computeEffectiveSpread`, was dead code and was deleted in SST-869."* It had not been deleted. It
was live, and it was the **only** spread resolution the optimizer used — so the engine silently
fabricated win probabilities from a hard-coded team-tier hash for every game whose line arrived by
CSV import (all 256 loaded 2026 games, weeks 2-18).

**Why:** an authoritative-sounding negative claim ("X no longer exists") terminates the search. Every
reviewer who read that line stopped looking for a third resolver, so a Golden-Source violation sat in
the core engine through multiple review passes.

**How to apply:** a doc asserting that code is deleted, dead, or unreachable is a *hypothesis*, not
evidence — and it is the highest-value kind to falsify, because a wrong negative hides an entire
code path rather than merely misdescribing one. Before relying on it, `grep` for the symbol and for
its callers. Cheap check, and the payoff is asymmetric.

Corollary, same shape: "this function is never called" / "this flag is unused" / "that branch is
unreachable". Verify each with a call-site grep before building on it. Related failures where the
guard was fail-open on its own subject: [[feedback_renaming_for_clarity_can_recreate_the_defect]],
[[feedback_source_scanning_guards_need_three_meta_tests]].

When you find such a doc error, fix the doc **in the same commit as the code fix** and say plainly
in the commit message that the error contributed to the defect surviving — otherwise the next
session inherits the same false confidence.
