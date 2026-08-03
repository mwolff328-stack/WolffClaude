---
name: survivorpulse-e2e-cloudflare
description: Playwright E2E CI is Cloudflare-blocked from the Replit deployment; a new in-CI ephemeral pipeline (branch ci/e2e-ephemeral / PR #43) boots the app on localhost + a Neon test DB to run E2E green inside Actions
metadata: 
  node_type: memory
  type: project
  originSessionId: 6ebacea5-8947-4c0d-b385-b72cb3ee01c3
---

The SurvivorPulse Playwright E2E suite (`e2e/*.spec.ts`, `playwright.config.ts`, workflow `.github/workflows/playwright.yml`) targets the **deployed** app via `BASE_URL` (real `/login` flow + API-provisioned fixtures from `auth.setup.ts` / `fixtures.setup.ts`). **GitHub-hosted Actions runners are blocked by Cloudflare when hitting the Replit `.replit.dev` URL** — the runner receives a "Sorry, you have been blocked" page, so the auth setups time out on `[data-testid="input-email"]` and all dependent specs "did not run" (verified 2026-06-09, run #42: 2 failed / 88 did not run).

**Why:** Replit's Cloudflare bot protection rejects datacenter/CI IP ranges. A residential IP (founder's machine) is not blocked, which is why local runs pass (e.g. 26 pass / 1 skip).

**How to apply (two options now):**

1. **In-CI ephemeral pipeline (2026-06-10, GREEN)** — `.github/workflows/playwright-ci.yml`
   on branch `ci/e2e-ephemeral` (draft PR #43 → `2026-v1`) boots the app on
   `localhost:5000` via Playwright `webServer` (`npm run dev`) against a dedicated
   isolated Neon project `survivorpulse-ci-e2e`, seeded by `scripts/seed-e2e.ts`
   (users + active subscription + NFL teams + `2025-01-PHI-DAL` game + fixture
   pool/entry). 94/95 specs pass; `pool-schedule-types` AC-4 is `test.fixme`
   (redesign drift — server returns 422 with `field='poolType'` because "Playoffs
   Only" cascades `poolType`, while the UI only renders the inline error for
   `field='poolScheduleType'`). **Critical boot facts:** must run in
   **development** mode — `server/cookies.ts` only sets the session cookie `Secure`
   in production, and Secure cookies don't persist over `http://localhost` (breaks
   `/login`); `server/replitAuth.ts` throws at *import* if `REPLIT_DOMAINS` is unset
   (set a dummy in CI; `setupAuth` is only called when `ENABLE_REPLIT_AUTH=true`).
   Secrets: `E2E_CI_DATABASE_URL`, `E2E_CI_TEST_EMAIL/PASSWORD`, `E2E_CI_ADMIN_*`.
2. **Local against the deployed app** — `BASE_URL=<deployed-.replit.dev-url> npx
   playwright test`, creds in `.env.test`. Still valid; uses the original
   `.github/workflows/playwright.yml` (left intact), which is Cloudflare-blocked
   from CI runners.

CI Actions secrets live under **GitHub → Settings → Secrets and variables → Actions
→ Repository secrets** — NOT Replit Secrets, NOT the Dependabot tab. A
`[e2e]`-flagged push to `2026-v1` triggers the OLD deployed-target workflow (still
Cloudflare-blocked from CI). `playwright-ci.yml` triggers on `workflow_dispatch`,
push to `ci/e2e-ephemeral`, and PRs into `2026-v1` (NOT on `[e2e]` push to `2026-v1`).
Trigger manually: `gh workflow run playwright-ci.yml --ref 2026-v1`. See
[[survivorpulse-operating-model]].

**Update 2026-06-18 (SST-544 / SST-545):**
- `playwright-ci.yml` now accepts an optional `test_spec` workflow_dispatch input
  (commit `f89e3173`): `gh workflow run playwright-ci.yml --ref 2026-v1 --field
  test_spec=e2e/sst-536-auth-flow-header.spec.ts` runs ONE spec; empty = full suite.
  Playwright project deps (`setup`, `fixtures`) still run when a path is passed.
- **SST-544 (Done):** fixed an indefinite-poll hang + a seed FK crash. `assertEndpointOk`
  in specs caps polling at 10 retries. `scripts/seed-e2e.ts` now seeds `pick_popularity`
  (week 1, `scheduleType: 'regular_season'` — the DB value, NOT `'regular'`),
  `pool_weekly_stats`, AND creates the **hardcoded demo pool `04e2471b-6498-4a59-8a95-c0dc50221457`**
  (referenced in `BTAppShell.tsx`/`SeasonReplayView.tsx`) before seeding its stats —
  else `/dynamics/comprehensive` 422s and the backtester page retries forever.
- **SST-545 (Backlog, DevOps, tracks ephemeral-CI infra):** (1) full 235-test suite runs
  serial (1 worker) and can't finish in the 60-min budget — demo-pool `/dynamics/comprehensive`
  still 422s intermittently because rolling-3-week estimation lacks historical `pick_popularity`
  (only week 1 seeded); (2) scoped runs lack working auth storage state / a paywall-exempt
  account (`isPaywallMode` / 401s at startup) so positive-control E2E assertions fail.
- **SST-540** (Notion ID; spec file `sst-536-auth-flow-header.spec.ts`, internally "SST-536")
  is the header auth-flow-suppression bug — Done + E2E-verified (10/13 pass; the 3 fails are
  the SST-545 auth-state issues, not product defects).
