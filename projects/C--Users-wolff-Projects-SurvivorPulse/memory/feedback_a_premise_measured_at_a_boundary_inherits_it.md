---
name: feedback_a_premise_measured_at_a_boundary_inherits_it
description: "A premise verified at ONE point in a domain is not a premise about the domain — a directional filter measured at week 1 became an unqualified 'not the cause' in a ticket and a founder ruling, and was false from week 2"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: baf43b4f-7640-44ba-b0ec-419991174241
  modified: 2026-08-03T04:28:38.159Z
---

**A claim measured at a boundary value silently inherits that boundary as an unstated
precondition.** Measured 2026-08-02 on SST-1188.

SST-1188's ticket and its founder ruling both stated, unqualified:

> "Field% masking itself was confirmed **correctly directional**
> (`poolPicksEstimationService.ts:148`) and **is not the cause** — do not 'fix' that."

Both halves are in the same sentence, and the first proves the second is scoped. The filter is
`pick.week < week` — **directional**, so the masked set is empty in week 1 and non-empty from
week 2. It was measured at week 1, because that is where SST-1176's CI fixture sits. "Not the
cause" was true there and false everywhere else. A second entry-dependence channel was live the
whole time, reaching the adapter through the `estimatedPicks` **parameter** rather than the
`entryId` one that had been fixed.

Cost: the fix shipped with a header comment claiming full entry-invariance and per-(pool, week)
cacheability. Both were wrong. Caught by an independent code reviewer during In Review, verified
firsthand, corrected before Done rather than after — but the *ticket* had carried the false
premise since it was written, and the founder ruling repeated it.

**Why:** the same shape as SST-1212's false premise, which also originated in a confident claim
about code and propagated ticket → ruling → build before anyone re-derived it. A measurement is
evidence about the conditions it ran under. Writing it down strips the conditions.

**How to apply:**

- **When a claim rests on a word like *directional*, *ordered*, *incremental*, *prior*, or
  *first*, that word names a range. Restate the claim at BOTH ends before recording it.**
  "Directional, therefore inert" is only ever "inert on one side."
- **Ask what the fixture's coordinates were.** A conclusion drawn from a fixture pinned to a
  boundary — week 1, empty set, first element, single row, zero prior state — is a conclusion
  about that boundary. Week 1 is where "has prior picks" is definitionally false.
- A premise arriving pre-blessed by a founder ruling gets *more* scrutiny, not less: the ruling
  inherited it from the ticket, which inherited it from a measurement nobody re-ran.
- When correcting it, fix the CLAIM as well as the code. A comment that overstates what the fix
  achieves is the same defect one layer up, and it is what the next reader will trust.
- If the residual can't be fixed (here the ruling said "do not fix that"), **pin it with an
  explicitly LABELLED characterization test and say so in the header** — this behaviour's
  previous known-gap marker was unlabelled and mechanism-named, and got read as a spec.

Related: [[feedback_verify_a_reviewers_evidence_not_their_judgement]],
[[feedback_survivorpulse_verify_a_deferral_reason]],
[[feedback_a_doc_saying_code_was_deleted_is_not_evidence]],
[[feedback_a_value_in_output_is_not_a_constant]].
