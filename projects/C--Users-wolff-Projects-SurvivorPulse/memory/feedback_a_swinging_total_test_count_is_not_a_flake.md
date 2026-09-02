---
name: feedback-a-swinging-total-test-count-is-not-a-flake
description: "A flaky test holds its TOTAL constant and moves the pass/fail split; a swinging total means the files were being edited while the loop ran, so the whole flake premise is wrong."
metadata:
  node_type: memory
  type: feedback
---

Before root-causing an intermittent test failure, check whether the **total** test count
was stable across the runs. SST-1517 (2026-09-02) reported "2 of 17 isolated runs failed"
and, beside it, a combined-suite total swinging **129/132/136/139**.

- **A flaky test holds its total constant** (e.g. always `(21)`) and moves only the
  pass/fail split. **A swinging total means vitest collected a different SET of tests each
  run** — the files were being written while the measuring loop ran. The failing describe
  contributed exactly 3 tests and 132 − 129 = 3.
- The trap is that a repeat-loop run against a file another process (or you) is editing
  produces an *extremely* convincing flake signature: intermittent, low rate, a varying
  failure count (`1 failed | 20 passed`, then `2 failed | 19 passed`), and failures
  concentrated in exactly the describe that guards the code under edit — because the
  intermediate states have the tests but not yet the implementation. Reproduced by accident:
  a background loop running during RED-proof mutations failed 3 of 30 with that exact
  signature.
- **The clean-run "verification" is worthless under the same conditions.** "12/12 clean runs
  after the fix" was not evidence the fix worked; it was evidence editing had stopped.
  **Checksum the files before and after any repeat-loop** (`md5sum -c`) — that is the control
  the original measurement lacked, and it is one line.
- Corollary for concurrent sessions: never measure a flake in a worktree another session is
  editing. Copy the tree state into your own worktree (`git checkout <sha> -- <paths>`;
  worktrees inherit the repo root's `node_modules` by Node's upward resolution, so vitest
  just runs).

Second lesson from the same story: **a focus-drop cannot make a delegated key handler pick
the wrong target.** If focus leaves the element, the keydown is delivered to whatever now
holds focus and never bubbles to the handler — so the handler does not run *at all* and no
anchor/index logic is consulted. Any `indexOf(document.activeElement) === -1` fallback in a
bubbled keydown handler is unreachable, not defensive. Discriminate the two stories by
forcing the precondition and counting handler invocations, not by reading the outcome.

Related: [[feedback_proving_a_flake_fix_without_reproducing_it]],
[[project_survivorpulse_local_flake_repro_traps]],
[[feedback_verify_a_reviewers_evidence_not_their_judgement]],
[[feedback_a_green_test_certifies_its_stale_comments]].
