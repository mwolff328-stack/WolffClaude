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

## 2026-09-28 finding: PROD's proxy chain is deeper than dev's (SST-1505 follow-up)
- Measured via Admin -> Auth Events (`/api/admin/auth-events`, GET, admin session). At the default trust proxy 1, every prod row from 2026-09-03 on records a Google-range address (34.x / 35.x, dozens of distinct ones), NOT the visitor. Rows before 09-03 (pre-SST-1505, leftmost XFF) were real consumer IPs. So prod is NOT 1 hop like the dev workspace: it sits behind a Google front end that adds its own address to the end of the chain.
- Effect at hops=1: the spoof stays closed (the key is never attacker-controlled), but the limiter key is a varying Google address instead of the visitor. Per-client limiting gets weaker (an attacker's requests spread across the pool) and unrelated visitors can share a bucket.
- Founder set TRUSTED_PROXY_HOPS=2 on 2026-09-28. Rows at 14:43Z (my non-forged failed login), 14:50Z and 15:56Z (the founder's sign-in), all AFTER the change, STILL showed Google addresses (Chrome egress was 73.241.80.179, no VPN). So either the published deployment had not picked up the secret (a workspace restart is probably not a republish) or 2 is not enough. RESOLUTION PENDING: republish, sign in once, re-read; expect the real IP; if still Google, try 3.
- Admin endpoint gotchas: the default page is the newest 20 rows and most are usage events (recommendation_viewed, entries_connected) with a NULL ip. Filter with `type=signin_success|signin_failed|signup_success`; `pageSize` max 100; `page` paginates past the "last 100" wording. Aggregate in-page and print only masked prefixes plus distinct counts, never emails.
- UPDATE 2026-09-28 17:30Z (after the founder REPUBLISHED with TRUSTED_PROXY_HOPS=2): the setting IS live, because every row since (the founder's sign-in plus 6 of my non-forged failed logins, 3 via survivorpulse.com and 3 via survivorpulse-beta.replit.app) is in 35.191.x.x, Google's load-balancer proxy range, where hops=1 gave varied 34.x addresses. Both hostnames land in the same range, so both routes have the same chain depth. Each notch peels one Google-appended entry; the visitor is one more out. NEXT: set TRUSTED_PROXY_HOPS=3, republish, sign in once; success = the row shows the founder's real IP (Chrome egress 73.241.80.179). That address can only be in the chain if infrastructure appended it (a non-forged request carries no XFF of its own), so seeing it proves the boundary is exactly right, neither too low nor too high. If still Google, try 4.
- UPDATE 2026-09-28 19:17Z (hops=3, republished): still not the visitor. The founder's sign-in and a fresh non-forged probe both landed in 34.111.x.x -- a THIRD distinct Google range (after 35.191.x.x at hops=2). So the chain is at least 3 Google-internal hops deep before the real client is reached: outer (hops=1, varied 34.x), 35.191.x.x (hops=2), 34.111.x.x (hops=3). NEXT: hops=4, republish, sign in once, re-read -- success is the founder's real Chrome-egress IP appearing (confirm the current one fresh each time; home IPs can change on their own between sessions, independent of this chain). If 34.111.x.x persists at hops=4 too, that would mean either the chain is even deeper (try 5) or 34.111.x.x is NOT infra-appended but is the actual origin as Replit's autoscale/deploy router sees it (worth checking Replit's own docs/support on how many hops sit between an autoscale deployment and app code, rather than continuing to guess upward indefinitely).
