---
name: sp-live-verify
description: Get a real, trustworthy live SurvivorPulse surface locally (or read the deployed app) and measure it without fooling yourself — covers the dev-server hang, the SPA-404 dot-path trap, auth/session state, frozen-animation false positives, and the divergences a local build can never close.
triggers:
  - /sp-live-verify
  - "live verify"
  - "live-verify"
  - "verify in the browser"
  - "audit the ui"
  - "run e2e locally"
---

# SurvivorPulse Live Verification

A green jsdom suite has repeatedly missed real launch-blockers that a live pass
caught in minutes — persisted state beating a deep link, a render loop only
reachable with real pool state, a legal document unreachable by keyboard. This
skill is the accumulated runbook for getting a **trustworthy** live surface and
measuring it correctly. Follow the section that matches what you're trying to do;
several sections compose (e.g. static-server + fresh-worktree + animation-freeze
all apply to the same session).

## 0. Decide: local build, or the deployed app?

Some things a local build **cannot** show you, no matter how carefully you run it
— go straight to the deployed app for these:

- **Anything CSP-, cache-, or bundle-dependent.** The locally served static build
  sets `default-src 'none'`, which blocks `page.addStyleTag` — the deployed app
  permits it. A UI symptom reported right after a Replit publish is often just the
  **old bundle in an already-open tab** (client-side nav = no reload); curl the
  deployed `/assets/index-*.js` before debugging source.
- **Current-season interactive paths.** The local dev DB has no forward odds for
  the *current* NFL season — `/api/me/strategy/cockpit` 503s. Verify the
  interactive optimizer/Game-Plan path against a **past** season with seeded odds
  (2025 pools return 200); current-season locally only exercises the graceful
  fallback branch.
- **Browser regression coverage.** The Playwright suite (`playwright-ci.yml`) is
  separate from anything in this skill and from the Pre-Publish Gate — see
  `pre-deploy` skill.

Prod is reachable read-only for smoke (`.replit.app`); the `.replit.dev` dev
subdomain is Cloudflare-blocked from here. Use the founder's logged-in Chrome
(claude-in-chrome) for auth-gated prod smoke.

If you do need a local surface, continue below.

## 1. Get a live server running

`npm run dev` (→ `NODE_ENV=development tsx watch server/index.ts`) **hangs** in
this environment: it logs boot through the scheduler but `await setupVite(app,
server)` never completes, so nothing binds `:5000`. The preview manager reports
"running"; curl/browser get connection-refused.

**Workaround — serve the static build instead of Vite dev** (`server/index.ts`
branches on `CI_STATIC`; set it and the server uses `serveStatic` instead of
`setupVite`, so there's no Vite hang. `NODE_ENV=development` keeps dev
auto-login):

1. `npm run build` (→ `dist/public`).
2. `rm -rf server/public && cp -r dist/public server/public` — `serveStatic` run
   from source resolves `server/public`; bundled prod resolves `dist/public`
   directly. `server/public` is gitignored, so this copy is required every time.
3. `NODE_ENV=development CI_STATIC=1 PORT=5000 npx tsx --env-file=.env server/index.ts`
   — this only works via Git Bash (POSIX env-var prefix). This is also *why*
   `npm run dev` fails as a command: npm runs the script string through
   `cmd.exe`, where `NODE_ENV=...` isn't recognized. Use `--env-file=.env`
   (`source .env` fails on the connection-string values). A ready-made launch
   config exists: `.claude/launch.json` → `survivorpulse-static` (port 5000).
4. Wait for `✅ Server successfully started on port 5000`, then `preview_start`.
5. Stale server holding `:5000`: `Get-NetTCPConnection -LocalPort 5000` +
   `Stop-Process`, or `PID=$(netstat -ano | grep ":5000" | grep LISTENING | awk '{print $NF}'); taskkill //F //PID $PID`.
   `preview_stop` can itself be permission-blocked.

**If `npm run dev` happens to come up for you, prefer it** — Vite handles the SPA
fallback itself (see the 404 trap below) and serves every route with no path
workaround needed. The hang above is why static mode exists at all; it isn't the
default because Vite dev is strictly better when it works.

## 2. The SPA-404 dot-path trap (static mode only)

Under `CI_STATIC`, `/` serves 200 but `/terms`, `/privacy`, `/methodology`, `/pools`
— every non-root SPA route — 404. **This is not a real bug and not a Windows
issue.** `res.sendFile(path.resolve(distPath, "index.html"))` in `server/vite.ts`
is called with no `root` option, so `send`'s default `dotfiles: 'ignore'` applies
to the **whole absolute path**. Every agent worktree lives under
`.claude/worktrees/…`, which contains a dot-segment, so the fallback refuses it.
`express.static` (which serves `/` and `/assets/*` fine) is unaffected because it
applies that rule only relative to its own root. CI never sees this
(`/home/runner/work/…` has no dot-segment).

