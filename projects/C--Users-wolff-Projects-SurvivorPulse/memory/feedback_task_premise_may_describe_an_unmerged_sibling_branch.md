---
name: feedback-task-premise-may-describe-an-unmerged-sibling-branch
description: "A task's \"X was just extracted/fixed\" premise can be true on a sibling worktree's branch and false on yours — grep for the claimed symbol before building on it."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8802a898-7d5f-433f-92f3-6dcee67995d0
  modified: 2026-08-03T04:28:40.587Z
---

A task description that states prior work is already done (e.g. "SST-654 just
extracted server/routes.ts's inline handler into an exported `poolSettingsHandler`")
is a claim about REPO state, not a fact about YOUR branch. In this repo, dozens of
worktrees run concurrently off `2026-v1` at different divergence points — the
described commit can be real, correct, and already pushed to origin, while simply
not yet on the branch you're sitting in.

Concretely (2026-08-02, SST-654 follow-on): a task assumed `poolSettingsHandler`
was already exported from `server/routes.ts`. `grep -r poolSettingsHandler
server/routes.ts` found nothing. Rather than treating the task as wrong, the
right move was to `git log --all --oneline | grep <ticket-number>`, which found
the exact commit (`5a734c96`) on a sibling branch (`claude/epic-bhabha-7c8e0e`,
checked out in another worktree, already pushed to origin, worktree status
clean — i.e. genuinely finished, not mid-edit). `git rev-list --left-right
--count HEAD...<sibling>` showed 12 commits unique to mine and 1 unique to
theirs — a real divergence, not a fast-forward — so `git cherry-pick
<commit>` (not a full branch merge) pulled in exactly that one self-contained
prerequisite cleanly, and the originally-assigned task proceeded correctly on
top of it.

**Why:** Silently redoing the "missing" work would have produced a second,
divergent implementation of the same handler — a duplicate two future sessions
would eventually have to reconcile by hand. Treating the task as simply wrong
and stopping would have blocked real, already-finished, already-pushed work for
no reason. Neither extreme is correct; the commit has to be located and
integrated deliberately.

**How to apply:** When a task's premise names a specific function, export, or
file state as an accomplished fact, verify it against the CURRENT branch first
(grep/read), not just trust the prose. If it's missing: (1) `git log --all
--oneline | grep <ticket-or-keyword>` to find the commit elsewhere, (2) check
the sibling branch's worktree is clean (not mid-edit) and the commit is pushed
to origin (persisted, not at risk), (3) check divergence with `git
rev-list --left-right --count HEAD...<branch>` — if it's genuinely one small
self-contained commit, `git cherry-pick` it rather than merging the whole
divergent branch (which would pull in unrelated, unreviewed history). If the
commit is large, still in flux, or the sibling worktree has uncommitted
changes, stop and ask rather than guessing. This is the same "verify, don't
inherit" discipline as [[feedback_survivorpulse_verify_a_deferral_reason]] and
the duplication-blindness problem in
[[feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see]], applied
one layer earlier — before the ticket/ledger layer, at the git-branch layer
itself.
