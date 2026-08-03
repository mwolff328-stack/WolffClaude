---
name: feedback_survivorpulse_hollow_fixtures
description: "The hollow-fixture test defect: a test whose FIXTURE makes its own requirement unviolatable. 'Assert at the DB' does NOT catch it. Correct check: does a world exist in this fixture where the requirement could be violated?"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8f10d85a-d2da-48f8-95e3-32dc4aa42a12
  modified: 2026-07-23T06:27:36.528Z
---

**The check is not "does this test assert the requirement" but "does a world exist in this FIXTURE where the requirement could be violated?"**

Felix's formulation, SST-961, 2026-07-23. It is strictly sharper than the rules already in `rules/common/testing.md` §"Tests Specify, They Don't Describe", and it catches a class those rules provably miss.

**Why the existing rules miss it.** §9 / testing.md rule 6 says "assert where the truth lives — query the DB, not the UI." In SST-961 the hollow-fixture defect appeared FOUR times and **every one of those assertions was already at the DB.** Asserting at the right layer is necessary and not remotely sufficient. The test can be well-named, well-layered, and DB-asserted, and still prove nothing, because the world it builds cannot contain the failure.

**The three costumes it wore in ONE story (SST-961):**
- A partial-failure test that mocked rejection on **every** call — so it only ever exercised FIRST-entry failure, the single case where no data is lost. The bug (entries 1 and 3 cleared, silently, while reporting total failure) needs a MIDDLE entry to fail.
- A permission probe pointed at an **empty pool** — nothing there to refuse, so a 403 and a 200 are indistinguishable.
- A season-filter fixture containing **one season** — nothing to filter out, so a broken filter and a working one produce identical rows.

Same disease as the tests-that-encode-bugs family, but the defect is in the FIXTURE, not the assertion. Reading the test does not reveal it; you have to ask what the fixture makes possible.

**How to apply:**
- For every must-NOT / branch / precedence test, name the world in which the requirement WOULD be violated, then confirm the fixture builds that world. If it can't, the test is decorative.
- Multi-item operations: the failing item must NOT be the first. First-item failure is the degenerate case.
- Authorization probes: the target must actually CONTAIN something to refuse.
- Filters/scoping: the fixture must contain at least one row the filter is supposed to EXCLUDE.
- Precedence rules ("if both A and B, show A"): the fixture must be both A and B. A fixture that is only A proves nothing.
- Boolean branches: build both. The branch a developer sees on their own test data is the one that gets built; the other is the one that ships broken (SST-960 TC-14, the `canEditPoolSettings` case).

**Status:** proposed as an Operating Model §9 amendment 2026-07-23, founder ruling pending — do not cite it as ratified until he approves.

Related: [[feedback_survivorpulse_smoke_over_mocks]], [[project_survivorpulse_beta_scope_and_rhythm]]
