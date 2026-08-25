---
name: project_survivorpulse_customsessionmiddleware_not_in_registerroutes
description: "registerRoutes(app) alone never populates req.customUser -- any hand-built Express app for a supertest integration test needs customSessionMiddleware mounted explicitly, or every cookie-authenticated route 401s regardless of a valid session."
metadata: 
  node_type: memory
  type: project
  originSessionId: acd276de-073f-4935-a249-4b2b0e1c0c1c
  modified: 2026-08-25T05:44:23.672Z
---

`customSessionMiddleware` (populates `req.customUser` from the `sp_session` cookie — server/middleware/customAuth.ts) is mounted in `server/index.ts` (`app.use(customSessionMiddleware)`), **not** inside `registerRoutes` (server/routes.ts). `registerRoutes` only wires up route handlers; it assumes the caller already set up the middleware stack the same way `index.ts` does.

**Why: an integration test that builds its own Express app** (`express()` + `registerRoutes(app)`, the pattern used by `tests/gameplanClearPicks.sst961.integration.test.ts` and others) reproduces the routes but not this middleware. Any assertion against a cookie-authenticated route (e.g. `GET /api/auth/me`, anything behind `requireCustomAuth`) will 401 even with a perfectly valid session cookie set on the request — the middleware chain never ran, so `req.customUser` is `undefined` regardless of what's in the DB.

Caught for real, not hypothetically: SST-1466's `tests/auth-google.integration.test.ts` AC-10 test failed the real Pre-Publish Gate (973/983 other tests passed — this was the only failure) with `expected 401 to be 200`, on a test that manually extracted the `sp_session` cookie from a prior response and set it on the next request. The fix was one line: `app.use(customSessionMiddleware)` before `registerRoutes(app)` in the test's `beforeAll`, mirroring `server/index.ts`'s own setup order.

**How to apply:** any NEW integration test that builds its own Express app around `registerRoutes` and needs `req.customUser` to resolve from a real cookie must mount `customSessionMiddleware` explicitly. The pattern already used by several tests (`SST-961` style) sidesteps this entirely by injecting `req.customUser` directly via a fake middleware instead of relying on cookie-based auth — that's fine when the test doesn't care about proving the cookie/session mechanism itself, but AC-10-style "does a real session survive the middleware chain" assertions need the real middleware wired in.

See also [[feedback_verify_fix_site_is_live_before_citing_it]] and [[feedback_guard_the_wire_not_just_the_helper]] — same family of defect (a fix or test proven against a mock of the wiring, not the real wiring).
