---
name: feedback_removal_tests_need_the_most_rendered_state
description: A "this is gone" test is vacuous unless the fixture forces the target into the state where it would actually be VISIBLE — a component's loading/error branch can satisfy the absence assertion while the thing still exists.
metadata:
  type: feedback
---

When testing that something was REMOVED, the absence assertion must be proven
RED against the target in its **most-rendered state**, not its default one.

**SST-1450 (2026-08-24).** TC1 asserted the Admin Hub renders no "Spec
Mismatches" card. Rendered with no `fetch` mock, the component took its own
`isLoading` branch and rendered *"Scanning for spec mismatches…"* — which does
**not** contain the string `"Spec Mismatches"`. So the test would have PASSED
against the fully-present, un-removed component. It only became capable of
failing once the fixture supplied a **loaded payload** (`currentCount: 1`,
`lastRecordedCount: 1`) that drove the component into its full card branch with
heading, badge and Record button.

**Why:** Rule 7 says the fixture must be able to violate the requirement. For a
removal, the violating world is "the thing is there AND showing" — and most
components have at least one branch (`isLoading`, `if (error) return null`,
empty state) that renders nothing recognisable. Default-render a component in a
test and you frequently get that branch, which reads exactly like successful
deletion.

**How to apply:**
- Before trusting a removal test, ask: *which branch does this render under my
  fixture?* If it's the loading/empty/error branch, the assertion is vacuous.
- Drive it to the loud state first, then assert absence.
- Watch for a paired trap: a sibling assertion that ALSO can't distinguish. In
  SST-1450 a second AC (remove the spacing wrapper too) needed its own test,
  because the "no card" assertion passed identically whether the now-empty
  wrapper survived or not. Its RED proof had to be taken against the **naive
  implementation** (child deleted, wrapper kept), NOT against pre-change HEAD —
  at HEAD the wrapper was non-empty, so a revert there went red for the wrong
  reason. Reverting to the closest WRONG implementation is the point.

Related: [[feedback_proving_a_test_is_load_bearing]],
[[feedback_paired_assertions_both_vacuous_when_op_never_ran]],
[[feedback_assert_after_the_effect_not_before_it]].
