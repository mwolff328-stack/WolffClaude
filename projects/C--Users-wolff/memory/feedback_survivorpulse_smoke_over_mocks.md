---
name: feedback_survivorpulse_smoke_over_mocks
description: "On SurvivorPulse, verify UI-that-calls-an-endpoint with a real-render test against the ACTUAL response shape + a live dev-app smoke — mocked unit tests repeatedly passed while the feature was broken"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8d76c496-896a-47db-9364-babdb8c87726
---

For SurvivorPulse UI work that fetches an endpoint, do NOT rely on mocked unit/render tests alone — they pass while matching the component's own (wrong) assumptions. Add a render test against the REAL API response shape, verify the component is actually REACHABLE in normal navigation, and run a live dev-app smoke before moving an In-Review UI story to Done.

**Why (SST-567/589, 2026-06-22):** three bugs all passed their automated tests but failed on the live dev app —
1. components were **mounted but stranded** (rendered into a route that redirected away) — render tests rendered them in isolation;
2. the pool-detail P&L section was **gated on `selectedEntryId`**, so it never appeared on a fresh Overview — the mount test supplied the id;
3. `PnLPoolSummary` read the aggregate at the wrong nesting level → **`$NaN`** live — the mount test *stubbed* the component, and the parse test mock matched the wrong shape.
The founder-requested dev-app smoke caught all three.

**How to apply:**
- For a component calling endpoint X, add a test rendering the REAL component with a fetch mock shaped EXACTLY like X's real response (verify the shape against the route handler, not by guessing).
- Add a reachability test: the component renders on normal navigation WITHOUT incidental state (e.g., no pre-selected entry).
- Before Done on an In-Review UI story, smoke it on the live Replit dev app (drive via the Chrome extension; the local sandbox can't reach helium).

Related: [[feedback_survivorpulse_dev_workflow]] · [[feedback_survivorpulse_parallel_agents_worktree]]
