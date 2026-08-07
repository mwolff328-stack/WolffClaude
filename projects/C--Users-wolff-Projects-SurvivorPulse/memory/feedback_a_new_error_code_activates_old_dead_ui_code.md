---
name: feedback-a-new-error-code-activates-old-dead-ui-code
description: Making a route return an error code it never returned before can activate downstream UI code written for a different caller and never re-audited for the new one.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9f1f1f89-441b-4c5c-9762-f1d4fa27a9aa
  modified: 2026-08-07T23:39:32.287Z
---

Before wiring a new producer into an existing error code/response shape (e.g. making a second route start returning a 409 `TEAM_ALREADY_USED` that only one route used to return), grep for every existing consumer of that shape and check whether its remediation logic hard-codes assumptions (an endpoint, a table, a track) specific to the ORIGINAL producer.

**Why:** SST-1299 (SurvivorPulse, 2026-08-07) fixed `proposedPicksPeriodPutHandler` to return the same `409 TEAM_ALREADY_USED` shape Actual's sibling route (SST-1273) already returned, reusing the existing pure `computeTeamReuseConflicts` helper. Correct in isolation. But the client's `TeamPickerModal` remediation panel ("Clear Week N and save here") that consumes that error code was written only for the Actual-track caller — its "clear the conflicting week" flow (`putPeriod`, `handleClearConflictingWeek`) is hard-wired to Actual's `/picks` endpoints. That panel had been structurally unreachable for `track="proposed"` (the Proposed route never emitted the 409), so it was dead code for that caller — until this fix made it reachable. The result: a Proposed-only conflict would have silently read and written the entry's REAL Actual pick history to "resolve" a conflict that only existed in Proposed's history, directly violating a founder ruling (SST-1293) that the two tracks' data must never cross-contaminate. Caught by an independent code-reviewer pass, not by the implementer.

**How to apply:** Any time a fix makes a previously-rare-or-impossible response (a new error code, a newly-reachable branch, a previously-empty array now populated) reachable for a caller that couldn't hit it before, treat every existing consumer of that response shape as suspect — read its full handling logic, not just its type signature, before assuming "same shape in, same correct behavior out." A generic-looking error handler (`isTeamAlreadyUsedError(err)`) can still be silently coupled to one specific caller's side effects.
