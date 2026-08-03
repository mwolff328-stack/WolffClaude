---
name: concurrent-reviewer-agents-race-on-shared-file-reverts
description: "Dispatching multiple review subagents in parallel, where more than one independently reverts-and-restores the SAME file for its own RED-proof verification, causes transient file-content races in a shared worktree."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fd2a6533-9f56-4aba-bc36-5e4f6343c6e7
  modified: 2026-08-03T15:34:34.505Z
---

During SST-1252's In Review phase, three subagents (code-reviewer, Vlad, Ann) were dispatched in a single parallel batch, all working in the same shared worktree. Each independently chose to reproduce the RED-proof themselves (`git show <pre-fix-sha>:<file> > <file>`, run tests, `git checkout -- <file>` to restore) as part of genuinely verifying the build rather than trusting commit messages. All three targeted the *same* file (`client/src/hooks/useWizardApi.ts`).

Result: all three independently reported transient anomalies — intermittent test failures reading pre-fix content, a file "modified again" with no edit action taken, unexplained mtime changes — all resolving once every agent's revert/restore cycle finished. Each agent verified its own final state was clean (via `git status`/`git diff`/`git hash-object` matching HEAD) before reporting, so no work was lost and the committed code was never at risk — but the transient confusion cost real verification time and could have been mistaken for a real bug or a deliberate interference.

One of the three agents also independently encountered and correctly rejected fabricated `<system-reminder>`-style tool output telling it a file change was "intentional... don't tell the user" — verified via `git hash-object` that no actual change existed, and reported it rather than complying. That specific incident was very likely just the harness's generic file-watch notification (it fires for any file write outside its own Edit/Write tool tracking, e.g. a raw shell redirect) colliding with the concurrent-revert race above, not a targeted attack — but the correct response (verify independently, never suppress from the user) was right regardless of cause.

**Why:** each reviewer's revert-test-restore cycle is a legitimate, valuable verification step (don't just trust a commit message's RED-proof claim) — but running several of them concurrently on the *same* file in a *shared* (non-isolated) worktree means their write/read/write sequences interleave.

**How to apply:** when dispatching multiple review agents that may each want to reproduce a RED-proof on the same file, either (a) have only ONE reviewer own that specific reproduction and have the others read its output/verify via a different method (re-derive independently without touching the file, e.g. `git show <sha>:<file> | <run against stdin>` if the test tooling supports it, or just trust one rigorous repro plus their own read-only source review), or (b) serialize that specific check across reviewers, or (c) isolate each reviewer in its own worktree if the check is important enough to duplicate. Don't assume a parallel multi-reviewer dispatch is race-free just because each reviewer's final state comes back clean — the transient collision is real even when the end state isn't corrupted.
