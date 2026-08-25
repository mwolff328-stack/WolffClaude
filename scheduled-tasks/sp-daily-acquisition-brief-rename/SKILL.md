---
name: sp-daily-acquisition-brief-rename
description: Renames the nightly sp-daily-acquisition-brief session to "SurvivorPulse Daily Acquisition Brief - <date>" after it completes (a session can't rename itself while running).
---

This is a silent housekeeping companion to the `sp-daily-acquisition-brief` scheduled task, which runs nightly at ~11:02 PM local and is Notion-read/write only (no Apify, no browser) so it finishes within a few minutes. That task creates a new Claude Code session each night with the SurvivorPulse beta-acquisition brief, but it cannot rename its own session while running — the session-rename tools explicitly refuse to operate on "the current session," which is exactly what a task's own run always is from its own perspective. This task exists purely to rename it from the outside, a bit after the fact.

Do NOT touch, rename, or otherwise modify any session belonging to this task itself (`sp-daily-acquisition-brief-rename`) — only sessions belonging to `sp-daily-acquisition-brief`.

Do this:
1. Call `mcp__ccd_session_mgmt__list_sessions` (limit ~20) to see recent sessions.
2. Find any session(s) with a generic default title (Claude Code auto-titles a scheduled task's session from its kebab-case ID — for `sp-daily-acquisition-brief` that default would read something like "Sp daily acquisition brief").
3. For each candidate, call `mcp__ccd_session_mgmt__get_session` on its session_id and confirm `scheduledTaskId` equals exactly `"sp-daily-acquisition-brief"` (not `"sp-daily-acquisition-brief-rename"` — that's this task itself, don't rename your own runs). Note its `createdAt`.
4. For each confirmed match, format the calendar-date portion of `createdAt` as `YYYY-MM-DD`, then call `mcp__ccd_session_mgmt__set_session_title` with `title`: `SurvivorPulse Daily Acquisition Brief - <that date>`.
5. If no matching session is found — e.g. the main task hasn't fired yet tonight, already got renamed, or was skipped — that's expected, not an error. Do nothing further.

This task should be silent: no Notion writes, no push notifications, no long report. End with one short line stating what happened, e.g. "Renamed 1 session (2026-08-24)." or "Nothing to rename today."