---
name: feedback_paired_assertions_both_vacuous_when_op_never_ran
description: A clear-assertion and a preserve-assertion in one fixture are BOTH vacuous if the operation never ran; assert the run acted on the subject first.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e53b932a-3452-4de8-957d-39883a73b9fc
  modified: 2026-08-19T22:34:53.697Z
---

A "does X, but not to Y" test pair looks like a strong rule-7 fixture — it can fail in
both directions, so neither "do nothing" nor "do everything" passes. That reasoning is
wrong when both assertions sit behind the same precondition: **the operation actually
running on that subject at all.**

Measured, SurvivorPulse Game Plan clear-first (2026-08-19). One integration test asserted
a stale Proposed pick was CLEARED; its sibling asserted a manually-locked one SURVIVED.
CI: the clear test failed, the preserve test passed. That reads like "the clear half is
broken, the preserve half works" — and it is not what happened. If the Apply run produced
no candidates for that entry, the per-entry loop body never executed, so the clear never
ran, so the stale row survived **and** the locked row survived. Both observations are
exactly what a no-op produces. The passing test proved nothing; it was the same no-op
wearing a green hat.

**Why:** a preserve-assertion is satisfied by inaction. Pairing it with a clear-assertion
feels like it closes that hole, but inaction fails only the clear half, and a reader then
misdiagnoses a fixture void as a one-sided code defect.

**How to apply:** before either assertion, assert the precondition that the operation
acted on this subject — for an HTTP write path, that the response's per-item outcomes
contain an entry for this exact id, not merely that the status was 2xx. A brand-new
fixture pool/entry with sparsely-seeded prerequisite data (odds, spreads, schedule) is the
common way to accidentally produce zero candidates. Generalizes past clear/preserve to any
must-do/must-not pair: filter in/out, write/skip, enable/disable.

Related: [[feedback_proving_a_test_is_load_bearing]], [[feedback_guard_the_wire_not_just_the_helper]],
[[project_survivorpulse_sandbox_has_no_local_postgres]] — the last one is why this could
only be discovered in CI, which is precisely why a CI-only test must be seen green before
any Done claim rather than assumed.
