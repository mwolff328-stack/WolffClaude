---
name: feedback_mutation_harness_edits_the_first_match_not_yours
description: "A mutation harness that replaces the FIRST occurrence in a large shared file mutates a neighbour's code, not yours, and reports your tests as weak when they are fine. Scope every mutation to your own block."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5d7806f4-5094-4b99-9541-24dcb5291fdd
  modified: 2026-09-02T14:22:25.937Z
---

Proving a test is load-bearing means mutating the implementation and watching it go red. In a
large shared file that step can silently grade **someone else's code**.

Measured on SST-1517 (2026-09-02). A wire-mutation run over `server/routes.ts` reported the single
most important mutation as **SURVIVING**: keying the rate limiter on `req.ip` instead of
`X-Forwarded-For`, which is the exact SST-1501 production defect the test file existed to guard.
Two mutations "survived" and both readings were false. The harness used
`s.replace(old, new, 1)` — first occurrence. `routes.ts` holds **three** copies of the XFF anchor
and **302** copies of `return res.status(400).json({`. The edit landed on SST-1501's route, ~77
lines above mine. My handler was never touched, so of course my tests stayed green.

Scoping the same mutations to my own handler killed all five, `req.ip` taking 3 tests with it.

**Why:** the failure is invisible and reads as a real result. An anchor-not-found assert does not
fire, because the anchor genuinely exists — elsewhere. The output looks exactly like a weak test
suite, and the honest response to a weak test suite is to go write more tests, so the error costs
real time and can talk you into "my tests do not cover this" when they do. It also fails the other
way: if you conclude the code is fine because a mutation "was killed", the kill may belong to a
neighbour's tests catching a neighbour's mutation.

**How to apply:** slice the file to your own block before replacing, and assert the anchor is
inside that slice:

```python
i = s.index("GET /api/public/back-test-lite")   # a marker unique to MY code
j = s.index("// API Defense-in-Depth", i)        # the next thing after it
block = s[i:j]
assert old in block, "ANCHOR NOT IN MY BLOCK"
s = s[:i] + block.replace(old, new, 1) + s[j:]
```

Then: `grep -c` the anchor across the whole file FIRST. More than one occurrence means a bare
`replace(..., 1)` is unsafe. And after every mutation run, restore from a backup and print a
one-line invariant proving the restore happened — a mutation run that times out mid-flight (this
one did) otherwise leaves the file mutated, and the next command silently tests broken code.

Same underlying discipline as [[feedback_verify_a_reviewers_evidence_not_their_judgement]] and
[[feedback_a_harness_disagreement_is_evidence_about_the_harness]], applied to a harness you wrote
yourself: **a surprising measurement is evidence about the instrument before it is evidence about
the code.** Relatedly [[feedback_proving_a_test_is_load_bearing]] and
[[project_survivorpulse_concurrent_session_git_discipline]] — in a repo where many sessions share
`server/routes.ts`, an unscoped edit is also a way to touch another session's work.
