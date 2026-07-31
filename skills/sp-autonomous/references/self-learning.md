# Self-Learning — sp-autonomous improves itself without the founder monitoring for it

Every fix in this skill's history so far came from the founder watching sessions, spotting a
pattern, and asking for a specific edit. That doesn't scale, and it means the gap between "a
session hits a trap" and "the skill stops making the next session hit it" is however long it takes
the founder to notice. This file closes that gap for **learnings about sp-autonomous's own
instructions** — SKILL.md and session-sync.md, not the SurvivorPulse codebase (those still go to
`learned/` and `MEMORY.md`, unchanged).

**The standing rule: propose, never auto-apply.** A session that hit the gap drafts the fix; a
human approves it before it lands. This mirrors how Luigi's weekly synthesis already handles
Operating Model changes (Operating Model §4.7) — same discipline, applied to this skill's own
files, because a bad edit here doesn't just affect one story, it steers every run after it.

## The queue

`C:\Users\wolff\.claude\projects\C--Users-wolff-Projects-SurvivorPulse\sp-autonomous-learnings.jsonl`
— outside the repo, no commit churn, same pattern as the claim ledger. Append-only: never edit an
existing line, add a new one that references it.

**New entry:**

```json
{"ts":"<ISO8601>","session":"<sessionId or title>","severity":"normal|urgent","target_file":"SKILL.md|session-sync.md","target_section":"<Phase N — … / heading>","observation":"<concrete: what happened, with evidence — not a vague impression>","evidence":"<commit SHAs, ticket IDs, session names>","proposed_diff":"<sketch of the actual edit — REQUIRED for urgent, optional but encouraged for normal>","status":"queued"}
```

**Status update** (append, don't rewrite the original line):

```json
{"ref_ts":"<the entry's original ts>","status":"proposed|applied|declined","batch":"<review date or session that acted>"}
```

## Normal severity — queue it, move on

Most learnings are this. Append the entry with `status: queued` and continue your run — don't stop
to draft a full diff unless you already know exactly what it should be. The weekly review
(`sp-autonomous-weekly-review` scheduled task, Sundays) reads everything still `queued`, drafts
proposed edits for anything that doesn't already have one, and presents them to the founder as a
batch. You do not need to do anything further.

## Urgent severity — queue it, AND surface it now

Urgent means: a live SHIP-blocking gap, or a trap the *next concurrent session* will hit before a
week is up (the kind of thing that cost real work tonight — the SHIP-verdict-ownership collision,
a worktree holding an unpushed fix with no claim on it). Don't let it wait for Sunday.

1. Append the entry with `severity: urgent` and a **filled-in `proposed_diff`** — draft the actual
   edit while you have full context, even though you won't apply it yourself.
2. Put it at the top of your own final report to the founder, clearly marked, with the draft
   attached. Don't bury it in Phase 6 housekeeping.
3. If nobody is likely to read that report soon (this run is unattended, or the founder is known
   to be away), also `PushNotification` — one line, what the gap is, that a fix is drafted and
   waiting.

**You still do not apply the edit.** Urgent changes the *speed* of surfacing, not the *review
requirement*. The founder (or a session they explicitly ask to) applies it — same as every edit to
this skill has been applied so far: read the current file, `Edit`, verify the auto-commit hook
picked it up.

## Applying an approved proposal

When the founder approves a proposal (in the weekly review's chat, or in response to an urgent
surface): read the current SKILL.md/session-sync.md, make the edit, verify it committed and pushed
(`git log -1` in `~/.claude`, same check every prior edit in this skill's history has used), then
append the `status: applied` companion line so the queue reflects reality and nothing gets
re-proposed.

## Why a scheduled task, not "the next session that happens to notice"

Relying on the next sp-autonomous run to notice a queued learning means it only surfaces if that
run happens to touch Phase 6 introspection, which most runs have no reason to do — they're busy
shipping their own tickets. A dedicated weekly task is the same mechanism already proven for
`sp-daily-brief` and `sp-friday-sprint-review`: unattended, self-contained, pushes a notification
because there's no live session to read chat output. See
`~/.claude/scheduled-tasks/sp-autonomous-weekly-review/SKILL.md` for its exact procedure.
