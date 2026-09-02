---
name: project_survivorpulse_vitest_exclude_beats_explicit_cli_filename
description: "npx vitest run <file> silently drops the file if it matches vitest.config.ts's exclude glob (e.g. *.integration.test.ts) — naming it explicitly on the CLI does not override exclude."
metadata: 
  node_type: memory
  type: project
  originSessionId: fbd227d7-5bb9-4dfb-b87a-a2cf04aa4ed6
  modified: 2026-09-02T21:19:40.316Z
---

`vitest.config.ts`'s default `exclude` (which drops `*.integration.test.ts`) applies even
when that exact file is named explicitly and individually on the `npx vitest run` command
line — it is not just a glob-discovery filter. SST-1529's QA pass ran
`npx vitest run <5 files>` including `tests/scheduledRefreshStatusRoute.sst1529.integration.test.ts`,
got a clean "4 passed (4)" with no error or warning that the 5th file was dropped, and only
caught the gap by noticing the reported test count was lower than expected.

**How to apply:** a suite matching an `*.integration.test.ts` (or similar excluded) naming
pattern must be run under its dedicated config — here,
`--config vitest.integration.core.config.ts`, plus whatever env vars its `beforeAll` needs
(e.g. `REPLIT_DOMAINS=localhost`, per [[project_survivorpulse_customsessionmiddleware_not_in_registerroutes]]-adjacent import-time guards). A bare `npx vitest run <files>` "passing" is not proof those files ran — check the reported test COUNT against what the files actually contain, not just green/red. Distinct from
[[project_survivorpulse_env_gated_suites_are_invisible_locally]] (that one is `describe.skip`
gated by an env var and reports itself as skipped; this one is a config-level `exclude` that
silently vanishes the file from the run with no skip notice at all).
