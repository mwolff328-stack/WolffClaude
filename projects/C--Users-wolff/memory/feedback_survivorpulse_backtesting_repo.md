---
name: feedback-survivorpulse-backtesting-repo
description: "Backtesting work should only be committed to the main SurvivorPulse repo, not the BackTesting Prototype repo"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c3f6ec2f-55cf-4366-906f-1d9de1041e64
---

All backtesting bug fixes and feature work should be committed to the main SurvivorPulse repo (`mwolff328-stack/SurvivorPulse`, branch `2026-v1`) only.

**Why:** The BackTesting Prototype repo is separate but the canonical work lives in the main repo. Committing to the prototype is wrong.

**How to apply:** When fixing backtesting bugs (e.g., PoolConfigPanel, StrategyTypeSelector, shared.tsx), only commit to `Projects\SurvivorPulse` on branch `2026-v1`. Do not commit the same change to `Projects\SurvivorPulse-BackTesting-Prototype`.
