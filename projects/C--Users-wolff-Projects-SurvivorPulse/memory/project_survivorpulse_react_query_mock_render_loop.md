---
name: project_survivorpulse_react_query_mock_render_loop
description: "Mocking useQuery to return a fresh array literal per call causes infinite render loops (OOM) in components with a [.., data] effect"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6c0b78b2-4eb7-4add-9f6a-e7faf86d6562
  modified: 2026-07-29T04:53:49.222Z
---

In SurvivorPulse unit tests, mocking `useQuery` like `mockUseQuery.mockImplementation(() => ({ data: [entry], isLoading: false }))` returns a **new array reference on every call**. Any component with an effect keyed on that data — e.g. `useEffect(() => setX(...), [savedOrderData, rawEntries])` — sees a changed identity every render, so the effect re-fires → setState → re-render → new array → **infinite loop → JS heap OOM** (the worker dies, often non-deterministically after other tests pass).

Real `@tanstack/react-query` returns a **referentially stable** `data` for unchanged results, so the app never loops — only the mock violates that contract.

**Fix:** hoist the array to a stable const before the mock: `const data = [entry]; mockUseQuery.mockImplementation(() => ({ data, isLoading: false }))`. Mirrors react-query's real behavior.

Seen in `tests/entryRosterSidebar.test.tsx` (SST-296/307 blocks) against `EntryRosterSidebar`'s customOrder effect. The working `renderSidebar` helper in the same file already used a stable ref; the inline mocks didn't.

Also note: the full unit suite has a separate, pre-existing cumulative-memory OOM at ~7,100 tests — see [[project_survivorpulse_prepublish_gate_mechanism]]; that is NOT the same as this per-mock render loop.
