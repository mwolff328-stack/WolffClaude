---
name: project_survivorpulse_no_branch_protection_ci_advisory_only
description: "SurvivorPulse's GitHub repo has no branch protection (private, non-Pro tier) — PR CI is advisory, not a merge gate; a red check does not block `gh pr merge`"
metadata: 
  node_type: memory
  type: project
  originSessionId: 37e1cee1-018e-4c70-ae1e-44cfdee4fea1
  modified: 2026-07-31T06:06:59.670Z
---

`gh api repos/mwolff328-stack/SurvivorPulse/branches/2026-v1/protection` returns 403
("Upgrade to GitHub Pro or make this repository public to enable this feature"). Confirmed
2026-07-31. So the only `pull_request`-triggered workflow (`playwright-ci.yml`, E2E only —
`pre-publish.yml` and `release-guardian.yml` are `workflow_dispatch` + `push: [main]` only, never
run on a PR) is **advisory**: `gh pr merge` succeeds regardless of a red check.

**Why this matters:** a red PR check here is not "don't merge" — it's "go verify whether this is
actually your regression before merging anyway." In one PR, across 5 pushes, CI never went fully
green; each failure was a *different* spec in a *different* shard each time (legal-pages sticky
header, an unrelated game-plan deep-link test, a `DrizzleQueryError` during shared test-DB setup)
— the signature of environmental flakiness under this repo's heavy concurrent-session CI load,
not a stable regression. Confirmed via server logs (no 401s on the routes actually changed) and
by reproducing the SAME failure byte-for-byte on a direct `workflow_dispatch` run against
`2026-v1` itself, with zero involvement from the branch in question.

**How to apply:**
- Before merging despite a red check, trace it: pull the failing job's server logs and confirm
  no request to the route(s) your diff touches actually 401/403'd or errored.
- Prove "pre-existing" don't assume it: find or trigger a direct run against the base branch and
  compare — [[feedback_proving_a_flake_fix_without_reproducing_it]] applies here too.
- If two+ different specs fail across consecutive pushes to the same PR with no common cause in
  your diff, that itself is evidence of shared-CI contention, not per-push regressions — see
  [[project_survivorpulse_e2e_ci_drift_traps]] (6 shards share one DB+user).
- Don't take "branch protection" for granted on any repo — check the API before assuming CI is a
  hard gate, especially on a private repo without a paid tier.
