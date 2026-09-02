---
name: project_survivorpulse_queued_gate_is_not_a_verified_commit
description: A push-triggered pre-publish run can be cancelled by concurrency before it ever starts, so "I pushed and the gate is queued" is not proof the commit will be verified.
metadata:
  type: project
---

`pre-publish.yml` uses `concurrency: group: pre-publish-${{ github.event_name }}` with
`cancel-in-progress: false`. GitHub allows **one running + one pending** per group, and a new
arrival **supersedes the pending run before it ever starts**. On a busy branch an individual
commit's gate may therefore never execute.

Measured in one night on `2026-v1`: two push-triggered runs against SST-1509's commits were both
`completed / cancelled` with zero steps — one superseded by my own next push, one by another
session landing SST-1508. Both commits were safely on the branch (confirmed with
`git merge-base --is-ancestor`); only the verification was lost.

**Why:** the workflow's own comment says the run that *does* execute always tests the branch TIP,
so nothing ships unverified — true for the branch, **false for a specific SHA**. If you need proof
that *your* commit passed, a queued push run will not reliably give it to you.

**How to apply:** to verify a specific commit, push it to a throwaway ref and
`gh workflow run pre-publish.yml --ref <that-ref>`. `workflow_dispatch` runs live in a **separate
concurrency group** (`pre-publish-workflow_dispatch`) and cannot be superseded by pushes. Delete
the ref afterwards. Check `gh run view <id> --json status,conclusion` — `cancelled` is not
`failure` and is easy to misread as a problem with your change. Do not force-push a feature branch
to re-point a dispatch: after a rebase the branch has diverged, the push is rejected, and a
dispatch will silently run against the STALE ref (this happened; the run tested a commit without
the fix). A fresh ref avoids the whole question. See also
[[feedback_verify_the_commit_not_the_exit_line]] and
[[feedback_local_run_differs_from_ci_by_construction]].
