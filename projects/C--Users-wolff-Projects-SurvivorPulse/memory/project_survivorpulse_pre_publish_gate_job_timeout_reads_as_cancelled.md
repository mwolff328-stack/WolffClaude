---
name: survivorpulse-pre-publish-gate-job-timeout-reads-as-cancelled
description: "The Pre-Publish Gate hit its 45-min job timeout on 2026-09-19 and concluded \"cancelled\" (not failure); how to tell it from a superseded run, and the 60-min bump"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4ab27021-5588-4f49-83f8-6949d85566fc
  modified: 2026-09-19T19:01:58.211Z
---

On 2026-09-19 the Pre-Publish Gate on 7d5d3293 concluded **`cancelled`** with no code failure: the job hit `timeout-minutes: 45` and was killed 26 s into Stage 2c. Stages 1, 2a, 2b had passed; Stage 2c, 3 and 4a-c never ran, so it proves nothing about them.

**How to tell a timeout from a superseded/cancelled-by-concurrency run:** `gh run view <id> --json jobs` shows a job that actually STARTED and ran ~45 min (a superseded run has an empty jobs array and never starts). The check-run annotation says "The job has exceeded the maximum execution time of 45m0s" + "The operation was canceled." (`MSYS_NO_PATHCONV=1 gh api repos/mwolff328-stack/SurvivorPulse/check-runs/<jobId>/annotations`). This is a different failure mode from the one the CI Cancellation Sweep (SST-1569) watches for.

**Why it happens:** Stage 1 runs the 8 unit shards back to back (`for SHARD in $(seq 1 8)`, ~5 min each, for a memory budget) and alone takes ~39 min. Job durations on 9/19: 48117f95 = 40.7 min, 1176bb5f = 44.7 min (green, 16 s margin), 7d5d3293 = over 45. The suite grows with every commit. The 45 limit had been unchanged since the workflow was created (2026-03-20).

**Fix landed:** commit a740060e raised it to 60 (workflow-only, +4/-1), filed retroactively as SST-1692. A structural fix (parallel shard matrix) was NOT done; if the gate approaches 60 min again, that is the real fix, not another bump.

**How to apply:** when a gate is `cancelled`, check whether its job ran to ~the timeout before treating it as a push-burst supersede. Timeouts are not pass evidence. Also: a push under the OLD workflow file keeps the old limit, and only one push-gate runs per concurrency group (one running + one pending), so a doomed old-limit run can block the run that has the fix; cancelling the doomed run (its commit is contained in the newer tip) frees the queue. Related: [[survivorpulse-github-actions-budget-exhaustion-signature]], [[survivorpulse-prepublish-gate-mechanism]].
