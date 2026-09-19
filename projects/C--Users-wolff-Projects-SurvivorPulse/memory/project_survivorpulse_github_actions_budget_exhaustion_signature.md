---
name: survivorpulse-github-actions-budget-exhaustion-signature
description: "How to tell GitHub Actions budget exhaustion (every workflow red in 3-6s, zero steps) from real test failures, what it blocks, and how to re-gate afterward"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4ab27021-5588-4f49-83f8-6949d85566fc
  modified: 2026-09-19T16:42:20.181Z
---

On 2026-09-19 at ~13:37Z every workflow that needs a GitHub runner started dying in 3-6 seconds. It looks exactly like "all CI is red" but it is NOT a code problem; nothing to debug in the repo.

**Signature:** `gh run view <id> --json jobs` shows job durations of 2-5s with zero recorded steps; `gh run view <id> --log` says "log not found". The real message is only in the check-run annotation: `MSYS_NO_PATHCONV=1 gh api repos/mwolff328-stack/SurvivorPulse/check-runs/<jobDatabaseId>/annotations` -> "The job was not started because an Actions budget is preventing further use." (Drop the leading slash or set MSYS_NO_PATHCONV, or Git Bash rewrites the endpoint into a filesystem path.)

**Why it matters:** the Pre-Publish Gate is the only automated run of the real test suite (`npm run check` is typecheck + guardrails only), so with the budget out, every commit pushed after the block is unverified by CI. Replit Sync (SSH `git reset --hard` into the Replit checkout) also stops, so the Replit dev app/checkout freezes at the last successful sync. Jobs that had already started keep running (the 1176bb5f gate ran its full 45 min). Scheduled refreshes that started before the block still ran; distinguish a real failure by checking whether the job has steps.

**Cause (inference):** 9/19 alone had ~13 full gate runs (~518 min) plus ~18 Playwright runs (6 shards each). Only the founder can raise the budget (GitHub > Settings > Billing and licensing > Budgets and alerts); the gh token lacks the `user` scope, so billing numbers are unreadable from here.

**How to apply:** when a window's CI is red, check run duration and annotations BEFORE diagnosing tests. Find the last run that was `completed` with a real duration; that commit is the last CI-cleared point, and everything after it is "never in CI". `pre-publish.yml` and `playwright-ci.yml` both accept `workflow_dispatch`, so once the budget is restored re-gate the tip with `gh workflow run pre-publish.yml --ref 2026-v1` (replit-sync.yml is push-only). Related: [[survivorpulse-prepublish-gate-mechanism]].
