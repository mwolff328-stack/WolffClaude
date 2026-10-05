---
name: survivorpulse-weekly-broadcast
description: Draft, get founder review, send (with explicit approval), and log the weekly SurvivorPulse broadcast email
---

This is the recurring Wednesday SurvivorPulse broadcast workflow. It is a continuation of an established weekly practice (Week 1 sent 2026-09-16, Week 2 sent 2026-09-23, Week 3 sent 2026-10-01, all logged in Notion). Run this whole prep workflow autonomously, but the actual send always needs the founder's (Michael's) explicit go-ahead -- never send on your own.

FIRST: check today's date. If it is after roughly 2027-02-10 (the regular season + playoffs + Super Bowl should be over by then), stop and tell the founder the season has ended and ask whether to disable this recurring task, rather than drafting a broadcast.

## 1. Confirm the current NFL week live
Do not assume a week number from date math alone. Check survivorpulse.com/rankings (the Week selector) or search the web to confirm which week just completed (recap) and which week is next (preview). This broadcast recaps the week that just finished and previews the upcoming week.

## 2. Read the last 1-2 real sent broadcasts for voice/structure calibration
Query the Notion "Broadcast Emails Log" database (https://app.notion.com/p/be9703843aa6443090765b38edbb0114, data_source_id 939f8ddd-969b-4bbd-98aa-f5f2d4954a6c) sorted by Send Date descending, and read the 1-2 most recent entries' Key Story/Stat, Data Accuracy Notes, and Notes fields. Also check for a founder-written draft or real sent copy in `C:\Users\wolff\OneDrive\Documents\SurvivorPulse\Strategy & Growth\Broadcast Emails\` (there's usually a dated subfolder per week, e.g. "Week N Recap"). If the founder has already started a draft .docx there for the current week, read it (unzip the docx and extract <w:t> runs from word/document.xml; if locked by Word, copy to a scratch path first) and work from/alongside that rather than starting from scratch -- do not silently overwrite his own edits.

## 3. Required content sections (founder's standing list)
1. Recap of the previous week -- top-5 SurvivorPulse-ranked picks' actual won-loss record, real final scores verified live (see below), call out any notable upset or chalk result by name.
2. Preview of the upcoming week -- top picks, which teams are heavily favored/popular, a reminder to check field exposure and try different strategies.
3. New capabilities/enhancements shipped since the last broadcast -- check `git log origin/2026-v1 --since=<last Send Date>` in the SurvivorPulse repo worktree for user-facing changes, and confirm each one is actually live in PRODUCTION (look for a "Published your App" commit after the feature's commit) before claiming it's live. Never describe a feature as available without confirming it's past the most recent publish commit.
4. A tip (or tips) on using SurvivorPulse more effectively.
5. Links to other content posted in the last week -- check `G:\Shared drives\SurvivorPulse\Strategy & Growth\Marketing\2026 Diary Posts\` for a new diary post (Michael's own weekly recap, posted under his own name to Reddit/X) dated since the last broadcast. If none exists yet, ask the founder rather than inventing or reusing stale content.

Explicitly OUT OF SCOPE: any unrelated personal Reddit reply threads Michael is running about his own pool results -- that's separate from this broadcast; don't pull content from those threads unless he says otherwise.

## 4. Voice
Use the `authentic-tone-of-voice` skill as the outer voice/style frame (invoke it via the Skill tool). Pull in `explain-simply`'s content-clarity principles only (plain-before-jargon, one anchor, name results straight) -- NOT its bullet/bold/skimming formatting guidance, which conflicts with this voice's prose rhythm. Before finalizing, re-invoke `authentic-tone-of-voice` and self-check against its Quality Check list (no em dashes, no banned corporate jargon, no generic closings, at least one short standalone line).

## 5. Structural template
Mirror the real prior sends' shape: a subject reacting honestly to how the week went, a short personal opening line, a recap section with real scores/win-probabilities (and upset call-outs by name), a new-capabilities section, a tips section, a "week ahead" bullet list (rankings live, try strategies, check field exposure, watch line movement), a links-to-other-content section, a closing Discord/Reddit feedback ask, and sign-off "The SurvivorPulse team".

## 6. Verification requirements -- do not skip any of these
- Game scores and win probabilities are beyond training-data cutoff for an in-progress season. Verify every final score live. Prefer a direct authoritative source (e.g. `site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=N&year=2026&seasontype=2` and the matching `/summary?event=<id>` for box-score detail) over a generic WebSearch -- WebSearch result synthesis has previously returned a confidently wrong final score (38-14 instead of the real 33-31) that would have shipped an inaccurate email if not independently cross-checked against the ESPN API. Cross-check anything surprising (an upset, an unusual stat) against the authoritative API, not just a narrative search result.
- Pull rankings live from survivorpulse.com/rankings, not a local dev build -- use the Week selector (a native `<select>`, use form_input not click) to get both the just-finished week (for the recap's actual picks/results) and the upcoming week (for the preview).
- Verify every link in the drafted email actually resolves live (no 404s) before presenting the draft, including any new-feature links -- a feature can exist in the repo but not yet be published to production.
- If a screenshot is needed for review, use the founder's own real account data, never a shared test/QA account.
- The broadcast compose page has a "Discord invite link" field that must be filled in per-send (invite expires every 30 days) -- ask the founder for the current live link; don't reuse an old one or fabricate one.
- docx extraction: this sandbox has no pandoc. Unzip the .docx and regex-extract `<w:t>` runs from word/document.xml, using `</w:p>` as paragraph breaks. If a file is locked (open in Word) or throws PermissionError (OneDrive cloud-only placeholder), copy it to a scratch path first and read the copy. To get real hyperlink URLs (not just visible text), also read `word/_rels/document.xml.rels` and extract `Target="..."` values.

## 7. Process
1. Confirm current week live (step 1).
2. Read prior sends + any in-progress founder draft (step 2).
3. Check git log + production publish status for new capabilities (step 3.3).
4. Check for a new diary post and verify game results/rankings live (steps 3.5, 6).
5. Draft the full email (subject + body) in voice, or build on the founder's in-progress draft if one exists.
6. Present the draft to the founder in chat and ASK for explicit review/approval before anything goes out. He has consistently caught real issues (inaccurate claims, unpublished features linked as live, dead links, wording precision) in every prior review pass -- don't skip this step or treat a first draft as final. Get his current Discord invite link at this point if not already known for this send.
7. Iterate on his feedback as many rounds as needed. Verify every claim he adds or changes against live sources too (do not just trust an edit is correct -- but also don't contradict his own direct live observation, e.g. a screenshot of the logged-in app, without good reason; if your static/code-level check conflicts with what he says he's looking at live, ask whether a gate or config changed recently rather than insisting on the static read).
8. The actual SEND is the founder's action, not yours -- he sends it himself via the SurvivorPulse admin Broadcasts compose page. Do not attempt to send it yourself or simulate having sent it. Wait for him to confirm it went out (he may paste a screenshot of the admin page showing "Sent to N of M recipients").
9. Once he confirms it was sent, log the entry in the Notion "Broadcast Emails Log" (data_source_id 939f8ddd-969b-4bbd-98aa-f5f2d4954a6c, parent database_id be970384-3aa6-4430-9076-5b38edbb0114) via API-post-page, matching the Week 1/2/3 row conventions: Subject (title), Week (rich_text, e.g. "Week 4"), Topic (select "Weekly Recap"), Status (select "Sent"), Send Date (date), Recipient Count (number, from his screenshot/confirmation), Key Story/Stat (rich_text), Data Accuracy Notes (rich_text -- summarize what was verified and any corrections caught during review, same style as prior rows), Notes (rich_text -- what else was covered, any cross-links used).

Keep going through each Wednesday until the season (through playoffs/Super Bowl, roughly early-to-mid February 2027) is over.