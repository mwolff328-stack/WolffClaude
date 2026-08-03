---
name: project_survivorpulse_worktree_prune_readonly_attr
description: "git: failed to delete '.git/worktrees/X': Permission denied is a Windows ReadOnly ATTRIBUTE, not a file lock — clear it and prune works immediately."
metadata: 
  node_type: memory
  type: project
  originSessionId: 8dedbdc5-b53d-4319-b5c6-229929f7edb8
  modified: 2026-08-02T07:10:01.933Z
---

Recurring noise on this Windows machine, which runs many worktrees:

```
error: failed to delete '.git/worktrees/<name>': Permission denied
```

It prints on nearly every git command (fetch, checkout, push) because git auto-prunes stale
worktree admin dirs and fails each time. It reads like a locked file or a live process holding
a handle. **It is neither** — the subdirectories (`logs/`, `refs/`) carry the Windows
**ReadOnly attribute**, and Windows refuses to delete read-only directories.

Diagnose and fix:

```powershell
$p = "<repo>\.git\worktrees\<name>"
Get-ChildItem $p -Recurse -Force | Select-Object Name, Attributes   # look for ReadOnly
Get-Item $p -Force, (Get-ChildItem $p -Recurse -Force) | ForEach-Object {
  $_.Attributes = $_.Attributes -band -bnot [System.IO.FileAttributes]::ReadOnly }
```
Then `git worktree prune -v` succeeds on the first try.

**Check before pruning** — prune destroys metadata:
- `git worktree prune -v --dry-run` states the reason (usually `gitdir file does not exist`,
  meaning a worktree was deleted without `git worktree remove`).
- `git worktree list` will NOT show the stale entry; absence there is the tell.
- `find .git/worktrees/<name> -type f` — if `logs/` and `refs/` are empty there is nothing to
  lose. Verify any `ORIG_HEAD` SHA is reachable (`git branch -a --contains <sha>`) before
  deleting the pointer.

2026-07-29 instance: SurvivorPulse-BackTesting-Prototype, stale `cmea-frontend` worktree; both
subdirs empty, ORIG_HEAD was an ancestor of every branch. Clean prune.

## A SECOND cause with the identical message — check this before hunting attributes

2026-07-30 (SST-1126): `git worktree remove <path>` printed

```
error: failed to delete '<path>': Permission denied
```

with **zero ReadOnly attributes anywhere** (checked both the worktree and its `.git/worktrees/`
admin dir). Two things were going on, and both are worth knowing:

1. **The removal had already SUCCEEDED.** `git worktree list` no longer showed it and the
   `.git/worktrees/<name>` admin dir was gone. Only the working directory survived — and it was
   **completely empty**. Git had unlinked everything and failed only on the final `rmdir`.
   A plain `rmdir <path>` then worked instantly. So: **inspect before you escalate** —
   `git worktree list`, whether the admin dir still exists, and whether the leftover directory
   is empty. Do not assume the error means nothing happened.
2. **The likely cause is a process whose CWD is inside the worktree**, not an attribute and not
   an open file handle. Windows refuses to remove a directory that is any process's current
   directory even when it is empty. Persistent tool shells that `cd`'d in earlier are the usual
   culprit, and they will not show up by grepping process *command lines* for the path.

Also note `git worktree remove ... 2>&1 | tail -5; echo "exit: $?"` reports the **exit code of
`echo`/`tail`, not git** — it printed `exit: 0` on this failure. Check the effect, not that.

Related: [[feedback_survivorpulse_shared_worktree_staging_discipline]]
