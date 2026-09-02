---
name: feedback_findings_inside_just_closed_classes_mean_wrong_instrument
description: When each review round's new findings land inside the class the previous round just closed, and the discovery rate is not falling, the instrument is wrong — stop hardening and change approach.
metadata:
  type: feedback
---

Four review rounds on one source-text guard (SST-1509's
`tests/stage2cFileListSync.tripwire.test.ts`). Every fix was individually correct and
mutation-proved. Every round still found a new hole **one layer down inside the class just
closed**:

- R2 fixed entry *shape* (comments, quote style) →
- R3 found block *extent* (a `]` inside a comment truncated the block — and the R2 cross-check
  ran downstream of that corruption, so the check added to catch partial under-scans was blind
  to this one) →
- R4 found *string* vs comment (a `]` inside a string still truncates), plus path-shape variants
  invisible to both scans.

**Why:** the tell is not "review found bugs" — that is review working. The tell is that the
**discovery rate is flat and each finding sits inside the previous fix's class**. That is the
signature of a wrong instrument, not of insufficient care. Here the structural reason was
diagnosable: the guard's "throw on anything you don't understand" net was built from a loose
regex that **shared a character class** with the strict matchers it checked, so it could only
ever catch quoting variants. *A net cannot be more permissive than the thing it nets.*

**How to apply:** after the second round of the same shape, stop patching and ask what would make
the failure mode impossible rather than caught. Usually: replace parsing with identity. Here the
answer was a committed manifest the config imports and the workflow reads — one list instead of
two, no parse, no fail-open. Ship the improved-but-unsound version if it is strictly better than
nothing, but **document it as unsound and file the real fix**; do not let a green tripwire imply
a closed class. Related: [[feedback_survivorpulse_source_text_guards_fooled_by_text]],
[[feedback_source_scanning_guards_need_three_meta_tests]],
[[feedback_guard_the_wire_not_just_the_helper]].
