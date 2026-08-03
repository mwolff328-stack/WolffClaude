---
name: feedback-survivorpulse-rely-on-self-learning-not-manual-monitoring
description: "Don't default to manually polling/monitoring sp-autonomous sessions for skill improvements — that's what the self-learning queue + weekly review exist to replace."
metadata:
  type: feedback
  originSessionId: ed467c1f-aa86-4473-9969-3879bbad2a5b
  modified: 2026-08-03T04:28:53.379Z
---

After a night of the founder repeatedly asking me to watch multiple sp-autonomous sessions,
extract learnings by hand, and hand-edit `~/.claude/skills/sp-autonomous/SKILL.md` /
`session-sync.md`, he explicitly asked for a self-learning pipeline so this stops being his job to
request. Built 2026-07-31/08-01: `sp-autonomous-learnings.jsonl` (append-only queue, individual
sessions log candidate skill-instruction gaps there per
`~/.claude/skills/sp-autonomous/references/self-learning.md` (project skill, not a personal
memory), consumed by the `sp-autonomous-weekly-review`
scheduled task (Sundays 6:10pm CT — drafts proposed edits, never auto-applies, pushes a
notification). Urgent-severity entries get surfaced immediately by the logging session instead of
waiting for Sunday.

**Why:** the founder's stated goal, verbatim: "so I don't need to have you constantly monitor
other sessions for improvements." Manually watching sessions and hand-porting learnings was a real
and repeated cost across one long session (multiple hours polling `list_sessions`/`list_events` on
a ~15-20 min cadence, transcribing findings into skill edits by hand). The pipeline exists
specifically to make that unnecessary going forward.

**How to apply:** don't default to spinning up manual `list_sessions`/poll-loop monitoring of
SurvivorPulse/sp-autonomous sessions "just in case" there's something worth capturing — that
instinct is exactly what this pipeline replaces. If the founder wants a *specific* session watched
live for a *specific* reason (e.g. "tell me when this ships," "watch for X"), that's still a normal
ask and fine to do. But proactively watching sessions across a whole night "in case a skill
improvement shows up" should route through the queue + weekly review instead, not through me
narrating everything I see. Trust the Sunday digest to surface what matters; check in on it rather
than pre-empting it.
