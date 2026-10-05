---
name: feedback_domain_vocabulary_collides_with_unrelated_claim_scan
description: "A new feature's own domain vocabulary can collide with an unrelated pre-existing governance/claims scanner's trigger words -- SST-1757's 'isolated point' chart terminology tripped SST-1706's privacy-language scan 3 separate times, each costing a full extra gate-checked push-and-wait cycle."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 9993d1e9-832b-4c4b-8899-555d49920869
  modified: 2026-09-29T07:27:39.353Z
---

SST-1757 (duplicating-picks research pages) built a chart component whose domain concept is an "isolated point" -- a data point with a gap on both sides, rendered as a dot instead of a line segment. That phrase, and the identifier `isolated*` built from it, is also one of the phrases `client/src/lib/__tests__/overrideCopy.claimScan.sst1706.test.ts` scans the whole `client/src` tree for, because SST-1706's job is catching privacy/data-isolation *claims* like "your data is isolated from other users." Every new file using the word tripped that unrelated scanner's whole-codebase diff.

**It recurred 3 times across one story, each one a real gate failure:**
1. S3's fixture/loader doc comments ("an isolated point") -- 2 new hits.
2. S5's chart component (`ISOLATED_MARKER_R`, `isolatedDots`, a testid, a JSX comment) -- 9 new hits.
3. Flagged again by a code reviewer as structurally brittle: 9 of the 11 total baseline entries are *exact lines of code*, so any reformat of those lines (a rename, a prettier pass, moving a comment) re-trips the scanner even though nothing meaningfully changed.

Each collision was genuinely a false positive -- the reviewed additions correctly confirmed the hits were domain vocabulary, not shipped copy or claims, and none ever leaked into an actual `aria-label` or rendered string. But because the scanner runs in CI as part of the shared unit-test suite, each collision surfaced as a **full pre-publish gate FAILURE** on an already-pushed commit, not a local warning -- costing a full diagnose-fix-commit-push-wait-for-gate cycle every time, on top of the review overhead of confirming each new hit was actually benign.

**How to apply:**
- Before starting a feature whose name or core concept might overlap a word a security/compliance/claims scanner treats specially (grep the scanner's own trigger-word list against the feature's working name and obvious domain terms *before* writing code), either (a) pick different internal identifiers/vocabulary that avoid the trigger word entirely (e.g. `lone*`/`gapPoint*` instead of `isolated*`), or (b) do one comprehensive baseline review of the whole feature's vocabulary up front, rather than reactively fixing it slice by slice.
- If a collision is unavoidable (the trigger word is baked into an AC or the domain's established terminology), keep the reviewed additions to *doc comments and identifiers*, never let the word reach a rendered string or accessible name, and flag the brittleness explicitly (a reformat-only diff shouldn't need re-review) rather than silently re-approving the same lines every time they shift.
- When you hit this pattern, check whether it's *this specific scanner* (grep its exact trigger-word list) before assuming a real defect -- the failure surfaces identically to a real privacy-claim regression in the CI log.

See [[project_survivorpulse_content_dir_governance_scan]] for the related `client/src/content/` governance-scan mechanism, and [[reference_survivorpulse_lessons_index]] for the fuller lessons index.
