---
name: feedback_limiter_slots_held_by_single_flight_waiters_starve_other_requests
description: SST-1672 -- a FIFO concurrency limiter plus a single-flight memo made the batch route 2.4x SLOWER on dev while 74 tests and byte-identical output stayed green; only the live before/after measurement (AC-27) caught it. Fix = run one leader entry first.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dedfca8e-b67e-44c6-bdf5-3a7cbc2b39bf
  modified: 2026-09-19T02:33:09.738Z
---

SST-1672 slices 1-6 (bounded fan-out via a process-wide FIFO limiter, L=4, over per-entry work that shares a single-flight ranking memo) shipped green everywhere and made the deployed dev app ~2.4x SLOWER (Season Grid W=4 median 2.2s -> 5.1s, W=18 6.2s -> 14.7s), byte-identical output, zero errors.

**Why:** the limiter admits FIFO, so the first request's L entries took every slot. Only ONE entry computes the shared ranking; its siblings wait on the flight WHILE HOLDING slots, so other requests' rankings could not start and rankings serialised across requests. The old sequential loop ran one stream per request in parallel, so per-request "sequential" beat "globally bounded".

**How to apply:**
- Any limiter placed over work that shares a single-flight/memoised computation must not let waiters hold slots. Warm the shared thing first (one leader through the limiter), then fan out siblings. Slice 7 did exactly that (`const [leaderId, ...siblingIds]` in `entryRecommendationsBatchHandler`).
- A bounded-concurrency change is a perf REGRESSION RISK, not just a perf win: unit tests with mocked storage cannot see head-of-line starvation. The live before/after (AC-27) is the only oracle; take BEFORE before pushing, and compare with a control endpoint (`GET /api/me` ~85ms when the dev server is quiet; ~1s+ means unrelated load, discard the run).
- The failing test that proved the mechanism before the fix: two requests, a per-context flight model, assert both requests' rankings start (RED: "expected 1 to be 2", limiter active 4 / queued 12).
- Measurement recipe that worked: in-page `fetch` POSTs fired all weeks concurrently (Season Grid pattern) via claude-in-chrome, first run in the background (`window.__done`) and poll, because the javascript tool times out at 45s. Hash each response body so before/after equality is proven byte for byte.
