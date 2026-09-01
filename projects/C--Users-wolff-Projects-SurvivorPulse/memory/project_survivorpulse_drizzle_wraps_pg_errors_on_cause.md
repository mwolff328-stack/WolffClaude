---
name: project_survivorpulse_drizzle_wraps_pg_errors_on_cause
description: Drizzle wraps every query failure in DrizzleQueryError with no code/constraint/detail; the pg error is on .cause, so error.code checks are always undefined.
metadata:
  type: project
---

`drizzle-orm` (0.45.2 here) wraps **every** query failure in a `DrizzleQueryError`
whose own message is `Failed query: <sql>\nparams: <values>` and which carries
**no `code`, `constraint` or `detail`**. The driver's pg error is on `.cause`.

So `(error as {code}).code === '23505'` is `undefined` for every real collision.
Any handler written that way is dead code that silently degrades to a 500.

This shipped in SST-1502 and was green: the retry for the username unique-violation
race never fired, and four race tests passed because the fixture hand-rolled
`Object.assign(new Error(), {code, constraint})` — **a shape the real stack never
produces**. Caught only by an independent code review.

Walk the cause chain (bounded), and build fixtures with the REAL exported class:
`import { DrizzleQueryError } from 'drizzle-orm'` — verified importable, and
`new DrizzleQueryError(query, params, pgError)` reproduces the live shape exactly.

Also: discriminate a unique violation on `error.constraint`, never a substring
search over the whole error. Postgres' detail is `Key (username)=(<value>) already
exists`, so the offending VALUE is in the text too — a signup from
`account_email@x.com` derives the username `account_email` and a haystack search
misclassifies it. See [[feedback_verify_a_reviewers_evidence_not_their_judgement]].
