---
name: revisit-pr-gating
description: Reminder to revisit routing SurvivorPulse changes through PRs before season start / paid subscriptions
---

Send Michael a reminder message (do not do the work yet, just prompt him): "It's been 2 weeks — time to revisit the decision on routing SurvivorPulse changes through PRs. On 2026-08-18 we agreed to hold off on requiring PRs for every change while still in Beta and fast-iterating, but agreed to put a lightweight PR gate in place (PR required + CI must pass before merge to main, using the existing Pre-Publish Gate / Release Guardian workflows) before the NFL season starts and SurvivorPulse starts taking paid subscriptions. Ask him: is now the right time to turn this on, or does he want to push it further? If he says yes, offer to set up branch protection on the SurvivorPulse repo requiring a PR + passing CI before merge to main."