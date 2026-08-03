---
name: project_survivorpulse_visual_verification
description: How to render + MEASURE the authed SurvivorPulse app locally for visual/responsive verification (dev-auto-login recipe); Chrome-extension viewport limit; Neon DB host map
metadata: 
  node_type: memory
  type: project
  originSessionId: 16c5a014-5f18-46ec-9790-14db6190d4c5
  modified: 2026-07-22T18:11:23.003Z
---

**Why this exists:** CSS/responsive work cannot be done blind. Two consecutive SST-809 passes failed because the implementing agent (Deb) has NO browser and reasoned from code + character-count estimates. Never accept an estimated layout claim ("the tabs now fit") — measure it.

## ⚠️ FOUNDER RULING 2026-07-22 — WHICH ACCOUNT auto-login may use
**NEVER `mwolff328@gmail.com`.** That is the founder's day-to-day ADMIN account. The deployed dev app is INTERNET-FACING, so auto-login pointed at it silently logs *any visitor* in as a real admin.
- Normal verification → **`test@survivorpulse.com`**
- Only if admin privileges are genuinely required → **`admin@survivorpulse.com`**, switched back afterwards.
Consequence for verification: you see the TEST account's pools, not the founder's. If a check depends on the founder's specific data (e.g. his 3 pools grouped across all 3 schedule types), either seed the test account or ask the founder for a screenshot.

## ⚠️ AUTO-LOGIN IS NOW ENABLED ON THE **DEPLOYED DEV APP** (2026-07-22, commits 3c9079af + 832744dd)
`ALLOW_UNSAFE_DEV_FEATURES = "true"` now lives in `.replit` under **`[userenv.development]`** (with `DEV_AUTOLOGIN_EMAIL`). This is what was missing — the middleware and email var were already correct, so auto-login was inert and the deployed app 401'd/redirected every automated browser to `/login`.
- **NEVER move it to `[userenv.shared]`.** That section spans BOTH environments. `server/envValidation.ts:63` is a FATAL boot guard: production exits code 1 before the app is created if it sees the flag. This flag was deleted once before for exactly this reason — it had been set as a **global Replit Secret**, which also spans both. The deployment runs `npm run start` (NODE_ENV=production) and never reads `[userenv.development]`.
- **Requires a Repl RESTART to take effect** — a push alone does not reload the process env.
- Keep it IN THE REPO: Replit Sync's `git reset --hard` overwrites the workspace `.replit` on every push, wiping anything set only in the Replit Configurations UI.
- Once live, **in-app browser + the deployed worf URL = authed AND true 375px**, which removes the catch-22 below without needing a local server.

## The capability (built 2026-07-14, commit f159e8fc, SST for dev-auto-login = Done)
`server/middleware/devAutoLogin.ts` auto-authenticates a browser as a seeded user, DEV ONLY. Boot recipe (from the `spulse-merge-final` worktree):
```
NODE_ENV=development ALLOW_UNSAFE_DEV_FEATURES=true DEV_SUBSCRIPTION_BYPASS=true \
DEV_AUTOLOGIN_EMAIL=<account that owns data> PORT=5099 DATABASE_URL=<db> \
npx tsx server/index.ts
```
- `DEV_SUBSCRIPTION_BYPASS=true` is ALSO required — without it auto-login succeeds but the subscription paywall replaces the page.
- Use `npx tsx server/index.ts`, NOT `npm run dev` (its inline `NODE_ENV=` syntax fails under Windows cmd) and NOT `tsx watch` (fights itself on reload -> EADDRINUSE).
- Boot logs `⚠️ DEV AUTO-LOGIN ACTIVE as <email>`. Triple-gated (NODE_ENV!=prod + flag + independent in-middleware prod no-op + pre-existing envValidation FATAL prod guard). Real session always wins.
- Load `.env` for the other vars with a per-line loop (NOT `source .env` — the `&` in Neon URLs breaks bash source).

