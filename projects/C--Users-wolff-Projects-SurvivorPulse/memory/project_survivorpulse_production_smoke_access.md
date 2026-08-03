---
name: project_survivorpulse_production_smoke_access
description: "How to live-smoke the auth-gated production app after publish — .replit.app is reachable (unlike .replit.dev), and auth-gated surfaces need the founder's logged-in Chrome via claude-in-chrome."
metadata: 
  node_type: memory
  type: reference
  originSessionId: e4e7aa75-240d-4154-93b2-2ed0f2801add
  modified: 2026-08-01T16:40:09.618Z
---

Production beta app: **https://survivorpulse-beta.replit.app/** (a `.replit.app` autoscale deployment).

Reachability (matters because verification is often blocked):
- **`.replit.app` production IS reachable** from the in-app browser (mcp__Claude_Browser) — the public landing/login loads fine.
- **⚠️ CORRECTION 2026-08-01: `.replit.dev` IS reachable too.** This memory, `OPERATING_MODEL.md` and the `sp-live-verify` skill all said the sandbox is Cloudflare-blocked from the deployed dev app. It is not — verified by plain `curl` from the Bash tool: `200` on `/`, `401` on `/api/me`, `200` on `/login`, 8/8 consecutive probes, cache-busted. Playwright's Chromium reached it too. I nearly declined a founder request on the strength of the inherited claim. The GitHub-runner half may still be true (untested); the LOCAL half is false. Test reachability with one curl before citing it — [[feedback_survivorpulse_verify_a_deferral_reason]].
- The dev URL is **not stored in the repo** and each Repl has its own UUID host. When given one, check it MATCHES what tooling is configured with: `.env.test`'s `BASE_URL` pointed at a *different, dead* Repl than the URL supplied in chat, and I spent several rounds comparing two hosts without noticing because I only verified the value *looked* like a `.replit.dev` URL.
- **Auth-gated surfaces** (My Pools, Pool Detail, Game Plan) require login, and I must NEVER enter credentials. Path that works: the founder's **real Chrome** is connected via `mcp__claude-in-chrome__*` (list_connected_browsers → tabs_create_mcp → navigate). If the founder is logged in there (they were, as ADMIN — the "View all pools / Admin only" toggle shows), the session carries through and I can smoke authenticated pages **read-only** (navigate + read_page + screenshot; NO destructive clicks, form submits, pick/settings changes on real data).

**Reading production DATA (not just UI), read-only — SST-1187, 2026-08-01.** Production is NOT in the founder's Neon account (`list_projects` returns only `survivorpulse-dev` and `survivorpulse-ci-e2e`; prod is Replit-provisioned), so there is no SQL path to it from this machine and `PROD_DATABASE_URL` is unset. The working substitute is the deployed app's **own admin API**, through the founder's authenticated ADMIN Chrome, GET only: `/api/pools?scope=all` (system-wide pool inventory), `/api/admin/users?limit=1000`, `/api/admin/users/:id`, `/api/pools/:id/entries`, `/api/pools/:id/entries/:eid/picks`. `javascript_tool` + `fetch(..., {credentials:'include'})` from a logged-in tab returns JSON directly. Truncate output aggressively — the tool result caps out fast, so aggregate/slice in the page rather than dumping rows.

**Proving WHICH database you read.** `current_database()` is worthless — all three are `neondb`. Identify prod by **host** (`survivorpulse.com` is the live customer apex; whatever it serves IS production by definition), then corroborate with a count fingerprint against the two databases you *can* reach via Neon MCP. On 2026-08-01: prod 21 pools / 441 users / 62 entries; `survivorpulse-dev` 11 / 2901 / 13; `survivorpulse-ci-e2e` 7 / 4 / 7 — mutually exclusive, and the pool names don't overlap either. Counts drift; the method doesn't. ⚠️ And note the `survivorpulse-dev` project's primary branch is literally **named `production`** — branch names lie here exactly as database names do.

**Legacy prod (`optivor.replit.app`) is reachable but NOT logged in** in that Chrome, so it cannot be audited this way, and credentials must never be entered. Anything about Legacy needs a founder-run query in its Replit SQL console.

Gotchas:
- The console error `"A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received"` at source `:0:0` is **Chrome-extension messaging noise, NOT an app bug** (the app doesn't use chrome.runtime). Ignore it in app smokes.
- Sticky-header / horizontal-scroll behaviors only show when the table actually overflows — a wide desktop viewport with few rows shows nothing to scroll; narrow the window or use a longer list to see it (founder confirmed the SST-1046 sticky header works when narrowed).
- Production has real 2026 odds, so the interactive entry-cards / Season grid render (the happy path) — unlike the local dev DB which only shows the read-only fallback. See the sp-live-verify skill and [[project_survivorpulse_pool_cockpit_wrapper_global_nav_trap]].
