---
name: feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect
description: "Two shipped fixes were wrong because their tickets' Proposed resolution asserted a false equivalence between two code paths; the implementers followed it faithfully and every review passed."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 715ea743-c5bf-44e7-a238-1b31c07f379a
  modified: 2026-08-23T16:30:37.285Z
---

A SurvivorPulse bug ticket's **Proposed resolution** section carries real authority — it is
written after a root-cause dig, cites `file:line`, and the implementer treats it as the spec.
That is usually good. It also means **an error there propagates into shipped code with nothing
downstream positioned to catch it.**

**The case (SST-1192 and SST-1194, both shipped to production 2026-08-01).** Both tickets'
Proposed resolution said, in almost identical words, that the fix must use
`resolveSingleTeamForSimulation` because it is "the same resolution the writer uses," so the
claimed/badged team and the written team would be "the same team by construction." That claim
is false — the writer is `resolvePlannedTeamsForWeek` and uses a different rule. Neither ticket
had verified it; both implementers implemented it exactly as written; both fixes shipped; a
Pre-Publish Gate passed on each. Found only by a later review that called both functions on the
same input and compared the answers.

**Why:** an assertion of equivalence between two code paths is unfalsifiable by any of the
normal instruments. Unit tests assert against a hard-coded expected value, which encodes the
same belief. Code review reads the diff against the ticket and sees agreement. The gate runs
the tests. Nothing in that chain ever calls the other path.

**How to apply:**

1. **Treat "X is the same as Y" in a ticket as a hypothesis, not a requirement.** Before
   implementing, call both and compare. It is usually a five-line throwaway test. If they
   differ, the ticket is wrong and the story goes back to grooming — do NOT implement it and
   note the discrepancy in the commit message.
2. **Never let the resulting test assert a hard-coded value for an agreement requirement.**
   `expect(f(r)).toBe('LAC')` cannot verify "matches what the other system produces" — only
   "matches what I believed it produces." Assert `expect(f(r)).toBe(g(r))`. In SST-1194 the
   literal `'LAC'` was the file's strongest-looking assertion and was the one carrying the
   error, under a test named *"names the SAME team the writer picks."*
3. **When reviewing a shipped fix, re-derive the ticket's premise, don't inherit it.** The
   review that found this was told the fixes were correct and asked only to confirm wiring and
   set board Status. The premise had never been checked by anyone.
4. **A doc comment is not evidence either.** `resolveSingleTeamForSimulation`'s own doc says it
   is for "AUTOMATED SIMULATION CONTINUATION ONLY" and explicitly disclaims the interactive
   path — and two interactive call sites were added to it anyway, because the ticket said
   otherwise and nobody read both. Same failure mode as
   [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]], one layer up.

Grooming implication worth raising if it recurs: a Proposed resolution that asserts two code
paths are equivalent should have to show the comparison before it becomes an AC.

## Second sub-shape: "just reuse the shared helper" can DELETE a guard

The equivalence error above is one flavour. The other is a **DRY recommendation that silently
drops a safety feature the specific implementation had** — and it is more dangerous, because
consolidating onto a shared helper reads as unambiguously good engineering in review.

**The case (SST-1230, 2026-08-02).** I filed the ticket myself and wrote the Proposed
resolution: `scripts/cleanup-test-pools.ts` is missing three non-cascading child deletes, so
**reuse `storage.deletePool`** rather than hand-maintaining a table list — citing that
`cleanup-e2e-fixtures.ts` already does exactly that. Reasonable, cites a precedent, matches the
lesson of the sibling ticket.

It is wrong. `cleanup-test-pools.ts` carries a deliberate mass-deletion cap
(`MAX_DELETE_PER_TABLE`, default 200, added in `d754132f`) that counts every table's planned
deletes up front and aborts unless `ALLOW_LARGE_TEST_DELETES=1`. **`storage.deletePool` has no
cap.** Routing a bulk-deletion script through it would have traded a foreign-key bug for an
uncapped hard-delete path, while the diff looked like a tidy cleanup. Caught only by reading
the script before implementing my own recommendation.

The quieter version of the same mistake was available too: add the three deletes but not the
three *counts*, leaving three tables deleted-but-uncapped. A guard that covers 5 of 8 tables
still prints a reassuring "Planned Delete Counts" header.

