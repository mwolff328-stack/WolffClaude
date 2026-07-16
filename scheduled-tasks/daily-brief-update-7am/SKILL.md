---
name: daily-brief-update-7am
description: 7am follow-up that appends an update to today's existing Notion daily brief. Reports what changed since 6am AND ages persistent unresolved items so long-running problems get louder over time instead of quieter.
---

You are running the 7:00 AM follow-up to Michael's morning daily brief. A full brief was generated at 6:00 AM and saved as "Daily Brief — [DATE]" in the Notion "Daily Briefings" database. Find that page and APPEND an update section. Do NOT create a new page. Run autonomously; the user is not present. Use the system date (America/Los_Angeles). Read-only everywhere except the single Notion append; do not send/post/delete anything.

## Why this run exists

An hourly update has exactly two jobs. Most implementations only do the first, which is why they decay into noise.

1. **Surface what's new.** Genuinely new, actionable items since 6am.
2. **Age what's old.** An item that has not changed is NOT the same as an item that is fine. A CI failure unchanged for 3 days is a worse problem than one that appeared this morning. A "Today" task unchanged for 19 days is not a task, it is a lie. Reporting these as "unchanged" every hour is how a real blocker becomes invisible.

The failure mode to avoid: writing "No material changes" and stopping. That sentence is only ever true about *new events*. It is almost never true about the state of the system.

## STEP 1 — FIND TODAY'S BRIEF PAGE

