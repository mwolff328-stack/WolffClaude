---
name: survivorpulse-new-test-file-can-trip-a-tree-scanning-tripwire
description: "A new test file that imports a guarded symbol can turn a tests/ tripwire that scans client/src red; the author's \"neighbour suites\" run misses it, only the gate or a sweep of tree-scanning suites catches it"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c9ab76e2-3a95-49c9-bce6-b72b1b340791
  modified: 2026-09-20T19:15:40.017Z
---

SST-1700 (2026-09-20): Deb's new `client/src/lib/__tests__/effectivePopularityQuery.rateLimited.sst1700.test.ts` imports `saveOverrides`/`resetOverrides` by name. `tests/effectivePopularityWriteImportGuardrail.sst1646.test.ts` scans every `.ts/.tsx` under `client/src` (tests included) and requires EXACTLY two importers, so it went red. Every author-side run was green (agents choose their own "neighbour suites"; this one lives under `tests/`, outside the client project). Vlad found it only by sweeping suites that scan `client/src`; the pushed gate would have gone red otherwise.

**Why:** an author's neighbour run proves nothing about tripwires that read the tree, and a new file anywhere under `client/src` (tests included) is inside their scan.

**How to apply:** when adding a file under `client/src` that imports a guarded symbol (or names a pinned string), grep `tests/` for scanners of `client/src` (`CLIENT_SRC`, `readdirSync`, `readFileSync` over source) and run them ALL before pushing. Fix the guard by path-shape exemption with the exemption's own shape pinned (see the SST-1646 guard, `isTestFile`), not by weakening the count. Related: [[project-survivorpulse-new-pool-route-trips-two-guard-suites]], [[feedback-a-test-named-for-a-spec-item-claims-it]].
