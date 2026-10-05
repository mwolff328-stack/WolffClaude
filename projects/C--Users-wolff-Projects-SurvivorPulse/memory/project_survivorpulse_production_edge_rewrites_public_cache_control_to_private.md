---
name: project_survivorpulse_production_edge_rewrites_public_cache_control_to_private
description: Production (survivorpulse.com and the beta replit.app host) answers Cache-Control public as private; the dev preview keeps public. Observed 2026-10-03 on /api/public/week-picks and the entry bundle. Do not read a header diff dev vs prod as a code bug.
metadata:
  node_type: memory
  type: project
  originSessionId: 7c6d8f94-f9c3-47a3-af85-dc71bdbecb22
  modified: 2026-10-03T19:37:40.418Z
---

On 2026-10-03, right after the REL-65 publish, `GET /api/public/week-picks?week=1` (signed out) returned
`Cache-Control: private, max-age=60` on BOTH production hosts, while the deployed dev app returned
`public, max-age=60` for the same request. The route sets `public, max-age=60` (server/routes.ts, SST-1797 audience
header split), so something in front of production rewrites `public` to `private`. The static entry bundle also reads
`private, max-age=0` there.

**Why it matters:** a header check against dev will say `public`, a header check against production will say
`private`. That is the conservative direction (no shared cache stores it), not a regression and not a leak. It also
means the "short shared cache removes the abuse surface" idea in the SST-1797 design rests on the per-IP rate
limiter on production, not on edge caching.

**How to apply:** when smoke-testing cache headers after a publish, assert `Vary: Cookie` and the no-store on
refusals (those pass through unchanged), and treat `public` vs `private` on the 200 as an expected dev/prod
difference. Related: [[project_survivorpulse_app_compresses_responses_edge_does_not]],
[[project_survivorpulse_sst1797_signed_out_week_cap_regroomed_after_founder_rulings]].
