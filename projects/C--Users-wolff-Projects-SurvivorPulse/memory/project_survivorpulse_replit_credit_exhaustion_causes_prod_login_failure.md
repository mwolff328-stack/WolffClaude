---
name: survivorpulse-replit-credit-exhaustion-causes-prod-login-failure
description: "Production SurvivorPulse login failing with a generic \"unexpected error\" was caused by Replit running out of compute credits, not a Neon/code issue"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9390f846-88b7-4022-975b-2ffe9162433d
  modified: 2026-09-24T13:08:48.844Z
---

2026-09-23: Production login on survivorpulse.com failed for every attempt with the generic "An unexpected error occurred" message. A dev-server restart log showed a Neon Postgres error ("The endpoint has been disabled. Enable it using the API and retry.") on a secondary connection (the market-data change bus), which looked like a strong lead pointing at a disabled/quota-exhausted Neon endpoint. The actual root cause was unrelated to Neon directly: **Replit had run out of compute credits**, and purchasing more credits resolved it immediately.

**Why:** Replit hosts the app; when its own credits/compute budget is exhausted, the app (and by extension its DB connections) can fail in ways that surface identically to a Neon-side outage — the "endpoint disabled" style error was a red herring, or at least a symptom one layer removed from the real cause.

**How to apply:** If SurvivorPulse production shows widespread failures (login, or any DB-touching route) with generic 500s, check **Replit account credit/billing status first** alongside Neon endpoint status — don't assume Neon is the culprit just because the error looks like a Postgres connection failure. This is a distinct check from [project_survivorpulse_neon_branch_named_production_is_not_prod.md] (Neon branch confusion) and from [project_survivorpulse_github_actions_budget_exhaustion_signature.md] (GitHub Actions billing) — SurvivorPulse now has three separate places (Replit, Neon, GitHub Actions) where hitting a billing/quota wall produces a misleading downstream error.
