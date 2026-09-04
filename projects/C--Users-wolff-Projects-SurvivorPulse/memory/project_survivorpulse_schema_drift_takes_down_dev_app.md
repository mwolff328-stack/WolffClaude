---
name: survivorpulse-schema-drift-takes-down-dev-app
description: "A users-table column present in shared/schema.ts but missing from ANY one database takes that whole environment's auth down -- seen on helium (2026-07-22) and on the LOCAL ep-flat-rice dev DB (2026-09-01)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 21161978-e055-4d72-ab00-4e13ee7e87f4
  modified: 2026-09-01T18:00:00.000Z
---

Adding a column or table to `shared/schema.ts` and pushing without applying the SQL to **helium** (the deployed dev app's DB) takes down the whole dev app, not just the new feature. Drizzle generates `SELECT` listing every column in the schema, so a single missing column makes *every* query against that table fail with Postgres `42703`. When the table is `users`, all three auth paths die (sign-in, session resolution, dev auto-login) and the app 502s.

This happened on 2026-07-22: commit `56bd8d12` added `users.beta_granted_at` + the `beta_access_*` tables, dev (`ep-flat-rice`) got the migration but helium did not. Hours were lost blaming `ALLOW_UNSAFE_DEV_FEATURES` / dev auto-login, which was exonerated in `9c016764` — the "Dev auto-login middleware error" in the logs was a *symptom* of the missing column (devAutoLogin catches and calls `next()`, so it can never be fatal).

**Why:** the failure presents as a total outage with an auth-flavored error message, pointing debugging away from the real cause (schema drift).
**How to apply:** any schema change is not "done" when local dev is green — helium needs the same SQL run in the Replit SQL console before the deployed dev app will boot. Write the migration as idempotent SQL, hand it to the founder explicitly, and treat a post-schema-change dev-app 502 as schema drift first, before touching env flags. Related: [[project_survivorpulse_beta_launch_site_decisions]].

---

**2026-09-01 — the mirror case: the LOCAL dev DB was the one left behind, and `db:push` was the wrong fix.**

Same disease, opposite host. `users.google_id` (added by SST-1466, `bb572366`, 2026-08-24) was applied to helium AND production but never to the local Neon dev DB (`ep-flat-rice`), so *local* auth was totally dead while both deployed environments were fine:

- `POST /api/auth/signin` → **500 `INTERNAL_ERROR`, not 401** (the handler threw). A 500 rather than a 401 on signin is the tell — it means the lookup failed, not the credentials.
- dev auto-login → `GET /api/me` 401 even with `ALLOW_UNSAFE_DEV_FEATURES=true` (same symptom the 2026-07-22 incident wasted hours on — again *not* the env flag).
- `seedDemoUsers` failed at boot, so "missing seeded users" looked like a second, independent cause. It was the same one.
- `e2e/auth.setup.ts` never wrote `e2e/.auth/user.json`, so every authenticated Playwright test was unrunnable locally.

**Fast diagnosis, no server restart needed.** `POST /api/auth/check-email` with a made-up address is a clean, read-only discriminator on ANY host — it runs the same `getUserByAccountEmail` SELECT. **200 `{"available":true}` = the column exists; 500 = drift.** Production needs the header `x-sp-request: 1` or `requireCsrfHeader` answers 403 first (that guard is `NODE_ENV==='production'`-only). This is how helium and prod were cleared without SQL access to either — see [[project_survivorpulse_production_smoke_access]] for why host, not `current_database()`, identifies prod.

**⚠️ Do NOT reach for `npm run db:push` to fix local drift, even though `docs/DB_OPERATIONS.md` says push is "allowed" against `ep-flat-rice`.** Measured 2026-09-01: a full push against that DB proposes adding `users.google_id` *and* **dropping `pick_confirmations`** — unrelated SST-940 drift (removed from `shared/schema.ts`, dropped on prod via the publish prompt, never dropped locally). Run the story's own idempotent SQL file instead. A bidirectional sweep (schema→live for ADDs, live→schema for DROPs) before pushing is what surfaces the second half; a one-directional "what's missing" check would have declared the push safe.

**And distrust the migration file's own STATE block.** `SST-1466-google-account-integration.sql` claimed `local test DB .. applied via npm run db:push`. That line was false, and it is precisely what a reader checks before re-applying — so the false claim is *why* the drift survived a week. Corrected in `69c1cc25`. Related: [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]].

---

**2026-09-04 — third instance, and a free verification technique worth reusing.**

`user_pool_pick_popularity_overrides` (SST-1542, `4527d8f3`) reached `shared/schema.ts` on `2026-v1` but never reached helium — step 2 of the DB_OPERATIONS propagation order was skipped. The deployed dev app died at boot with `[SCHEMA_DRIFT_ALERT]`. Note this was a missing **TABLE**, not a column: the failure mode is not limited to `users`, and the app dies even when nothing reads the new table (here no route did — SST-1544 wasn't built).

**The reusable bit: once the migration is applied, the app answering AT ALL is proof the drift cleared.** `server/index.ts:320` awaits `enforceSchemaDriftCheck()`; `server.listen()` is at line 424. The check throws outside production on any missing table *or column*, so the process cannot reach the listening state with drift present. A single `curl` to `DEV_BASE_URL` therefore proves every declared column of the new table exists on a database you cannot otherwise reach — strictly stronger than `\d <table>`, and it needs no SQL access. A bare `GET /api/me` returning **401 `{"errorCode":"UNAUTHORIZED"}` is a PASS** (no session cookie); the failure signal is **502**, meaning nothing is listening.

⚠️ **502 is ambiguous** between "not restarted yet" and "restarted and crashed again" — Replit does not auto-restart a workflow whose process exited. Ask for the restart explicitly, then re-probe; do not read the first 502 after a migration as the migration having failed.

**Proving a migration before handing it over, without touching the target DB:** the drift comparator is pure, so feed it `liveColumns` derived from the migration file's `CREATE TABLE` + `ADD COLUMN IF NOT EXISTS` bodies and assert `hasFatalDrift` goes true→false, with the pre-migration state as the control (it should reproduce the exact log). Then execute the file against `ep-flat-rice` to prove it runs on real Neon and check `pg_constraint.confdeltype` for the cascade contract. Both are cheap and catch a migration that runs cleanly but leaves the boot check still red.
