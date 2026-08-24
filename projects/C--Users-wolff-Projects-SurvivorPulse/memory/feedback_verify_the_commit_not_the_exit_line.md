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


## The general rule (refined with nifty-jackson-ebd58f, 2026-08-24): the STEP and the CHECK must not share a failure mode

Five instances across two sessions in one night, all the same shape — **a step reported
success while doing nothing, and the confirming check could not tell success from no-op
because it measured the same thing the step did, or something downstream that was already
true.**

| step that silently did nothing | check that could not see it |
|---|---|
| Python string replace whose `old` anchor did not match | "the suite passes" — it passed at the OLD value too |
| `git rm` pre-staged a path, so `git add` errored and broke the `&&` chain | the commit succeeded, exit line looked clean |
| `npx vitest … ; echo $?` | the echo's own exit 0 |
| a guard silently stopped covering moved routes | the full suite stayed green — guards fail OPEN |
| a floor left stale at 224 against a true count of 232 | `>= 224` passes trivially |

**The cheap rule is NOT "assert more". It is: make the check measure something the broken
path could not have produced.**

- `assert old in s` works — a missing anchor cannot produce a present anchor.
- `git show --name-status HEAD` works — a partial commit cannot produce the full file list.
- Reading the floor value back out of the file works — a no-op cannot change it.
- Mutation-killing works — a guard that stopped scanning cannot kill a mutant.
- "The suite is green" fails the bar in every one of these cases.

Corollary for numbers: derive a value by *measurement*, not arithmetic, and prefer the
authority the consumer itself uses. Two sessions independently landed on 230 here — one
by setting an assertion absurdly high and reading the real value out of the failure
message, one by running the consuming file's own regex against `git show <ref>:<path>`
blobs. Agreement by two different routes is worth far more than either alone. A hand grep
disagreed with the file's own scanner by one (229 vs 228); when they disagree, the
authority is whichever scan the assertion actually runs.

Related: [[feedback_survivorpulse_shared_worktree_staging_discipline]],
[[feedback_local_run_differs_from_ci_by_construction]],
[[feedback_a_200_is_not_proof_the_server_lived]],
[[project_survivorpulse_sandbox_has_no_local_postgres]].
