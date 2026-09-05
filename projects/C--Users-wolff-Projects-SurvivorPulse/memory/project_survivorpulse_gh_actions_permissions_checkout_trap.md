---
name: survivorpulse-gh-actions-permissions-checkout-trap
description: "permissions:{} on a GH Actions job silently breaks actions/checkout; verify workflow YAML changes by live-dispatching, not just reading them"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0f7516be-fabf-4f1e-83e3-3eb0828ff33f
  modified: 2026-09-05T23:15:19.439Z
---

`permissions: {}` on a GitHub Actions job is not a safe least-privilege default the moment that job uses `actions/checkout` for ANY reason — checkout authenticates via `GITHUB_TOKEN`, which `{}` strips down to metadata-only, and the step fails with `fatal: repository ... not found` (reads exactly like a missing/private-repo error, not a permissions error). The correct minimum when checkout is present is `permissions: { contents: read }`.

**Why:** discovered live during [[project_survivorpulse_sst1569_ci_notification_gaps]] (SST-1569, 2026-09-05). A new `notify` job in `playwright-ci.yml` was scoped to `permissions: {}` on the reasoning "it only reads job results and posts to two webhooks, no repo write needed" — true, but it also ran `actions/checkout` + `npx tsx` to invoke a tested TS script rather than reimplementing logic as untested bash, and checkout itself needs `contents: read` regardless of what the job does afterward. This was caught only by actually dispatching the real workflow and reading the failure log (`GITHUB_TOKEN Permissions: Metadata: read` in the job's own startup log, then `git` reporting "repository ... not found") — two full rounds of independent code review, a security audit, and 78 passing unit tests never touched it, because GitHub's runtime token-scoping behavior can't be simulated by reading YAML or unit-testing pure TypeScript.

**How to apply:** (1) For any new/changed GitHub Actions job in this repo, if it includes `actions/checkout`, its `permissions:` block (if it declares one at all — omitting the block entirely and inheriting the repo default is also fine) must include `contents: read` or broader. (2) More generally: after any GitHub Actions YAML change (new job, new trigger, new permissions scope), `gh workflow run <file> --ref 2026-v1` and read the actual run log before calling it verified — a green test suite and a clean code review are necessary but not sufficient for this class of defect, since the failure mode lives entirely in GitHub's runtime semantics (token scoping, secret availability by trigger context — see also the Dependabot-gets-no-secrets pattern already known from `setup`'s own guard in `playwright-ci.yml`).
