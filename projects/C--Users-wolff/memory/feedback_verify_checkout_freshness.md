---
name: feedback-verify-checkout-freshness
description: "Before claiming you \"code-verified\" a bug/report against a repo, confirm the checkout isn't stale (git log HEAD..origin/<branch> empty); a stale local checkout produced two bogus SurvivorPulse tickets"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6cbdf628-09f0-4c0c-8f96-0d889cb41d4d
---

Before asserting a claim is "code-verified" against a repo, verify the working copy is current with the remote: run `git status` + `git log --oneline HEAD..origin/<branch>` (and check `git worktree list` — SurvivorPulse has ~15 worktrees, easy to read the wrong one). If HEAD is behind, the code you read may already be fixed/changed. Say "verified against <sha>, N behind origin" or sync first — never report stale-checkout reads as confirmed.

**Why:** On 2026-07-17 I filed two SST bugs (SST-879, SST-880) off Vlad's live smoke and reported both as "code-verified this session." The checkout was **17 commits behind origin/2026-v1**. Both were already resolved on origin: SST-880's leak was fixed by `c4b6d348` (with the exact regression tests I said were missing), and SST-879's symptom had become a deliberate board decision (SST-881). Both tickets were cancelled. I then compounded it by proposing a "gate-hardening" fix for SST-880 without reading current code — the fix would have blanked Game Plan's indicator and regressed SST-881. The live smoke was sound; my verification of it wasn't.

**How to apply:** This is the git analog of the documented wrong-host DB trap (see [[project_survivorpulse_visual_verification]] / CLAUDE.md: "never declare a dev-app blocker from a locally-run SQL check alone"). Same failure family: reasoning from a stale/wrong source and reporting it as ground truth. For code: (1) fetch + check behind-count before any "I verified X in the code" claim; (2) for bug triage specifically, a live-smoke finding can be real while the current code already fixes it — reconcile the report against `origin/<branch>` HEAD, not your local tree; (3) when in doubt, do the read in a fresh worktree off `origin/<branch>`. Related: [[feedback_survivorpulse_parallel_agents_worktree]], [[project_survivorpulse_repo_path]].
