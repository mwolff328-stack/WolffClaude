---
name: post-r-nflsurvivor-series1
description: One-time reminder to post the r/NFLSurvivor cut of SurvivorPulse content series post 1
---

This is a one-time reminder for Michael "Mike" Wolff, founder of SurvivorPulse. It is time to post the r/NFLSurvivor cut of post 1 in the six-part backtesting content series. This is the last piece of post 1 still outstanding — the Discord #backtester post, the r/SurvivorPulse post, and a reply on an existing r/NFLSurvivor thread are already live (posted 2026-08-17). Sequencing was deliberate: this post was held back a day so the same personal Reddit account wasn't seen commenting and self-posting on the same day.

Call PushNotification yourself to notify Mike now. Include in the notification: it's time to post to r/NFLSurvivor, from his personal account u/Cold_Issue_5093, and the ready-to-paste title and body below.

---
TITLE: I backtested 5 seasons of survivor pool picks. First finding: chalk survives longest, and it's not close.

BODY:
I build a survivor pool tool called SurvivorPulse, so take that for what it's worth going in. I'm posting this because I think the finding is more interesting than the plug, and I want to hear where people disagree.

Here's what we did. For every game, we pulled the win probability straight from the betting line. No power rating, no proprietary model. The spread already has home field, injuries, rest, and weather baked into it, so we didn't see the point in re-deriving something the market already prices.

Then we estimated how much of the field is on each team, and ranked teams by weighting those two inputs, win probability and field exposure, a few different ways. We ran that against five full seasons, 2021 through 2025, with unit tests the whole way so we weren't fooling ourselves.

First finding, and it's the clearest thing we found: chalk, meaning the highest win probability team available, is the strongest way to stay alive, at every depth we tested. In our 2021-2025 testing, chalk got you to week 9 alive about 15% of the time, against about 4% for an even blend of win probability and low field exposure.

That's not the surprising part though. We also asked a different question: which approach actually wins the money? We compared 36 pool setups on expected value, and chalk won none of them. It finished somewhere between 5th and 18th every single time.

I'll get into why in a follow-up, but I'm curious if that tracks with what people here have seen. Does the safest path to surviving long ever feel like the path to actually winning it?

Full methodology write-up is at survivorpulse.com/methodology if anyone wants the details.
---

Also remind him: once this is live, the X thread (@survivor_pulse) is next in the sequence, queued to go out the day after this Reddit post. It's logged in the "Original Content Log" Notion database (page URL: https://app.notion.com/p/3bf29ce5833d81c5af87e00facb3e2b0), Status "Ready for Review."

After sending the notification, use the Notion OAuth connector tools (mcp__d77c6777-2678-446f-b1ea-d56a8303dfb6__notion-fetch, not mcp__notionApi__*) to fetch this page: https://app.notion.com/p/3bf29ce5833d810d8658daac6435e1b1 (the r/NFLSurvivor cut log entry) and re-paste its current Content property into the notification if it differs from what's embedded above — this task was scheduled a day in advance, so if Mike or Claude edited the copy since scheduling, the notification should reflect the latest version, not stale text. Do not attempt to post to Reddit yourself, this is a manual-posting workflow.