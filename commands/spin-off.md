---
description: Package the current session's context into a self-contained prompt and spawn a new-session chip, so long-running work can continue in a fresh session without losing context.
---

# Spin Off Command

This session is getting long (or the work has shifted to something separable) and you want to keep going in a fresh session without re-explaining everything. Package what matters into a `spawn_task` chip instead of a `save-session` file — a chip hands off into a live new session immediately; a saved file just sits until someone runs `/resume-session`.

## When to Use

- The current session is getting long and you want a clean context window for the next chunk of work
- The work has branched into something separable (a bug found in passing, a follow-up ticket) that deserves its own session
- You want to keep working here while a related task runs in parallel elsewhere

Prefer `/save-session` instead when you're closing up for the day and nobody needs to pick up the thread immediately — a chip is for continuing *now*, in parallel or in sequence, not for archiving.

## Process

### Step 1: Scope the handoff

Ask (yourself, or the user if ambiguous): what specifically continues in the new session? A `spawn_task` prompt is a fresh start, not a full transcript replay — it needs to be curated, not dumped. Identify:

- The concrete next task (not "continue the session" — the actual unit of work)
- What's already been established that the new session must not rediscover (decisions made, dead ends already tried, files already touched)
- Anything from *this* session's context that changes how the task should be approached

If the user hasn't said what continues, ask before drafting — don't guess at scope.

### Step 2: Draft the prompt

The `spawn_task` prompt becomes the new session's *entire* starting context — it has no access to this conversation. Write it self-contained, in the same spirit as a `save-session` file but tighter and task-focused, not a full retrospective:

- **Objective** — the concrete task, stated plainly
- **Relevant file paths / branches / tickets** — anything the new session needs to locate the work
- **Decisions already made** — so the new session doesn't relitigate them
- **Dead ends already ruled out** — so it doesn't retry a failed approach (this is the single most valuable thing to carry over)
- **Exact next step** — where to start, precisely enough that no scoping thinking is needed

Do not include: full chat transcripts, exploratory back-and-forth, or anything resolved that has no bearing on the task ahead.

### Step 3: Title and tldr

- `title` — under 60 chars, imperative, starts with a verb (e.g. "Fix stale season-grid cache", "Ship SST-1388 QA pass")
- `tldr` — 1-2 plain-English sentences a person skimming a chip list would want, no file paths or jargon

### Step 4: Call spawn_task

Call `mcp__ccd_session__spawn_task` with `title`, `tldr`, `prompt` (from Step 2), and `cwd` if the work is tied to a specific project directory.

### Step 5: Confirm

Tell the user the chip was created and give a one-line summary of what it will do. If the chip later becomes stale (superseded, already done manually), remind them it can be withdrawn with `dismiss_task`.

## Notes

- A chip is one-shot: the user clicks it to start a new session. It is not a recurring task — for that, use `/schedule` instead.
- If you're about to spin off because the *conversation* feels long but the *task* hasn't actually changed, consider whether `/save-session` + `/resume-session` is the better fit — spinning off mid-task splits context that arguably belongs together.
- Keep the prompt honest about what's unresolved — a chip that hides an open blocker just relocates the confusion to a session with less context to solve it.
