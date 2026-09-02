---
name: project_survivorpulse_wrong_api_path_returns_spa_shell
description: "Any request to a non-existent /api/* path falls through to the SPA catch-all and returns 200 with HTML, so a wrong endpoint reads exactly like a successful call — check Content-Type, not status."
metadata: 
  node_type: memory
  type: project
  originSessionId: 2856bfb1-bb70-49e6-8018-c66425f266c6
  modified: 2026-09-02T00:09:30.945Z
---

A request to an `/api/*` path that matches **no registered route** is not a 404.
It falls through to the SPA catch-all (`setupVite` / `serveStatic`) and returns
**HTTP 200 with `Content-Type: text/html`** — the app shell. Verified
2026-09-01: `POST /api/auth/login` (a path that does not exist) returned 200 and
a `<!DOCTYPE html>` body, which read as a successful login until the headers
were inspected. The real endpoint is **`POST /api/auth/signin`**
(`server/authRoutes.ts`; the router is mounted at `/api/auth`, so the handler is
declared as `router.post('/signin', …)` and greps for `'/api/auth/signin'` in
`server/` find nothing — grep the client instead: `client/src/pages/login.tsx`
calls `apiRequest("POST", "/api/auth/signin", …)`).

`sp-live-verify` documents this for `DELETE /api/pools/` with an empty id, but
it is **not specific to that route or to empty path segments** — it is how every
unmatched `/api/*` path behaves, including typo'd and renamed ones.

**Why:** a status-only check inverts its own meaning here. `curl -w "%{http_code}"`
reporting 200 is the single most natural way to verify an API call, and it is
precisely the check that cannot distinguish "worked" from "this route does not
exist". Scripts that branch on `[ "$code" = "200" ]` will take the success path
on a completely wrong URL.

**How to apply:** when probing any API endpoint by hand or in a script, assert
the **Content-Type is JSON** (or parse the body) before believing the status —
`curl -D - -o body.json` then check for `application/json`. Treat an HTML body
from an `/api/*` path as "no such route", and go find the real one in the client
caller rather than in `server/`, where the mount prefix hides it. Related:
[[feedback_verify_the_commit_not_the_exit_line]] for the sibling problem of a
shell step reporting success while doing the wrong thing, and
[[project_survivorpulse_split_route_registration]] for why a route you cannot
find in `routes.ts` may still exist.
