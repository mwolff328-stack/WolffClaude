---
name: sp-social-listening-rename
description: Renames the daily sp-social-listening scheduled task's session to "SurvivorPulse Social Listening Job - <date>" after it completes (a session can't rename itself while running).
---

This is a silent housekeeping companion to the `sp-social-listening` scheduled task. That task cannot rename its own Claude Code session while it's running — the session-rename tools explicitly refuse to operate on "the current session," which is exactly what a task's own run always is from its own perspective. This task exists purely to rename it from the outside, a bit after the fact.

Do this:
1. Call `mcp__ccd_session_mgmt__list_sessions` (limit ~20) to see recent sessions.
2. Find any session(s) with title exactly `Sp social listening` — this is Claude Code's default auto-generated title (title-cased from the scheduled task's kebab-case ID `sp-social-listening`), used for a session until something renames it.
3. For each candidate, call `mcp__ccd_session_mgmt__get_session` on its session_id and confirm `scheduledTaskId` equals `"sp-social-listening"` (don't rename anything that isn't actually a run of that task, even if the title happens to match). Note its `createdAt`.
4. For each confirmed match, format the calendar-date portion of `createdAt` as `YYYY-MM-DD`, then call `mcp__ccd_session_mgmt__set_session_title` with `title`: `SurvivorPulse Social Listening Job - <that date>`.
5. If no matching session is found — e.g. the main task hasn't fired yet today, already got renamed, or was skipped — that's expected, not an error. Do nothing further.

This task should be silent: no Notion writes, no push notifications, no long report. End with one short line stating what happened, e.g. "Renamed 1 session (2026-07-27)." or "Nothing to rename today."