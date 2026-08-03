---
name: feedback-duplicate-vi-mock-same-module
description: "Two vi.mock calls for the same module in one test file is a real defect, not redundancy — which factory wins varies by worker, so the file passes alone and fails in a full run."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 934ead4d-d534-45a5-b163-a22e49249c1a
  modified: 2026-07-30T19:40:12.041Z
---

`tests/entryRosterSidebar.test.tsx` registered `vi.mock("@tanstack/react-query")`
**twice**: once near the top returning `{...actual, useQuery}`, and again lower
down returning `{...actual, useQuery, useMutation, useQueryClient}`. Both were
hoisted. Which one took effect varied — and when the FIRST won, `...actual`
handed the component the REAL `useQueryClient`, which throws "No QueryClient set"
because the file renders without a provider.

Symptom: all 28 tests failed in a full `vitest run`, and passed 28/28 in
isolation. Easy to misread as flakiness or as pollution from whichever file
happened to share the worker.

Why this repo is exposed: `vitest.config.ts` uses `pool: 'forks'` with
`maxWorkers: 2`, and its own comment notes this gives module-cache isolation but
**no per-file global isolation**. Adding or removing any test file reshuffles
which files share a process, so a latent duplicate-mock bug surfaces and vanishes
seemingly at random.

**Fix:** merge into one factory holding every export the component touches. Do
not "fix" it by adding a provider to the render — that leaves the duplicate
registration in place to bite the next reader.

**How to apply:** when a test file fails in a full run but passes alone, grep it
for repeated `vi.mock("<same module>"` before blaming another file. And when
partially mocking a module with `...actual`, list every hook the component
actually calls — inheriting one real hook from `actual` is what turns an
ambient dependency into an order-dependent failure.

Related: [[project_survivorpulse_prepublish_gate_mechanism]]
