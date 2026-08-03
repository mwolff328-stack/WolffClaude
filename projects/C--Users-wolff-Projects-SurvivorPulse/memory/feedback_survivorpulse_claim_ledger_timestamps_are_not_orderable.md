---
name: feedback_survivorpulse_claim_ledger_timestamps_are_not_orderable
description: "Two sessions both used the claim ledger correctly and still duplicated a whole ticket — its ts values come from each session's own clock, so claims cannot be ordered by them and 'nobody has claimed this' is only true as of the moment you read."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d454198c-d629-4d4b-b775-944b733f1aee
  modified: 2026-08-02T09:37:01.740Z
---

On 2026-08-02 two sp-autonomous sessions each built **SST-1212** end to end — same file path
(`shared/poolRules/eliminationPredicate.ts`), same `classifyTeamOutcome` helper name, same two
findings. Both had appended a claim to
`~/.claude/projects/…/active-claims.jsonl` before starting. The ledger did not prevent it.

**Why the ledger failed, and it is not carelessness:**

1. **`ts` is written by each session from its own clock and they disagree by hours.** In the same
   file, one session's entries ran `07:05Z … 09:45Z` while a concurrent session's ran
   `14:00Z … 15:10Z` for work happening at the same wall-clock time. So `ts` **cannot be used to
   decide who claimed first**, which is exactly the question a collision needs answered. Neither
   session could have resolved priority from the ledger alone.
2. **A claim only helps a session that reads the ledger AFTER you write it.** The other session
   had already begun when my claim landed. Reading the ledger once, at Phase 0, is a snapshot —
   it says nothing about what starts thirty minutes later.
3. **`send_message` does not interrupt.** It queues behind the target's in-flight turn. Mine sat
   unread through several of their turns while they built the duplicate. Messaging is necessary
   but it is not a lock, and it is not acknowledgement.

**The ledger's `session` field is a DIFFERENT identifier from the one messaging routes on.**
Learned 2026-08-02: the SST-1206 owner writes `local_4233dbd4-4c4f-4211-baa1-08c236605893` into
this ledger, but `mcp__ccd_session_mgmt__send_message` routes it as
`local_797a2cb9-6d1e-4a1b-9f48-c9d85c1f3c78` (title "Fix SST-1206 canonical spread staleness",
worktree `goofy-pascal-88025e`). Messaging the ledger ID returns a hard `Session not found`;
`list_sessions` has no entry for it. So **read the owner out of `list_sessions` by title/worktree,
never out of the ledger's `session` field**, and when recording an owner write both and label
which is which. A session cross-referencing the two will otherwise conclude there are two
different owners. That session sent me its ledger ID as a *correction* to my (routable) one — I
nearly propagated it into a founder report, and only the failed send caught it. Their correction
was sincere and wrong, which is the general shape: **a peer's claim about their own identity is
still a claim to verify**, same as any other.

**The self-serve test — don't wait for a send to fail.** `ls` the transcript directory of any
session whose `list_sessions` id you have:
`~/.claude/projects/C--Users-wolff-Projects-SurvivorPulse--claude-worktrees-<worktree>/*.jsonl`.
The filenames are transcript UUIDs and **none of them ever matches the manager id** — measured
2026-08-02 across three sessions (`local_aee05239…` → `715ea743`/`8788757e`/`d454198c`;
`local_c2516994…` → `5bf8a0f0`/`9f96b9bf`/`e52858ac`). One command, no collision required, and it
proves the namespaces are distinct for *every* session rather than for one anecdote.

**Why the mistake is structural, not careless.** From inside a session the transcript UUID is the
only identifier you can observe — it is your scratchpad path and your transcript filename — and
`list_sessions` **excludes the current session**, so a session cannot see its own routable id at
all. That is why the wrong id is stated with total confidence: it is genuinely, verifiably yours,
just in the namespace nobody asked about. Expect the next session to make the same error for the
same reason.

So when writing a claim, record **two labelled fields** (`ledgerId` + `routableId`), never a bare
`session`. A single field is what invites the conflation.

**How to apply:**

- **Never order claims by `ts`.** If two claims overlap, treat priority as genuinely unknown and
  resolve on *state* instead — who is complete, who is mid-flight, who has pushed. That is
  checkable and it is what actually minimises wasted work.
- **Re-read the ledger before each new ticket in a multi-ticket run**, not only at Phase 0. Cheap,
  and it is the only thing that catches a claim filed after you started.
- **A queued `send_message` is not a reply.** Do not treat "I messaged them" as coordination
  achieved. If the work is complete and unpushed, pushing is usually better than waiting: it
  protects the work and gives the other session something concrete to rebase onto instead of a
  phantom. Say so explicitly when you do it.
- **Duplicate work is not automatically waste.** Both sessions independently concluded that
  SST-1212's own premise was wrong (the three implementations did *not* disagree on ties). Two
  independent derivations agreeing is real corroboration — harvest what the other found before
  discarding their branch. Theirs caught a playoff week-vs-period-index hazard mine had to be
  checked against.

**Addendum from the other side (2026-08-02, session `gracious-visvesvaraya-10897c`).** I was the
"14:00Z…15:10Z" session this memory describes from the outside. Confirming and extending, now that
both halves are visible:

- **The queued `send_message` really did sit unread.** Two messages were sent negotiating this
  exact collision; I never saw or answered either in that session — not because I ignored them, but
  because nothing in a long autonomous build phase surfaces incoming messages until you go looking.
  Point 3 above is not a hypothetical failure mode, it is exactly what happened on both ends at once.
- **Sometimes there is no negotiation left to have by the time you find out.** By the time this
  session re-checked, the other side had already pushed, gated green, and moved all three tickets to
  Done. There was no "push now to protect the work" decision available — that window had already
  closed. The correct move at that point is not to negotiate, it's to **verify current state
  directly (fresh Notion read of the ticket's own Status/Date Completed field, not the ledger) and
  stand down** if it's already shipped: `git reset --hard origin/<branch>` on your own never-pushed
  commits, release the claim with a full note, done. Don't assume a collision is still live just
  because you found it late.
- **"Checked the ledger fresh" is not the same as "grepped the ledger for this exact ticket
  string."** This session's own Phase 0 claim explicitly said the ledger was checked and found no
  overlap — and it was wrong, because the check scanned recent entries rather than searching the
  full file for the literal ticket ID. The other session's claim was sitting in the file the whole
  time, just not in the window that got read. **Before claiming a ticket, grep the ENTIRE ledger for
  its ID string** (`SST-1212`, not a date range or a tail read) — the file is append-only and a hit
  anywhere in it is a real prior claim regardless of how old the surrounding entries look.
- **Duplicate work is not automatically waste, confirmed from both directions.** The other session's
  build caught a real, more severe bug mine had explicitly scoped out (the scheduler destroying
  paid-for buybacks by ignoring `entries.revivals`). This session's build independently caught the
  same playoff week-vs-period-index hazard theirs did, before running any test — so the
  corroboration in both directions was real, even though only one build shipped.

Related: [[feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see]] (duplicate *files*
git shows no conflict for — this is the *claim* layer failing one level earlier),
[[feedback_survivorpulse_fetch_and_search_before_work]],
[[feedback_survivorpulse_shared_worktree_staging_discipline]].
