---
name: feedback_worktree_add_plus_push_default_upstream_lands_on_2026v1
description: "git worktree add <ref> -b <name> + this repo's push.default=upstream means a plain `git push origin <name>` silently lands on <ref>, not a new same-named remote branch."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0f0942e8-7cdd-4788-ace7-11b8feb5f188
  modified: 2026-09-08T13:58:11.284Z
---

This repo has `push.default = upstream` set in `.git/config` (deliberate — it's what lets a
plain `git push origin <branch>` from a session's own feature branch land on `2026-v1` per the
project's autonomous-push workflow, per [`CLAUDE.md`]'s "Autonomous Operation" section). But it
has a sharp edge for any branch NOT meant to land on `2026-v1`: `git worktree add <ref> -b
<newname>` sets `<newname>`'s upstream/merge config to `<ref>` (visible as `branch.<newname>.merge
= refs/heads/<ref>` in `.git/config`). With `push.default=upstream`, a subsequent `git push -u
origin <newname>` — even though it names `<newname>` explicitly — pushes to that CONFIGURED
upstream, not to a same-named branch on the remote. The push output looks like
`<newname> -> 2026-v1`, which is easy to misread as "pushed my branch" when it actually means
"pushed onto 2026-v1."

**Why:** Caught live in SST-1571's verification (2026-09-08): needed a scratch branch off
`origin/2026-v1` for a throwaway test-only workflow file, created it via `git worktree add
../tmp -b chore/x`, then `git push -u origin chore/x` — it landed directly on `2026-v1`,
triggering two real Pre-Publish Gate / Playwright CI runs and a Replit dev-environment sync
before it was caught and reverted (net diff zero, confirmed via `git diff` against the pre-push
tip; no other commits had landed in between so the revert was a clean fast-forward). No lasting
damage, but it burned real CI minutes and briefly synced an irrelevant file to the dev Replit
environment.

**How to apply:** For any branch that must NOT land on `2026-v1` (a scratch/throwaway branch, a
verification-only branch, anything not meant for the standing autonomous-push flow), push with
an explicit `src:dst` refspec that names the remote branch directly — `git push origin
HEAD:chore/x` or `git push origin chore/x:chore/x` — which overrides `push.default` regardless
of the branch's configured upstream. Never trust a bare `git push origin <name>` to land where
the name suggests in this repo; check the actual push output's `->` destination every time, and
treat a destination of `2026-v1` you didn't intend as an immediate stop-and-revert signal (check
`git fetch && git log origin/2026-v1 --oneline` first to confirm nothing else landed in between
before pushing a revert, same discipline as [[feedback_survivorpulse_shared_worktree_staging_discipline]]).
