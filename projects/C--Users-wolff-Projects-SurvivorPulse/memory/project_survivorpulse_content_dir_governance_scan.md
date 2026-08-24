---
name: project_survivorpulse_content_dir_governance_scan
description: "Anything added under client/src/content/ is enumerated by a GOVERNANCE-CRITICAL scan that requires PLAIN WALKABLE DATA — a RegExp export or a function taking an argument fails the build, by design."
metadata: 
  node_type: memory
  type: project
  originSessionId: f67a14cd-0fb7-415a-ac23-af83446b0308
  modified: 2026-08-24T02:26:01.724Z
---

`client/src/pages/__tests__/landing.governanceCopy.test.ts` (SST-800/978/1115, labelled
GOVERNANCE-CRITICAL) recursively enumerates **everything under `client/src/content/`** and
runs an "exported-value scan" over it, looking for banned overclaim strings and em dashes.

**It rejects non-plain exports rather than skipping them**, and the errors are specific:

- `exported value is a RegExp object, not plain data. The governance scan walks own keys
  only, so copy on a prototype or behind an exotic trap would go unscanned. Content modules
  must export plain objects, arrays, strings, Maps or Sets (not subclasses of them).`
- `exported function requires 1 argument(s), so any copy it returns cannot be scanned.
  Export the copy as data, or give every parameter a default so it can be invoked with none.`

**How to apply.** Put ONLY product copy under `content/`, as plain data. Route constants,
href builders, helpers and test rule sets belong elsewhere (`client/src/lib/…`,
`client/src/__tests__/…`). This is not bureaucratic: keeping the module walkable is exactly
what lets the guard read the copy at all. Fix the structure; do not reach for the ALLOWLIST,
which is for a legitimate copy phrase that trips a banned pattern, and whose entries are
exact-phrase and individually reviewed.

**Why this is easy to miss (2026-08-23, SST-1377).** Targeted vitest runs on the files you
touched pass fine. The scan lives in a `pages/__tests__` suite that has no obvious relationship
to the directory it polices, so nothing about editing `content/` suggests you should run it.
It surfaced only in the FULL unit suite, ~24 minutes in. Two new files failed it: a shared
claim-boundary module exporting `RegExp`s, and a series registry exporting a one-arg
`seriesArticleHref`.

Related traps confirmed the same session:

- **`npm run test:*` exits 0 on Windows WITHOUT RUNNING.** Always `npx vitest run --config
  vitest.config.ts` directly. Also `cmd | head; echo $?` reports **head's** status, not the
  command's — capture the exit code before piping.
- **A clean local typecheck proves nothing about the commit** if the worktree is dirty. Staging
  by explicit path, then typechecking the working tree, passed while the pushed commit did not
  compile (one importer of a moved symbol was left unstaged). Verify with `git status` empty so
  working tree == HEAD, or CI finds it for you — it did.
- **`playwright-ci.yml` DOES trigger on `pull_request: branches: [2026-v1]`**, so a PR gets real
  ephemeral e2e coverage. **`pre-publish.yml` does NOT** (push to main/2026-v1, or dispatch),
  so a PR branch never gets the full ship gate until it merges.
- Running the full suite dirties three `ca1/**/__snapshots__/*.snap` files with **CRLF-only**
  churn. Not yours; `git checkout -- ca1/` and do not stage them. See
  [[project_survivorpulse_ca1_snapshot_crlf_churn]].

Related: [[feedback_confirm_the_check_covers_what_you_changed]],
[[feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see]],
[[project_survivorpulse_sandbox_has_no_local_postgres]].
