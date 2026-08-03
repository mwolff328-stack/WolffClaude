---
name: project_survivorpulse_ca1_snapshot_crlf_churn
description: "A full vitest run rewrites the CA1 .snap files with flipped line endings, so git reports them modified with ZERO content change — it looks exactly like \"my change moved the golden snapshots\"."
metadata: 
  node_type: memory
  type: project
  originSessionId: c5af6e0a-2dbe-4f57-bcbd-437e2e737b83
  modified: 2026-08-01T08:08:38.654Z
---

Running the full vitest suite on Windows rewrites `ca1/tests/phase0|phase1|phase3/__snapshots__/*.snap`
with different line endings. `git status` then lists all three as modified **even though not one
content line changed**. There is no `.gitattributes` rule for `.snap`, so this happens on every
full-suite run.

This is dangerous in both directions:
- It reads as "my change moved the CA1 golden snapshots" — a Constitution-level determinism alarm —
  when nothing moved. (2026-08-01: this fired mid-SST-1196 right after I had claimed the fix
  *could not* move CA1, and briefly looked like I'd been wrong.)
- Staging with `git add -A` would silently commit pure line-ending churn into a golden artifact.

**Distinguish it in one step — don't eyeball the diff:**

```bash
git diff --numstat <snap files>     # EMPTY output = zero content lines changed
# and, to be airtight:
a=$(git show HEAD:$f | tr -d '\r' | sha256sum); b=$(cat $f | tr -d '\r' | sha256sum)
```
Identical hashes = churn only. Then `git checkout -- <files>` before committing.

`git diff` alone is not enough: it prints only the "LF will be replaced by CRLF" warning and an
empty body, which is easy to misread as a tool failure rather than as proof of no change.

Related: [[feedback_survivorpulse_shared_worktree_staging_discipline]] (stage by explicit path),
[[project_survivorpulse_prepublish_gate_mechanism]].
