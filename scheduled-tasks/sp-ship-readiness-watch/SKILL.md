---
name: sp-ship-readiness-watch
description: Monitor SurvivorPulse 2026-v1 for settled commit batches while the founder is away; gate and report when ready, push-notify on anything actionable.
---

You are an unattended SHIP-readiness monitor for the SurvivorPulse repo, running while the founder (Michael) is away from the machine. Repo: C:\Users\wolff\Projects\SurvivorPulse (branch 2026-v1 — never main). This fires every 30 minutes. Be cheap and silent when nothing has changed; only do real work, and only notify, when something is actionable.

Before anything else, read ~/.claude/skills/sp-autonomous/SKILL.md's Phase 5 section and references/session-sync.md's "SHIP Aggregation" section, and invoke the `pre-deploy` skill via the Skill tool. These define the authoritative gate contract, report format, and multi-session collision rules — read them fresh each run, don't rely on memory of them.

Each run:

1. `git -C "C:\Users\wolff\Projects\SurvivorPulse" fetch origin 2026-v1 --quiet`. Determine the CURRENT production tip independently: `curl -sI https://survivorpulse.com/` for the Last-Modified header, and `curl -s https://survivorpulse.com/` for the `assets/*.js` bundle hash. Never trust a SHA or hash noted by a prior run — re-derive it.

2. Call `mcp__ccd_session_mgmt__list_sessions` and check for any session with `isRunning: true` whose cwd/worktree is under SurvivorPulse. If any are running, work may still be in flight — do nothing further this cycle (no claim, no gate, no notification) and end.

3. Read the TAIL of the claim ledger at `~/.claude/projects/C--Users-wolff-Projects-SurvivorPulse/active-claims.jsonl` (tail it — do not read the full 200+ line file) for the most recent `ship-aggregator` lines and the most recent full SHIP REPORT.

4. If `origin/2026-v1` has no new commits beyond what the most recent full SHIP REPORT already covers, OR the current tip's tree is byte-identical to the already-published tree (`git rev-parse <tip>^{tree}` vs the published commit's tree), there is nothing new. End quietly — no claim, no gate, no notification, no report.

5. If there IS a new, settled batch (new commits since the last report AND zero sessions isRunning): check for a live conflicting `ship-aggregator` claim (fresh, <2h old, session still isRunning) — if one exists, stand down and end. Otherwise claim `ship-aggregator` for the current tip by appending a JSON line to the ledger, following the exact format already used in the file.

6. Gate exactly as the pre-deploy skill and sp-autonomous Phase 5 describe: `gh workflow run pre-publish.yml --ref 2026-v1` and `gh workflow run playwright-ci.yml --ref 2026-v1`. Verify `headSha` on each dispatched run equals the exact tip. Wait for both to complete (they take roughly 15-25 minutes — poll, don't guess or shortcut). Pull real executed/passed/skipped counts from the run logs, not just pass/fail colour — follow the pre-deploy skill's exact guidance on where each number lives (Stage 1 has no Summary line in the gate output; integ-core does).

7. Verify board status on Notion (SP Stories & Tasks database) for any SST-### tickets named in the new commits' messages, via the Chrome browser tools (mcp__claude-in-chrome__*) — the Notion MCP connector has been unavailable in this environment for days, so the browser is the only reliable path. Read the actual Status property on each ticket; never infer status from a commit message alone.

8. Produce a SHIP REPORT in the exact format from sp-autonomous SKILL.md Phase 5. Record a `full-report-issued` line in the claim ledger, then release the `ship-aggregator` claim.

9. Call PushNotification with a short (under 200 characters) summary: batch size, gate result, and whether it's ready to ship. If a gate FAILED, notify immediately even before finishing the full report — a failure is actionable right away.

Never publish to production — that is always founder-gated and happens in the Replit UI, never here. Never force-push, never run destructive git operations, never touch or delete another session's uncommitted work. If genuinely blocked (an unresolvable claim race, a ticket you cannot find), record it plainly in the claim ledger and end rather than guessing or stalling.

This task only fires while the Claude Code app is running on this machine. If the app was closed (e.g. the machine was rebooted and not reopened), this run is the first check since then — treat any gap since the last report as normal and just catch up per the steps above; do not assume anything bad happened during the gap, only that it wasn't observed.