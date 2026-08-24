---
name: survivorpulse-beta-launch-site-decisions
description: Founder decisions (2026-07-22) governing the Beta Launch public site and beta access model
metadata: 
  node_type: memory
  type: project
  originSessionId: 21161978-e055-4d72-ab00-4e13ee7e87f4
  modified: 2026-08-24T21:14:22.630Z
---

Founder decisions for the V1 Beta Launch (end of July 2026), made 2026-07-22:

⚠️ **Items 1 and 2 were superseded on 2026-07-28 by SST-1097/SST-1098** — the open beta
now lets anyone with the URL sign up with email + password, with neither the access-code
step nor the Stripe step shown (`OPEN_ACCESS_MODE = true` in `shared/accessMode.ts`, see
[[project_survivorpulse_open_access_mode]]). The gated design below is retained, not
deleted, and setting that flag to `false` restores it — so this stays the reference for
what "restore the gates" means. **Items 3–5 and the site strategy below are unchanged and
still binding.**

1. **Beta access**: both invite and request-access paths; every beta user gets a unique access code bound to their email (non-shareable). Beta users must NOT go through Stripe checkout at all (do not reuse the SST-794 $0-price comp approach — it still creates a Stripe subscription).
2. **Pricing**: beta is free for at least the first 5 weeks of the 2026 season, possibly the whole regular season — expiry must be configurable/extendable. Site may hint "paid version coming soon" for non-beta users; no prices.
3. **CMEA multi-entry coordination is prototype-only** — the public site must not claim automated cross-entry coordination.
4. **Competitor naming**: never name PoolGenius/PoolCrunch etc. in public site copy; generic "other sites and tools" is fine. Named comparisons reserved for demos.
5. **Screenshots**: ⚠️ SUPERSEDED — real product screenshots shipped 2026-07-29 (`301c5ef2`, "swap landing page screenshots to My Pools and Game Plan," then cropped tighter in `31c39f77`), two days before this memory's own last edit. `client/src/pages/landing.tsx` renders real PNGs (`beta-my-pools.png`, `beta-game-plan.png`) via `LandingScreenshot`, not placeholders — confirmed live 2026-08-24. Originally: "deferred to Phase 2; Day-1 site uses placeholders."

Site strategy (Paige, approved direction): keep public pages inside the React app; content-as-data (copy in JSON/MD files under client/src/content/); evergreen-only public copy (nothing season/week-specific); backtest credibility claim limited to "5 real NFL seasons, 14 candidate strategies" — no outcome promises.

**Why:** these constrain all public-site copy and the beta-access build; violating #3 or the credibility cap would breach the Product Constitution.
**How to apply:** check any landing/marketing copy change and beta-access implementation against this list before presenting or committing.
