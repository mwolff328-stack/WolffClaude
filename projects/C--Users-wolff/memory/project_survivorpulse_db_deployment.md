# SurvivorPulse — Database & Deployment (Replit)

**Source:** Founder directive, 2026-06-04.

## Deployment
- SurvivorPulse is currently deployed via **Replit**.
- The database lives in the **SurvivorPulse Replit database** (not a separately-managed Neon project — even though the repo CLAUDE.md references "Neon serverless," DB changes are applied through the Replit-hosted database).

## Database change rule (MANDATORY)
Any database change (schema edits, Drizzle migrations, `drizzle-kit push` / `npm run db:push`, new tables/columns, indexes) MUST follow this order:

1. **DEVELOPMENT database FIRST** — apply and verify all schema changes against the SurvivorPulse Replit **development** database.
2. **PRODUCTION later** — apply to the **production** database ONLY when the founder says we are **ready to publish** production.

### Guardrails
- **NEVER** run a migration against the production database without an explicit "ready to publish / deploy to production" instruction from the founder.
- Before running ANY `db:push` / `drizzle-kit push`, **verify the `DATABASE_URL` (or Drizzle target) points at the development database**, not production. If unsure which DB the connection targets, STOP and confirm with the founder.
- Production DB migration is a deliberate, founder-gated publish step — treat it as such.

## Immediate relevance
- **Wave 5 / DEP-3 (SST-292)** — adds a `fieldPicksHistory` table (schema change + push). This is the first DB work since DEP-1/DEP-2. Apply to the Replit **dev** DB only; defer prod until publish.
- When dispatching Felix (or any agent) for a slice with a schema change, explicitly instruct: dev DB first, no prod migration, verify the connection target before pushing.

## Database topology (clarified 2026-06-04) — THREE separate databases
Know which is which before ANY push:

1. **Replit dev app DB** — internal host `helium` / `heliumdb`. This is what the DEPLOYED dev app actually runs against. Reachable ONLY from inside the Replit container (does NOT resolve from the local machine — verified `ENOTFOUND`). Migrate it by running `npm run db:push` INSIDE the Replit shell — NOT from local. (No credentials stored here.)
2. **Local-dev / test Neon DB** — endpoint `ep-flat-rice-akn42ssx` (the `DATABASE_URL` in the repo's local `.env`). A SEPARATE Neon DB used for local development + integration tests. DEP-2/DEP-4 schema pushes from local landed HERE — NOT on helium, NOT on prod. Reachable from local; safe to push for local testing.
3. **Production Neon DB** — endpoint `ep-orange-bush-afg0m2nx` (`neondb`). PRODUCTION. NEVER migrate without an explicit founder "ready to publish" go-ahead.

### Consequences / open items
- A schema change must be applied in BOTH the local test DB (from local, for tests) AND the Replit dev app DB (`npm run db:push` inside Replit, for the running dev app). They are different databases.
- DRIFT: `helium` (dev app DB) is MISSING DEP-2 (entries indexes) + DEP-4 (`pool_schedule_type` column) — reconcile with one `npm run db:push` inside Replit (syncs full shared/schema.ts).
- SECURITY (2026-06-04): production DB password was pasted in plaintext in chat — flagged for rotation. Never write any DB credential to a file (especially committed files).

## ⚠️ CRITICAL (2026-06-04) — `db:push` is UNSAFE on helium/prod (SUPERSEDES earlier db:push notes above)
Running `npm run db:push` / `drizzle-kit push` against `helium` (or production) is DANGEROUS. Those DBs hold real data and have significant drift from `shared/schema.ts`, so drizzle proposes DESTRUCTIVE changes unrelated to the story. Confirmed live on helium: push offered to truncate `users` (15,346 rows), `subscriptions`, `waitlist_signups`, and recreate `id` columns (serial→integer, data loss). Correct answer at those prompts = **ABORT**.
- `db:push` is ONLY for the local test DB (`ep-flat-rice`), used to run integration tests.
- Apply schema to helium/prod via **targeted, additive SQL migrations** (`CREATE TABLE`/`ALTER`, idempotent `IF NOT EXISTS`), reviewed, run in the Replit **SQL console**. Keep files in `docs/pools-dashboard-redesign/migrations/`. (DEP-3 example: `dep3-field-picks-history.sql`.)
- Pre-existing drift to reconcile LATER (carefully, NOT via push): helium `id` columns are `serial` vs `integer` in schema.ts; unique constraints on `users.username`, `subscriptions.user_id`, `subscriptions.stripe_subscription_id`, `waitlist_signups.email` are missing on helium. Also confirm whether `helium` (15k+ users) is truly "dev" and not serving live traffic.

## Test DB update (2026-06-04) — ep-flat-rice REPLACED
- Replit upgraded its dev database and is removing the previous Neon dev DB (`ep-flat-rice`, the OLD local `.env` target). Do not rely on `ep-flat-rice` anymore.
- NEW local test DB: a fresh, independent Neon project (endpoint `ep-cool-brook-a6gheo51`), NOT Replit-managed, isolated from dev/prod. Local `.env` `DATABASE_URL` now points here. Full schema applied via `npm run db:push` (safe — empty DB). 32/32 field-picks integration tests pass.
- Destructive integration tests run ONLY against this isolated test DB.
- `db:push` IS safe against this fresh empty test DB (no data, no drift) — unlike helium/prod.
- GOTCHA: vitest does NOT auto-load `.env` (drizzle-kit does). To run integration tests locally, export DATABASE_URL first:
  `DATABASE_URL="$(grep -m1 '^DATABASE_URL=' .env | cut -d= -f2-)" NODE_ENV=test TEST_DISABLE_NETWORK=1 TEST_FAST_OPTIMIZER=1 TEST_INTEGRATION_FAST=1 npx vitest run <file> --config vitest.integration.core.config.ts`
  (or `source .env` first). Without it, tests fall back to localhost:5432 → ECONNREFUSED. In Replit, DATABASE_URL is already in the environment.
