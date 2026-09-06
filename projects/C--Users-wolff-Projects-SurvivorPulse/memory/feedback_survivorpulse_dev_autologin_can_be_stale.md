---
name: feedback_survivorpulse_dev_autologin_can_be_stale
description: "The deployed dev Repl's ALLOW_UNSAFE_DEV_FEATURES auto-login can be inactive even when .replit and memory say it should be active -- verify with GET /api/me before trusting the memory, and fall back to signing in with the seeded demo credentials via POST /api/auth/signin."
metadata:
  type: feedback
---

Live-verifying SST-1575 (2026-09-06), the deployed dev Repl at `.replit`'s `DEV_BASE_URL`
returned 401 on `GET /api/me` for a cookieless request -- dev auto-login was NOT active,
contradicting [[project_survivorpulse_deployed_dev_url]]'s confident "auto-login is active
there, no login flow needed" claim. Clearing the `sp_dev_public_view` cookie (`?publicview=0`)
did not fix it either, so the cause is most likely `ALLOW_UNSAFE_DEV_FEATURES` actually being
unset/false on that running Repl instance right now (env drift between what's committed and
what the live workspace has), not a client-side cookie issue -- see
`server/middleware/devAutoLogin.ts`'s `isDevAutoLoginActive()` gate for the exact condition.

**Why:** memory records observed a WORKING state at a point in time; the underlying Repl env
can drift after that (secrets panel changes, a "Published" event, a workspace recreation) with
no local signal to catch it, since `.replit`'s committed `DEV_BASE_URL`/`APP_BASE_URL` say
nothing about the live `ALLOW_UNSAFE_DEV_FEATURES` value.

**How to apply:** before relying on auto-login for a live-verify session, check `GET /api/me`
first (200 bare = active, 401 = not). If 401, don't stop or ask the founder immediately --
sign in directly with the seeded dev demo account via `POST /api/auth/signin` with body
`{"accountEmail": "demo@survivorpulse.test", "password": "DemoPass123!"}` (real credentials,
documented in `server/seedDemoUsers.ts` boot logs, not the founder's). This produced a normal
session cookie and unblocked the rest of the verification with no further auth friction. Note:
the wrong endpoint (`/api/auth/login` instead of the real `/api/auth/signin`, per
`client/src/pages/login.tsx`) silently 200s by falling through to the SPA catch-all shell --
same "wrong /api path returns the SPA shell" trap as [[project_survivorpulse_wrong_api_path_returns_spa_shell]].
Grep the client code for the real `apiRequest("POST", "/api/auth/...")` call before guessing
the route.

Related: [[project_survivorpulse_deployed_dev_url]] (still the right first move for the URL
itself, just not a guarantee about the live auto-login state), [[project_survivorpulse_dev_preview_runs_vite_dev_server]].
