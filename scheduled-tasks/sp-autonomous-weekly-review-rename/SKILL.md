---
name: sp-autonomous-weekly-review-rename
description: Renames the weekly sp-autonomous-weekly-review session to "sp-autonomous Weekly Review - <date>" after it completes (a session can't rename itself while running).
---

This is a silent housekeeping companion to the `sp-autonomous-weekly-review` scheduled task, which runs Sundays at ~6:10 PM local and reviews the sp-autonomous self-learning queue. That task creates a new Claude Code session each Sunday, but it cannot rename its own session while running — the session-rename tools explicitly refuse to operate on "the current session," which is exactly what a task's own run always is from its own perspective. This task exists purely to rename it from the outside, a bit after the fact.

Do NOT touch, rename, or otherwise modify any session belonging to this task itself (`sp-autonomous-weekly-review-rename`) — only sessions belonging to `sp-autonomous-weekly-review`.

Do this:
1. Call `mcp__ccd_session_mgmt__list_sessions` (limit ~20) to see recent sessions.
2. Find any session(s) with a generic default title (Claude Code auto-titles a scheduled task's session from its kebab-case ID — for `sp-autonomous-weekly-review` that default would read something like "Sp autonomous weekly review").
3. For each candidate, call `mcp__ccd_session_mgmt__get_session` on its session_id and confirm `scheduledTaskId` equals exactly `"sp-autonomous-weekly-review"` (not `"sp-autonomous-weekly-review-rename"` — that's this task itself, don't rename your own runs). Note its `createdAt`.
4. For each confirmed match, format the calendar-date portion of `createdAt` as `YYYY-MM-DD`, then call `mcp__ccd_session_mgmt__set_session_title` with `title`: `sp-autonomous Weekly Review - <that date>`.
5. If no matching session is found — e.g. the main task hasn't fired yet this week, already got renamed, or was skipped — that's expected, not an error. Do nothing further.

This task should be silent: no Notion writes, no push notifications, no long report. End with one short line stating what happened, e.g. "Renamed 1 session (2026-08-24)." or "Nothing to rename today."