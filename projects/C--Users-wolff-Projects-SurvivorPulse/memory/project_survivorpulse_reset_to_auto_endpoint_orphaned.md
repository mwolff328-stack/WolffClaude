---
name: project-survivorpulse-reset-to-auto-endpoint-orphaned
description: "SST-860's make-picks reset-to-auto endpoint has no UI caller; its multi-pick picks[0] data loss is already SST-873 (Backlog/Low)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 89b5ba11-51aa-47eb-ba9b-c7413c494d78
  modified: 2026-09-11T11:23:20.707Z
---

As of 2026-09-11 (git grep on 2026-v1 @ bd0bff1b): `POST /api/entries/:entryId/:scheduleType/:season/picks/:periodKey/reset-to-auto` (server/routes.ts ~7993) is registered but has **no UI caller**. Its only client caller is TeamPickerModal's resetMutation. The button needs `cell.autoPickComputable === true`, which is set only inside the `<PickGrid>` component, and that component has zero production renderers. Game Plan's own reset route (SST-874's code) was deleted by SST-1254 (founder, 2026-08-03: "do not resurrect").

The handler reads only `entryAllocation.picks[0]`, and `replaceEntryPeriodPicks` deletes the whole period first, so a multi-pick week loses slot 2. That is **already ticketed as SST-873**, whose title literally says "not just picks[0]". It is Backlog/Low, and was re-verified and written up on 2026-09-11. Don't re-investigate or re-file it. A fix only matters if a reset control is revived; retiring the endpoint instead is an open Pam/founder call.

**Why:** a session was spawned on 2026-09-11 to TDD-fix this as a "likely pre-existing bug" without knowing SST-873 existed. Re-deriving the reachability trace took a full investigation pass.

**How to apply:** before touching this route or its client reset code, read SST-873, SST-874 and SST-1254 first. If a reset control is ever revived, its `!isMultiPick` client gate uses `getPicksForPeriod`, which ignores the legacy `overrides.regular_season` key that the server's `getRequiredPickCount` still honours. Related: [[project_survivorpulse_pickgrid_dead_seasongrid_shared]], [[feedback_survivorpulse_fetch_and_search_before_work]].
