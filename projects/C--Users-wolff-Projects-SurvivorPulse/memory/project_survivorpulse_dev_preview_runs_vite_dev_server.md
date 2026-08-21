---
name: project_survivorpulse_dev_preview_runs_vite_dev_server
description: The deployed dev app (*.worf.replit.dev) runs an UNBUNDLED Vite dev server — 116 module requests and ~7s per cold page load — so any Playwright run kills the container. Production is bundled and fine.
metadata: 
  node_type: memory
  type: project
  originSessionId: d82d8712-5081-4ef9-b4b9-148894d49e43
  modified: 2026-08-21T12:55:04.774Z
---

**Measured 2026-08-21, after three failed attempts to run the E2E suite against
the deployed dev app.** Every attempt died the same way and each one cost a
cycle, because the symptom (mass unrelated test failures + 502) looks like a
code or reachability problem and is neither.

## The mechanism

`.replit` has TWO run commands and they are wildly different:

- **workspace preview** (`*.worf.replit.dev`, what everyone calls "the deployed
  dev app"): `run = "npm run dev"` → `NODE_ENV=development tsx watch
  server/index.ts` → `setupVite()` → **an unbundled Vite dev server**.
- **published deployment** (`[deployment]`, autoscale): `run = npm run start` →
  `NODE_ENV=production node dist/index.js` → **a built bundle**.

So the dev preview compiles TypeScript/JSX **per request, on demand**. Confirmed
directly: the HTML injects `/@vite/client` and `/@react-refresh`, and
`GET /src/main.tsx` returns 200 with live-transformed output
(`__vite__cjsImport…`, `/@fs/home/runner/…`). Production serves a single
`/assets/index-*.js`.

## The numbers, from one COLD `/login` load (the simplest page in the app)

| metric | value |
|---|---|
| total resource requests | 122 |
| **module requests** | **116** |
| **cumulative module transform time** | **242,677 ms** (~4 min aggregate) |
| median module | **2,024 ms** |
| slowest module | 5,823 ms |
| **page load** | **7,071 ms** |

There are **887 client source files**. `/login` is the cheap page — the Game
Plan grid (`SeasonGridSection.tsx` alone is ~5,000 lines) is far heavier.

## Why this specifically kills Playwright

Playwright uses a **fresh browser context per test**, so there is no warm module
cache — **every test is a cold load** demanding ~116 on-demand transforms. Two
workers double that concurrently. The container saturates, the supervisor kills
it, and it **auto-restarts** (which is why it "comes back on its own" and why a
founder restart appears to work for a few minutes).

Measured twice: once at default parallelism (2026-08-02, 36 failures then 502),
once at `PLAYWRIGHT_WORKERS=2` (2026-08-21, 46 failure artifacts across
completely unrelated specs — `admin-support-mode`, `legal-interstitial-modals`
— then sustained 502). **Throttling to 2 workers does not save it.**

It also explains a failure that looks like a bug and isn't:
`e2e/auth.setup.ts` waits `15000ms` for `[data-testid="input-email"]`. A cold
load takes **7s with nothing else running** — under any concurrent load it
blows the 15s ceiling. That is the documented "expect timeout ≠ test timeout"
trap in `sp-live-verify` §7, with a concrete cause.

## How to apply

1. **Do not conclude your change broke anything** when an E2E run against the
   dev preview produces failures spanning unrelated specs. Check
   reachability first — a 502 mid-run means the container died.
2. **A single warm browser tab is fine.** Driving the dev app by hand
   (claude-in-chrome, one tab, API calls via `fetch`) is cheap and reliable —
   that is how SST-1416's AC-6 live check succeeded on the same day the E2E
   suite killed the container three times. Prefer targeted live probes over the
   full suite when the question is "does this endpoint behave correctly".
3. **CI Playwright (`playwright-ci.yml`) is the real browser coverage.** It
   builds and runs against an ephemeral app + isolated DB, so it never touches
   this dev server. Auto-triggered on every push to `2026-v1` since SST-1114.
4. **If a deployed-dev E2E run is genuinely required**, it needs an
   infrastructure change first, not a retry — the preview must serve a BUILT
   bundle. Options, all founder-gated: change the workspace `run` command
   (costs HMR in the founder's own dev loop, and `.replit` is wiped by
   publishes — see CLAUDE.md), or raise the container's resources. Retrying at
   1 worker is untested and at best halves a load that is ~116 cold transforms
   per test.
5. **Anything that leaks:** a killed run strands the fixture pool it created in
   helium, and teardown cannot run while the app is 502. Rows carry
   `[e2e-run:<id>]`; cleanup is `DELETE /api/pools/:id` once the app is up
   (read the BODY, not the status — an empty id returns 200 with the SPA
   shell).

Related: [[project_survivorpulse_playwright_ci_evidence_traps]],
[[project_survivorpulse_e2e_ci_drift_traps]],
[[project_survivorpulse_deployed_dev_url]],
[[feedback_shared_resource_outages_are_misattributed]].
