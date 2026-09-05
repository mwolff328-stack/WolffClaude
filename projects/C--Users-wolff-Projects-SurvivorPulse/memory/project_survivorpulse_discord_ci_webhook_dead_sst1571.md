---
name: project_survivorpulse_discord_ci_webhook_dead_sst1571
description: "The shared DISCORD_WEBHOOK_URL GitHub secret is dead (404 Unknown Webhook) as of 2026-09-05 — SST-1571, blocked on founder action."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0f0942e8-7cdd-4788-ace7-11b8feb5f188
  modified: 2026-09-05T22:57:24.205Z
---

The `secrets.DISCORD_WEBHOOK_URL` GitHub repo secret points at a deleted/rotated Discord
webhook. Discovered 2026-09-05 during live verification of [[project_survivorpulse_sst1569... ]]
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
