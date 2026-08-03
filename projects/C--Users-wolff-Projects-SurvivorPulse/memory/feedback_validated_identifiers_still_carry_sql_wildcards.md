---
name: feedback_validated_identifiers_still_carry_sql_wildcards
description: "A regex-validated identifier is not automatically safe in a LIKE pattern — underscore is a wildcard, so a validated run id like my_run also matches myXrun, widening a hard-delete script's target set."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7712f21a-824b-429a-99af-c5912cfcc4e1
  modified: 2026-08-02T01:22:02.379Z
---

An identifier that passed a strict shape check still is **not** safe to interpolate into a SQL
`LIKE` pattern. The check proves it is well-formed; it says nothing about whether its characters
mean something to `LIKE`.

**Postgres `LIKE` has exactly two wildcards: `%` and `_`.** The underscore is the one that gets
missed, because it looks like an ordinary identifier character and is permitted by almost every
"safe token" regex ever written.

**The case (SST-1216, 2026-08-02).** SST-1214's `fixtureRunId.ts` validates run ids against
`RUN_ID_SHAPE = /^[a-z0-9][a-z0-9_-]{3,63}$/i` — deliberately conservative, explicitly to stop
regex metacharacters and whitespace reaching a description that cleanup later matches on. The
obvious next step in `cleanup-test-pools.ts` was to select the run's pools in SQL:

```sql
WHERE description LIKE '%[e2e-run:' || $1 || ']%'
```

That is broken for any run id containing `_`, which the shape permits. A run tagged `my_run`
would also match `myXrun` — **another run's rows**, in a script that hard-deletes against real
databases. Precisely the widening the ticket's required case 3 ("leaves a pool carrying a
DIFFERENT run's tag untouched") exists to prevent, arriving through SQL semantics rather than
through a sloppy predicate.

The fix is not to escape the underscore. It is to keep the decision out of SQL:

1. **Coarse prefilter in SQL on a CONSTANT substring** — `LIKE '%[e2e-run:%'`. The literal
   contains no `%` or `_`, so nothing user-derived reaches the pattern language.
2. **Precise decision in application code**, against the already-validated predicate
   (`isTaggedWithRun`), which fails closed on an untagged row, a malformed id, or a different
   run's id.

**How to apply:**

- Before putting any value in a `LIKE` pattern, ask what its **allowed alphabet** is, not
  whether it is validated. If `_` or `%` is permitted, it is a wildcard.
- Prefer prefilter-in-SQL + decide-in-code whenever the predicate already exists and is tested.
  It is also easier to unit-test, since the decision no longer lives in the database.
- Treat this as sharper for **destructive** paths. A false positive on a `SELECT` is a wrong
  answer; on a hard delete it is someone's data. The blast radius is what makes the underscore
  worth checking every time.
- Note the analogous trap in the other direction: an **exact-match allowlist** compared with
  `===` is safe where a prefix regex is not — see the `E2E_THROWAWAY_HOSTS` comment block in
  `scripts/lib/disposableDbHost.ts`, which chose exact string equality over a prefix pattern
  for the same class of reason.

Related: [[feedback_proving_a_test_is_load_bearing]],
[[feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect]],
[[feedback_guard_the_wire_not_just_the_helper]]