## Browser tooling: the catch-22 (important)
- **Chrome extension** (`mcp__claude-in-chrome__*`) = the founder's REAL authed session, good for authed DESKTOP checks against the live Replit app. But it CANNOT emulate a narrow viewport: `resize_window` AND browser zoom both leave `window.innerWidth` at 1920. Useless for mobile.
- **⚠️ THE DEPLOYED DEV APP URL (use for future testing, confirmed 2026-07-21):** `https://3faa879a-b955-4ac0-b132-e4ebbd482101-00-3f5q699y4opzy.worf.replit.dev/` — this is the real deployed dev app on helium, reachable + AUTHED via the founder's real Chrome (`mcp__claude-in-chrome__navigate` to it, then `javascript_tool`/`read_console_messages`/`read_page`). Do NOT chase `localhost:5000` — that's just a port-forward that drops on server restart (burned a cycle 2026-07-21: connection-refused after restart while the app was actually up on the worf URL). Replit `*.replit.dev` URLs can rotate — if it 404s, ask the founder for the current one. Real JSON API paths for smokes: `/api/pools`, `/api/user/entries` return JSON; many guessed `/api/...` paths (e.g. `/api/me/gameplan/entries`) hit the SPA fallback and return index.html at 200 (looks like a healthy API but isn't) — verify content-type is JSON. DESTRUCTIVE actions (DELETE, etc.) via `javascript_tool` fetch are BLOCKED by the auto-mode classifier (correctly) — have the FOUNDER perform deletes/writes, then verify read-only.
- **In-app browser** (`mcp__Claude_Browser__*`) = real viewport presets (mobile 375x812) but NO session — the Replit app and localhost both redirect to `/login`. AI must not enter credentials.
- **Solution:** dev-auto-login + in-app browser at `localhost` = authed AND true mobile viewport. This is the supported path for all responsive/CSS verification.
- Measure with `javascript_tool`: `document.documentElement.scrollWidth - window.innerWidth` (page overflow), computed `position==='sticky'` on th/thead, `overflowY` containers with `scrollHeight>clientHeight` (nested scrollbars; MAIN app shell is expected), `bar.scrollWidth > bar.clientWidth` (does a tab bar fit). Screenshots often TIME OUT on this heavy page — the DOM metrics are the authoritative evidence.
- **⚠️ GOTCHA (SST-858 smoke, 2026-07-15) — resize AFTER mount does NOT trigger the mobile layout.** `useIsMobile` listens for a `matchMedia` change event; resizing the in-app browser viewport once a component is already mounted doesn't fire it, so the desktop layout persists and you'll log a false FAIL on responsive work. **Do a FRESH PAGE LOAD at the target width (e.g. 375px)**, don't resize into it. Cost a debug cycle once; will again.
- **Worktree smoke setup tax:** `node_modules` is NOT shared across git worktrees — you must `npm install` in the worktree, and copy `.env` + add `DEV_SUBSCRIPTION_BYPASS` / `ALLOW_UNSAFE_DEV_FEATURES` / `PORT`. If the preview launcher errors "Could not determine Node.js install directory," that's really "npx tsx has nothing to resolve against" — i.e. you skipped the install.
- **Forcing a kickoff-lock (409 PICK_LOCKED) live:** set `games.override_kickoff_at` to a past timestamp via direct Neon SQL on the local dev host, exercise the flow, then CLEAR the override afterward. This is how SST-858's lock path was verified against a real round trip rather than a mock.

## GOTCHA: orphaned wrong-repo servers poison local results
Stale `server/index.ts` node processes from `C:\Users\wolff\Projects\SurvivorPulse` (canonical path, stuck on `feat/design-system-foundation`) squat on ports and serve code WITHOUT your changes — this produced a completely bogus debugging trail. ALWAYS kill strays and confirm a SINGLE listener before trusting local results:
```powershell
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'server[\\/]index\.ts' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

## Neon DB host map (verified by direct query 2026-07-14 — NONE of these is the founder's dev DB)
- `ep-blue-tree-a6s610f5` = **E2E CI TEST DB**. 4 users, 242 pools, ALL owned by `ci-e2e@survivorpulse.test` (fixtures like "E2E Fixture Pool - picks"). Founder's account absent. GOOD target for local UI verification: real table data, touches zero real data.
- `ep-flat-rice-akn42ssx` and `ep-cool-brook-a6gheo51` (the latter is the host in the repo `.env`) = **the SAME database via two Neon compute endpoints** — identical query results (998 users, 6 pools owned by `demo@survivorpulse.test` + a `cleanup_test` account). A test/integration DB with accumulated test users. Founder's account absent.
- **RESOLVED 2026-07-14: the real dev DB is `helium` — Replit-INTERNAL and NOT reachable from the local machine.** Founder supplied `postgresql://postgres:password@helium/heliumdb?sslmode=disable`: bare hostname, no domain, `sslmode=disable`, default creds = a container-internal Postgres that only resolves INSIDE the Replit environment. Consequences: (a) you can NEVER boot locally against real dev data — use `ep-blue-tree` (CI fixtures) instead, which is safer anyway; (b) dev schema migrations must be run from the **Replit console/shell**, which is exactly the manual step that gets skipped (cf. [[project_survivorpulse_schema_drift_helium]]). None of the Neon hosts is dev. See [[project_survivorpulse_db_deployment]].
- Verification trick: query `users`/`pools` counts + `SELECT ... FROM pools p JOIN users u ON u.id = p.created_by GROUP BY u.account_email` to identify WHOSE environment a DB is, without dumping PII.
- **CONFIRMED AGAIN 2026-07-15 (Game Plan session, by live read-back not assertion):** canonical map is **helium = deployed dev app's DB (in-container only)** · **ep-flat-rice = the local `.env` host** (note: local `DATABASE_URL` AND `TEST_DATABASE_URL` point at the SAME host — looks alarming, is expected) · **ep-blue-tree = E2E CI test DB** · **prod = separate, founder-gated**.
- **⚠️ MIGRATIONS DIVERGE PER HOST — check the right one before declaring a story blocked.** Worked example: Felix ran `to_regclass('public.pick_confirmations')` against ep-flat-rice → `null`, and we nearly filed Reset-to-Auto as DB-blocked. But the founder had already run `db:push` on **helium** 2026-07-15, and Game Plan PROVED the table exists there by driving a real manual-pick → auto-confirm → read-back loop on the deployed dev app (`confirmedWeeks=[1]` came back). So: **a table missing on ep-flat-rice says nothing about the deployed dev app.** If you need a table locally for integration runs, a local `npm run db:push` against ep-flat-rice is the established, SAFE pattern (it is NOT the deployed app's DB, so it cannot break the running dev app). Ask the Game Plan session or the founder to confirm helium state — they're inside the container; you aren't.
- **UPDATE 2026-07-16 — `pick_confirmations` NOW CONFIRMED PRESENT on BOTH helium and ep-flat-rice.** Founder ran `psql "$DATABASE_URL" -c "to_regclass('public.pick_confirmations')"` in the Replit shell → table present, 1 live row (helium). ep-flat-rice went from absent (2026-07-15) to present (2026-07-16, 4 confirmation rows written 14:14, entries 6→10) — someone ran db:push there within the day. ci-e2e (damp-sunset) also present. FK delete rule is `ON DELETE NO ACTION` on every reachable host. **prod remains unchecked/founder-gated** — run the same to_regclass on prod before shipping any pick_confirmations fix. Reachability recap: Neon MCP sees only Michael's org (survivorpulse-dev = shy-star = ep-flat-rice = small integration-test DB; survivorpulse-ci-e2e = damp-sunset); NO shared projects; helium is Replit-org, reachable ONLY via the Replit shell `$DATABASE_URL`. Audit of pick_confirmations two-table sync gaps = **SST-871** (Bug/Backlog/High): batch-picks route + all three deletion paths are unsafe (SST-864 defect class); see [[project_survivorpulse_schema_drift_helium]].

## Paths (updated 2026-07-14)
Work from `C:\Users\wolff\Projects\SurvivorPulse` — it is now correctly on `2026-v1` (the `spulse-merge-final` worktree referenced above was removed; DS lives at `sp-wt-design-system`). See [[project_survivorpulse_repo_path]].
