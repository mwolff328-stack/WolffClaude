---
description: Evaluate whether the current session is safe to archive, then archive it automatically once approved. If it's not safe, list exactly what needs to happen first.
---

# Archive Readiness Check

Archiving stops this session's process and, by default, tears down its worktree. That's fine when the work is actually settled — but if it happens while something is still in flight, the in-flight thing is what gets lost (uncommitted diffs in a worktree, a background job with no one watching it, an unanswered question the user needed to weigh in on).

This command evaluates readiness, then hands off straight to `archive_session` when it's safe — `archive_session` carries its own confirmation prompt, so that single approval is the only gate; this skill does not additionally stop and wait for a separate "yes" in chat before calling it.

## When to Use

- The user asks "can I archive this session" / "is it safe to close this out"
- Before wrapping up a session that did real work (not casual Q&A)
- No PR-merge signal to rely on (that path is covered by the "Auto-archive on PR close" preference instead) — this is for everything else: local commits, exploratory work, chores, anything without a PR gate

## Process

### Step 1: Check working-tree state

If this session touched a git repository (main worktree or one entered via `EnterWorktree`):

- Run `git status` (and `git status` in any other repo touched this session, if more than one)
- Flag **uncommitted changes** (modified, staged-but-uncommitted, or untracked files that aren't scratch/build artifacts) — these are silently at risk if the worktree gets cleaned up on archive
- Flag **unpushed commits** if the user's workflow expects work to reach a remote (check whether the local branch is ahead of its upstream)
- If the session is inside a worktree entered via `EnterWorktree`, call this out explicitly: archiving removes it by default, so anything not committed is gone

### Step 2: Check for work still in flight

- Any backgrounded Bash/PowerShell commands (`run_in_background: true`) that haven't reported completion
- Any `Workflow` runs, `Agent` calls, or `Monitor` watches still outstanding
- Any open `TaskCreate`/`TaskList` items in this session still `pending` or `in_progress`
- Any `spawn_task` chips created this session that the user hasn't acted on yet and that depend on context only this session has

### Step 3: Check for unresolved conversation state

- Questions asked (by either party) that never got a clear answer
- A plan or decision that was proposed but not confirmed
- Anything flagged as a blocker earlier in the session that was never marked resolved

### Step 4: Render the verdict and act on it

**If everything in Steps 1–3 is clear:**

> ✅ Safe to archive. [one-line summary of what this session accomplished]

Immediately call `archive_session` with `session_id: "self"` and a `reason` summarizing the session — do not pause here to ask "want me to archive it now?" first. `archive_session` itself prompts the user for confirmation before it does anything, so that prompt is the approval step; adding a second one in chat is redundant. This still respects the tool's "never speculatively" rule because the user invoking `/archive` on this session is the explicit trigger — it's not a background or unrelated context calling it unprompted.

**If anything is outstanding:**

> ⚠️ Not yet safe to archive. Before archiving:
>
> - [ ] [specific blocking item — e.g. "commit or discard 3 modified files in `client/src/...`"]
> - [ ] [specific blocking item — e.g. "background task `bb815vl75` is still running"]
> - [ ] [specific blocking item — e.g. "you asked about X, never got an answer"]

Each item must be concrete and actionable — "some things are unresolved" is not a valid list item. Name the file, the task ID, or the exact open question.

## Notes

- This command calls `archive_session` itself the moment the verdict is safe — approval happens via that tool's own confirmation prompt, not a separate chat exchange.
- If the verdict is unsafe, still don't call `archive_session` — resolve the checklist first (or ask the user to), then re-run `/archive`.
- A session with zero git activity and zero background work (e.g. pure conversation, research, or a fully-committed-and-pushed session) is trivially safe — say so plainly, don't manufacture caveats.
- If the user regularly hits "not safe" for the same reason (e.g. always forgetting to push), that's a signal to fix the underlying habit or workflow, not to keep re-running this check as a substitute.
