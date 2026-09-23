---
name: feedback-harddeleteuser-fk-gaps-recur-audit-full-fk-list
description: "hardDeleteUser has hit the same class of bug twice (missing FK cleanup steps) — audit the full FK list, don't patch one table at a time"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 882f4494-1a62-47f7-a692-909cb44c4a01
  modified: 2026-09-23T13:40:03.244Z
---

`storage.hardDeleteUser` (server/storage.ts) enumerates specific tables/steps to null out or delete before the final `DELETE FROM users`. This has now caused two separate live incidents from the same root cause: a table with a `references(() => users.id)` FK simply wasn't in the step list, so deleting a user with a row in that table threw a raw, unhandled FK violation surfaced as an opaque 500.

- **SST-940** (pre-existing, see `tests/sst940HardDeleteUserFkSafety.integration.test.ts`): `pick_confirmations.entry_id` was removed from the shared `deletePickDataForEntriesTx` step and nothing caught it.
- **2026-09-23** (this incident): `beta_access_codes.issued_by_user_id`/`redeemed_by_user_id` and `founding_member_feedback.user_id` (NOT NULL) were never in the step list at all. A real beta tester who redeemed a code and submitted an in-app "delete my account" feedback form couldn't have their account permanently deleted — Admin Hub's Perm. Delete threw a 500. Fixed in commit `c81c0579`, shipped and validated on prod 2026-09-23.

**Why:** Each fix so far has been reactive — a specific table is discovered missing only when a real user's data happens to hit it. The existing SST-940 test doesn't (and structurally can't) catch gaps in *other* tables, because its fixture only seeds `pick_confirmations`-adjacent data. A test whose fixture can't violate a requirement outside its own narrow class gives false confidence that "hardDeleteUser is tested" (see [[feedback_a_premise_measured_at_a_boundary_inherits_it]] and [[feedback_sweep_for_the_class_not_the_change]]).

**How to apply:** Before trusting `hardDeleteUser` again, grep `shared/schema.ts` for every `references(() => users.id)` (16 hits as of 2026-09-23) and cross-check each one against the transaction's step list in `server/storage.ts`. `broadcasts.createdBy` (notNull, admin-only) was still unhandled as of this incident — low risk since regular users don't create broadcasts, but it's the same latent gap pattern and should be closed proactively rather than waiting for a third live incident. Consider a source-level tripwire test that walks the schema for `users.id` FKs and asserts each one is referenced somewhere in `hardDeleteUser`'s body, rather than one-off integration tests per table (see [[feedback_guard_the_wire_not_just_the_helper]] for why call-site coverage beats per-table coverage here).
