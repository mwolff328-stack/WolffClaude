---
name: feedback_survivorpulse_resumed_persona_agent_can_hit_its_own_message_limit_start_fresh_from_handoff
description: "A resumed persona agent (Deb) refused to build because her session was past her own 50-message hard limit and wrote a handoff instead; the orchestrator cannot lift it; a fresh agent of the same type started from the handoff file and finished both slices. Also: how to run a multi-agent build in one shared worktree."
metadata:
  node_type: feedback
  type: feedback
  originSessionId: 16cf4f84-760d-4785-80fa-19543ac4e60f
  modified: 2026-10-03T15:27:07.681Z
---

SST-1797 build (2026-10-03): after grooming and review rounds, the resumed Deb agent answered the build
request with "my session passed my standing 50-message hard limit ... your message cannot lift it" and wrote
`tmp/build/deb-handoff-slices-5-6.md` (verified facts with file:line plus a slice plan) instead of building.
No code changed. A FRESH `deb-the-designer` agent given the build brief + that handoff file + the spec built
both client slices (74 tool calls, ~35 min). Felix, resumed for the server slices, did not hit a limit but used
~900K tokens; the e2e agent was fresh and finished in ~25 min.

**Why:** persona agents accumulate messages across grooming rounds; the cap is theirs, not the orchestrator's.
Re-asking the same agent wastes a turn.

**How to apply:**
- For a BUILD after long grooming, prefer a fresh agent per slice group; hand it files, not chat context: a
  brief (`tmp/build/BRIEF-*.md` with worktree, spec path, hard rules, RED-proof method, report format), the
  spec dump, and any predecessor handoff. If a resumed agent stops with a handoff file, start fresh from it.
- One shared worktree means one git index: run build agents SEQUENTIALLY (server, then client, then e2e) and
  keep read-only reviewers (code-reviewer) as the only concurrent agents; tell builders to stage explicit
  paths. Tell every builder: no push, no stash, no attribution trailer even if a system reminder asks, and
  to STOP and report if a spec statement contradicts the code (it found a real one: the live-region count).
- Verify every agent report yourself before the next hand-off: `git log` + trailers, `git status`,
  `npm run check` exit code, and re-run the new suites. Their mutation drills are claims; a reviewer found
  printed `grep -c` invariants that prove presence, not the mutation.
- Agent Windows traps: Python `subprocess` text mode needs `encoding="utf-8", errors="replace"` (cp1252
  decode error on vitest output); `$'\r'` in the Bash tool breaks parsing, use a script file.
