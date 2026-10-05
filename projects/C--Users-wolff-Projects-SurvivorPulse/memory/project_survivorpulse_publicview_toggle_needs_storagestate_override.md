---
name: survivorpulse-publicview-toggle-needs-storagestate-override
description: A new e2e spec for an anonymous public page must clear storageState AND use ?publicview=1 - either alone is not enough
metadata:
  node_type: memory
  type: project
  originSessionId: 39612460-2a27-4d47-b49e-d48024047efd
  modified: 2026-09-29T12:54:18.982Z
---

2026-09-29 (REL-50, SST-1757): two new Playwright specs (`e2e/duplicatingPicksResearchPages.sst1757.spec.ts`, `e2e/viewBasisPickerFocusFixup.sst1757.spec.ts`) failed every test, both attempts, 100% reproducible - not a flake. Root cause: the `chromium` Playwright project (`playwright.config.ts`) defaults `storageState: 'e2e/.auth/user.json'`, a real authenticated session, for every spec that doesn't override it. `?publicview=1` (`server/middleware/devAutoLogin.ts` lines 107-118) only *withholds the dev-auto-login fallback* - it never signs out a real session; a real cookie authenticates upstream of that middleware and wins unconditionally. So `?publicview=1` alone does nothing when the context already has a real session.

**Why:** three pre-existing specs get this right (`e2e/legal-pages-container-and-rail.spec.ts`, `e2e/sst-1501-public-week-1-picks.spec.ts`, `e2e/sst-1517-public-back-tester-lite.spec.ts`) - each ALSO calls `test.use({ storageState: { cookies: [], origins: [] } })` before navigating with `?publicview=1`. Two are needed together: clear the real session (storageState override) AND suppress dev-auto-login's cookieless fallback (`?publicview=1`). The new specs' own header comment even names the hazard ("a cleared context is NOT anonymous on its own") but only implemented half the fix.

**How to apply:** any new e2e spec asserting anonymous/signed-out behavior on a public page must have `test.use({ storageState: { cookies: [], origins: [] } })` at the top (file or describe level) in addition to `?publicview=1` on the first navigation. Grep both patterns together when reviewing a new "loads anonymously" e2e spec, not just one. This is exactly the kind of thing to check before trusting a green-looking e2e shard - the assertion (`GET /api/me must be 401`) fails loudly with "received 200 and a real user id" when this is missing, so it is easy to diagnose once you know to check `playwright.config.ts`'s project defaults.

Independently confirmed the two shipped pages themselves have no auth gate (live-browsed signed-out on production during REL-49's publish confirmation, fully rendered) - this was a test-authoring gap, not a product defect, but per standing rule it still blocked the ship verdict until fixed or waived.

Related: [[project_survivorpulse_sp_live_verify]], [[project_survivorpulse_env_gated_suites_are_invisible_locally]].
