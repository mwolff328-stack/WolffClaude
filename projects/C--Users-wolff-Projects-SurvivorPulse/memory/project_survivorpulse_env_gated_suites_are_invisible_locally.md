---
name: project_survivorpulse_env_gated_suites_are_invisible_locally
description: 17 test suites are describe.skip locally and only execute in CI; a suite is dead only if BOTH the explicit-list and config-glob invocation paths miss it.
metadata:
  type: project
---

17 suites in `tests/` use `process.env.X === '1' ? describe : describe.skip`,
across three gates — `RUN_DB_REGRESSION_TESTS` (`pre-publish.yml:112`, job level),
`RUN_SIGNUP_EDGE_CASES` (`:113`, job level), `RUN_HTTP_INTEGRATION_TESTS` (`:418`,
**step level, Stage 2c only** — deliberately, per the comment at `:108`, because
setting it job-wide would fire the HTTP suites with no server in Stages 1/2a/2b).

None are set on a default local run, and the local suite reports them **skipped,
not missing**, so the count looks healthy while 16 suites go unobserved. SST-1502
shipped a break in one of them (`signup-edge-cases`) that no grep could find and
that failed the gate.

**Two invocation paths, and a suite is dead only if BOTH miss it:**
1. named explicitly in the workflow's file list, or
2. inside a config's include-glob and outside its exclude-list, where some stage
   runs that config with the gate var set at a scope covering that stage.

A filename-only audit reports 9 dead suites; the real answer is 1. The 8
`RUN_DB_REGRESSION_TESTS` files are plain `.test.ts` (not `*.integration.test.ts`),
so the unit config's glob takes them and the job-level var is live in Stage 1 —
alive, just never named.

The genuinely dead one is `tests/prototypeFeedback.integration.test.ts`: excluded
by the unit glob, excluded by `vitest.integration.core.config.ts` under a comment
saying "run in Stage 2c", and omitted from Stage 2c's list. The repo documents a
delegation the workflow never implements.

Setting the vars locally only half-works: the `RUN_HTTP_INTEGRATION_TESTS` suites
need a live server on `BASE_URL`, so you get collection, not execution.
