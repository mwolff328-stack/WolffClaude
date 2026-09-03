---
name: project_survivorpulse_replit_edge_appends_client_ip_last
description: Replit's edge appends the real client IP as the LAST X-Forwarded-For entry; trust proxy 1 makes req.ip the real client. Measured, and the hop count is load-bearing.
metadata:
  type: project
---

Measured on the deployed dev app (SST-1505, 2026-09-02): Replit's edge **appends
the real client IP as the LAST `X-Forwarded-For` entry** and does NOT strip or
replace inbound XFF. So an attacker's injected entries are all to the LEFT, and
the RIGHTMOST entry is the trustworthy one.

Consequence for rate limiting / IP identity:
- `app.set('trust proxy', 1)` makes Express return that rightmost entry as
  `req.ip`. Verified empirically (express+supertest, XFF
  "ATTACKER1, ATTACKER2, REALCLIENT"): **1 -> REALCLIENT (correct); 2 ->
  ATTACKER2; true -> ATTACKER1 (leftmost, attacker-controlled); unset -> socket
  peer (the shared edge address, identical for every visitor).** The hop count
  is load-bearing: too high re-opens the spoof, too low collapses every visitor
  into one bucket (an availability outage). Don't reason about it; measure.
- In production, `trust proxy` was OFF before SST-1505 (it was set only in
  setupAuth / server/replitAuth.ts, dev-gated). SST-1505 sets it app-wide in
  `registerRoutes` via `server/clientIdentity.ts` (TRUSTED_PROXY_HOPS, default 1,
  env-overridable and clamped to <=10).
- The `SST-1505` verified path: key rate limiters on `clientRateLimitKey(req)` =
  `normalizeRateLimitKey(req.ip)`. NEVER read `(x-forwarded-for)[0]` for a key.

Before enabling app-wide trust proxy, audit every consumer of
req.ip/req.protocol/req.secure/req.hostname (SST-1505 found them all safe: cookie
`secure` flags are hardcoded NODE_ENV booleans; `server/baseUrl.ts` and
`server/middleware/canonicalHost.ts` validate host against operator allow-lists;
no express-rate-limit). See [[project_survivorpulse_replit_edge_passes_forwarded_host]]
(the edge passes X-Forwarded-Host through unmodified too).

Prod is a SEPARATE deployment (autoscale, behind Google Frontend, and it
additionally requires an `X-SP-Request: 1` header on writes). Confirm prod also
trusts exactly 1 hop before relying on the fix there: ~11 ordinary non-forged
check-email requests should 429 at the ceiling. A differing prod depth is a
TRUSTED_PROXY_HOPS secret flip, not a redeploy.
