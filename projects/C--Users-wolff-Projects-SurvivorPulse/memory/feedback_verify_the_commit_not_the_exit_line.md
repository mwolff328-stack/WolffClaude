---
name: feedback_verify_the_commit_not_the_exit_line
description: Two independent ways a shell step reports success while doing the wrong thing — `git rm` breaking a later `git add &&` chain into a partial commit, and a trailing `echo` masking a non-zero test exit.
metadata:
  type: feedback
---

Both of these fired in one session (SST-1450, 2026-08-24) and both look exactly
like success.

**1. `git rm` pre-stages a deletion, so naming that path in a later `git add`
ERRORS and breaks the `&&` chain.**

```
git rm -q path/Deleted.tsx          # earlier in the session
...
git add path/Deleted.tsx other.tsx && git commit ...
  → fatal: pathspec 'path/Deleted.tsx' did not match any files
```
The file is already staged and no longer on disk, so `git add` fails. A commit
still landed — containing **only** the deletion, not the other edits. The
"1 slice = 1 commit" invariant was silently broken.

**Apply:** after ANY commit, run `git show --name-status HEAD` and confirm the
file set is what you intended, plus `git status --porcelain` to confirm nothing
you meant to include is still unstaged. Verify the staged set with
`git diff --cached --name-status` BEFORE committing, not after. Don't re-add a
path that `git rm` already staged.

**2. A trailing `echo` makes a background runner report exit 0 while the command
failed.**

```
npx vitest run ... > run.log 2>&1; echo "EXIT=$?"
```
The task's own exit status is the **echo's** (0). The harness reported
"completed (exit code 0)" while vitest had exited **1** with 4 failing test
files. `FULL_SUITE_EXIT=1` was sitting in the output all along.

**Apply:** never trust a wrapper's exit code for a test run. Read the
`Test Files … / Tests …` summary lines and the FAIL markers from the log. This
compounds with the known trap that absence of `FAIL` is absence of *evidence*,
not presence of pass — confirm a NON-ZERO passed count too.

**Corollary that saved this story:** when failures do appear, attribute each one
with a real baseline control rather than the obvious-looking cause. Three
failures were plainly `ECONNREFUSED :5432` (no local Postgres) — but the edited
file appeared in their stack trace, so they still got a control run at the
pre-change commit. Checking out the baseline **in the same worktree** preserves
untracked files (a gitignored stale build artifact was the real cause of the
4th failure), which a fresh worktree would have hidden.

Related: [[feedback_survivorpulse_shared_worktree_staging_discipline]],
[[feedback_local_run_differs_from_ci_by_construction]],
[[feedback_a_200_is_not_proof_the_server_lived]],
[[project_survivorpulse_sandbox_has_no_local_postgres]].
