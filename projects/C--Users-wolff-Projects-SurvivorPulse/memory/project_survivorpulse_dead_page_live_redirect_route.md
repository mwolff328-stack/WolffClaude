---
name: project_survivorpulse_dead_page_live_redirect_route
description: "A dead page's route can still be load-bearing; and measure a dead-code cascade by exclude-and-diff on the import graph, never by reading the file list."
metadata: 
  node_type: memory
  type: project
  originSessionId: 91b4851b-10a5-46bd-9b86-36862c90f1b4
  modified: 2026-07-31T01:26:24.402Z
---

Removing an unreachable page in SurvivorPulse, two things that a file-by-file read gets wrong:

**1. The route outlives the page.** `/picks` and `/my-picks` render nothing (SST-827
redirected both to `/game-plan`), but the `<Route>` entries are still load-bearing:
`PortfolioROIDrawer.tsx`, `RoadmapToolPage.tsx` and `RoiProjectionToolPage.tsx` all still
`navigate("/picks")`, and `MobileBottomTabs.tsx` lists both in the Game Plan tab's
`matchPrefixes`. Deleting the "unused" routes 404s three live CTAs. Delete the component
and the router *import*; keep the redirect, and say why in a comment so the next cleanup
pass doesn't undo it. `e2e/portfolio-roi.spec.ts:267` asserts that exact href.

**2. Measure the cascade, don't read it.** The brief scoped this at 3 files / 1,750 LOC.
The real blast radius was 32 modules / 10,499 LOC — `set-strategy-shell.tsx` and most of
`components/strategy/` were reachable *only* through the same dead root. Method: walk the
static import graph from both entries (`main.tsx`→`App.tsx` and `main-v1.tsx`→`App-v1.tsx`,
resolving `@/` and `@shared/`), then re-walk with the root excluded and diff the unreachable
sets. Validate the method on a known survivor — `StrategySelectionModal` correctly stayed
alive via `Step4ProjectROI`. Two path traps: resolve ROOT to absolute (mixing relative walk
paths with `path.resolve`d import paths silently reports everything as dead), and remember a
module imported by the router purely "so the file is not orphaned" still counts as reachable,
so the plain walk will never flag it.

Corollaries seen the same session: vendored `components/ui/*` shadcn primitives in the
cascade should be RETAINED (15 others are already unreachable-and-kept — deleting one is
inconsistent); and a "cross-consumer" test whose whole premise is *two* consumers should be
deleted, not trimmed to one. See [[feedback_sweep_for_the_class_not_the_change]].

The two optimizer endpoints `my-picks.tsx` was sole caller of (`batch-hub-recommendations`,
`make-picks-allocation`) were left LIVE — SST-1124 had just added auth + guard tests to
both. That blocker cleared when SST-1124 landed on `2026-v1`.
