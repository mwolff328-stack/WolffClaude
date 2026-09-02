---
name: parallel-triage-agents-share-the-dispatching-sessions-worktree
description: "Dispatching 5 persona subagents in parallel for bug-triage code verification means they all read/write the SAME worktree path as the orchestrator and each other -- not isolated copies. A RED-proof-style revert-test-restore by one agent can race another agent's read or the orchestrator's own file state."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fbd227d7-5bb9-4dfb-b87a-a2cf04aa4ed6
  modified: 2026-09-02T16:58:38.751Z
---

**Parallel subagents dispatched for triage/verification (Agent tool, no `isolation: "worktree"`) all operate on the SAME on-disk worktree the orchestrating session is in -- there is no automatic per-agent isolation.** Confirmed 2026-09-02 during SST-1519's triage: Vlad (one of five parallel persona agents, each told to independently verify a fix) did a RED-proof-style revert (`git checkout ce8a2c15^ -- <file>`, run tests, restore) as part of confirming the fix's own RED proof was legitimate. Vlad's own report: a first attempt came back a suspicious 13/13 green against what should have been buggy (reverted) code -- caught it, redid the revert+test as one atomic bash chain, and got the correct 4-failed result. Vlad's own hypothesis: the file had been silently restored mid-run by a concurrent session sharing the worktree -- plausible, since Felix (a sibling parallel agent in the same dispatch) also independently read AND ran things in that identical worktree path at overlapping times, and the orchestrator itself was mid-mutation-testing in the same directory throughout.

**Why to apply:** any subagent instructed to do a file-mutating verification step (revert-and-rerun, mutation testing, "confirm this fails without the fix") in a dispatch that runs multiple agents in parallel is operating in a shared filesystem, not a sandbox. A single non-atomic sequence (separate tool calls for revert / test / restore rather than one chained command) is a real race window against ANY other concurrent writer -- another persona agent, the orchestrator's own background mutation-testing, or in principle a wholly different session sharing the same worktree (see [[feedback_survivorpulse_shared_worktree_staging_discipline]] for the git-level version of this same hazard).

**How to apply:**
1. When asking a subagent to do a revert-based RED proof, tell it explicitly to chain revert→test→restore as ONE bash command (`git checkout X -- f && test-cmd; git checkout HEAD -- f`), never as separate tool calls with time in between -- exactly the pattern this orchestrator already uses in its own mutation-testing scripts.
2. After ANY dispatch of parallel agents that read or write files in the shared worktree, re-verify the orchestrator's own view of the critical files before trusting it (`git status --porcelain`, confirm the expected commit is still HEAD, grep for a fix-specific marker) -- don't assume nothing touched your files just because your own tool calls didn't.
3. A subagent's self-reported "I caught an anomaly and fixed it" is a GOOD sign (it means the verification was real and adversarial, not rubber-stamped) -- but it's also a flag to independently confirm the orchestrator's own state afterward, which is exactly what caught this being harmless rather than assuming it was fine.
4. For anything higher-stakes than a read-mostly verification pass, consider `isolation: "worktree"` on the Agent call so mutating steps genuinely can't collide with the orchestrator or siblings -- traded against the setup cost of a fresh worktree per agent.

In this instance, no actual harm occurred: the orchestrator's `HEAD` and working tree were confirmed clean and correct immediately after all five agents finished, and Vlad's own re-run produced the correct evidence. This is recorded as a near-miss / process lesson, not an incident.
