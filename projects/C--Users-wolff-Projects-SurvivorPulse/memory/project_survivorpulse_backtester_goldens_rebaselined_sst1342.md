---
name: survivorpulse-backtester-goldens-rebaselined-sst1342
description: "SST-1342 shifted historical Back Tester output on exact-tie weeks; the golden season numbers no longer match upstream or Stan's ground-truth report, and regenerating from those sources reintroduces the bug."
metadata: 
  node_type: memory
  type: project
  originSessionId: 1ee44824-32d5-4eaf-9447-3bab16d32bff
  modified: 2026-08-17T05:18:59.685Z
---

**SST-1342 (2026-08-16) re-baselined the Back Tester's golden season numbers.** Before it,
the client engine (`client/src/backtester/lib/assignIndependentPicks.ts`) resolved an exact
score tie by array insertion order, while the server sweep used the product's shared rule
(`shared/strategyEngine/tieBreak.ts`, alphabetical). Aligning the client moved real output.

Five of the 95 executed assertions in
`client/src/backtester/__tests__/verification.test.ts` changed, in **both** directions:

| run | was | now |
|---|---|---|
| 2021 pureWP | 21 | 23 |
| 2022 pureWP | 8 | 6 |
| 2023 buyback coordDiv Skip 1 | 37 | 34 |
| 2023 buyback pureWP | 23 | 22 |
| 2023 buyback SP EV | 9 | **17** |

**Why:** not a scoring change. A team taken on a tied week is spent for the rest of the
season, so one tied week re-shapes every week after it — which is why a single tie can move
a season total by several entry-weeks and why the direction isn't uniform. SP EV moves most
because its composite collapses to identical scores far more readily than a win-probability
blend. That 90 of 95 assertions did NOT move is the evidence the change is confined to
exact ties rather than being a general re-scoring.

**How to apply:**

- **These numbers deliberately no longer match the upstream `SurvivorPulse-BackTesting-Prototype`
  repo or Stan's original ground-truth report.** Both were captured against the insertion-order
  engine. `scripts/run_ground_truth_full.ts` from that repo will REINTRODUCE the divergence —
  regenerate only from this engine. The file header says so; believe it over the older sibling.
- **Any backtesting figure sourced before 2026-08-16 needs re-deriving before it goes public.**
  This matters specifically because the planned content series is built on backtesting
  methodology and "hold us to this" credibility — a published number that no longer reproduces
  is the exact failure that premise cannot survive.
- The Back Tester itself stays admin-gated (`client/src/lib/backTesterVisibility.ts`,
  `isBackTesterEnabled` returns `isAdmin`) per the founder decision of 2026-08-16. SST-1342 did
  not touch that, and correctness work on this surface should not be read as a step toward
  un-hiding it.

Related: [[feedback_guard_the_wire_not_just_the_helper]],
[[feedback_proving_a_test_is_load_bearing]].
