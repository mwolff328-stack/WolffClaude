---
name: feedback-never-pkill-by-shared-entry-point
description: "`pkill -f \"server/index.ts\"` kills EVERY concurrent session's dev server, not just yours — always kill by the port you own."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6e0cd6d8-87ac-461b-8d93-9fbd8eec55a8
  modified: 2026-08-01T22:16:13.286Z
---

Many Claude sessions run against this repo at once and they all start the same dev server
entry point. A pattern match on that entry point is a match on all of them.

On 2026-07-30 a cleanup step ran `pkill -f "server/index.ts"` to stop two servers on ports
5055/5056. Port 5000 — explicitly identified at session start as belonging to someone else, and
deliberately avoided all the way through — was found dead immediately afterwards, and the kill
was self-reported as the cause.

**The follow-up showed that attribution was probably wrong, and the correction matters as much
as the rule.** The session that owned :5000 had stopped its own server ~40 minutes earlier, and
was running `node dist/index.js` (built, `CI_STATIC=true`), whose argv the pattern would never
have matched. A second live session had no server at all. So the actual blast radius may well
have been zero.

Two lessons, not one:
- The practice was still unsafe. It was luck, not care, that limited it — the documented local
  workflow *is* `npx tsx --env-file=.env server/index.ts`, so any session on the common path
  would have matched.
- **Do not over-attribute damage either.** "Port X is down right after I ran a broad kill" is
  correlation. Check whether the owner stopped it themselves and whether your pattern could
  even match their argv before announcing you broke something — a confident false confession
  sends other sessions chasing a problem that isn't theirs.

**Why:** process-name matching has no notion of ownership. `-f` widens it to the full command
line, which is *identical* across sessions because it is the same repo and the same script.

**The inverse failure is worse, and it fires on vitest (2026-08-01).** Narrowing a command-line
match to your own worktree is a FALSE NEGATIVE, not a safe filter:

```
Get-CimInstance Win32_Process | Where CommandLine -like '*<worktree-name>*'   ->  0 processes
```

returns 0 for a **fully alive** vitest run, because the worker processes do not carry the
worktree path in their command line — only the parent might. A session used this to "confirm"
its suite had died and killed a healthy run, losing ~45 minutes. It then ran the identical
query against a run it could *prove* was alive and got 0 again. Same query, opposite truth: the
signal is consistent with alive AND dead, so it cannot distinguish them and must not be used
as a liveness check in either direction.

**Reliable liveness check for a background run: watch the output file's byte count grow.**
Two reads a few seconds apart (`244428 -> 244446`) is positive proof. Also note a 0-byte or
frozen output file is the EXPECTED behaviour of a healthy run piped through `tail`/`head` —
those buffer the whole stream until exit, so "no output for 13 minutes" is not evidence of
anything. Don't pipe a run you intend to monitor; write the full log and tail the file.

And absence of `FAIL` in a partial log is not presence of pass. The only completion signal is
the final `Test Files N passed (N)` / `Tests N passed (N)` line **with a non-zero count** — zero
or absent means it never ran (see the Windows `npm run test:*` and broken-`&&` traps in
[[feedback_confirm_the_check_covers_what_you_changed]]).

**How to apply:**
- Kill by the port you started, never by process name:
  `PID=$(netstat -ano | grep LISTENING | grep -E ":<port>\s" | awk '{print $NF}' | head -1)`
  then `taskkill //PID $PID //F`.
- Verify afterwards that the ports you do NOT own are still up, and say so.
- If you do kill someone else's process, tell the affected sessions via
  `mcp__ccd_session_mgmt__send_message` — a dead dev server is silent and they will burn time
  on it. Note that an archived session cannot receive messages.

Related: [[feedback_survivorpulse_shared_worktree_staging_discipline]], [[feedback_survivorpulse_fetch_and_search_before_work]].
