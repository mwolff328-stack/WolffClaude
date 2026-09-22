---
name: project_survivorpulse_weekly_rankings_post_workflow
description: "Recurring workflow for the Week N Rankings social post (r/SurvivorPulse canonical, then X, r/NFLSurvivor, personal X) -- where to pull live numbers, when to refresh, and known traps"
metadata: 
  node_type: memory
  type: project
  originSessionId: da34babb-67cc-4c25-9712-87967549b99e
  modified: 2026-09-22T03:40:19.251Z
---

Weekly Rankings is a recurring SurvivorPulse content post (first run: Week 2, 2026-09-17 through 2026-09-19), distinct from the backtesting research series in [[feedback_content_reference_hierarchy_across_channels]]. Same reference hierarchy applies: **r/SurvivorPulse is the canonical draft**, then the SurvivorPulse X account, then r/NFLSurvivor (posted from the founder's personal account, u/Cold_Issue_5093, with a disclosure line since it's not the brand account), then optionally a quote-post from the founder's personal X account pointing at the SurvivorPulse X post.

**Data source: `GET /api/public/week-picks?week=N` on `survivorpulse.com`, not the Replit dev app.** The two run different databases and disagreed on real numbers during the Week 2 run (49ers spread -12.5 on prod vs -13.5 on dev at the same moment). The post links to production, so production is the only number source that matters. Pull it from a plain fetch in a Claude-in-Chrome tab navigated to `survivorpulse.com` first (unauthenticated is fine, it's a public endpoint) — `credentials:'omit', cache:'no-store'`.

**These lines move, repeatedly, in both directions, over multiple days.** During one week's posting window (Sept 17-19) the same two teams (49ers, Ravens) swung between two different states three separate times as posting was delayed. Do not treat one earlier pull as "close enough" for a later post. Re-pull immediately before each platform is actually posted, not once for all four posts — the X and r/NFLSurvivor posts went out roughly a day after r/SurvivorPulse, and needed their own fresh pull.

**When numbers move, the prose needs re-checking, not just the table.** Phrases like "almost 90%" or "same win probability tier as Tampa Bay, 79%" are claims tied to specific values — if Baltimore drifts from 79.0% to 76.3%, "same tier" becomes false even though the table update is trivial. Read every sentence that names a number or comparison against the fresh pull, not just regenerate the table.

**Known traps hit during the first run:**
- Markdown tables only render in Reddit's Markdown Mode, not the default rich-text ("Fancy Pants") editor. Paste with Ctrl+Shift+V (paste without formatting) if using rich text.
- Watch for em dashes sneaking into bullet-list adaptations (Discord/X) even when the canonical post is clean — the voice rule bans them everywhere, not just the reference post.
- A pasted URL can get text glued onto it with no space (e.g. `/rankingsor in the app`) — always re-read the rendered link, not just the source markdown.
- Before the link goes out, confirm the destination page actually opens on the week being promoted for a SIGNED-OUT visitor. The public Weekly Rankings page's default week is separate code from the authenticated top-nav selector, and it silently hardcoded Week 1 until fixed 2026-09-18 (see the current-week-default work in this project's git history, `client/src/pages/week-1-picks.tsx`). Test the actual public URL in an incognito-equivalent check, not just as the founder's authenticated account, since auth changes which code path drives the displayed week.
- A route change (e.g. adding a generic `/rankings` alias) needs to actually be published to production before the post's link works — landing on `2026-v1` is not the same as being live on `survivorpulse.com`.

**How to apply next time:** pull fresh from `survivorpulse.com/api/public/week-picks?week=N`, build the r/SurvivorPulse table+prose first, get founder sign-off there, then derive Discord/X/r/NFLSurvivor per the reference hierarchy, then re-pull fresh numbers immediately before each actual post action (not from the earlier canonical draft), then verify the destination link/page live before considering the task done.
