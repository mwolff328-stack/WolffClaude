---
name: project_survivorpulse_admin_pool_classification
description: "Admin-only Real/Test pool marker is pools.poolClassification ('real'|'test') — a SEPARATE field from isTestData, which drives destructive test-data cleanup and must never be user-settable."
metadata: 
  node_type: memory
  type: project
  originSessionId: 450703be-2d25-4571-a9b8-3dcbb262dcf5
  modified: 2026-08-02T06:23:29.671Z
---

Admins can mark a pool Real vs Test via `pools.pool_classification` (varchar NOT NULL DEFAULT 'real', values 'real'|'test'). Surfaced as an admin-only "TEST" badge on My Pools (MyPoolsCard, gated `isAdmin && poolClassification==='test'`) and toggled in the Pool Settings "Admin" section. Endpoint: `PATCH /api/pools/:poolId/classification`, gated strictly on `role==='ADMIN'` (owners excluded — NOT canAccessPool). Omitted from insertPoolSchema so normal create/edit can't reset it. Added 2026-07-26 (commit bb358d00, branch 2026-v1).

**Why it's a distinct field, not isTestData:** `isTestData=true` triggers automated hard-deletion in scripts/cleanup-test-pools.ts (`DELETE FROM pools WHERE is_test_data=true`) and the no-test-pool-leaks tripwire. Reusing it for an admin display marker would let an admin's "test" tag get a real pool reaped. `poolClassification` is display-only and never feeds cleanup.

**⚠️ NEITHER FLAG IS A VISIBILITY CONTROL, AND ONE OF THEM IS A LOADED GUN (verified by full-repo sweep, SST-1187, 2026-08-01).** If you are ever asked to "flag test rows so they stop showing up", neither field does that:
- `poolClassification` has exactly ONE read in the whole client — `MyPoolsCard.tsx:306`, `isAdmin && poolClassification==='test'` — which renders a badge only admins can see. It excludes the row from nothing.
- `isTestData` has **ZERO** non-comment reads in `server/`, `client/` or `shared/`. Its only real readers are `scripts/cleanup-test-pools.ts` (which DELETEs the matched rows) and `scripts/verify-no-test-pools.ts`. **Setting `isTestData=true` changes nothing a user sees and converts the row into a deletion target for any future cleanup run** — it is a deferred unattended delete, not the reversible option it looks like. Never reach for it as a "safe first step" before deleting.

**And the one script that DOES read the flag reaps almost nothing (SST-1187/1215, 2026-08-01).** `scripts/cleanup-test-pools.ts` walks DOWN from `pools WHERE is_test_data = true`, so anything with no pool is unreachable from it. Its user cleanup matches ONLY `testuser_%` / `testadmin_%` — in scoped (`:180`, `:185`) **and** `CLEANUP_DEEP` (`:167`, `:172`) modes. Production held 148 e2e-named accounts and **zero** matched either prefix (verified: 0 even as a substring), because they come from vitest tests that mint their own names — `http_e2e_user_${Date.now()}`, `backfill_e2e_{user,admin}_${Date.now()}`, `test_email_<hex>`. Neither `e2e/fixtures.setup.ts` nor `scripts/seed-e2e.ts` ever set `isTestData` either. Net: for a long time NOTHING in the repo could reap NOTHING of the test residue. Don't assume a named cleanup script covers its nominal subject — read its WHERE clause.

**⚠️ PARTIALLY SUPERSEDED 2026-08-02 — the paragraph above describes the state BEFORE SST-1216/SST-1230, and is kept because it explains how SST-1187 happened.** Three things changed that night, all on `2026-v1`:

- **SST-1216** — the script is no longer blind to API-created pools. Selection is now
  `isTestData = true` **OR** the pool's description carries **this run's** `[e2e-run:<id>]` tag
  (SST-1214's `isTaggedWithRun`). So "walks DOWN from `is_test_data = true`" is no longer the
  whole WHERE clause.
- **FOUNDER RULING 2026-08-02: scoped only, do not sweep historical tags.** The tag path matches
  ONLY the current run, in SCOPED *and* DEEP modes — `CLEANUP_DEEP` has never affected pool
  selection, only user selection. Historical `[e2e-run]`-tagged pools are unreachable by this
  script **by decision**; clearing any such residue needs a deliberate one-off sweep with its
  own review (the SST-1226 shape), not a widening of this script. Don't re-open it.
  ⚠️ Read the ruling narrowly: it governs the TAG path. `isTestData = true` still reaps all
  flagged pools regardless of run or age. The script is not wholly scoped; the new criterion is.
- **SST-1230** — the script previously deleted pools while leaving `pool_participants`,
  `pool_rules` and `pool_historical_data_completions` behind (non-cascading FKs), so a matched
  pool with any of them would have thrown. Fixed, and the three tables are counted, reported and
  **cap-checked** like the rest, so `MAX_DELETE_PER_TABLE` still covers everything it deletes.

The user-cleanup half of that paragraph is **unchanged and still true**: it matches only
`testuser_%` / `testadmin_%` in both modes, so the 148 prod e2e-named accounts remain
unreachable (SST-1215 owns that).

Two independent prod-write paths existed, closed 8 days apart: **SST-1006** (`bbbbefcd`, 2026-07-23) fixed vitest `DATABASE_URL` (`testEnvSetup.ts` had been unconditionally setting `ALLOW_NONLOCAL_TEST_DB='true'`, defeating `dbHostGuard.ts` on every run); **SST-1175** (`91828c42`) + **SST-1011** (`eb296e64`), 2026-07-31, fixed Playwright `BASE_URL` and the e2e reset target.

What actually controls pool visibility is ownership: `storage.getPoolsWithEntryCounts(userId)` filters `eq(pools.createdBy, userId)` — **strictly who created it, not who holds an entry in it** — and `?scope=all` is admin-only (SST-872). So a pool owned by a test account is already invisible to every customer with no flag set at all.

**How to apply:** this marker does NOT affect pool visibility — a hidden pool is an ownership problem ([[project_survivorpulse_default_user_id_ownership_trap]]), not classification. Deploying the column needs the schema-drift handshake: apply the column to helium (ALTER TABLE / db:push) BEFORE the code deploys or the whole dev app 502s ([[project_survivorpulse_schema_drift_takes_down_dev_app]]). Integration test tests/poolClassification.integration.test.ts needs the column in the CI/test DB too.
