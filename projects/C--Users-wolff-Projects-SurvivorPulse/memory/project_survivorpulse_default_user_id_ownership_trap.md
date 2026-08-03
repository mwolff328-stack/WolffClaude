---
name: project_survivorpulse_default_user_id_ownership_trap
description: "Pools/entries created while dev auth fell back to the stub user (default-user-id / \"existing\") are owned by that stub, so they vanish from the real user's ownership-scoped My Pools and show ONLY under admin \"View all pools\" (scope=all)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 450703be-2d25-4571-a9b8-3dcbb262dcf5
  modified: 2026-07-26T23:14:53.815Z
---

A real pool the founder created can be invisible in his own **My Pools** yet appear under the admin **View all pools** toggle. Cause: `/api/pools` default view is strictly ownership-scoped (`WHERE pools.created_by = <userId>`, storage.getPoolsWithEntryCounts); `?scope=all` (admin-only, getAllPoolsWithEntryCountsAndUsername) drops that filter. So a pool showing only under scope=all means its `created_by` ≠ the current user's id.

Real 2026-07-26 case: "Goldflam Suicide 2025" (id e6e25327-7755-4624-b9e8-7f9e67a974fd, created 2025-09-13) had `created_by = 'default-user-id'` — the **dev stub user** (username "existing", existing@example.com). In `NODE_ENV=development`, a request with missing/unresolved auth headers falls back to that stub (server/auth.ts, customAuth). So anything created during that fallback is owned by the stub, not the real account. Founder's real id = `47230349` (username mwolff328, ADMIN).

Fix = reassign in the Replit SQL console (helium): `UPDATE pools SET created_by='47230349' WHERE id='<poolId>';` and, if entries were also stub-created, `UPDATE entries SET user_id='47230349' WHERE pool_id='<poolId>' AND user_id='default-user-id';`. No code change needed — it's a data fix.

**Why:** looks like a visibility bug or a "test pool" filtering issue but it's neither — it's stale ownership from dev-auth fallback. **How to apply:** when a pool is visible only under scope=all, check `created_by` before theorizing; if it's `default-user-id`, reassign. This is separate from the admin Real/Test marker ([[project_survivorpulse_admin_pool_classification]]) — that badge does NOT change visibility. Verify/mutate on helium only, never a local Neon host (see wrong-host trap in CLAUDE.md).
