---
name: project_survivorpulse_discord_ci_webhook_dead_sst1571
description: "SST-1571 (dead Discord CI webhook) — RESOLVED 2026-09-08, founder rotated the secret, verified live against real CI activity."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0f0942e8-7cdd-4788-ace7-11b8feb5f188
  modified: 2026-09-08T13:57:54.146Z
---

**RESOLVED 2026-09-08.** Founder rotated the webhook. Verified against real GitHub Actions
activity on 2026-v1 (not a synthetic/dry-run test): two genuine Playwright CI runs posted
"✅ E2E Passed" and a re-dispatch of `ci-cancellation-sweep.yml` found 2 real cancelled-while-
pending runs and posted both — 4/4 notifications confirmed landed in #infra by directly
reading the channel via the `discord-reader` MCP tool (not just absence-of-error in CI logs),
independently re-checked by a second pass (Vlad). Ticket moved to Done. Also corrected in the
process: #infra (1491786035980537978) is genuinely the documented target per the
`survivorpulse-infra` skill, but that same channel is ALSO where a separate personal-automation
bot ("Luigi", OpenClaw-based) posts its own unrelated cron-job status updates — the two systems
share a channel but not a posting mechanism. No CI embeds appeared anywhere in 100 scanned
messages before the fix, consistent with a long-silent outage. The rest of this file is the
original incident record, kept for context.

The `secrets.DISCORD_WEBHOOK_URL` GitHub repo secret points at a deleted/rotated Discord
webhook. Discovered 2026-09-05 during live verification of SST-1569
(CI notification tech-debt fix): dispatching the new `ci-cancellation-sweep.yml` against real
run history produced 9/9 `Discord post failed: 404 {"message": "Unknown Webhook", "code": 10015}`
errors (run 33995896694). Telegram notifications worked fine in the same test — Discord-only
failure.

The same secret is read by three workflows: `pre-publish.yml`'s pre-existing Notify Discord
step (~lines 652-680), `playwright-ci.yml`'s new notify job, and `ci-cancellation-sweep.yml`.
So this almost certainly also silently broke `pre-publish.yml`'s Discord alerting, for an
unknown period predating SST-1569 — it is NOT a defect SST-1569's code introduced.

Filed as **SST-1571**, triaged by the 5-persona panel to Severity Low / Criticality Low /
Priority Low (3 of 5 personas Low; Ann and Vlad dissented to Medium citing the 3-workflow
blast radius and zero monitoring coverage — noted, not averaged away). Status: **Blocked** —
no coding session can advance it. The only fix is: create a new incoming webhook in Discord
(likely #infra, channel 1491786035980537978) and update the `DISCORD_WEBHOOK_URL` GitHub repo
secret — Discord workspace admin + GitHub secret-write access, founder-only.

**Why:** Telegram is a working redundant channel, so CI alerting is degraded, not dark — this
is not an emergency, but it should not be silently rediscovered again.

**How to apply:** Before citing "Discord CI notifications work" as a live fact, check whether
SST-1571 has moved past Blocked (i.e. the founder rotated the secret) — this memory is a
point-in-time snapshot of an outage, not a standing architecture fact. Once fixed, Ann's
suggested follow-up (a synthetic webhook health-check so a future silent rotation doesn't
recur) is real scope but needs its own design — file it as a new ticket, don't bolt it onto
SST-1571's fix per the Operating Model's guard-needs-its-own-design rule
([[feedback_defer_a_guard_that_needs_its_own_design]]).
