---
name: project_survivorpulse_bystander_rule_broke_two_distinctness_tests
description: "0fe9aadb's CLAIMED bystander rule — not the 4a3c86c0 claim-ledger refactor — is why gameplanApply SST-1249 and cockpit SST-788 assert two same-pool entries got the same team; one fails ~50% on a randomUUID coin flip, the other 100%."
metadata:
  type: project
---

Two Stage-2a integration failures that look unrelated (`expected 'DET' not to be 'DET'` in `tests/gameplanApply.integration.test.ts`, `expected 'LV' not to be 'LV'` in `tests/strategyRecommendation.cockpit.sst788.integration.test.ts`) are **one root cause**, and it is NOT the `4a3c86c0` claim-ledger refactor that a diff-and-import-graph reading fingers.

**Cause: `0fe9aadb` "fix(core): CLAIMED only from in-scope entries…" (2026-08-26 05:48 -0700)**, which added `participatesInClaims()` to `shared/strategyEngine/cockpitEntryPlans.ts`. An entry now claims a team for week W only if it is an Apply write target for W **or** holds a strategy-written (`archetype != null`) `proposed_picks` row for W. Everything else is a **bystander** and reserves nothing. Both tests were written against the pre-contract "every alive entry claims" behaviour and neither was updated.

Bisect is exact: last green `ce1f40f2`, first red `0fe9aadb`; the only other commit in the window is a docs commit.

**Why one is 100% and the other ~50%** — worth knowing, because the intermittent one is what makes this look like a regression from whatever landed most recently:
- **SST-788 (deterministic).** Pure `GET /api/me/strategy/cockpit`, so no write targets, and the file contains **zero** `proposedPicks` references. Both entries are bystanders, neither claims, both take LV. Fails every run.
- **SST-1249 (coin flip).** Fixture does `[eX.id, eY.id].sort((a,b) => a.localeCompare(b))` on two `randomUUID()` ids to pick which sibling is "unlisted". eX ran a baseline Apply (so it holds a proposed row); eY never did. The baseline cleanup is `db.delete(picks)` — the **wrong table**, since SST-1284 made `proposed_picks` Apply's default write target, so it deletes zero rows and eX keeps its row. Result: eX-sorts-first → unlisted sibling eX claims → PASS; eX-sorts-second → unlisted sibling eY is a bystander → FAIL. Measured 'DET' red in 6 of 8 runs, consistent with 50/50.

The test's own comment ("Ranking is entry-agnostic … equally valid for whichever sibling is processed FIRST") is the wrong premise under this contract: the siblings are **not** interchangeable, because only one of them has a persisted proposed row and `participatesInClaims` gates on exactly that.

Fixing them means deciding whether SST-1249's requirement survived the 2026-08-25 contract at all (an unlisted sibling now counts only if it holds a strategy-written proposed row), then making the fixture *state* that precondition instead of inheriting it from a UUID sort. Do not chase the most recent commit. See [[feedback_a_premise_measured_at_a_boundary_inherits_it]] and [[project_survivorpulse_three_claim_signals]].
