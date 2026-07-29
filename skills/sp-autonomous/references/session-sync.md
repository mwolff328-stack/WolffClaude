# Cross-Session Sync Protocol

Multiple Claude sessions run against the SurvivorPulse repo concurrently, on the same files.
**Staleness is the default, not the exception.** This protocol is blocking: complete it before
reading source files, and honor the integration rules on every commit and push.

**Repo root:** `C:\Users\wolff\Projects\SurvivorPulse` (referred to below as `$SP`).

Evidence this is not hypothetical:

- A branch cut 13 commits behind `2026-v1` and never re-fetched made two upstream fixes invisible
  for a whole session. PR #89 closed unmerged, SST-1003 cancelled as a duplicate.
- A worktree branch created from `origin/2026-v1` inherited `2026-v1` as upstream; `git push -u`
  fast-forwarded **remote `2026-v1`** with unreviewed commits. Remote auto-syncs to the Replit dev
  app. Caught in the push output and reverted within a minute.
- Concurrent sessions sharing the one main worktree meant `git status` showed another session's
  half-finished files. A `git add -A` would have swept them into an unrelated commit.

---

## Step 1 — Measure drift (always first)

```bash
git -C "C:/Users/wolff/Projects/SurvivorPulse" fetch origin
git -C "C:/Users/wolff/Projects/SurvivorPulse" rev-list --left-right --count origin/2026-v1...HEAD
```

Output is `<behind> <ahead>`. Behind by more than a couple of commits → rebase or re-branch **before
doing anything else**. Then read what landed: `git log --oneline HEAD..origin/2026-v1` — an upstream
commit may already have done your work, better.

## Step 2 — Enumerate who is live

```bash
git -C "C:/Users/wolff/Projects/SurvivorPulse" worktree list
git -C "C:/Users/wolff/Projects/SurvivorPulse" status --porcelain
ls -d "C:/Users/wolff/Projects/sp-wt-"* 2>/dev/null
```

Plus `mcp__ccd_session_mgmt__list_sessions` — look at `isRunning`, `cwd`, `branch`, `lastActivityAt`.
A session with `isRunning: true` and a `cwd` inside the repo is an **active neighbor**.

Build a short ownership map before proceeding:

| Signal | Read it as |
|---|---|
| Running session, cwd = a worktree | Owns that worktree and its branch. Do not enter it. |
| Running session, cwd = main worktree | Shares the main worktree with you. File-level care required. |
| Uncommitted WIP in main worktree | Belongs to whoever is running there. Never stage it. |
| `.claude/scratchpad.md` modified | Another session's context. **Never touch.** Keep your plan in your own scratchpad dir. |
| Worktree with no running session | Probably abandoned. Leave it; don't reuse or delete it. |

## Step 3 — Check the board before creating anything

Search **SP Stories & Tasks** (`collection://35929ce5-833d-8156-9e29-000ba878443c`) for the symptom
**and** the suspected root cause before filing a ticket. A code-read finding is not evidence nobody
has fixed it.

Then check for in-flight work: query for Status in `Grooming` / `In Progress` / `In Review` and read
`Assigned To Agent` and the recent comments. If a story covering your item is already In Progress,
that item is claimed by someone else — defer it (Step 5).

**Watch the auto-assigned `SST-###` as a collision signal.** A jump in the sequence means concurrent
sessions took IDs in the same feature area. Go read what they did.

## Step 4 — Claim your work

Two records: a machine-local ledger for fast collision checks, and a Notion comment as the durable,
human-visible claim.

**Ledger** — `C:\Users\wolff\.claude\projects\C--Users-wolff-Projects-SurvivorPulse\active-claims.jsonl`
(outside the product repo — no commit churn). Read it first, then append one line per item:

```json
{"ts":"<ISO8601>","session":"<this sessionId>","ticket":"SST-1234","status":"claimed","paths":["client/src/components/shell/","server/services/optimizerService.ts"],"worktree":"<path or 'main'>"}
```