**How to apply:**

5. **Before consolidating onto a shared helper, enumerate what the specific implementation does
   that the shared one does not.** Caps, dry-run modes, confirmation prompts, audit logging,
   scoping, rate limits. DRY is about duplicated *logic*, and a safety feature attached to one
   call site is not duplication — it is the reason that call site is different.
6. **When adding an item to a guarded set, add it to the guard in the same commit.** New table
   → new count, new cap check, new report line. Ask explicitly: "does the existing safety
   mechanism now cover everything it appears to cover?"
7. **Your own ticket gets no more trust than anyone else's.** This Proposed resolution was
   written by the same session that later implemented it, hours apart, and was still wrong —
   because it was written from the FK graph without reading the script's other 300 lines.

## Third sub-shape: delegating to a shared helper whose RULE disagrees with the reference

Routing a consumer through a shared helper removes the *duplicate implementation*. It does
**not** make the helper's answer the right one. If the helper's rule differs from the quantity
you actually needed, delegation propagates the wrong answer faster and with more confidence than
a local copy would have — this is the SST-1192/1194 case above from the other side: not just
"did anyone verify the equivalence claim" but "of several plausible delegates, which one did they
pick, and why."

**The case (SST-1220, 2026-08-01).** SurvivorPulse had **three** tie-break rules for "which team
does a tied recommendation resolve to":

| where | rule |
|---|---|
| `resolveSingleTeamForSimulation` (greedyPath) | `[...candidates].sort()[0]` — ALPHABETICAL |
| `resolvePlannedTeamsForWeek` (gameplanApplyService) | `candidates.find(not-already-used)` — engine order ← **what Apply WRITES** |
| greedyPath's internal `usedTeams` | the walk-chosen team |

SST-1192 and SST-1194 each repointed a consumer at the **alphabetical** one, both citing "one
comparator" as the reason to delegate rather than tie-break locally. Both were right to delegate.
Both picked the wrong delegate, and each wrote a variant of *"so they are the same team by
construction"* into a doc comment. Neither had ever called both functions on one input. Live
consequences, both in production: the claim map withheld a team nobody took, so a second entry
was planned onto the team Apply really writes and **one pool was written the same team twice in
one week**; and the REC badge pointed at a team Apply would not write.

**How to apply:**

8. **"A is the same as B by construction" is an assertion to execute, not to document.** Call
   both on one input, print both, and diff — before writing the comment, and again as a test
   that compares the two functions' outputs rather than either against a literal.
9. **Choose the delegate by naming the reference quantity first.** Here it was "the team Apply
   writes" — both tickets said so explicitly and neither checked which function computed it.
   Read the reference implementation, don't infer it from a helper's name.
10. **When two fixes both delegate and both are still wrong, fix the HELPER'S RULE, not the call
    sites.** One-line change, corrects every consumer at once, edits no call site — which also
    avoids collision with a concurrent session that has the call-site files claimed.
11. **Pick a fixture where the candidate rules disagree.** A pair whose orderings coincide passes
    under the broken and the fixed implementation alike — see
    [[feedback_proving_a_test_is_load_bearing]]. The SST-1192 test used `ZZ_TIE_A` before
    `ZZ_TIE_B` and stayed green straight through the defect it was named for.
12. **A doc comment asserting an equivalence ages into a false claim** the moment either side
    moves, and it reads as verified. After changing a shared rule, grep the codebase for prose
    describing the OLD rule — three comments here still said "alphabetical by team ID" after the
    fix, one of them justifying a helper by contrast with a guess that no longer existed.

Related: [[feedback_derive_from_the_quantity_the_reader_validates]],
[[feedback_an_ac_can_launder_an_ungroomed_commit_into_a_decision]],
[[feedback_guard_the_wire_not_just_the_helper]] (the coverage half of the SST-1220 case — a
delegate can be thoroughly tested while the wire carrying its answer is naked; severing both
badge call sites left 154 files / 1920 tests green),
[[feedback_a_doc_saying_code_was_deleted_is_not_evidence]],
[[feedback_survivorpulse_verify_a_deferral_reason]].
