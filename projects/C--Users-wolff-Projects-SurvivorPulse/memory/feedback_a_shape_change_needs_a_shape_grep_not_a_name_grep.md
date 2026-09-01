---
name: feedback_a_shape_change_needs_a_shape_grep_not_a_name_grep
description: When a request/response shape changes, coupled tests come in two forms and only one is findable by grep.
metadata:
  type: feedback
---

When you change a request/response SHAPE, grep for assertions on the **shape** —
field names in the payload and in the error body — not for the component's name
or its test ids.

**Why:** SST-1502 reduced the signup payload and broke six test files in two
distinct ways.

1. **Coupled by test id / import** (5 files). Greppable — but sweep the WHOLE
   repo. Mine searched `tests/` and `e2e/` and missed
   `client/src/components/legal/__tests__/signup.legalModals.test.tsx`.
2. **Coupled by schema shape** (1 file). `tests/signup-edge-cases.integration.test.ts`
   asserted `errors.username` is defined for an empty body. It imports nothing
   from the page and uses no test ids. **No string tied to the change could
   find it.** It was also `describe.skip` locally and `"1"` in CI — skipped
   everywhere observable, executed only where it wasn't.

**How to apply:** for form 2, searching cannot substitute for executing — run the
env-gated suites (see [[project_survivorpulse_env_gated_suites_are_invisible_locally]]).
And when a gate goes red on what looks like a stale assertion, verify the
alternative: "the test is stale" and "the validation regressed" are
indistinguishable from the failure output. Pin the contract with a local guard
that you RED-prove, rather than reasoning that the test was merely out of date.
