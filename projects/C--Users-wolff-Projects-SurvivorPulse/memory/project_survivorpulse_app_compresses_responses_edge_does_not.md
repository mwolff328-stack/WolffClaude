---
name: project-survivorpulse-app-compresses-responses-edge-does-not
description: "Replit's edge serves identity bodies, so the app itself compresses responses (SST-1792 middleware); exclusions list, admin users stopgap, and the doc claim that was false"
metadata:
  node_type: memory
  type: project
  originSessionId: dedfca8e-b67e-44c6-bdf5-3a7cbc2b39bf
  modified: 2026-10-02T18:52:47.075Z
---

Before 2026-10-02 nothing compressed anything: the production edge (Server: Google Frontend) returned the 2.77 MB main bundle with no `Content-Encoding` even for `Accept-Encoding: gzip, br`. A stale comment at `server/routes.ts` claimed an "earlier layer (compression, cors)" existed; it did not (a doc saying something exists is not evidence, see [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]] for the mirror case).

SST-1792 added `server/middleware/responseCompression.ts` (compression@1.8.2, brotli q4, gzip 6, 1024 B threshold), mounted in `server/index.ts` directly after `canonicalHostRedirect`. It skips Range/206, `Cache-Control: no-transform`, the `x-no-compression` request header (curl-only: not in the CORS allow-headers), and `EXCLUDED_SECRET_PATHS` (BREACH): `/api/admin/beta-access` and, as a STOPGAP, `/api/admin/users`.

**Why this matters later:** (1) `/api/admin/users` must be removed from the list when SST-1794 (admin routes return `passwordHash`) lands, otherwise the stopgap becomes permanent. (2) A new route that returns a secret credential in a JSON body must be ADDED to the list by hand; the inventory was a grep, not a proof. (3) Express 5 routing is case-insensitive here, so path guards must normalise (lowercase, strip trailing slash) the way `supportSession.ts` `normalizePathForBlocklist` does; the first version failed open on `/API/Admin/Beta-Access`. (4) Measured: bundle 24.9% br / 26.2% gzip of raw; 50-entry batch JSON 0.22% of raw on the live dev app. (5) Post-publish check still owed to SST-1796: confirm `https://survivorpulse.com/assets/index-*.js` returns `Content-Encoding`. (6) HEAD requests are never compressed by the library; AC8 was amended for that.

**How to apply:** when someone reports "slow first load" or large payloads, check `Content-Encoding` first (curl with `Accept-Encoding: gzip, br`) before profiling compute; the long immutable cache for hashed assets is SST-1796.
