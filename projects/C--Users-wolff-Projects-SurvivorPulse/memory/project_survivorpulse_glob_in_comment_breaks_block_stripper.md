---
name: project_survivorpulse_glob_in_comment_breaks_block_stripper
description: server/routes.ts has a line comment containing /api/optimizer/* — a naive block-comment stripper opens a comment there and silently deletes 45 of 231 route registrations.
metadata: 
  node_type: memory
  type: project
  originSessionId: b1702ff6-f38a-4ca1-a935-e054bfa64700
  modified: 2026-08-23T08:37:45.526Z
---

`server/routes.ts` contains this line comment:

> `// SST-1139 — EVERY /api/optimizer/* route is authenticated. The audit that…`

The `/*` inside `/api/optimizer/*` **opens a block comment** as far as a naive stripper is concerned. Any tool doing `source.replace(/\/\*[\s\S]*?\*\//g, '')` runs from there to the next real close-comment and **silently deletes 45 of the file's 231 `app.<verb>(` registrations** — including `POST /api/stripe/create-checkout-session`.

The failure is invisible and fail-open: the scan reports a smaller, clean table and every assertion still passes. Measured in SST-1439: **231** registrations raw, **186** under the naive stripper, **231** under a safe one.

**Safe form** — only treat an opener as a comment when it begins its own line, so one inside a string, a regex, or comment prose can never trigger it:

```js
source
  .replace(/^[ \t]*\/\*[\s\S]*?\*\/[ \t]*$/gm, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1');   // the [^:] guard keeps https:// intact
```

Add a meta-test pinning it, because the regression is otherwise undetectable: assert that stripping the literal line `// EVERY /api/optimizer/* route is authenticated.` followed by an `app.post(...)` line leaves the registration intact.

Any repo-wide source scan over `server/routes.ts` inherits this — `tests/supportSessionRouteCoverage.test.ts` and `tests/readOnlySessionGuard.test.ts` both parse that file. Related: [[feedback_a_source_guard_must_assert_the_wire_is_reached]], [[feedback_source_scanning_guards_need_three_meta_tests]].
