---
name: project-survivorpulse-moat-gap3-wipeout-readout
description: Status of the competitive-moat Gap 3 (correlation/wipeout risk) response after Duke Survivor Tool shipped an equivalent
metadata:
  type: project
  originSessionId: games-spreads-page-updates-14ddf0
  modified: 2026-09-01T02:37:30.197Z
---

As of 2026-08-29, `docs/competitive-moat-features.md`'s Gap 3 (Correlated Elimination Risk
Score) was flagged as no longer uncontested: competitor Duke Survivor Tool
(survivor.the-duke.app) already ships an equivalent ("DIES score" + correlation tax/bonus) and
is monetizing while SurvivorPulse is free.

**On investigation (Pam, 2026-08-31), the gap was smaller than the moat-doc addendum implied:**
- The "market-odds, not proprietary power rating" positioning claim is already published at
  survivorpulse.com/methodology (SST-840/SST-1143, Done).
- The cross-entry Pick Correlation score is already shipped (`shared/correlationScore.ts`,
  live in the Portfolio Risk Lens, from SST-345/75/568) plus a same-team pick-collision banner
  (SST-894/902).
- The actual missing piece: nothing surfaces a wipeout-risk number on the CURRENT WEEK pick
  screen. That logic is built and validated (`scripts/research/lib/wipeoutMetrics.ts`) but only
  reachable via the admin-gated Back Tester (SST-1426, blocked on an unrelated gate for ~3 weeks).
- A correction comment was posted on the Notion competitive analysis page
  ("Competitive Analysis: Duke Survivor Tool, survivor.app & SurvivorHQ — 2026-08-29") so this
  doesn't get re-scoped as fully unbuilt work in a future session.

**Tickets created:**
- **SST-1497** — Live Wipeout-Risk Read-Out for the Current Week's Pick Screen. High priority,
  Backlog, Epic SE-88. Decoupled from SST-1426's blocked gate. Two open questions before Ready:
  a Curie-boundary language ruling (does the Portfolio Lens's "no risk/verdict language" rule
  apply here) and a live-vs-historical-data feasibility check with Felix.
- **SST-1498** — Name and cross-link the shipped Pick Correlation score. Medium priority,
  sequenced behind SST-1497. Copy/positioning only, no build.

**How to apply:** [[project_survivorpulse_paid_tier_launch_target]] gives SST-1497 a soft
deadline (~2026-09-30/10-01) — Pam's recommendation was to ship the wipeout read-out before the
paid tier launches so pricing launches with a stronger differentiation story. Check SST-1497's
status before assuming this is still open.
