---
name: survivorpulse-my-strategy-wizard-unreachable
description: "DELETED 2026-08-03 (SST-1261). The 5-step My Strategy wizard (my-strategy.tsx, Step1SeasonDebrief/Step2SelectStrategy/Step5Review) no longer exists in the repo — don't go looking for it, and don't re-diagnose it as 'dead but present' again."
metadata: 
  node_type: memory
  type: project
  originSessionId: fd2a6533-9f56-4aba-bc36-5e4f6343c6e7
  modified: 2026-08-03T17:44:02.625Z
---

**RESOLVED 2026-08-03 (SST-1261): the dead wizard subtree is deleted, not just frozen.** `my-strategy.tsx`, `Step1SeasonDebrief.tsx`, `Step2SelectStrategy.tsx`, `Step5Review.tsx`, `RecommendedPicksByWeek.tsx` (plus their dedicated tests and 3 already-skipped e2e specs) are gone from the repo as of commit `70d8056b`. If you're looking for these files, they don't exist — check `client/src/components/strategy/` (now 8 files, not 12) rather than assuming a grep miss means you searched wrong.

**Survived, still live** (imported by standalone `/tools/*` pages extracted in SS-7/SST-690 — do not delete these on the assumption "the wizard is dead so everything in this directory is dead"): `StrategyWizardContext.tsx`, `Step3RoadmapAhead.tsx`, `Step4ProjectROI.tsx`, `RoadmapGrid.tsx`, `RoadmapDetailPanel.tsx`, `SurvivalCurveChart.tsx`, `roiAssumedFeeSummary.ts`, `StrategySelectionModal.tsx`, `BackTesterReturnBanner.tsx`. The `/strategy` route itself also survives (redirects to `/game-plan`) — kept deliberately for old bookmarks/links, same pattern as `/picks`/`/the-call`/`/my-picks`.

**Original finding, preserved because the general lesson outlasts this specific case:** the wizard was unreachable (`/strategy` permanently redirected to `/game-plan` since the SS-1 freeze, 2026-07-30) for over a month while still being actively maintained (SST-1204/SST-1247 touched `Step1SeasonDebrief.tsx` the same day SST-1252 also fixed a real bug in it — hours before SST-1261 deleted the file entirely). Nobody's diagnostic caught the unreachability at the time; it only surfaced during a live-verification pass for an unrelated ticket.

**How to apply, generalized:** before characterizing ANY bug/defect as "live" or "a real user could hit this," check the router's actual current registration/redirect state first — don't infer reachability from a file being recently-modified, well-commented, or free of deprecation warnings. This class of mistake recurred even within the SAME session that discovered and fixed it: three separate ticket reviews (SST-1252's grooming, then SST-1261's own initial scoping) each initially treated a component as reachable-until-proven-otherwise rather than checking the router first. A related, adjacent instance of the identical trap surfaced incidentally during SST-1261's own build: `client/src/components/MyPoolsEntryCard.tsx` was treated as a live file needing a surgical edit (removing one dead button) because it's genuinely well-maintained, but it turned out the WHOLE FILE has zero live importers too (see task_5f6d30f9, filed not yet actioned) — the same "well-maintained != reachable" gap, one layer deeper.

See [[project_survivorpulse_dead_page_live_redirect_route]] for the analogous my-picks pattern.
