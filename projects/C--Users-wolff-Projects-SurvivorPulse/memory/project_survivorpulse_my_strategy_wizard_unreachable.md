---
name: survivorpulse-my-strategy-wizard-unreachable
description: "The 5-step My Strategy wizard (my-strategy.tsx, Step1-5*.tsx) is completely unreachable by real users — /strategy permanently redirects to /game-plan, no /my-strategy route exists."
metadata: 
  node_type: memory
  type: project
  originSessionId: fd2a6533-9f56-4aba-bc36-5e4f6343c6e7
  modified: 2026-08-03T15:46:07.646Z
---

`client/src/router-v1.tsx:328` redirects `/strategy` → `/game-plan` unconditionally (the "SS-1 freeze", landed 2026-07-30 in commit 45d91095). No `/my-strategy` route is registered anywhere. The router's own comments are explicit: "the route itself is unreachable via nav" (`router-v1.tsx:73-74, 323-328`). Confirmed both by reading source and empirically in a live browser (forcing client-side navigation to `/strategy?step=1` redirects to Game Plan before the wizard ever mounts).

This means `my-strategy.tsx` and every `Step1SeasonDebrief.tsx`–`Step5Review.tsx` component are dead code from a real-user standpoint today, even though they're actively maintained (SST-1204 and SST-1247 both touched `Step1SeasonDebrief.tsx` and `useWizardApi.ts` on 2026-08-03, and the files carry no deprecation warnings in their own headers).

**Why: SS-7 (SST-690) extracted pieces of the wizard into standalone `/tools/*` pages** (`RoadmapToolPage`, `RoiProjectionToolPage`) that don't depend on the wizard shell.

**Founder-confirmed 2026-08-03: the My Strategy wizard is deprecated with NO plans to bring it back** — not a speculative "could resurface" risk. This resolves an open question a reviewer raised during SST-1252 (the linked Epic "2026-v1 My Strategy Workflow" / SE-78 shows Status "No Longer Needed"; that status is accurate, not stale roadmap bookkeeping). Consequence: `my-strategy.tsx`, `Step1SeasonDebrief.tsx`–`Step5Review.tsx`, `StrategyWizardContext.tsx`, and `StrategySelectionModal.tsx` are strong candidates for outright **deletion**, not just continued freeze-and-maintain — same category as the already-deleted `picks-container.tsx`/`my-picks.tsx`/`set-strategy-shell.tsx` subtree (`router-v1.tsx:300-304`). Not deleted as of 2026-08-03; flagged to the founder as a candidate follow-up, not yet actioned.

**How to apply:** before characterizing any bug or defect in `Step1-5*.tsx` / `my-strategy.tsx` as a "live" or "user-facing" issue, check `router-v1.tsx` for the current redirect state first — do not assume reachability from the fact that the files are recently-modified and well-maintained. This bit SST-1252 directly: grooming (Pam, Ann, Deb) characterized a real cache-collision defect in `Step1SeasonDebrief.tsx` as "a live hazard today for any session visiting Home then the wizard," which was wrong on reachability even though the underlying code defect was real. Also relevant: `client/src/components/MyPoolsEntryCard.tsx:311` calls `setLocation('/my-strategy?step=2&...')`, a route that doesn't exist — a live button pointing at a dead destination, filed as its own follow-up (not fixed as of 2026-08-03). If the wizard subtree does get deleted, that button either gets deleted with it or needs a different destination.

See [[project_survivorpulse_dead_page_live_redirect_route]] for the analogous my-picks pattern.
