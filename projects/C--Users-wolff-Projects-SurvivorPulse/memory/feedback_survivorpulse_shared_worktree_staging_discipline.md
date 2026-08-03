---
name: feedback_survivorpulse_shared_worktree_staging_discipline
description: "Concurrent-session git discipline: when another session has uncommitted WIP in the SAME main worktree, stage only your files by explicit path (never git add -A), don't touch the shared scratchpad, rely on the CI gate's clean checkout — and never push a worktree branch without an explicit refspec, because `worktree add -b` sets upstream to the BASE branch."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e4e7aa75-240d-4154-93b2-2ed0f2801add
  modified: 2026-08-02T07:09:40.065Z
---

Concurrent SurvivorPulse sessions sometimes share the ONE main worktree (`C:\Users\wolff\Projects\SurvivorPulse`), not separate worktrees — so `git status` shows another session's uncommitted WIP alongside yours (e.g. the "Archetype pick allocation" session's `shared/strategyEngine/*` while I did My Pools `client/*`).

**Why:** a stray `git add -A` / `git add .` would sweep their half-finished files into your commit, and clobbering `.claude/scratchpad.md` (which they may have checked out) destroys their context. The "Fetch and search before working" memory ([[feedback_survivorpulse_fetch_and_search_before_work]]) warns concurrent same-file work costs a whole session.

**How to apply (worked cleanly for SST-1076):**
1. `git status` first — identify which uncommitted files are theirs vs yours. Confirm no FILE overlap (different dirs = no merge conflict).
2. Stage ONLY your files by explicit path: `git add path1 path2 …`. Never `-A`/`.`.
3. Verify no leak before committing: `git diff --cached --name-only | grep -E "<their dirs>|launch.json|scratchpad"` must be empty.
4. Leave `.claude/scratchpad.md` untouched — they own it. Keep your own plan in the session scratchpad dir, not the shared file.
5. `git fetch` + rebase before push (different files → clean); push to `2026-v1`.
6. The **CI pre-publish gate runs a clean checkout of `origin/2026-v1`** = your pushed commit only, WITHOUT their uncommitted WIP — so their half-done work never pollutes your SHIP signal. (Locally, `npx tsc`/targeted `npx vitest run <files>` still compile their WIP; that's fine if it's type-clean, but the gate is the authoritative clean-tree check.)

**The worktree-branch push trap — a `push -u` can fast-forward REMOTE 2026-v1.**
`git worktree add <path> -b feat/X origin/2026-v1` sets feat/X's upstream to
origin/**2026-v1**. A later `git push -u origin feat/X` pushes to that UPSTREAM
ref, fast-forwarding remote 2026-v1 with unreviewed feature commits. It happened
2026-07-27 during Beta UI W0.1, caught in the push output and restored within
~1 min via `git push --force-with-lease=2026-v1:<bad-sha> origin <good-sha>:refs/heads/2026-v1`.
It matters because remote 2026-v1 auto-syncs to the Replit dev app and merges to
it are founder-gated. **How to apply:** after creating a feature-branch worktree
from origin/2026-v1, immediately `git branch --unset-upstream`; always push new
branches with an explicit refspec (`git push -u origin feat/X:refs/heads/feat/X`);
and always read the push output's destination ref before moving on.

Note the Windows trap the other session hit: `npm run test:unit` exits 0 WITHOUT RUNNING (POSIX env syntax) — always run `NODE_ENV=test TEST_DISABLE_NETWORK=1 TEST_FAST_OPTIMIZER=1 npx vitest run --config vitest.config.ts` via Git-Bash. See [[project_survivorpulse_prepublish_gate_mechanism]].
