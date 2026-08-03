---
name: survivorpulse-schema-drift-takes-down-dev-app
description: "Adding a column to shared/schema.ts without running the SQL on helium takes down the ENTIRE deployed dev app, not just the new feature"
metadata: 
  node_type: memory
  type: project
  originSessionId: 21161978-e055-4d72-ab00-4e13ee7e87f4
  modified: 2026-07-23T01:52:39.235Z
---

Adding a column or table to `shared/schema.ts` and pushing without applying the SQL to **helium** (the deployed dev app's DB) takes down the whole dev app, not just the new feature. Drizzle generates `SELECT` listing every column in the schema, so a single missing column makes *every* query against that table fail with Postgres `42703`. When the table is `users`, all three auth paths die (sign-in, session resolution, dev auto-login) and the app 502s.

This happened on 2026-07-22: commit `56bd8d12` added `users.beta_granted_at` + the `beta_access_*` tables, dev (`ep-flat-rice`) got the migration but helium did not. Hours were lost blaming `ALLOW_UNSAFE_DEV_FEATURES` / dev auto-login, which was exonerated in `9c016764` — the "Dev auto-login middleware error" in the logs was a *symptom* of the missing column (devAutoLogin catches and calls `next()`, so it can never be fatal).

**Why:** the failure presents as a total outage with an auth-flavored error message, pointing debugging away from the real cause (schema drift).
**How to apply:** any schema change is not "done" when local dev is green — helium needs the same SQL run in the Replit SQL console before the deployed dev app will boot. Write the migration as idempotent SQL, hand it to the founder explicitly, and treat a post-schema-change dev-app 502 as schema drift first, before touching env flags. Related: [[project_survivorpulse_beta_launch_site_decisions]].
