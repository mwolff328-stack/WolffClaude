---
name: pool-diary-weekly-rollout
description: Kicks off the weekly SurvivorPulse Pool Diary post rollout every Monday morning, after the prior week's NFL games have completed — gather data, draft, get Michael's approval, and post across all six channels.
---

## Objective

Run this week's SurvivorPulse "Pool Diary" rollout — a recurring weekly series under Michael Wolff's own name (personal Reddit account u/Cold_Issue_5093, brand X account @survivor_pulse, personal X account @mrwolff369, and a Discord server) reporting his real survivor-pool results, driving SurvivorPulse sign-ups. This runs every Monday through the rest of the 2026 NFL regular season and playoffs.

## Determine which week this is

Check the "Weekly Season Recap" Notion data source (`8714f72c-d1ed-4847-ac29-928e803ff896`) for the highest existing Week Number row — this week is that number + 1. If the season has ended (Super Bowl already completed and posted), stop and tell Michael this task should be disabled rather than proceeding.

## Standing cadence

Start gathering data and drafting on Monday (today). The post typically isn't finalized and pushed to all channels until Tuesday, after a round or more of edits with Michael — that's expected and fine, don't rush him. If Michael isn't available to review on Monday, continue the conversation into Tuesday rather than posting anything without his sign-off.

## Process (established and working as of Week 3, follow it exactly)

1. **Gather data first.** Ask Michael for his Game Plan screenshot/data for the week (picks made per pool/entry, results, any buybacks used). When asking about pool sizes, be precise: ask for "the total-field number shown as 'X of Y alive' under the pool name" specifically, not "entries alive" — those are two different numbers and conflating them wastes a round-trip.
2. **Fill the two Notion trackers FIRST, before drafting anything:**
   - **Weekly Season Recap** — data source `8714f72c-d1ed-4847-ac29-928e803ff896` — one row per week (Pools Start/End, Entries Start/End, Wins, Losses, Buybacks Used, Prize Alive, Cumulative Buy-in, Posted Date, Story Notes). Story Notes should capture the real narrative/lesson for the week, verified against the pick-level data, not reconstructed from memory.
   - **Weekly Pick Results** — data source `d310ce9d-141f-4d37-84cd-a3d75923e43b` — one row per pool per week (Pool Name, Entry, Pick, Result, Status, Buyback Cost as its own field — never put buyback cost in a Buy-in field). Both link from the Pool Diary Notion page (`3d529ce5833d816f88fef03d0e933059`).
   - These trackers only record what actually happened — they do NOT track which entries are carrying an unused buyback in reserve. If Michael's narrative references reserve-buyback allocation, that detail must come from him directly, it isn't derivable from tracker data.
3. **Build the two recap images from tracker data.** Recipe that works: build a small HTML file (cream/tan card design, Georgia serif headline, sans-serif table — match the existing Week 1-3 PNGs' exact visual style, view them for reference at `G:\Shared drives\SurvivorPulse\Strategy & Growth\Marketing\2026 Diary Posts\images\`), serve via local `python -m http.server` in the scratchpad dir, render with headless Edge:
   `"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu --user-data-dir=<isolated temp dir> --window-size=<W,H> --screenshot=<output.png> --default-background-color=00000000 --hide-scrollbars <http://localhost:PORT/file.html>`
   The `--user-data-dir` pointing at an isolated temp dir is REQUIRED — without it the command silently exits 0 with no file (profile-lock conflict with Michael's real Edge session). Copy finished PNGs to the shared drive via PowerShell `Copy-Item` (Bash `cp` sometimes gets "Permission denied" on that G: mount).
4. **Invoke the `authentic-tone-of-voice` skill before drafting any text, every time.** It has a dedicated "Pool Diary register" section with exact voice rules and rejected-AI-draft examples (overdramatized titles, manufactured drama, cute hooks like "Spoiler:"). Michael notices immediately if this is skipped.
5. **Draft the canonical r/SurvivorPulse post first**, get Michael's edits/confirmation — expect multiple rounds (title changes, image-title syncs, content rewrites, link/CTA decisions). Save the confirmed final text to the Notion "Original Content Log" data source (`collection://5ca826d7-ad5f-452c-af0a-81b1742b1d29`), Pillar = "Pool Diary", title pattern "Pool Diary — Week N (<channel>)".
6. **Then adapt for the other five channels, same pattern each week:**
   - **r/NFLSurvivor** — same body, posted from Michael's personal account (not brand). Soften the first SurvivorPulse mention with a low-key explanatory clause since that audience doesn't know the product.
   - **X** (brand account @survivor_pulse) — title folded into the opening line, full body reused, both images attached (they cluster at the end — known X limitation, not a bug).
   - **Discord #pool-updates** — split into as many messages as needed to stay under Discord's ~2000-char limit per message (count characters, don't assume a fixed number of messages works every week). Each message except the last ends with a zero-width space (U+200B) on its own line so consecutive messages don't visually merge.
   - **X personal repost** (@mrwolff369 quote-reposting @survivor_pulse) — a SHORT original comment (3-5 sentences), not the full post. Michael typically rewrites this one himself through a couple of rounds — draft it, expect edits.
   - **Discord #general teaser** — short, telegraphic status line pointing to #pool-updates. Michael sometimes posts as-drafted, sometimes hand-edits — ask him directly which happened before logging it, don't assume.
7. **No posting capability exists for Reddit, X, or Discord.** The Discord MCP connector is read-only (no send tool), and there's no Reddit/X posting tool. For every channel, give Michael the exact copy-pasteable text (and note which images go where), he posts it himself, and reports back the live URL.
8. **Log every posted piece in the Original Content Log** with Status=Posted, Post URL, Date Posted, and Content updated to match what was ACTUALLY posted (verify via Michael's "how does this look" screenshots before logging — he often tweaks further in the platform's own compose UI).
9. **After all channels are posted**, update both trackers' Posted Date fields and re-verify the Weekly Season Recap Story Notes field matches the truly final published narrative against the Weekly Pick Results rows — don't trust an earlier draft-stage version of the notes.

## Known traps, don't repeat

- Always re-verify narrative claims about pool/entry state (e.g. buyback reserves) against the actual Weekly Pick Results rows before writing them into prose — don't reconstruct from memory of the conversation.
- The Notion "Content" field on a channel's page can go stale if Michael rewrites the post after a first draft was logged — always re-sync it to match what was truly posted.
- Notion rich_text blocks are capped at 2000 characters each — long post bodies need multiple rich_text array entries, not one giant string.
- Privacy: Michael has explicitly ruled all the real pool names (Buddy Pool, Real Simple Football Pool, BetOnline Pool, BIG PRIZE Pool, ESPN AS Pool, ESPN Last Man Standing, McLaney's Pool, Stagger Inn Pool, APB Pool) are fine to use as-is since they're public pools. Don't re-litigate this or ask about anonymizing them.

## Exact next step

Ask Michael for this week's Game Plan data (picks, results, buybacks), specifying clearly whether you need his own entry-alive counts or the pool-wide "X of Y alive" field-size numbers for each pool.