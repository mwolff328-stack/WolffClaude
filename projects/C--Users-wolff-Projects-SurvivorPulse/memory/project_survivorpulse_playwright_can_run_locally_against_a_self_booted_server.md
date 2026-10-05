---
name: project_survivorpulse_playwright_can_run_locally_against_a_self_booted_server
description: "Playwright specs CAN be run locally by building the app and booting server/index.ts yourself against the dev database (ep-flat-rice); how SST-1797's e2e agent did it, what it proves and what it does not; the dev app's live-verify surfaces that worked on 2026-10-03."
metadata:
  node_type: project
  type: project
  originSessionId: 16cf4f84-760d-4785-80fa-19543ac4e60f
  modified: 2026-10-03T15:27:14.902Z
---

Earlier notes say Playwright is CI-only because the sandbox has no local Postgres. That is not the whole
story: the local `.env` points at the Neon dev branch (`ep-flat-rice`), reachable from this machine, so a
spec run is possible (SST-1797, 2026-10-03: 26 passed / 4 NOT RUN / 0 failed locally, then the same 26 in CI).

**Recipe that worked:** `npm run build`, copy `dist/public` to `server/public`, then boot
`NODE_ENV=development CI_STATIC=1 PORT=<free port, not 5055> npx tsx --env-file=<repo>/.env server/index.ts`;
run `npx playwright test <specs> --project=chromium --no-deps` (use an empty-state `e2e/.auth/user.json`; locally
the "signed-in" audience is then dev auto-login, CI uses a real session). `npx playwright test --list -g "<title>"
--project=chromium --reporter=list` proves discovery (the configured reporters print nothing in list mode).
Restart the server between runs to reset the in-process rate limiter. Clean up `server/public`, `dist`,
`e2e/.auth/user.json`, `playwright-report/`, `test-results/` (all gitignored).

**Limits:** this is NOT CI proof (different session, different DB clock); it reads the dev DB, not helium; the
public week-picks route allows 60 requests / 15 min / IP and a full SST-1797 run spends ~34, so do not run it
right before a live curl check from the same IP.

**Live surfaces that worked 2026-10-03 on the deployed dev app** (`.replit` `DEV_BASE_URL`): plain `curl` for
public GET routes (`/api/seasons/current`, `/api/public/week-picks`) with `-b 'sp_dev_public_view=1'` for a
signed-out context (cookie-less `/api/me` was 401, so no auto-login for curl); the built-in Browser pane at
`/rankings?publicview=1` after ~15 s of Vite compile (first load is a blank page under Replit's preview
banner), with `resize_window` mobile for the 375px measurement. See [[project_survivorpulse_deployed_dev_url]].
