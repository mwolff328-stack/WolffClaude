---
name: survivorpulse-copy-exact-headers-from-working-caller-not-route-handler
description: "When documenting/reproducing a call to an existing endpoint, copy headers from a known-working caller, don't reconstruct from the route handler alone"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 255269a3-6f27-4fd5-b269-39109cef76d3
  modified: 2026-10-01T12:00:10.548Z
---

When writing a runbook or new caller for an existing SurvivorPulse endpoint, a route handler's own auth check is not the whole story — global middleware in front of it (e.g. `requireCsrfHeader` in `server/middleware/customAuth.ts`, applied via `app.use('/api', requireCsrfHeader)` in `server/index.ts`) can reject the request first, with a response (`403 Forbidden`) that looks nothing like the route's own documented responses (`401`/`503`).

**Why:** SST-1732's external cron-job.org trigger (POST `/api/internal/scheduled-refresh`) was built by reading only the route handler's `x-cron-secret` check. The existing GitHub Actions workflow calling the same endpoint had already silently solved this — its curl step sends a second header, `x-sp-request: 1`, satisfying the CSRF guard — but that detail was invisible from inside the route handler. The first real test run 403'd before this was caught.

**How to apply:** before documenting or reproducing any call to an existing endpoint, find an existing caller already known to work (another script, a GitHub Actions workflow step, a frontend fetch call) and copy its exact headers/method/body shape, rather than reconstructing the request from the target route's own code. Middleware mounted in front of a handler (CSRF guards, rate limiters, auth layers) is invisible when reading only that handler.

See also [[project_survivorpulse_route_auth_is_opt_in]] for the related fact that route auth itself is opt-in per-route, not default-on.