Before appending, scan existing `claimed` lines for **path prefix overlap** with your intended
scope. Treat a claim as **stale and ignorable** if its session is not `isRunning` in
`list_sessions`, or its `ts` is more than 24h old — note in your report that you overrode it.

**Notion** — post on the ticket:

```
[Claude/sp-autonomous] — CLAIMED
Session: <sessionId>
Scope: <paths//modules you will touch>
Worktree: <path or 'main'>
```

Set `Assigned To Agent` to the personas that will hold it.

## Step 5 — Negotiate overlap

If another live session's claim, WIP, or ticket overlaps yours, **message it before touching a file**:

```
mcp__ccd_session_mgmt__send_message
  session_id: <theirs>
  message: |
    sp-autonomous run here, working <SST-###>. My scope: <paths>.
    I see you on <their files/ticket>. Overlap: <specific files>.
    Taking: <what I'll take>. Leaving to you: <what I won't touch>.
    Landing on 2026-v1 from <worktree>. Shout if that collides.
```

Then act — **do not block waiting for a reply.** Resolution order:

1. **No file overlap** (different directories) → proceed independently. Most common case.
2. **File overlap, they're mid-edit** → defer that item; take the next one on the list. Note it in
   the final report as deferred-for-collision with the session and files.
3. **Same ticket** → theirs. Defer.
4. **They're idle (`isRunning: false`) with stale uncommitted WIP** → work around their files.
   Never commit, revert, or stash someone else's WIP.

## Step 6 — Choose isolation mode

Judge by **overlap with the source files you intend to touch**, not by whether the tree is dirty.
`.claude/launch.json` and `.claude/scratchpad.md` are dirty in the main worktree almost all the
time — they are another session's config and scratch, they are never your source, and explicit-path
staging already keeps them out of your commits. **Dirty `.claude/*` alone is not a reason to
isolate.** Over-isolating is its own problem: the repo has accumulated ~19 stale worktrees.

**Isolate in a dedicated worktree if any of these hold** — otherwise work directly in the main
worktree on `2026-v1`:

- Another running session's scope **overlaps the source paths you will edit** (their WIP files, their
  claim ledger entry, or their ticket's scope intersect yours)
- Your item is large, long-running, or touches broadly-shared files
- You are running several items and want each to land as an independent, revertible unit
- You need a clean local typecheck/test signal and a co-resident session's WIP is breaking it

Otherwise the main worktree is fine. Explicit-path staging is what keeps you honest there, not
isolation.

```bash
cd "C:/Users/wolff/Projects/SurvivorPulse"
git fetch origin
git worktree add ".claude/worktrees/sp-auto-sst1234" -b auto/sst-1234 origin/2026-v1
cd "C:/Users/wolff/Projects/SurvivorPulse/.claude/worktrees/sp-auto-sst1234"
git branch --unset-upstream          # ← MANDATORY. See the trap below.
```

`.claude/worktrees/` is gitignored in the SurvivorPulse repo, so the worktree itself never pollutes
the tree.

> ⚠️ **The upstream trap.** `worktree add -b auto/X origin/2026-v1` sets `auto/X`'s upstream to
> `origin/2026-v1`. A later `git push -u origin auto/X` pushes to the **upstream ref** — fast-forwarding
> remote `2026-v1` with whatever you have. Remote `2026-v1` auto-syncs to the Replit dev app.
> `git branch --unset-upstream` immediately after creating the worktree, always.

---

## Integration — committing and pushing without collateral damage

### Staging

```bash
git status                                   # whose files are whose?
git add <explicit> <paths> <only>            # NEVER git add -A / git add .
git diff --cached --name-only                # verify before committing
```

The verification is not optional. Confirm the staged set contains **only** your files — no
`.claude/scratchpad.md`, no `.claude/launch.json`, nothing from another session's directories.

