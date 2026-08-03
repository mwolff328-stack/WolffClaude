---
name: project_survivorpulse_prod_publish_runbook
description: "Prod publish runbook + two non-obvious blockers from the 2026-07-14 beta launch (schema-drift verify, ALLOW_UNSAFE_DEV_FEATURES deploy guard, Pre-Publish Gate dispatch)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2664845c-5089-4a8f-8019-8ac215e2280b
---

SurvivorPulse **Beta published to prod 2026-07-14** (first prod publish after a long gap; smoke-tested clean). The end-to-end runbook that worked, plus two blockers that will recur:

**Runbook (Replit deploys from `2026-v1`, the default branch):**
1. `/pre-deploy` (or CI Pre-Publish Gate) green. NOTE the local suite OOMs on the Windows dev box (`ERR_WORKER_OUT_OF_MEMORY`) — run the gate in Replit or CI, not locally.
2. **Verify prod schema drift** — run `docs/pools-dashboard-redesign/migrations/verify-prod-schema.sql` (read-only) in the Replit PROD SQL console. After a publish gap the pattern is: "last publish got the dep-series; everything since (SS-3, SST-567, SST-658, pool-rules-engine-1/3, my-pools) never propagated." Apply the missing targeted SQL files (all idempotent `IF NOT EXISTS`), then re-verify → 0 MISSING. Missing pool/entries columns 500 every full-row pool select (My Pools "0 pools", season dropdown collapses). See [[project_survivorpulse_schema_drift_helium]].
3. **Playoff loader (SST-765)** against prod: `DATABASE_URL="<prod>" npx tsx scripts/seed-playoff-backtesting-data.ts` (idempotent). See [[project_survivorpulse_prior_season_playoff_data_gap]].
4. Publish `2026-v1` in Replit.
5. Smoke: log in → My Pools loads (not "0 pools") → season dropdown full → a 2021/2022 playoff pool renders → Back Tester hidden in prod, present in dev.

**GOTCHA 1 (deploy blocker, recurred TWICE on 2026-07-14): `ALLOW_UNSAFE_DEV_FEATURES=true` fails prod startup.** Trips a FATAL guard (`server/envValidation.ts:63-74`; `enforceEnvValidation()` exits code 1, crash-loop) with `🚨 ALLOW_UNSAFE_DEV_FEATURES=true is set but forbidden in production`. The value can live in three places, and Replit's **Configuration/Secret store is the source of truth — NOT the committed `.replit`** (Replit regenerates `.replit` from the store, so git-only edits get overwritten and DON'T update the store):
- (1st failure) a **global Replit Secret** of that name → leaks to prod. Fix = delete the Secret in the Secrets pane. Worked → first successful publish.
- (2nd failure) a **Configuration** stuck at Shared/Published scope. Root cause: a background agent task, while moving Stripe keys, briefly wrote `ALLOW_UNSAFE_DEV_FEATURES` into `[userenv.shared]` in git (commit f0bc3513). That pushed a **published-scope value into the Config store**. A later git commit (e2d5450c) removed it from `[userenv.shared]` in the FILE, but the store still held the published value (git edits don't sync to the store). The Configurations UI row even showed a dev-style icon while the store still exported it to prod. Fix = **DELETE the `ALLOW_UNSAFE_DEV_FEATURES` Configuration entirely in the Replit UI** (⋮ → Delete), then republish. Editing the scope in place does NOT reliably purge the stale published value.

KEY LESSON: never try to fix this by editing `.replit` `[userenv.*]` in git — the store wins and git edits can silently corrupt scope. Fix it in the Replit Secrets/Configurations UI. Deleting the config is safe when `DEV_SUBSCRIPTION_BYPASS=false` (nothing in dev actively uses the flag then); re-add it as **Development-only** later if you enable dev subscription bypass. Diagnosis order when the guard trips: (a) Secrets pane for a global secret of that name, (b) Configurations for a non-dev-scoped entry. Same global-vs-dev-scope trap applies to `DEV_SUBSCRIPTION_BYPASS`.

**RECURRED AGAIN 2026-07-19 (3rd time)** — same signature: publish crash-looped with `🚨 ALLOW_UNSAFE_DEV_FEATURES=true is set but forbidden in production` + healthcheck 500s/`connection refused`. A **global Replit Secret** of that name was the culprit again (diagnosis order (a) hit). Deleting it → **publish succeeded**. NOTE the accompanying Neon `57P01 terminating connection due to administrator command` lines and the `TypeError: Cannot set property message of #<ErrorEvent>` (a `@neondatabase/serverless` ws error-handler quirk) are RED HERRINGS — both are non-fatal ("server will continue running"), routine idle-connection resets, unrelated to the guard crash. **Do NOT re-add `ALLOW_UNSAFE_DEV_FEATURES` as a global Secret or Shared/Published Configuration** — that is exactly what re-breaks prod. It is already carried dev-scoped in the repo `.replit [userenv.development]` (line ~122), which is the ONLY place it belongs; dev features get it there automatically, so nothing needs re-adding for dev. See [[project_survivorpulse_replit_secrets_vs_config]].

**Prod URL + access (as of 2026-07-19): `https://survivorpulse-beta.replit.app/` is now PUBLIC.** It had been a Replit **private deployment** (edge `__replshield` / `silent-auth?privateDeployment=true` gate) that bounced any non-Replit-logged-in visitor to "Verifying session…" — which would have blocked founding-member leads. Founder flipped the deployment's Privacy setting to Public (Deployments → deployment Settings → Privacy/Access; per-deployment toggle, but an org/workspace "require login" default can override it; change may need ~1-2 min or a redeploy to propagate at the edge). Verified via the in-app browser (no Replit session): root landing page 200, and the app's OWN auth still 401s `/api/me`, `/api/me/subscription`, `/api/seasons` for anonymous visitors (public marketing page + Sign In/Create Account, private data stays gated). Smoke checklist from a logged-in browser all green: My Pools shows 3 pools/7 alive entries (no schema drift — `/api/pools?season=2026` = 200), a Playoffs pool renders, Back Tester hidden in prod.

**GOTCHA 2: Pre-Publish Gate wasn't runnable on the deploy branch.** `pre-publish.yml` triggered only on `push` to `main`, but `main` is stale (~1248 commits behind the default/deploy branch `2026-v1`), so the ship gate never ran on shipped code and had no manual button. Added `workflow_dispatch` 2026-07-14 (commit on 2026-v1) → run on demand: `gh workflow run pre-publish.yml --ref 2026-v1`.

**Tooling committed to 2026-v1** under `docs/pools-dashboard-redesign/migrations/`: `verify-prod-schema.sql` (reusable read-only drift check; index name comparison is case-insensitive because unquoted names fold to lowercase in Postgres) + `prod-pending-migrations.sql` (archival record of the 2026-07-14 catch-up batch).

**Security follow-up filed** (task_388de316): `.replit` lines 118-119 commit plaintext Stripe **test** keys (`STRIPE_SECRET_KEY_DEV`, `STRIPE_WEBHOOK_SECRET_DEV`) — rotate + move to Secrets.

Related: [[project_survivorpulse_db_deployment]], [[project_survivorpulse_repo_path]]
