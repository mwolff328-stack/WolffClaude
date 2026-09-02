---
name: feedback_a_guard_can_reproduce_the_defect_it_guards
description: "A guard written to catch a false claim can confirm a NARROWER proposition than the claim makes, and go green on the same defect. Test the scope the copy actually uses, not the scope your data module happens to hold."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5d7806f4-5094-4b99-9541-24dcb5291fdd
  modified: 2026-09-02T17:55:41.880Z
---

Copy that states a fact about data needs a guard that checks it **against the data**. Word scans
cannot see it: the sentence contains no forbidden word, it is well formed, on voice, and wrong.

SST-1517 shipped `"Chalk survives the longest here and wins the least"` on a public page and in
the Reddit/Discord **share-card metadata**. Both halves were false against that page's own dataset
(Chalk leads survival only at n=1; it is 2nd of 5 on win share at n=5). Three reviewers caught it
independently. Every existing guard — em dashes, money language, superlatives, forbidden framing —
was blind, because each is a word scan.

**The part worth remembering is what happened next.** The fix added a data-driven guard that
re-derives the survival ranking and asserts the copy's claims hold. The replacement copy said Heavy
Contrarian *"lasted the shortest of anything we tested"*. The guard passed. It was **also false**:
the guard ranked only the **five strategies in the committed extract**, while the sentence claimed
**everything tested** — and the source artifact holds **ten** templates, three of which last
shorter at n=1. The guard confirmed a *narrower proposition than the copy asserted* and went green
on the same defect class it was written to prevent, one commit later.

**Why:** a guard naturally reaches for the module it lives next to (the derived extract), while the
copy quantifies over the world (the source artifact). Those two scopes differ silently, and the
mismatch is invisible precisely when the narrower claim is true. Note the tell in the sentence
itself: it carefully scoped its first clause (`"of the five here"`) and then **widened** the second
(`"of anything we tested"`). A scope that changes mid-sentence is where to look.

**How to apply:**
1. **Quantify the guard at the copy's scope, not your data module's.** If the sentence says "anything
   we tested", read the full source artifact, not the extract.
2. **Ban the widened phrasings explicitly** (`/shortest of anything|longest of anything/`) *and*
   assert the wider claim really is false, so the ban is not superstition.
3. **Check the scope per clause.** Split on sentences; a claim and its qualifier can sit either side
   of each other, and a one-sided lookahead catches only one arrangement.
4. **Disclose the selection.** If the page shows 5 of 10 tested items and an unshown one beats
   everything displayed, say so — silence is its own overclaim.

Same family as [[feedback_derive_test_expectations_from_the_db_not_the_fixture]] and
[[feedback_confirm_the_check_covers_what_you_changed]]; the SST-782 precedent is
[[project_survivorpulse_sst782_rank_and_scope_errors]], where the same figures shipped unscoped
twice. See also [[feedback_mutation_harness_edits_the_first_match_not_yours]] — both are cases where
**the instrument, not the code, was the thing that was wrong**.
