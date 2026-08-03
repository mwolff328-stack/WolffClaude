---
name: feedback-survivorpulse-fetch-and-search-before-work
description: "Always `git fetch` and search Notion for an existing ticket BEFORE investigating or building — concurrent sessions work the same files."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4b29870c-a605-4bea-8ac2-889dfc4768e1
  modified: 2026-07-23T22:18:27.099Z
---

Before investigating a bug, filing a ticket, or writing code on SurvivorPulse: **`git fetch origin` and check how far behind the branch point is**, and **search the SP Stories & Tasks database for an existing ticket** on the defect.

**Why:** on 2026-07-23 a whole session's work was thrown away. A branch cut 13 commits behind `2026-v1` and never re-fetched meant two upstream commits were invisible the entire time: `4dd0bed2` (SST-992) had already fixed the exact stat-attribution bug that got re-filed as SST-1003, and `e7428df8` had already implemented most of SST-1000. Both upstream fixes were broader and better. PR #89 was closed unmerged and SST-1003 cancelled as a duplicate.

Multiple Claude sessions run against this repo concurrently, on the same files. Staleness is the default, not the exception.

**How to apply:**
1. `git fetch origin && git rev-list --left-right --count origin/2026-v1...HEAD` at the START of any task. If behind by more than a couple of commits, rebase or re-branch before doing anything else.
2. Before filing a bug, search Notion (`notion-search` against the SP Stories & Tasks data source) for the symptom AND the suspected root cause. A code-read finding is not evidence nobody has fixed it.
3. **Watch the auto-assigned ticket ID as a collision signal.** SST-1003 was auto-assigned precisely because a concurrent session had just taken 1001 and 1002 in the same feature area. A jump in the ID sequence means other sessions are active — go look at what they did.
4. Before `git checkout <ref> -- .` to compare against a base, use a stash or scratch clone. Doing it in the live worktree pulled in 5 upstream files and reverted an uncommitted edit.

Related: [[project_survivorpulse_multipick_past_variant_only]]