**A route 404ing under `CI_STATIC` from a worktree says nothing about your
change.** Client-side navigation (`history.pushState` + `PopStateEvent`) still
reaches the page for manual DOM measurement — only a fresh `page.goto()` /
direct-load is blocked. Ways out, cheapest first:
1. Use the Vite dev server if it comes up (§1) — it never reaches `res.sendFile`.
2. Run the built server from a checkout path with no dot-segment.
3. Bridge with a ~20-line local proxy that serves `server/public/index.html` for
   GET requests where `accept` includes `text/html` and the path isn't `/api`,
   piping everything else through. **Read `index.html` per request, not once at
   startup** — a rebuild changes the asset hash, and a cached copy silently
   serves a bundle that then 404s, which looks exactly like an app failure.

## 3. Establish the auth/session state you think you're in

- **A cleared browser context is NOT anonymous.** `devAutoLogin` activates
  whenever `NODE_ENV !== 'production'` AND `ALLOW_UNSAFE_DEV_FEATURES ===
  'true'` (set on the dev Repl and in local `.env`) — any cookieless request is
  silently authenticated as the seeded dev user. Playwright's
  `storageState: { cookies: [], origins: [] }` yields an **authenticated** page.
  An anonymous-branch test written against it fails while the implementation is
  correct.
  **Fix:** hit `/?publicview=1` first — sets `sp_dev_public_view`, which only
  ever *withholds* auto-login and never authenticates anyone, so it's safe in
  every environment (including prod, where it's a no-op). Confirm which state
  you're actually in: `GET /api/me` → **200** bare, **401** with the cookie.
  Assert this precondition in any test relying on it, so a regression reads as
  "this context is authenticated" rather than masquerading as a component bug.
- **Auto-login's default user is TEST_USER** (`demo@survivorpulse.test`) — no
  admin. For `/admin/*` audits: local DB's ADMIN rows are all disabled test
  fixtures. Temporarily flip one to `status='ACTIVE'`, set
  `DEV_AUTOLOGIN_EMAIL=...` **in the launch config, not `.env`**, restart, audit,
  then revert both.
- **Fresh worktree, no `.env`:** `.env` and `node_modules` are gitignored and
  exist only in the main checkout. `npm ci`, then point `--env-file` at the main
  checkout by absolute path — **never copy `.env`** into the worktree (it holds
  credentials): `npx tsx --env-file="C:/Users/wolff/Projects/SurvivorPulse/.env" server/index.ts`.
  Use your own port (`PORT=5055` is honored, `server/index.ts:335`) — port 5000
  usually belongs to another session. For `--no-deps` Playwright runs,
  `e2e/.auth/user.json` must **exist** (the dir ships only `.gitkeep`); locally
  `{"cookies":[],"origins":[]}` is enough since `NODE_ENV=development` auto-auths
  any cookieless request as the dev stub (`default-user-id`). Specs calling
  `readFixtures()` still need the setup/fixtures projects — `--grep` around them
  if running standalone.

## 4. Measure geometry correctly — animation and CSP false positives

**A backgrounded/hidden Browser pane does not composite frames, so CSS
animations freeze mid-flight.** Any geometry read is then a snapshot of an
intermediate animation frame — and because it's frozen, it is **identical across
repeated reads**, which is exactly what makes it convincing. A freshly-opened
Radix dialog measures at its slide-in START (e.g. rect `left:-178`, "3/4
off-screen") — a false positive, not a real off-screen bug. Screenshots also fail
("not compositing frames") unless the pane is actually displayed.

Concrete case: a legal modal reported `top: -224, height: 581, width: 638` with
its title off-screen, `data-state="open"`, identical across three reads minutes
apart and unchanged after a rebuild — every signal said "settled, real bug." It
was the `zoom-in-95` + `slide-in-from-top-[48%]` enter animation stuck partway
(612 × 0.95 = 581.4, 672 × 0.95 = 638.4). True settled geometry was `top: 54,
672×612`, correctly centred.

**Before measuring anything geometric:**
```js
const s = document.createElement('style');
s.textContent = '*,*::before,*::after{animation:none !important;transition:none !important;}';
document.head.appendChild(s);
```
or, for one specific overlay: `dlg.getAnimations({subtree:true}).forEach(a=>a.finish())`.

`page.addStyleTag` is **CSP-blocked on the locally served build**
(`default-src 'none'` → *"Applying inline style violates…"*) but permitted on
the deployed app — the standard freeze helper therefore fails the test it exists
to protect, locally. Use `page.emulateMedia({ reducedMotion: 'reduce' })` first
(changes media state, injects nothing) and wrap `addStyleTag` in try/catch as the
stronger-but-optional layer.

Note `getComputedStyle(el).transform` reads `"none"` for Tailwind v4
`translate-*` utilities — they set the `translate` property, not `transform` —
so a correctly centred element can still look untransformed by that one check.

**Do not conclude a layout bug from a hidden-pane measurement, and do not file
one.** Real defects survive the animation being disabled.

## 5. Test with real user state, not a fresh profile

jsdom fixtures start from empty storage; every real returning user does not. A
full cockpit suite can be green and RED-proofed and still miss defects a live
pass with a dirty profile finds in minutes — concretely: persisted
`localStorage` silently beating a `?poolId=` deep-link seed (worked in jsdom
against empty storage, was a no-op for every real returning user), and a focus
"correction" effect that snaps toward a target outside the current pool's
week-domain and loops forever (86+ "Maximum update depth exceeded", frozen tab —
only reachable with a real playoffs-only pool stacked with a regular pool).

**How to apply:** (a) run the live pass with EXISTING localStorage, never a
fresh profile; (b) for any URL-seed feature, add a test that seeds the competing
persisted state first; (c) for any effect that "corrects" state toward a target,
prove the target is reachable in every relevant domain (e.g. playoffs-only weeks
[19..22] vs regular [1..18]) or it may loop forever.

**Corollary — commit tests you cannot yet run, explicitly labelled** ("do NOT
read these as having passed"). Un-runnable-but-committed e2e cases have caught
real defects on their first execution once whatever blocked them was fixed;
claiming them as coverage in the meantime would have buried the defects instead.

## 6. Fast responsive audits — the iframe harness

For measuring the whole app across viewport sizes quickly: static build (§1) +
dev-auto-login, then inject a hidden 375×812 (or 1280×800) iframe into any app
tab and loop routes through it with one measurement function
(`getBoundingClientRect` / `scrollWidth` / scroll-container walk) via
`javascript_tool`. ~5 routes per call vs. 2 calls per page when navigating the
tab directly.

**`<main>` in `client/src/components/shell/AppShell.tsx` is
`overflow-x-hidden`** — mobile overflow failures **clip silently** instead of
scrolling the body, so `document.scrollWidth` never flags them. You must
rect-scan elements that are not inside an `overflow-x-auto` ancestor to catch
these.

## 7. Playwright-specific traps

- **`--timeout=N` sets the TEST timeout, not the `expect` timeout.** First render
  can leave an auth spinner up past `expect(x).toBeVisible()`'s 5s default while
  the test timeout is nowhere near hit. Put `toBeVisible({ timeout: 30_000 })`
  on the first gate of every test. Symptom in `error-context.md`: a snapshot
  showing only `- status: Loading`.
  On a **shared box**, don't attribute a slow first render to your own stack
  without checking what else is running — a concurrent session burning many CPU
  processes is a live confound, and past ~20 competing processes vitest fails
  its own worker handshake and reports `Test Files no tests`, which exits
  looking clean unless you assert a non-zero count.
- **`--reporter=list` on the CLI REPLACES the config reporters**, bypassing
  `executedCountGuard`. Use `list` for diagnosis only; re-run with the config
  reporters and `E2E_MIN_EXECUTED=<n>` for the record.
- **Always run a baseline control before blaming your change.** Revert the fix,
  re-run the same subset — if failures are identical, they're pre-existing
  cold-start flake, not a regression. Without that control the honest report is
  impossible.
- Scratch `.mjs`/config files must live in the **worktree root**, not the
  scratchpad dir, or Node cannot resolve `node_modules`.

## 8. Local DB gaps that look like app bugs

- **No forward odds for the current NFL season** → `/api/me/strategy/cockpit`
  503s. Verify the interactive path against a past season instead (see §0).
- **Local DB drifts from committed `shared/schema.ts`.** A migration landed and
  applied to CI/prod but not to the local dev DB manifests as 500s on routes
  that join the new table/column and blanks a page with a generic error — this
  is stale local schema, not a code bug, and not the deployed dev app (which has
  its own DB and its own drift risk, tracked separately). Fix with an idempotent
  `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...` guarded on `DATABASE_URL`
  containing the expected local host, or `npm run db:push`. Diagnose via a
  repo-root `.mjs` using `@neondatabase/serverless` + `dotenv/config` — a script
  under `/tmp` fails ESM `node_modules` resolution.

## Quick reference — what to check when a live check looks wrong

| Symptom | Likely cause | Section |
|---|---|---|
| Server "running" but connection refused | Vite dev hang | §1 |
| Every route 404s except `/` | dot-path SPA fallback | §2 |
| Anonymous test sees authenticated content | dev auto-login | §3 |
| Dialog/element measures off-screen, identically every time | frozen animation | §4 |
| `addStyleTag` throws a CSP error | local build's CSP | §4 |
| Deep link / URL param silently ignored | persisted state precedence | §5 |
| Infinite "Maximum update depth exceeded" | out-of-domain correction loop | §5 |
| Mobile overflow bug never shows in `scrollWidth` | AppShell clips silently | §6 |
| `toBeVisible()` fails immediately, page shows only "Loading" | expect timeout ≠ test timeout | §7 |
| A route 503s only for the current season | no forward odds locally | §8 |
| A route 500s that touches a recently-added column | local schema drift | §8 |
