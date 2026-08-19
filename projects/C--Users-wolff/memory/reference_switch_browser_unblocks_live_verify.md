# switch_browser Unblocks Live Verification (do not declare it blocked)

**Recorded 2026-08-19 during SST-1406.**

## The false blocker

`mcp__claude-in-chrome__list_connected_browsers` returns multiple connected Chrome
instances and instructs you to present **every** browser as an explicit choice via
`AskUserQuestion` before touching any of them — "do not pick one yourself."

In a non-interactive / background session `AskUserQuestion` is not available. Three
separate SurvivorPulse tickets concluded from this that live verification was
**permanently impossible** and shipped with the live test case open:

- **SST-1402** — TC5 (confirm `crossPoolOverlap` on the founder's real portfolio) left PENDING
- **SST-1402-followup** — TC6, same constraint, same conclusion
- **SST-1406** — initially recorded the same way, then disproven

## The actual route

**`mcp__claude-in-chrome__switch_browser`** broadcasts a connect prompt to *every*
connected Chrome extension and waits (up to ~2 min) for a human to click **Connect** in
the one they want. That satisfies the "do not pick one yourself" rule *by construction* —
the human picks, inside Chrome — and it needs **no** question tool at all.

```
mcp__claude-in-chrome__switch_browser   →  "Connected to browser 'SurvivorPulse Chrome'."
```

From there `tabs_context_mcp` / `navigate` / `computer` / `javascript_tool` all work
against the founder's **real authenticated session** on the deployed dev app — which is
the only way to see real pool/entry data (helium is unreachable from a local query, and
the local Neon DB has no founder user row at all).

`select_browser` is the alternative when you already know the right `deviceId`, but it
requires you to choose — `switch_browser` does not.

## Why this matters beyond the tool

The failure mode is the generalizable part: the constraint was **real and correctly
identified**, but only **one** route out of it was considered, so a genuine capability got
filed as a permanent capability gap and propagated across three tickets. A
founder-visible feature sat unverified twice while being reported as shipped.

**Rule:** before writing "blocked, no route available," enumerate the tool surface for a
second route. In a report, "I checked one door" is indistinguishable from "the room is
sealed."

## Companion facts confirmed the same session

- **Local DB is not the founder's data.** Querying `users` for `%wolff%` on the local
  `DATABASE_URL` returns **zero rows**. Live verification of real portfolio data
  *cannot* be done locally, regardless of `DEV_AUTOLOGIN_EMAIL`. Go to the deployed app.
- **A fresh worktree has no `.env`** (gitignored, lives only in the main checkout), so a
  full `vitest` run from one fails DB-bound suites with `pg-pool ECONNREFUSED` at
  `createTestUser`. That is an environment artifact, **not** a regression — prove it with
  a baseline control run of the same files in the main checkout.
- **Rebase rewrites your commit SHAs.** After `git rebase origin/2026-v1`, the SHAs you
  noted pre-rebase are dead. Verify each with
  `git merge-base --is-ancestor <sha> origin/2026-v1` before citing it anywhere a human
  will follow it. Caught three dead SHAs already written into a Notion Done comment.
