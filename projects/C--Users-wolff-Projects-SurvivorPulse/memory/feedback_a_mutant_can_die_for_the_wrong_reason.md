---
name: a-mutant-can-die-for-the-wrong-reason
description: "A mutant that goes red may be dying incidentally, hiding a live fail-open — check WHICH assertion failed, and mind duplicate-direction and nested-block placement."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 06821680-7ad9-4262-868e-6d40482d3cdc
  modified: 2026-09-06T20:38:18.817Z
---

A red mutant is not proof the guard works. It can die for a reason unrelated to
the hole you meant to exercise, and that reads exactly like a caught mutant.
Both of these produced a wrong "guard is fine" conclusion on SST-1556, on
mutants a reviewer had already demonstrated as 126/126 green:

- **Duplicate-declaration mutants: direction matters.** The defective reader
  takes the FIRST match; the cascade applies the LAST. So the duplicate must go
  **after** the real declaration. Inserted before, the reader reads the wrong
  value and the assertion fails — but on the reader's own arithmetic, not on
  the defect.
- **Nested-block mutants: placement matters.** `[^}]*` truncates at the first
  `}`, so a nested block anywhere but **last** in the rule truncates the real
  declarations away and trips some unrelated guard. Appended last, every real
  declaration still precedes the truncation point and only the intended hole is
  exercised.

**Why:** both failures look identical to success in a `Tests N failed` summary.
Only the failing assertion's identity distinguishes them.

**How to apply:** grep the run for the assertion location, not just the count —
`grep -E 'AssertionError|\.test\.tsx:[0-9]+:'`. Name the assertion you expect to
fail before running, and if a different one fires, the mutant is wrong, not the
guard. This is the same discipline as [[feedback_verify_a_reviewers_evidence_not_their_judgement]]
applied to your own evidence, and it is how a dominated assertion is detected
too — see [[feedback_paired_assertions_both_vacuous_when_op_never_ran]].
