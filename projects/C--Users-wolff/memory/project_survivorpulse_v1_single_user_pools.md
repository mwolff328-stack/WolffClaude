---
name: project_survivorpulse_v1_single_user_pools
description: "2026 v1 launch constraint: pools are SINGLE-USER (one owner's entries only); admins manage other users' pools via Admin Hub > Users. Collapses several multi-user assumptions."
metadata: 
  node_type: memory
  type: project
  originSessionId: 8f10d85a-d2da-48f8-95e3-32dc4aa42a12
  modified: 2026-07-23T14:41:52.462Z
---

**Founder ruling 2026-07-23:** for the **2026 v1 launch**, multiple users adding or managing entries in the same pool is **NOT allowed**. A pool's entries belong to one user. **Only exception:** ADMIN users can access and manage another user's pools through the **Users feature in Admin Hub**.

## What this collapses — check before reasoning about "other users' entries"

- **"My last entry" == "the pool's last entry."** `server/routes.ts:6800` already guards on `storage.getEntries(entry.poolId).length <= 1`. Under single-user pools that IS the caller's last entry, so a separately caller-scoped guard solves a case the product forbids (SST-965 — reduced to UI-only on this basis).
- **The joined-pool lockout** (delete your only entry in a pool where OTHERS hold entries → `canParticipateInPool` no longer admits you → admin-only recovery) is **not reachable in v1**. It becomes real only if multi-user pools ship later.
- **"Joined-not-created" user branches** (e.g. SST-960 AC-20's "ask the pool's commissioner") may be unreachable in v1. Harmless and correct if multi-user arrives; do not treat their existence as evidence multi-user is supported.

## What it does NOT collapse

- **The admin-scope defect class is still live**, because Admin Hub is the exception. `canWriteEntry` (`server/services/pickWriteAuthzService.ts:20-22`) returns true for **every** entry in a pool when `role === 'ADMIN'`, so an admin acting on another user's pool is acting on entries they do not own. SST-962's fix (count the entries the SERVER will act on, not the caller's own) stays correct. See [[project_survivorpulse_se91_batch2_outcome]].
- **The distinction between `canEditPoolSettings` (creator OR admin) and `role === 'ADMIN'`** still matters. Using the former overstates scope for a non-admin creator.

## ⚠️ CORRECTION 2026-07-23 — multi-user pools ARE reachable. The collapse holds for a different reason.

I first recorded that pools cannot hold entries from two users because no route creates an entry for another user. **That reasoning was incomplete and the conclusion as stated is wrong.**

`POST /api/pools/:poolId/entries` (`server/routes.ts:5016`) is gated by `canAccessPool`, which returns `true` for **any `role === 'ADMIN'` on any pool** (`routes.ts:197-204`). `userId` is still hardcoded to the caller (`:5060`) — so create-on-behalf genuinely does not exist — but **an ADMIN can add their OWN entry to another user's pool**, producing a two-user pool. "One user per pool" is **not strictly invariant**.

**Why SST-965's ruling still holds:** the asymmetry only runs the safe way. `poolEntryCount >= callerEntryCount` always, so
- dangerous divergence (UI enabled, server refuses) needs `callerCount >= 2 && poolCount <= 1` — **arithmetically impossible**;
- the only real divergence is `callerCount 1 / poolCount 2`: the UI disables a delete the server would have allowed. **Over-strict, never over-permissive.**

So rely on the **inequality direction**, never on "only one user's entries exist".

**Generalisable lesson:** *"no route does X" is not "X cannot happen."* Two of us proved no route creates an entry FOR another user and both missed an admin creating one FOR THEMSELVES in someone else's pool — same resulting shape. When establishing an invariant, enumerate the STATES that violate it and show each is unreachable; do not enumerate the mechanisms you happened to think of and conclude from their absence.

Related: [[project_survivorpulse_se91_batch2_outcome]], [[feedback_survivorpulse_hollow_fixtures]]
