# Fix Red CI Before Shipping More Features

**Extracted:** 2026-06-21
**Context:** SurvivorPulse 2026-v1 redesign branch. Daily briefs flagged the Replit Sync workflow failing six straight runs (#131-136) plus a Playwright (ephemeral) CI failure, while feature work (Pools Dashboard, Playwright back-tester) kept shipping on the same branch.

## Problem
Feature work continued on the 2026-v1 branch while its CI pipeline (Replit Sync workflow, Playwright CI) stayed red for days. Green features on a red pipeline hide regressions and silently raise the cost and risk of every later ship. The breakage surfaced in daily briefs repeatedly but stayed a "standing blocker" instead of getting fixed.

## Solution
Treat a red feature-branch pipeline as a stop-the-line event, not background noise.

- Before starting the next feature, get the failing workflow green. Start from the first failing stage and the first error line.
- - If you cannot fix it now, explicitly quarantine or disable the broken check with a tracked follow-up, so "red" means something again.
  - - Keep infra docs current: survivorpulse-infra documents the Pre-Publish Gate and Release Guardian workflows but not the Replit Sync workflow that runs on feature branches. Add it.
   
    - ## When to Use
    - - A CI workflow (Replit Sync, Pre-Publish Gate, Release Guardian, Playwright) has failed more than ~2 consecutive runs on an active branch
      - - You are about to start new feature work on a branch whose CI is already red
        - - A daily or weekly brief surfaces the same "CI broken" line two runs in a row
          - 
