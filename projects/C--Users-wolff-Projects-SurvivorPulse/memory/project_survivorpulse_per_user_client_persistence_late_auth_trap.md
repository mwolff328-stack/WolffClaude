---
name: project_survivorpulse_per_user_client_persistence_late_auth_trap
description: "Scoping a client-only (localStorage) preference \"per user\" — the late-auth path is the trap that leaks one account's value to another."
metadata: 
  node_type: memory
  type: project
  originSessionId: a8bba028-c120-4e35-8af3-903e9c07745d
  modified: 2026-07-26T17:50:38.379Z
---

Making a client-only persisted preference (localStorage) per-user = suffix the key with `userId`. The subtle bug is the LATE-AUTH path: on an auth-gated page, `/api/me` can resolve AFTER first paint (the page's other data may come from cache). If the `useState` initializer reads the legacy/unscoped key while `userId` is still unknown, that value can masquerade as the real user's selection — and a save effect then overwrites the user's real per-user key with it. Two accounts on one browser cross-bleed.

Fix (Game Plan SELECT POOLS, SST-1035, game-plan.tsx): track whether the current value was **fallback-seeded** (init read with no userId) and REPLACE it from the real per-user key once auth resolves — do NOT gate the re-hydrate on `prev === null`, which conflates "no choice yet" with "seeded from fallback". Also gate the save effect on a known `userId` so the pre-auth window never writes/pollutes a key. A code review (not the tests) caught this; the tests seeded the legacy key without mocking `useAuth`, so over-aggressively dropping the fallback read broke them — the fallback-seeded-tracking approach preserves both the test and the fix. See [[feedback_survivorpulse_fetch_and_search_before_work]] for the concurrent-session branch discipline that surrounds this work.
