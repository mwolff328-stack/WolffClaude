---
name: project_survivorpulse_support_mode_is_server_side
description: Admin Support Mode is a server-enforced acting-as session (SST-1439); the old ?supportUserId= query param is retired as a context mechanism.
metadata: 
  node_type: memory
  type: project
  originSessionId: b1702ff6-f38a-4ca1-a935-e054bfa64700
  modified: 2026-08-23T08:37:06.711Z
---

**As of SST-1439 (2026-08-23, `4d0b9b5d..8308b085`), admin Support Mode is server-side.** Do not reason about it from the old `?supportUserId=` convention — that param is **retired as a context mechanism** and `PoolCard` no longer emits it.

How it works now:
- `sp_support_target` HttpOnly cookie, valued `${adminId}:${targetId}` and **bound to the issuing admin** (a different admin on a shared browser profile is refused).
- `supportSessionMiddleware` (`server/middleware/supportSession.ts`) mounted at **`['/api', '/objects']`** — deliberately not global (a bare mount costs a `storage.getUser` per static asset and per Vite module), and deliberately not `/api`-only (that made `GET /objects/*objectPath` unreachable).
- Validation is **continuous, per request**: target must exist, be ACTIVE, not soft-deleted, and be in the `USER`/`TEST_USER` **allowlist**. Every failure path falls closed to the admin's own identity.

**The invariant everything rests on:** `req.customUser` is ALWAYS the ADMIN. `resolveEffectiveUserId(req)` returns the target **for DATA SCOPING ONLY**. Authorization (`canAccessPool`, `canParticipateInPool`, `canWriteEntry`) and audit (`logAuthEvent`) must keep reading `req.customUser`.

⚠️ **The trap that bit this story twice.** "Should this read resolve?" is NOT answered by whether it is a user id — it is answered by whether the id is *data scoping* or an *authorization predicate*.

- `POST /api/entries/:entryId/financial-records`, `PATCH` and `DELETE /api/financial-records/:id` look like scoping, but `pnlService` filters on the user id with **no ADMIN bypass** — the id IS the authz check. Resolving them handed admins create/edit/delete access to other users' money rows, attributed wholly to the target, with no audit event and no actor column. Reverted; they stay on `req.customUser`.
- The same reasoning keeps `clearStaleProposedPicksHandler` unresolved (its `user` reaches only `canWriteEntry` and `logAuthEvent`; it scopes from body-supplied entryIds).
- Conversely, routes that DERIVE a new row's owner from the caller **must** resolve, even with a `:poolId` in the URL — `poolEntryCreateHandler`, `poolEntryCreationFailureHandler`, `POST /api/pools/:poolId/join`, `POST /api/me/gameplan/pools/:poolId/entries`. Leaving those unresolved created **admin-owned rows inside the target's pool**, which render normally and are visible only in the `userId` column.
- A route that writes FOR someone else must authorise that someone else too. `POST /api/me/gameplan/pools/:poolId/entries` gated only on the caller, whose ADMIN bypass returns true for any pool — so an admin could add a real user to a stranger's pool.

**`GET /api/me` returns the TARGET's identity while a session is active**, plus a `supportSession: { admin, target }` envelope. Consequence: client `isAdmin` goes **false**, the Admin Hub nav disappears, and `AdminGuard` bounces `/admin/*`. That is intended. The banner's exit control is therefore the only way back and is **never gated on `isAdmin`**. `SubscriptionGateShell` also always renders the shell during a session, so a non-entitled target cannot strand the admin behind a bannerless paywall.

Blocked while a session is active (`rejectBlockedSupportModeActions`, mounted beside `rejectReadOnlyWrites`): Stripe checkout/attach, `/api/auth/password/change`, `/api/auth/profile`, signout and signout-all, beta-access invite/approve/reject/revoke, and founding-feedback. Paths are normalised for case and trailing slash first — Express 5 here routes non-strictly and case-insensitively, so `/API/auth/signout` and a trailing slash both reached the handler before that was added.

`tests/supportSessionRouteCoverage.test.ts` is a ratchet over the re-derived route table: a NEW identity-scoped route added without the resolver fails it. Related: [[feedback_guard_the_wire_not_just_the_helper]], [[feedback_a_source_guard_must_assert_the_wire_is_reached]], [[project_survivorpulse_route_auth_is_opt_in]].
