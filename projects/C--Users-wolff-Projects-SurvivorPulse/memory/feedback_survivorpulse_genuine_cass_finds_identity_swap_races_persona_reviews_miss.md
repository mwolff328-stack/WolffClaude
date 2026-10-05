---
name: genuine-cass-finds-identity-swap-races-persona-reviews-miss
description: "SST-1802 (10/4) the genuine Codex Cass pass on the BUILD returned FAIL with 5 reproduced blockers (identity-swap and OFF-state races) that code-reviewer, security-auditor, Vlad and a 6177-test green suite all missed; do not skip it for stateful client UI, and note Codex quota is short."
metadata:
  node_type: memory
  type: feedback
  originSessionId: c9ab76e2-3a95-49c9-bce6-b72b1b340791
  modified: 2026-10-05T00:10:41.538Z
---

On SST-1802 (Pick Popularity override fan-out, client-only, ~2400-line table component) code-reviewer, security-auditor and Vlad all returned PASS or READY WITH FOLLOW-UPS and 6,000+ tests were green. The first genuine Codex Cass pass on the built code then returned CASS: FAIL with five BLOCKING defects it REPRODUCED with in-memory probes: a late failure after an identity swap minted the old user's retry payloads in the new user's bell; same-lead user swap kept the previous user's pending edits; Retry stayed a write control after access was revoked; the OFF-state failure banner vanished when every row was override-only; a failed multi-pool Reset reduced to its lead pool lost all errors.

**Why:** the persona and Claude reviewers read the code and the happy-path fixtures; Codex wrote adversarial probes (swap the user mid-flight, revoke access after a failure, empty the row set) that existing fixtures could not violate. The class is "state that outlives the identity, operation or mode that created it".

**How to apply:** for any stateful client component with async fan-out, run the genuine Cass pass on the BUILD (not only the spec) before Done, and brief the builder with these probe shapes up front (identity swap mid-run, access revoked after failure, mode toggled with an unusual fixture, selection narrowed after a failure). Codex quota is the bottleneck: the pass ran once at ~3:20 PM, the re-review died at 3 minutes on quota (resets 8:20 PM), so batch ALL fixes before re-running and keep the ticket In Review, not Done, until the genuine re-pass lands. Related: [[survivorpulse-cass-rounds-converge-by-deleting-mechanisms-not-patching]], [[cass-final-pass-is-waivable-when-codex-quota-low]].
