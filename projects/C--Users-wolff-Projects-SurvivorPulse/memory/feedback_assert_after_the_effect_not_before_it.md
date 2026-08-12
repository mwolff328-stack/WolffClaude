---
name: feedback_assert_after_the_effect_not_before_it
description: A guard for a post-auth effect passes with the fix reverted if it asserts before auth resolves — prime the query cache to make the state deterministic.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2993dd74-1b19-4302-9b8a-6bd5b31d6e47
  modified: 2026-08-12T16:26:08.501Z
---

`useAuth` on this codebase is a `useQuery` on `/api/me`, so **`userId` is null
on first render, always**. Any behaviour seeded by an effect keyed on `userId`
therefore has a window where it has not happened yet. A test that renders and
immediately asserts the POST-effect state is racing that window.

SST-1333 measured it: a guard asserting "the strategy chooser survives an
unresolvable stored archetype" came back **green with BOTH fixes deliberately
reverted**, because at the moment it looked, the seed had not been applied and
the page had not yet blanked. It looked like a passing guard and was a
tripwire that could not fire.

**Why:** the usual `await waitFor(...)` does not save you here — `waitFor`
retries until the assertion SUCCEEDS, so an assertion that is true early
(before the bad state arrives) resolves instantly and never sees it. This is
the inverse of a flaky test: it is deterministically, wrongly green.

**How to apply:** when a test must observe a state that only exists after the
auth effect has run, make auth resolve on the first render —
`queryClient.setQueryData(["/api/me"], user)` before `render`. Do this ONLY in
those tests: late-resolving auth is the real ordering and is the entire reason
the seed is an effect rather than a `useState` initializer, so the other tests
must keep exercising it (a primed cache would let the broken initializer
version pass too). And whichever you choose, prove it: revert the fix and
confirm the test actually goes red. Related:
[[feedback_tests_that_pass_by_winning_an_animation_race]],
[[project_survivorpulse_per_user_client_persistence_late_auth_trap]],
[[feedback_proving_a_test_is_load_bearing]].
