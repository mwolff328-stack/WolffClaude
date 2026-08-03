---
name: feedback_delegating_is_not_agreeing
description: "Two fixes each delegated to a shared helper to avoid a second implementation, and both shipped wrong because the helper's RULE disagreed with the reference — 'X is the same as Y by construction' is a claim to execute, not to write in a comment."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9f96b9bf-c0c8-4934-ad0f-37f361c6bb56
  modified: 2026-08-03T04:28:42.690Z
---

Routing a consumer through a shared helper removes the *duplicate implementation*.
It does **not** make the helper's answer the right one. If the helper's rule differs
from the quantity you actually needed, delegation propagates the wrong answer
faster and with more confidence than a local copy would have.

SST-1220 (2026-08-01). SurvivorPulse had **three** tie-break rules for "which team
does a tied recommendation resolve to":

| where | rule |
|---|---|
| `resolveSingleTeamForSimulation` (greedyPath) | `[...candidates].sort()[0]` — ALPHABETICAL |
| `resolvePlannedTeamsForWeek` (gameplanApplyService) | `candidates.find(not-already-used)` — engine order ← **what Apply WRITES** |
| greedyPath's internal `usedTeams` | the walk-chosen team |

SST-1192 (the claim map) and SST-1194 (the REC badge) each repointed a consumer at
the **alphabetical** one, both citing "one comparator" as the reason to delegate
rather than tie-break locally. Both were right to delegate. Both picked the wrong
delegate, and each wrote a variant of *"so they are the same team by construction"*
into a doc comment. Neither had ever called both functions on one input.

Two lines of throwaway code would have shown it:
`resolveSingleTeamForSimulation({kind:'tied', candidates:['LAR','LAC']})` → `LAC`,
while `resolvePlannedTeamsForWeek(same)` → `LAR`. On the SST-1194 fixture, no less.

Live consequences, both in production: the claim map withheld a team nobody took, so
a second entry was planned onto the team Apply really writes and **one pool was
written the same team twice in one week**; and the REC badge pointed at a team Apply
would not write. Exposure was roughly half of two-way ties — the half where
alphabetical order and candidate order disagree.

**Why it survived review.** The reported instance was `LAC`/`LAR`, where the two
rules happen to agree. Everything looked fixed. And the shipped test asserted
`.toBe('LAC')` — a literal that re-encoded the alphabetical rule — under the name
*"names the SAME team the writer picks"*.

## How to apply

- **"A is the same as B by construction" is an assertion to execute, not to
  document.** Call both on one input, print both, and diff — before writing the
  comment, and again as a test that compares the two functions' outputs rather than
  either against a literal. A literal can only confirm what you already believed.
- **Choose the delegate by naming the reference quantity first.** Here it was "the
  team Apply writes" — both bug tickets said so explicitly and neither checked which
  function computed it. Read the reference implementation, don't infer it from a
  helper's name. `resolveSingleTeamForSimulation`'s own doc even disclaimed the
  interactive path while two interactive surfaces called it; the codebase asserted
  both and nobody reconciled it.
- **When two fixes both delegate and both are still wrong, fix the HELPER'S RULE, not
  the call sites.** One-line change, corrects every consumer at once, edits no call
  site — which also meant zero collision with a concurrent session that had all the
  call-site files claimed. Repointing each consumer would have been more churn and
  would have left the fourth consumer wrong.
- **Pick a fixture where the candidate rules disagree.** A pair whose orderings
  coincide passes under the broken and the fixed implementation alike — see
  [[feedback_proving_a_test_is_load_bearing]]. The SST-1192 test used `ZZ_TIE_A`
  before `ZZ_TIE_B` and stayed green straight through the defect it was named for.
  Both repaired fixtures now `throw` at module load if the pair is ever re-sorted.
- **A doc comment asserting an equivalence ages into a false claim** the moment
  either side moves, and it reads as verified. After changing a shared rule, grep the
  codebase for prose describing the OLD rule — three comments here still said
  "alphabetical by team ID" and one justified a helper by contrast with a guess that
  no longer existed. See [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]].

Related: [[feedback_guard_the_wire_not_just_the_helper]] (the coverage half — a
delegate can be thoroughly tested while the wire carrying its answer is naked;
severing both badge call sites left 154 files / 1920 tests green),
[[feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect]] (this defect
entered through exactly that door — both tickets' Proposed resolution named the
wrong function as the writer's), and the project skill
`.claude/skills/learned/survivorpulse-tests-that-encode-bugs.md` (not a personal memory).
