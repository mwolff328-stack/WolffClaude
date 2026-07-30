---
name: sp-autonomous
description: >-
  Run one or more SurvivorPulse work items — features, enhancements, revisions, bug fixes,
  tech debt, clean-ups — autonomously end to end through the full Product & Development
  Operating Model: ticket, grooming + approval gate, TDD build, In Review sign-offs, Done,
  and the pre-publish SHIP gate — without stopping for founder input except at the small set
  of documented hard gates. Includes a mandatory cross-session sync protocol so concurrent
  Claude sessions on the SurvivorPulse repo never collide on files, commits, branches, or
  tickets. Use whenever the founder outlines SurvivorPulse work and wants it carried all the
  way to Done/SHIP on its own: "work autonomously on…", "take this to done", "build and ship
  this", "run this end to end", "no need to check with me", or hands over a list of changes
  to execute.
---

# SurvivorPulse — Autonomous Work to Done & SHIP

You are running the founder's work list end to end with **no check-ins**. The founder has
delegated the whole pipeline. Your job is to finish it, not to narrate options or ask for
permission you already have.

**Repo:** `C:\Users\wolff\Projects\SurvivorPulse` · **Branch:** `2026-v1` (never `main`).

Two things make this skill different from just "doing the work":

1. **You play every persona.** Grooming, the approval gate, and the In Review sign-offs are
   all executed by you dispatching the persona agents. Autonomy does not mean skipping the
   gates — it means running them yourself, honestly, including the ones that can fail you.
