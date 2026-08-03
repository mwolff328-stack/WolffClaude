---
name: feedback-survivorpulse-autocommit
description: "SurvivorPulse: auto-commit and push to 2026-v1 immediately after finishing a story/slice, without asking first"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5efb5a9e-3b59-434e-abc0-674539708ef8
---

After implementation on a SurvivorPulse story/slice is complete and verified (tests/typecheck green, live smoke done), commit and push to `2026-v1` immediately — do not stop and ask whether to commit.

**Why:** `SurvivorPulse/CLAUDE.md`'s "Autonomous Operation" section already pre-approves `git` (any subcommand) and lists "push the 2026-v1 branch to remote" as a required post-implementation step, specifically so the founder doesn't have to ask. Founder confirmed this explicitly on 2026-07-04 after I left a completed, verified change (SST-714, My Pools card/table polish) sitting uncommitted and asked first — a real instance of not following the documented instruction.

**How to apply:** Once a slice's tests/typecheck pass and (for UI work) the live dev-server smoke check is done, run `git add` on the specific changed files (never `-A`/`.`), commit with a conventional message referencing the SST story ID, and `git push origin 2026-v1` — all in the same turn, without a check-in question. Only pause for confirmation on genuinely destructive/ambiguous git operations (force-push, reset --hard, rewriting history), consistent with the global git-safety rules — a normal forward commit+push on a feature branch is not one of those. Update the Notion story with the resulting commit hash after pushing. See [[project_survivorpulse_local_verification]] for the verification steps that should precede the commit.
