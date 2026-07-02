---
name: build-e2e-ci-ephemeral
description: Build an in-CI ephemeral-app + Neon-test-DB Playwright E2E gate for SurvivorPulse (no Cloudflare), on an isolated branch with a draft PR — never merging or touching prod.
---

Objective: Build a CI-gated end-to-end (E2E) Playwright pipeline for the SurvivorPulse project that runs ENTIRELY inside GitHub Actions against an in-CI ephemeral app instance + a dedicated Neon TEST database, so E2E no longer needs the Cloudflare-protected Replit deployment. (Context: GitHub-hosted Actions runners are blocked by Cloudflare from the `.replit.dev` deployment — verified previously — so the existing workflow that targets the deployed app can't run from CI. The fix is to boot the app locally inside the runner and point tests at localhost.)

REPO & FACTS:
- Local repo: C:\Users\wolff\Projects\SurvivorPulse. Active dev branch `2026-v1`; default branch `main`. GitHub remote: mwolff328-stack/SurvivorPulse.
- E2E lives in `e2e/*.spec.ts`; config `playwright.config.ts` (baseURL = process.env.BASE_URL || http://localhost:5000; the `webServer` block is commented out). Auth is a real /login flow: `e2e/auth.setup.ts` (env TEST_EMAIL/TEST_PASSWORD, defaults testuser@survivorpulse.test / TestPassword123!), `e2e/admin.setup.ts` (ADMIN_EMAIL/ADMIN_PASSWORD), fixtures `e2e/fixtures.setup.ts` (provisions a pool/entry via the API using the logged-in session).
- App: Express + Vite React. `npm run dev` = `NODE_ENV=development tsx watch server/index.ts` (port 5000); `npm run build` then `npm start` (port 5000). Custom email/password auth (bcrypt); Postgres via Drizzle (`shared/schema.ts`); `npm run db:push` applies schema and is safe ONLY against a fresh/empty test DB. Test helpers exist in `tests/helpers.ts` (createTestUser, createTestPool) and `server/storage.ts` (createUser).
- Existing CI: `.github/workflows/playwright.yml` targets the deployed app via the `E2E_BASE_URL` secret and is Cloudflare-blocked from CI. LEAVE IT INTACT — do not break it; add a NEW workflow instead.

PRE-FLIGHT (do FIRST; if blocked, STOP and report — do not thrash):
- In Bash, verify: the repo exists and git works; `gh auth status` is authenticated; you can reach GitHub Actions (`gh run list`). 
- Verify you can create a Neon database: load the Neon MCP tools via ToolSearch (query "select:mcp__Neon__create_project,mcp__Neon__list_projects,mcp__Neon__get_connection_string" etc.) and confirm they respond. 
- If `gh` is NOT authenticated, or Neon is NOT reachable, STOP immediately and write the Reporting summary listing exactly what is missing. Do not make partial commits.

HARD GUARDRAILS:
- Work ONLY on a new branch `ci/e2e-ephemeral` cut from latest `origin/2026-v1`. NEVER commit to `main` or `2026-v1`. NEVER merge anything. NEVER open or merge a PR to `main`.
- NEVER touch the production Neon database or the Replit `helium` database. Create a brand-new, ISOLATED Neon test database/branch used only for CI.
- NEVER write any DB connection string or secret into a committed file. Store the CI DB URL ONLY as a GitHub Actions repository secret via `gh secret set E2E_CI_DATABASE_URL`. Double-check no connection string appears in any committed diff before pushing.
- Do not change application/runtime behavior — only ADD test/CI infrastructure (a new workflow, a seed script, CI-only config/env). 
- Keep ALL commit messages and the empty-commit/PR titles FREE of the literal token "[e2e]" (that token triggers the other deployed-target workflow).
- Be cost-aware: cap CI debug iterations at ~8 runs. If still failing, stop and report.

PLAN:
1. Create a dedicated Neon TEST database (or branch) for CI; capture its pooled connection string. Store it as the GitHub secret `E2E_CI_DATABASE_URL` (gh secret set, Actions scope). Also set Actions secrets `E2E_CI_TEST_EMAIL`/`E2E_CI_TEST_PASSWORD` (you may choose values, e.g. ci-e2e@survivorpulse.test / a strong random password) and matching admin values if the admin spec is in scope.
2. Add `scripts/seed-e2e.ts`: given DATABASE_URL, run schema setup (`npm run db:push` or drizzle migrate) and insert a regular test user (bcrypt-hashed) matching TEST_EMAIL/TEST_PASSWORD, plus an admin user for ADMIN_EMAIL/ADMIN_PASSWORD if needed. Reuse `server/storage.ts`/auth helpers.
3. Add a NEW workflow `.github/workflows/playwright-ci.yml` triggered on `workflow_dispatch` and `pull_request` to `2026-v1` that: checks out; `npm ci`; `npx playwright install --with-deps`; exports `DATABASE_URL` from `E2E_CI_DATABASE_URL` (and minimal env to boot — Stripe may be unset; the app logs a warning but still runs); runs the seed script; builds + starts the app on localhost (prefer wiring Playwright `webServer` so it starts/stops the app and waits, with `reuseExistingServer:false` in CI); runs `npx playwright test` with `BASE_URL=http://localhost:5000` and TEST_EMAIL/TEST_PASSWORD/ADMIN_* matching the seeded users; uploads the `playwright-report` artifact.
4. Push `ci/e2e-ephemeral`; trigger the new workflow (`gh workflow run playwright-ci.yml --ref ci/e2e-ephemeral`); read logs (`gh run view <id> --log-failed`); fix and iterate until green or the 8-run cap.
5. Open a DRAFT PR from `ci/e2e-ephemeral` into `2026-v1` (NOT main) summarizing the change. Do not merge.

REPORTING (ALWAYS — success, partial, or blocked):
- Append a clearly dated section to `C:\Users\wolff\Projects\SurvivorPulse\.claude\scratchpad.md` covering: branch name, new workflow file, Neon test DB NAME (never its URL), final CI run result (pass/fail + failing specs), the draft PR link, and any blockers/follow-ups for founder review.
- Print that same summary as the final message.

SUCCESS CRITERIA: a `ci/e2e-ephemeral` branch with a working in-CI E2E workflow (app booted on localhost + dedicated Neon test DB, no Cloudflare) that is green — or a clearly documented best-effort with the exact remaining blockers — plus a draft PR into `2026-v1` and a scratchpad report. Nothing merged; no prod/helium DB touched; no secrets committed.