2. **You are not alone in this repo.** Multiple Claude sessions run concurrently on the same
   files. Phase 0 is mandatory and blocking. Skipping it has already cost a full session's
   work (PR #89 / SST-1003) and once fast-forwarded remote `2026-v1` with unreviewed commits.

**Authority:** founder's explicit instruction → [Operating Model](https://app.notion.com/p/37629ce5833d81eca755f86e4e001a33)
→ `SurvivorPulse/CLAUDE.md` → global config. The Operating Model is canonical for process;
`SurvivorPulse/docs/PRODUCT_CONSTITUTION.md` is canonical for product and data philosophy. Where
this skill and the Operating Model disagree, **the Operating Model wins** — re-read it if a
situation looks unusual.

---

## Phase 0 — SYNC & CLAIM (blocking; before you read a single source file)

**Read [`references/session-sync.md`](references/session-sync.md) now and follow it.** It has the
exact commands, the collision matrix, and the negotiation script. Summary of what it makes you do:

1. `git fetch origin` and measure drift. Stale branch = the #1 cause of thrown-away work.
2. Enumerate live sessions (`mcp__ccd_session_mgmt__list_sessions`), worktrees, and uncommitted
   WIP — establish who owns what right now.
3. Search Notion for an existing ticket **before** creating one. A jump in the auto-assigned
   `SST-###` sequence means other sessions are active; go look at what they did.
4. **Claim** your work: append to the local claim ledger and post a claim comment on the ticket.
5. **Negotiate** any overlap via `mcp__ccd_session_mgmt__send_message` before you touch a file.
6. **Choose isolation mode** (dedicated worktree vs. main worktree) using the rule in the reference.

Do not begin Phase 1 until every work item in the founder's list is claimed and the isolation
mode is chosen. If a claim conflict cannot be resolved autonomously, drop that *item* into the
deferred list and carry on with the rest — never stall the whole run on one collision.

---

## Phase 1 — TICKET & GROOM → `Ready`

Board: **SP Stories & Tasks**, data source `collection://35929ce5-833d-8156-9e29-000ba878443c`.
Always `notion-fetch` the data source first so you use exact property names and option values.

**Bugs go through the `survivorpulse-bug-triage` skill instead of this phase** (project-scoped, at
`SurvivorPulse/.claude/skills/survivorpulse-bug-triage/`) — its template and 5-persona triage panel
replace grooming. Rejoin at Phase 2.

1. **Pam scopes it.** Create the story (or adopt the existing one). Set Type, Category, Priority,
   Phase, and — required to enter Grooming — **at least one Feature, at least one Epic, and a Size**.
   Set `Assigned To Agent`. Status → `Grooming`.
2. **Groom in parallel.** Ann writes **Description + Acceptance Criteria**; Vlad writes **Test Cases**.
   Conditional specs, each required when the story touches that domain: Deb (UI spec/mockups),
   Stan (research/algorithm/calculation), Rita (integration), Sky (user-facing copy).
3. **All grooming content goes in the database property fields, never the page body.** Page body is
   for supplemental material only. This is checked at three gates and is the single most common
   grooming defect.
4. **Approval gate — Pam + Deb + Felix must all approve**, each with a verdict comment. Before any
   vote, run the pre-vote field check (Description, AC, Test Cases populated, in property fields).
   A kickback keeps the story in `Grooming` and returns it to Ann or Vlad.
5. On unanimous approval → Status `Ready`.

Running the gate against your own work is not theater. If Ann's AC are thin or Vlad's Test Cases
only restate the AC, **kick it back and fix it**. A gate that has never failed isn't a gate.

---

## Phase 2 — BUILD → `In Progress`

**Move the story to `In Progress` the moment development begins — before the first slice**, not after.

Research first (global workflow rule): check for an existing implementation or library before
writing net-new utility code.

Break the work into slices. **One slice = one atomic commit.** Per slice, in this order:

1. **RED** — write the test first, from the AC/Test Cases. Run it. Watch it fail.
2. **GREEN** — minimum implementation to pass.
3. **VERIFY** — typecheck + the relevant suites.
4. **COMMIT** — conventional commit, allowed scopes `api|ui|db|auth|core|infra`.
   **Never** add `Co-Authored-By` or any AI attribution to a commit message.
5. **COMMENT** — per-slice Notion comment.

### Testing integrity (Operating Model §9 — non-negotiable)

This is where an autonomous run is most likely to fool itself. A green test that was written after
the code, by the implementer, describing what the code *does*, certifies the defect.

- **Failing-first is the only proof.** Any test claiming to guard a behavior must be demonstrated
  RED against the broken state before it lands — revert the fix (`git show HEAD:path` swap), run,
  capture the actual failure output, restore, show the pass. **Report both.**
- **Bug fixes audit existing tests in that area for ones encoding the bug.** Required step. Fix the
  test to assert the requirement; never bend the code to satisfy a wrong test.
- **Test names state the requirement, not the mechanism.**
- **Characterization tests must be labeled** as such. Implementer-added tests trace to an AC.
- **Assert where the truth lives** — query the DB/real layer for anything invisible in the UI.
  "The operation happened" is not "the state it produced is correct".

### Commands (Windows — read this, the obvious ones are booby-trapped)

```bash
NODE_ENV=test TEST_DISABLE_NETWORK=1 TEST_FAST_OPTIMIZER=1 npx vitest run --config vitest.config.ts
```

⚠️ **`npm run test:unit` exits 0 on Windows WITHOUT RUNNING** (POSIX env-var syntax). Same trap for
the other `npm run test:*` scripts. Always invoke `npx vitest` directly via the Bash tool, and
sanity-check that the reported test count is non-zero.

Typecheck with `npx tsc --noEmit` (or `npm run check`). **If a slice touches 4+ files, typecheck
after every 3 edits** — don't let type errors cascade.

Run `code-reviewer` and, for anything touching auth/input/secrets/endpoints, `security-auditor`
while building. Fix CRITICAL and HIGH before moving on.

### Landing the work

Follow the push procedure in [`references/session-sync.md`](references/session-sync.md) exactly.
Two traps it defends against, both of which have fired for real:

- Staging another session's WIP: **stage by explicit path, never `git add -A`/`.`**, and verify the
  staged set before committing. Leave `.claude/scratchpad.md` alone — its owner is another session.
- Pushing to the wrong ref: a worktree branch created from `origin/2026-v1` inherits **`2026-v1`** as
  upstream, so a bare `git push -u` fast-forwards remote `2026-v1`. Unset upstream, push with an
  explicit refspec, and **read the destination ref in the push output** before moving on.

Pushing `2026-v1` after implementation is **pre-approved** — no founder sign-off.

---

## Phase 3 — IN REVIEW → `In Review`

Post-build independent verification. Entry requires: all slices committed, build/typecheck/tests
green, per-slice + build-summary comments posted, any schema change applied to the **dev** DB and
verified, a reviewable diff linked, grooming fields confirmed in property fields, and — **for UI
stories** — a full Playwright E2E run linked in the comments.

E2E targets the *deployed* app and is run **locally**, not in CI (GitHub runners are
Cloudflare-blocked from `.replit.dev`):

```bash
BASE_URL=<deployed-dev-url> npx playwright test
```

**This is load-bearing, not a formality.** Because Phase 2's push goes straight to `2026-v1` with
no PR, `playwright-ci.yml` never triggers for it (SST-1114) — this local run is the only e2e
coverage the commit gets before a real publish. Run the full suite, not just the story's own new
flows; a targeted run cannot catch a regression this story introduced elsewhere (see SST-1108).

Sign-offs, each a verdict comment:

| Reviewer | Scope | When |
|---|---|---|
| **Vlad** | QA — validates every Test Case; reviews the E2E run | always |
| **Ann** | Business acceptance — validates every AC | always |
| **Deb** | UI matches spec/mockups | UI stories |
| **Stan** | Research / algorithm / calculation vs. reference models | research/calc stories |
| **Rita** | Integration vs. integration spec | integration stories |
| **Sky** | User-facing copy vs. brand voice | UI stories with copy |
| `code-reviewer` | Quality, standards, architecture compliance | always, independent |
| `security-auditor` | Sensitive changes | conditional |

**Any reviewer finding a defect sends it back to `In Progress`** (Felix for code/logic, Deb for
UI/design). After the fix it re-enters In Review and needs **full** re-review from all required
reviewers — not just the one who failed it. Out-of-scope defects get their own ticket via the
bug-triage skill; don't scope-creep the story.

---

## Phase 4 — DONE

Exit checklist, all required: AC verified (Ann) · QA/E2E green (Vlad) · code review approved ·
security clear if applicable · conditional sign-offs complete · **property fields clean**.

**A story whose Test Cases include a CI-only test (the SST-1088 self-skip class — blocked
locally by the DB host guard) cannot reach `Done` on the promise that CI will pass.** Trigger a
targeted gate run for that story's actual commit and see it go green before posting Done — not
after. This has already failed once: a story was marked Done on the reasoning "it runs on CI,
that gate run is the proof," the gate then failed on a bug in that exact test, and Done had to be
publicly retracted with a `⛔ GATE FAILED — Done was premature` comment. The fix is sequencing:
run the check before the claim, never after. If waiting for a full gate run is too slow to do per
story, that is a real cost of shipping something whose proof only exists in CI — accept the wait,
don't skip the proof.

**Every reviewer sign-off named in the process must exist as an actual posted comment before you
rely on it — never tell a persona agent to skip posting "for speed."** This has produced a real
failure: an orchestrator instructed review agents not to post, then a required AC (an explicit
"Sky must sign off and Vlad must confirm the comment exists" gate) failed QA outright because the
comment never existed. Posting is not overhead on top of the review — it *is* the artifact the
gate checks for.

Then: post the summary comment, set Status → `Done`, set `Date Completed`, and **clear
`Assigned To Agent`**.

Every Done comment must carry a learning line. **`N/A` is acceptable; silence is not.**

```
[Felix] — <verdict/action summary>
🎓 Learning: [BUILD] <statement>
```

Categories: `[BUILD]` `[QA]` `[PRODUCT]` `[DESIGN]` `[RESEARCH]` `[PROCESS]`.

**Loop back to Phase 1 for the next work item** until the founder's list is exhausted. Do not run
the ship gate per item — it is batched.

---

## Phase 5 — SHIP GATE (once, after every item is Done)

Invoke the **`pre-deploy`** skill and follow it exactly. Do not re-implement or summarize it —
it carries the current pending-prod-migration list and the coverage caveats.

Two things that will otherwise waste an hour:

- **`npm run test:prepublish` cannot run on Windows** (POSIX env syntax, and it needs a live DB).
  The real gate is CI: `gh workflow run pre-publish.yml --ref 2026-v1`, then watch the run.
- **A green gate is not unqualified.** ~241 integration tests self-skip on `TEST_DISABLE_NETWORK=1`
  — the Game Plan / cockpit / pick-write core, including several tripwires. Report the qualification
  explicitly; never issue a bare 🚢 SHIP that implies coverage you didn't get.

Then produce the **founder handoff** — this is the deliverable that ends the run:

```
SHIP REPORT
  Items delivered:      SST-### … (one line each, with the Notion link)
  Gate:                 🚢 SHIP / 🚫 DO NOT SHIP  (run id, qualified as above)
  Pending prod DB:      <migrations/backfills the founder must apply, or "none">
  Founder actions:      1. Delete the ALLOW_UNSAFE_DEV_FEATURES secret in
                           Replit → Deployments → Secrets  (prod boot guard is FATAL)
                        2. Click Publish
  Deferred / not done:  <anything skipped, with the reason>
```

The last two steps are physically outside your reach — they happen in the Replit UI, and
production publish is founder-gated regardless. Everything up to them is yours.

---

## Phase 6 — RELEASE

1. Release your claims (ledger + a release comment on each ticket) — see the reference.
2. Message any session you negotiated with that the files are free.
3. Remove the isolation worktree if you created one.
4. If something bit you that would bite the next run, write it down: a `learned/` skill file for
   durable patterns, `MEMORY.md` for cross-session facts. This is Phase 6, not an afterthought —
   an autonomous run that learns nothing repeats itself.

---

## Hard stops — the ONLY reasons to interrupt the founder

Everything else, decide and proceed. When you hit one of these, **defer that item, finish
everything else, and surface it in the final report** — do not idle.

1. **Production DB changes.** Dev-first always. Prod migrations need an explicit "ready to publish".
   `db:push` is UNSAFE against `helium` and prod — at that prompt the answer is always ABORT.
2. **Production publish** and the Replit secret deletion (Phase 5 handoff).
3. **PRs to `main`.** Never open one. All work targets `2026-v1`.
4. **Expansion beyond NFL Survivor**, or anything that weakens a Constitution invariant
   (determinism, architectural separation, golden-source rules).
5. **Reversing a prior, documented founder ruling or product decision** — e.g. a board-recorded
   call like "ties must be surfaced, not auto-resolved." Building a fix is fine; building a fix
   that quietly contradicts a standing decision is not, even if it's the obvious-looking answer.
   Name the conflict and ask — and if you already wrote the code before you noticed the conflict,
   hold it unpushed and say so; don't ship it staged and unmentioned.
6. **Destructive or irreversible operations** — history rewrites, force pushes, data deletion,
   dropping columns, anything outward-facing.
7. **Genuine ambiguity where every reading leads somewhere materially different** and guessing wrong
   would make the work useless. Rare. State the assumption and build if you can.

## Standing rules

- **Branch `2026-v1`. Never commit to `main`.** Confirm with `git branch --show-current`.
- **Never** write a DB connection string or credential into any file.
- A locally-run SQL check says **nothing** about the deployed dev app — it reads `helium`, reachable
  only inside the Replit container. Never declare a dev-app blocker from a local query alone.
- Report faithfully. If tests fail, say so with the output. If you skipped something, say so. A
  clean report that hides a skipped suite is worse than a messy honest one.
- **Never end a turn with unprotected state — this has already happened twice.** One run stopped
  mid-CI-gate-wait with a story's status not yet resolved; another stopped right after saying "the
  suite is still running... queued to run the moment it finishes," and nobody was watching either
  run land. A worse instance: a worktree was found hours later holding a committed-but-unpushed fix
  *and* further uncommitted changes on top of it, with no claim, no comment, and no record anywhere
  that the work existed. Before you stop — whether you finished, hit a hard stop, or are simply out
  of runway — checkpoint:
  1. **Commit or explicitly flag every worktree change.** An untracked or uncommitted diff that
     nobody knows exists is one accidental `git worktree remove` away from being lost.
  2. **If you triggered an async check that hasn't reported** (a CI gate, a dev server boot, a long
     test run), either wait for it or post a comment naming the run/PID and what the next session
     needs to check.
  3. **If the board claims something that isn't true yet** (`Done`, an active claim), fix the board
     before you stop, not after. A session that ends by honestly saying "not done, here's exactly
     where it stands" is worth more than one that goes quiet mid-verification.