One slice = one atomic commit. Conventional format, allowed scopes `api|ui|db|auth|core|infra`.
**No `Co-Authored-By`, no AI attribution** in commit messages (PR descriptions may carry the footer;
commits may not).

### Pushing

Rebase onto the latest `2026-v1` first, then push with an **explicit refspec**:

```bash
git fetch origin
git rebase origin/2026-v1
NODE_ENV=test TEST_DISABLE_NETWORK=1 TEST_FAST_OPTIMIZER=1 npx vitest run --config vitest.config.ts
git push origin HEAD:refs/heads/2026-v1
```

Pushing from the worktree straight to `2026-v1` means you never check out or disturb the main
worktree, where another session may be working. Because you rebased, it is a fast-forward.

**Record your own commit range the moment the push succeeds** — you need it for every "what did I
change" claim from here on:

```bash
MY_BASE=$(git rev-parse HEAD~<number-of-your-commits>)   # the commit your first slice sits on
```

**Read the push output's destination ref before moving on.** If it says anything other than what you
intended, stop and fix it immediately — remote `2026-v1` is live to the dev app.

If the rebase conflicts, the other session landed in your files. Resolve in your worktree only,
re-run the tests, and tell them via `send_message` what you changed.

### After a rebase, the branch diff is NOT your changes

A rebase interleaves the neighbouring session's commits into your branch's history. From that moment
`git diff origin/2026-v1...HEAD` and "files changed on this branch" include **their** work as well as
yours, and every claim built on them is wrong.

This has already produced a false statement in a review record: a run reported "the three protected
files are unedited" when one had gained ~50 lines from a neighbour's commit that the rebase pulled in.
The claim survived because it read the branch diff instead of its own commits. A reviewer caught it;
the procedure did not.

So scope every "what I changed" claim to **your own commits**, never the branch:

```bash
git diff --name-only $MY_BASE..HEAD            # your changed files
git diff --stat      $MY_BASE..HEAD            # your diffstat
git diff --name-only $MY_BASE..HEAD -- <protected-path>   # must be EMPTY
```

Use this for the read-only/protected-file verification, the build summary's file list, and anything
you tell a reviewer. When a protected file *has* changed but not by you, say exactly that, name the
commit that did it, and prove your range is clean — do not report the blanket "unedited".

**Post or update the build summary AFTER the push, citing the pushed SHAs.** A summary written
pre-rebase cites commits that no longer exist on `2026-v1` — the reader follows them and finds
nothing. Include every slice that actually shipped, not the count you planned.

**Tell the next session what rode along.** If a rebase interleaved commits that aren't yours, name
them in the RELEASE comment so nobody attributes them to your ticket.

### Cleanup

```bash
cd "C:/Users/wolff/Projects/SurvivorPulse"
git worktree remove ".claude/worktrees/sp-auto-sst1234"
git branch -D auto/sst-1234
```

---

## Release

1. Append a `released` line to the ledger for each claim:
   `{"ts":"…","session":"…","ticket":"SST-1234","status":"released"}`
2. Post on each ticket: `[Claude/sp-autonomous] — RELEASED · <files> free · landed <sha> on 2026-v1`
3. `send_message` any session you negotiated with that the files are free.
4. Remove the worktree.

An unreleased claim blocks the next run for 24h. Release even when the item was deferred or failed —
especially then.

---

## What the CI gate does and does not see

The pre-publish gate runs a **clean checkout of `origin/2026-v1`** — your pushed commits only,
without any session's uncommitted WIP. That is the authoritative clean-tree signal, and it means a
neighbor's half-finished work cannot pollute your SHIP verdict.

Locally, `npx tsc` and `npx vitest` **do** compile a co-resident session's WIP in the main worktree.
If a type error appears in files you never touched, that's whose it is — don't fix it, don't commit
it, and don't let it block you. Isolate in a worktree instead.
