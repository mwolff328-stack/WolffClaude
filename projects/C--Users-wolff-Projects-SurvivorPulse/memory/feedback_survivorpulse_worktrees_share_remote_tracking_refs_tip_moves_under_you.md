---
name: survivorpulse-worktrees-share-remote-tracking-refs-tip-moves-under-you
description: "Concurrent sessions' fetches move your origin/2026-v1 without you fetching; re-fetch and recompute the commit range right before ff-merge and again before filing a SHIP verdict"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 1fbcec2e-344d-446b-a996-70f273a13d2c
  modified: 2026-10-02T12:07:17.534Z
---

Git worktrees share one `.git`, so remote-tracking refs (`origin/2026-v1`) are shared too. Another concurrent Claude session's `git fetch` advances your `origin/2026-v1` with no action from you.

**Why:** 2026-10-01, ship-aggregator cycle for REL-59. My first `git fetch` + `git log 1323965b..origin/2026-v1` showed 17 commits (tip c15119fe). A few minutes later `git merge --ff-only origin/2026-v1` (no new fetch by me) fast-forwarded to ea303ed8, 37 commits, with four extra tickets I had not audited. The tip then moved twice more before filing. Filing on the first range would have cleared code I never read.

**How to apply:** In every ship-aggregator cycle, re-run `git fetch origin 2026-v1` and recompute `git log --reverse <baseline>..origin/2026-v1` immediately before the fast-forward AND again right before filing the Releases record; name the exact tip the verdict clears in the record, and treat anything that lands after it as unaudited. Related: [[ship-aggregator-worktree-must-be-fast-forwarded-before-local-checks]].
