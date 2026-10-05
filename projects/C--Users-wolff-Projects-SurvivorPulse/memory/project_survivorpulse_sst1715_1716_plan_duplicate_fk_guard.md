---
name: project-survivorpulse-sst1715-1716-plan-duplicate-fk-guard
description: "SST-1715/1716 (subscription billing, Grooming, due Oct 7) planned their own copy of the hardDeleteUser FK-sweep guard SST-1724 already shipped"
metadata:
  node_type: memory
  type: project
  originSessionId: 1afd29b2-9705-48fa-bcdb-b827c958c771
  modified: 2026-10-01T13:08:52.505Z
---

SST-1715 (Subscription Billing — Three Cadences) TC22 and SST-1716 (Multi-Entry Add-On Pricing) TC20 both plan a `hardDeleteUser` test for new tables (`purchases`, `entry_billing`) with a mechanism description — "enumerate the full users.id FK list from information_schema/schema.ts and assert the delete handles every referencing table" — that is word-for-word what [[feedback_harddeleteuser_fk_gaps_recur_audit_full_fk_list]] led to: `tests/hardDeleteUserFkCoverage.tripwire.test.ts`, built and shipped by SST-1724 (Done 2026-09-30).

**Why:** Neither ticket was written with knowledge that SST-1724 would land first (both are in Grooming, same Oct 7 deadline window, independent authorship). Without catching this, whoever builds SST-1715 would likely duplicate the guard mechanism from scratch instead of just adding the new tables' `users.id` FK fields to `shared/schema.ts` and letting the existing guard pick them up automatically.

**How to apply:** Flagged via comments on both tickets (2026-10-01). When SST-1715 actually gets built: (1) do NOT build a second FK-enumeration test, (2) DO verify the existing guard's extraction regex actually matches however `entry_billing`'s/`purchases`' user-reference column ends up declared (it expects a single-line `propName: varchar("col").references(() => users.id)` field) — run the suite and diff the `it.each` count before/after adding the table rather than assuming it picked it up, (3) the real remaining work for TC22 is the hardDeleteUser *behavior* decision (delete vs. nullify ledger rows), which is still an open founder question (retain-anonymised vs. delete-with-user) independent of the guard.
