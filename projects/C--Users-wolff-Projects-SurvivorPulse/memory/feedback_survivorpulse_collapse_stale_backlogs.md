---
name: feedback_survivorpulse_collapse_stale_backlogs
description: "When a groomed Notion backlog's premises have rotted, collapse it to one re-survey story rather than maintaining it — founder ruling 2026-07-28 on SE-90."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a0f669c5-8839-4128-919d-e03bd243fbf8
  modified: 2026-07-28T17:48:04.573Z
---

When a groomed epic's backlog no longer describes the codebase, **collapse it into one "re-survey then groom fresh" story** instead of re-baselining the individual stories. Founder ruling 2026-07-28 on epic SE-90 (DataTable rollout): "collapse the 11 into 1".

**Why:** a stale plan is worse than no plan. SE-90's "already migrated" list was verified FALSE on `2026-v1` — anyone trusting it would have skipped real work, and it did mislead me mid-session before I checked. Its ACs were written against a branch that was later deleted, so every story already needed a "re-ground against the current file" pass, which is most of the grooming cost. And the sequencing itself (5 waves) was the stale part: one wave's target was prod-gated off, another's blocker had been removed, another's scope had shrunk under later rulings.

**How to apply:** cancel the stale stories, but write the carry-forward context into the replacement rather than losing it — the measured residual (labeled explicitly as a starting point, *not* an inventory to trust), the permanent exclusions so they aren't re-litigated, and any hard-won "unblocked ≠ advisable" warnings. Comment each cancelled story with the successor link and its own specific reason. Close the epic Complete-superseded with the rationale, not silently. Add a survey-first AC so the next person can't inherit the same failure.

Related: [[feedback_survivorpulse_fetch_and_search_before_work]] (same root cause — acting on stale state), [[feedback_proving_a_test_is_load_bearing]] (verify the premise before trusting it).
