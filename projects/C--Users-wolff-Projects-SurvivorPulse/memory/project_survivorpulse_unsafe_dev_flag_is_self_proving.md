---
name: project_survivorpulse_unsafe_dev_flag_is_self_proving
description: "A booting prod proves ALLOW_UNSAFE_DEV_FEATURES is not set — don't ask the founder to confirm the Replit secret deletion."
metadata: 
  node_type: memory
  type: project
  originSessionId: d67b0288-fead-4fb5-85cf-0e390d23783f
  modified: 2026-08-01T20:35:03.987Z
---

`enforceEnvValidation()` in `server/envValidation.ts` calls `process.exit(1)` when
`APP_ENV`/`NODE_ENV` is production AND `ALLOW_UNSAFE_DEV_FEATURES === 'true'` (same for
`DEV_SUBSCRIPTION_BYPASS`). The exit happens at startup, **before the server listens**.

So a production instance that serves ANY response has already proven the flag is not
`'true'`. The recurring Phase 5 handoff step "Delete ALLOW_UNSAFE_DEV_FEATURES in
Replit → Deployments → Secrets" can be verified by observation instead of asking:

```bash
for i in 1 2 3 4 5; do curl -s -o /dev/null -w "%{http_code}\n" https://survivorpulse.com/ --max-time 20; done
```

Probe repeatedly, not once — see [[feedback_a_200_is_not_proof_the_server_lived]]; Replit autoscale
can restart, and one 200 from a dying instance is not the same as a stable boot. Five
consecutive fast 200s is enough.

**What this does and does not prove.** It proves the env var is not `'true'` in the running
prod instance — the security property. It does NOT prove the secret was deleted from the
Replit UI (it could be absent, empty, or set to something other than `'true'`). If the
founder needs the secret itself gone, that still requires the Replit console.

Verified 2026-08-01 post-publish: 5/5 HTTP 200 at 0.26–0.41s.

Related: [[project_survivorpulse_stale_spa_bundle_after_publish]],
[[project_survivorpulse_production_smoke_access]].
