---
name: feedback_verify_a_reviewers_evidence_not_their_judgement
description: "A review's central judgement and its supporting file list need separate verification — the scope call was right while 2 of 5 named files were wrong and one severity was overstated; a follow-on ticket silently inherits whatever you don't check"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4233dbd4-4c4f-4211-baa1-08c236605893
  modified: 2026-08-02T08:54:14.093Z
---

Measured on SST-1206, 2026-08-02. The business-acceptance review's central
finding — that the story closed *an instance* of the defect, not the class — was
correct, well-argued, and the most valuable thing either review round produced.
Its supporting evidence was not uniformly correct:

- One named bypass file contained **zero** writes of the field in question. False.
- Four server files it listed as writers were object-literal **reads** building a
  resolver input. False.
- The one genuine bypass was described as "silently reintroduces the SST-1193
  fabrication class." Measured: it hard-codes the NON-final tier, so it
  *under*-states finality rather than fabricating a closing line, and the existing
  guards correct it on the next write. Real, worth fixing, not a P1.

Accepting the judgement is not accepting the file list. The two travel together
in a review write-up and separate the moment you act on them.

**Why it matters more than a normal inaccuracy:** the natural response to a scope
finding is to file a follow-on ticket, and a follow-on ticket is a *durable*
artifact read by a session with none of this context. Whatever you paste into it
becomes that session's starting facts. An unverified file list doesn't just waste
their time — it gets triaged, prioritised, and possibly acted on.

**How to apply:**
- Re-derive a review's file list yourself before it enters a ticket. Greps are
  cheap; the check is minutes.
- Distinguish READS from WRITES explicitly. A bare grep for a field name returns
  both, and a reviewer skimming output will conflate them.
- Restate any severity claim with the actual mechanism substituted in. "Hard-codes
  a tier" is not "fabricates a closing line" — those differ in direction, and the
  direction decides the priority.
- Write an **"enumerated and REJECTED"** section into the follow-on ticket naming
  the candidates you ruled out and why. One paragraph stops the next session
  re-deriving the same false leads, and makes the list you *did* keep credible.

Same shape as [[feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect]]
and [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]]: a confident,
plausible statement from a trusted source, load-bearing, never checked.
