---
name: feedback_ship_aggregator_worktree_must_be_fast_forwarded_before_local_checks
description: "Ship-aggregator cycles must fast-forward the session's own worktree branch to origin/2026-v1 before trusting any local typecheck/guard-script/build result -- a fresh per-session worktree starts pinned wherever it was created and does not auto-advance."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 1dd14330-b7e8-48dd-b6a3-f3c0636b8056
  modified: 2026-09-29T16:45:30.437Z
---

Running the ship-aggregator role (REL-52/REL-53, 2026-09-29): the second cycle's local
verification (typecheck, `check-query-keys.js`, `check-vacuous-tests.js`,
`check-querykey-docs.js`, and the Node 20 production build reproduction) silently ran
against **stale code**. The worktree's own branch (`claude/compassionate-goldstine-daebda`)
was still sitting on the PREVIOUS cycle's cleared tip (`8888e91a`) even though
`origin/2026-v1` had moved four commits ahead to `58cb74eb`. `git fetch origin 2026-v1` and
`gh api .../commits/<sha>/check-runs` are correctly SHA-scoped and unaffected by this, but
anything run directly against the worktree's checked-out files (`npx tsc`, the guard
scripts, a local build) reflects whatever the worktree's OWN branch HEAD is, not
`origin/2026-v1`'s tip -- and a session's own branch never auto-advances just because you
`git fetch`ed.

Caught it only by accident: the rebuilt production bundle from the "clean" local build
still contained the OLD UI text (`"Season and Week Selector"`) instead of the new commit's
text (`"Select Season:"`) when grepped directly, which is what exposed that the build had
run against pre-window code.

**Why: the CLAUDE.md worktree isolation rule ("do not `git checkout 2026-v1`") is about
never switching a SHARED worktree's branch out from under other concurrent sessions. It does
NOT forbid moving your OWN dedicated per-session worktree's branch forward** -- and a
ship-aggregator cycle genuinely needs real code on disk to typecheck/build/guard-script
against, not just `git show origin/2026-v1:<path>` reads of individual files.

**How to apply:** at the start of every ship-aggregator cycle, before running ANY local
check (typecheck, guard scripts, `run_build_node20.sh`, anything that touches files on
disk rather than `gh api` or `git show <ref>:<path>`), run:
```
git status                                  # confirm clean, nothing to lose
git merge-base --is-ancestor HEAD origin/2026-v1 && echo ok   # confirm a true ancestor
git merge --ff-only origin/2026-v1          # safe fast-forward, own worktree only
```
This is a plain fast-forward (nothing discarded) precisely because a ship-aggregator
worktree should never have local commits of its own ahead of `origin/2026-v1`. If the
ff-only merge is refused, that itself is a signal worth investigating (the worktree branch
diverged somehow) before trusting any further local result.

After any local build reproduction specifically, grep the output bundle for a literal
string unique to the window's actual change (a new label, a new testid) and confirm the
OLD text is gone -- don't trust a clean exit code alone, since a stale cached/uncleaned
`dist/` can also produce a "successful" build of the wrong code. `rm -rf dist` before
rebuilding removes that whole class of doubt.

Related: [[project_survivorpulse_failed_replit_publish_triage]] (a different Node-20-build
gotcha, the `run_build_node20.sh` NODE_OPTIONS Windows-path bug fixed the same day, 2026-09-29 --
`ship-aggregator-tools/run_build_node20.sh` now converts the `--require` path via `cygpath -w`
before use; both gotchas surfaced in the same REL-52/REL-53 pair of cycles).
