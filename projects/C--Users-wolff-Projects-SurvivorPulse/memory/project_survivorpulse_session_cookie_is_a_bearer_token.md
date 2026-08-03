---
name: project_survivorpulse_session_cookie_is_a_bearer_token
description: "sp_session has no IP/UA binding and the CSRF header is a static string — so a captured session is full write access from any client, and nothing in the app is read-only."
metadata: 
  node_type: memory
  type: project
  originSessionId: f8c8a42e-f441-4153-aff9-4a83881d1a26
  modified: 2026-07-31T16:37:24.264Z
---

Verified 2026-07-31 while designing agent access to the authenticated app.

**`sp_session` is a pure bearer token.** `server/customSession.ts::isSessionValid()`
checks expiry and nothing else. `ip_hash` / `user_agent_hash` ARE written at login
(`server/authRoutes.ts:250,364`) and selected back out — but are **never compared
anywhere**. So any HTTP client, from any IP, with any user agent, presenting the
cookie is fully authenticated. A Playwright `storageState` therefore works far
outside Playwright: curl, a plain fetch, another browser. That is simultaneously
the capability (you can hand a browser a session without a password) and the risk
(a leaked storageState is full account access from anywhere).

**Lifetime: 7 days absolute, 12 hours idle, sliding.**
`SESSION_ABSOLUTE_LIFETIME_MS = 7d`, `SESSION_IDLE_TIMEOUT_MS = 12h`, and
`touchSession()` runs on every authenticated request. A captured session dies
after 12h unused — so any "reuse a saved session" scheme needs ~daily refresh,
and hard-expires at 7 days no matter how actively it is used.

**The CSRF header is not a token and blocks nothing.** `requireCsrfHeader`
(`server/middleware/customAuth.ts`) requires the literal header `x-sp-request: 1`
on POST/PUT/PATCH/DELETE, and **only when `NODE_ENV=production`**. Any client can
set it; the real SPA sends it automatically. Never reason "the agent probably
can't write because of CSRF" — a session cookie is full write access.

**There is no read-only mode.** Roles are `ADMIN | USER | TEST_USER`
(`shared/schema.ts:34`, `varchar(10)` — so a new 9-char `READ_ONLY` would fit).
Support mode is the *opposite* of read-only: `canEdit = isOwner || supportMode ||
isAdmin` — it grants an admin write access to another user's pool.

**If read-only is ever needed, there is exactly one chokepoint.** `server/index.ts`
runs `customSessionMiddleware` (191) → `devAutoLoginMiddleware` (195) →
`app.use('/api', requireCsrfHeader)` (197), and only two route registrations
precede it (both the Stripe webhook, signature-verified). Everything else is
registered later by `registerRoutes(app)`. One `app.use('/api', …)` there covers
100% of the write surface. A name-based scan for mutating `app.get(` routes
(refresh/sync/reset/seed/trigger/recompute/settle/import) found none, so a
method-based guard is sound — suggestive, not exhaustive.

**Related trap:** `playwright.config.ts` takes `baseURL` from `process.env.BASE_URL`
with **no guard against production**, and the suite creates pools and writes picks.
See [[project_survivorpulse_production_smoke_access]] and
[[project_survivorpulse_e2e_fixture_provisioning]].