Query the "Daily Briefings" database (data source collection://2cb29ce5-833d-80cc-a37f-000bd410a54e) and find the page with Date = today, title "Daily Brief — [DATE]". If no page exists for today (the 6am run did not complete), note that and STOP. Do not create a brief.

Read the 6am brief content. You need it both to diff against and to compute ages.

## STEP 2 — RE-CHECK SOURCES (fast tier first)

**Fast tier — always check. These are cheap API calls.**
1. **Personal Gmail** (mwolff328@gmail.com) via the Gmail connector: `search_threads` with `in:inbox newer_than:1d`. Surface only genuinely new and actionable mail. Skip newsletters and automated notifications.
2. **Calendar** (Google Calendar `list_events` for today): newly added, changed, or canceled events; new invites needing a response. Flag any new event that collides with a block the Weekly Plan reserved for deep work — that is a real signal, not trivia.
3. **Master Backlog MITs** (Notion database 29d643cd-9eb9-4897-9027-8efbd73c0f1d): status changes, and due dates for age computation.
4. **Notion workspace**: pages edited since 6am. A new doc that contradicts the active Weekly Plan is one of the highest-value things you can catch.

**Slow tier — Chrome. Expensive (screenshots, multiple page loads). Check only if warranted.**

Run the Chrome sweep only when at least one of these is true:
- A tracked persistent item is at or past its escalation threshold (see STEP 3) and you need current state to report it honestly.
- The fast tier surfaced something that points at the slow tier (e.g. a GitHub notification email, a SurvivorPulse payment alert).
- It has been 3+ runs since the slow tier was last read.
- The 6am brief reported the slow tier as unreadable or unauthenticated.

If none of those hold, skip the Chrome sweep and say so in one line: "Chrome sweep skipped this run (no trigger); last read <when>." Do not burn five GitHub screenshots to confirm nothing happened in sixty minutes. Skipping is the correct, cheap default — but never skip it when a tracked blocker is aging, because that is precisely when you need the current number.

Slow-tier sources when you do run it: SurvivorPulse inboxes (michael.wolff@, admin@, survivorpulse@gmail.com, demo@ — note that admin@ and demo@ alias to michael.wolff@), mrwolff369@gmail.com, Google Tasks ("Mike's Personal Task List"), and GitHub (github.com/pulls, /pulls/review-requested, /issues/assigned, /notifications?query=is%3Aunread, /dashboard).

**Chrome method:** `list_connected_browsers` → `select_browser` → `tabs_context_mcp(createIfEmpty:true)`. Resolve every account BY EMAIL, not slot number — slots are unstable. Navigate to `https://mail.google.com/mail/u/?authuser=<EMAIL>` and verify the tab title reads "Inbox - <email>". If it redirects to a sign-in page, note "<email>: not signed in this run" and continue. `get_page_text` is unreliable on Gmail and GitHub — screenshot instead. READ-ONLY: never open, reply, archive, star, delete, comment, merge, or approve. If the browser is unreachable, note it and continue.

## STEP 3 — AGE THE PERSISTENT ITEMS (this is the part that gets skipped)

Before writing anything, build a short ledger of every unresolved item you can see, and compute its age. Age comes from the item's own data (due date, PR opened date, notification timestamp, task created date), not from memory.

Track at minimum:
- MITs with Status = "Today" or overdue (age = days past due)
- Open/draft PRs (age = days since opened or last touched)
- CI failures (age = how long the run has been failing; count of failure notifications)
- Overdue tasks
- Notion items flagged as needing action (e.g. a Weekly Plan still in Draft)
- Any hard blocker named in a previous run and not resolved (e.g. exhausted build credits)

**Escalation ladder.** Apply by age, not by novelty:

| Age | Treatment |
|---|---|
| Day 1 | Report normally under the relevant section. |
| Days 2–4 | Report with the age stated explicitly. "3 days." |
| Days 5–13 | Promote into a **⏳ Aging** block. State the age and what it is blocking. |
| Day 14+ | Promote to the top of the update as a **🚨 Escalation** block. State the age, state the consequence, and force a binary decision: fix it, or formally drop it. |

At Day 14+, "unchanged" is not an acceptable report. If a task has been "Today" for 19 days, say so, and say the quiet part: it is not actually today's task, and the backlog is lying. If a draft PR meant to fix 86 failing tests has been stale for 3 weeks while the branch it fixes is the one blocking the primary outcome, that is the single most important line in the update.

**Contradiction check.** If any new item (a scoping doc, a plan, an email) contradicts the active Weekly Plan's primary outcome, surface that as its own block. Two things that cannot both be true is a five-minute decision that changes what the week is, and it is worth more than every "no change" line combined.

## STEP 4 — WRITE THE STATE SNAPSHOT

Before appending the prose, write a structured snapshot of what you observed. This is what makes the *next* run's aging reliable instead of reconstructed from prose, and it doubles as an eval fixture.

Append it to the brief page inside a collapsed toggle titled `🔎 State snapshot — 7:00 AM` as a fenced `json` code block:

```json
{
  "run": "2026-07-14T07:00:00-07:00",
  "chrome_sweep": "skipped | ran",
  "new_items": [
    {"source": "gmail", "id": "...", "summary": "...", "needs_decision": true}
  ],
  "persistent": [
    {"id": "MIT-369", "label": "SurvivorPulse Back Tester", "source": "master-backlog",
     "first_seen": "2026-06-25", "age_days": 19, "tier": "escalation", "blocking": "2026-v1 launch"}
  ],
  "resolved_since_last_run": []
}
```

Keep it factual. Ages must be computed from dates, not estimated.

## STEP 5 — APPEND THE UPDATE

Use `notion-update-page` with command `insert_content`, position `{"type":"end"}` on today's brief page.

Structure, in this order (omit any block that is genuinely empty):

```
## 🔄 Update — 7:00 AM

### 🚨 Escalation
(Day 14+ items. Age, consequence, and the binary decision. Most important thing on the page.)

### ⚡ New & actionable
(Genuinely new since 6am. Anything needing a yes/no gets said as needing a yes/no.)

### ⚠️ Contradiction
(Anything new that conflicts with the active Weekly Plan's primary outcome.)

### ⏳ Aging
(Days 5–13. Age stated, what it blocks.)

### Held steady
(One line. Sources checked with nothing new. This is the ONLY place "no change" language belongs, and it gets one line total — not one line per source.)
```

Then the `🔎 State snapshot` toggle from STEP 4.

Lead with the point. Be concise and direct. No em dashes. Cite linkable items. Do not rewrite or duplicate the 6am content.

The Notion append is the only write action. Take no other write actions.
