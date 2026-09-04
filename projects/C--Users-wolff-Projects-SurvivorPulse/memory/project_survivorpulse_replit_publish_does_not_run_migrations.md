---
name: project_survivorpulse_replit_publish_does_not_run_migrations
description: A Replit publish never applies SQL migrations — deployment build/run are npm run build and npm run start, neither touches drizzle or SQL.
metadata:
  type: project
---

The Replit **deployment** pipeline cannot apply a database migration. `.replit`'s
`[deployment]` block is `build = ["npm","run","build"]` and `run = ["npm","run","start"]`;
`build` is `node scripts/build-v1.js` (prebuild = import guards only) and `start` is
`NODE_ENV=production node dist/index.js`. No drizzle, no `db:push`, no SQL step anywhere in
that chain.

So "the publish also ran the migration" is never true of the publish itself. If a pending
migration did get applied around a publish, it was a **separate** action — a founder paste
into the prod SQL console, or the Replit Agent running something on request. Confirm which,
because the two have very different risk: the story's own idempotent `.sql` file is safe,
while `npm run db:push` against production is explicitly UNSAFE (`docs/DB_OPERATIONS.md` —
it reconciles the ENTIRE schema and proposes destructive changes such as truncating
users/subscriptions and recreating id columns).

Verifying prod schema state cannot be done from a local machine (see the wrong-host trap in
`CLAUDE.md`). Two workable checks: Replit → Deployments → **Logs** for a boot-time
`🚨 [SCHEMA_DRIFT_ALERT]` naming the missing table (the SST-1514 tripwire in
`server/schemaDriftCheck.ts` — non-fatal in production, so it logs rather than exits), or run
`docs/pools-dashboard-redesign/migrations/verify-prod-schema.sql` in the prod SQL console.
No HTTP endpoint exposes drift state.

Related: [[project_survivorpulse_publish_prerequisites]],
[[project_survivorpulse_schema_drift_takes_down_dev_app]],
[[project_survivorpulse_stale_spa_bundle_after_publish]],
[[project_survivorpulse_unsafe_dev_flag_is_self_proving]]
