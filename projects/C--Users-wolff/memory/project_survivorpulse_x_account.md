---
name: project_survivorpulse_x_account
description: "SurvivorPulse's X presence — @survivor_pulse brand account, the reply-first strategy behind it, and the multi-pool positioning line it exists to carry"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3bede00d-6231-464e-9486-cef81710ae4d
  modified: 2026-08-03T23:48:28.684Z
---

SurvivorPulse's X account is **@survivor_pulse** (display name "SurvivorPulse"), created 2026-08-03 as a **brand** account, Professional > Business, category Sports/Fitness & Recreation. `@survivorpulse` (no underscore) is taken by an unrelated dormant personal account (1 follower, last active July 2025) and can't be reclaimed. `michael.wolff@survivorpulse.com` is deliberately **reserved for a future separate founder account** — the brand account is owned by its own survivorpulse.com address.

**Why it exists: replying, not broadcasting.** Competitor [@spgsurvivorpool](https://x.com/spgsurvivorpool) posts 4+ genuinely good strategy tweets a day and gets 1-20 views each. Copy into a void is not distribution. This account's job is to be a credible place to reply *from* when approaching the warm leads the daily `sp-social-listening` run surfaces. Don't build a content calendar for it.

**The positioning line it carries** (full note in Notion → SurvivorPulse > Strategy & Growth > Marketing > Messaging): the category's standard frame is single-pool "survivor is inventory management, spend your teams in the right order." That silently assumes one entry in one pool. Ours goes one level past it: *"One pool is inventory. Four pools is a portfolio, and your Week 6 pick is wrong in at least one of them."* Claim guardrails bind — no edge / win-rate / "optimal" / "proven" language (see [[project_survivorpulse_whitepaper_retraction]]); safe words are exposure, what it costs you, what you're doubled up on, which pool. Never name or quote-tweet a competitor.

**Brand assets.** Tokens live in `client/src/index.css`: `--color-brand #5e6ad2`, `--color-brand-accent #7170ff`, `--color-brand-hover #828fff`, `--color-brand-muted #7a7fad`. Generated X header (1500x500), three favicon sets, and the OG image (1200x630) are at `C:\Users\wolff\Downloads\survivorpulse-brand\` with their regenerating scripts (`make_brand_assets.py`, `make_header.py`) alongside — edit the constants and re-run rather than rebuilding by hand. Two gotchas: **Inter is not installed locally** (only Arial/Segoe UI), so never render brand text with Pillow — use the logo PNGs, which have the wordmark baked in; and the shield's fill is near-black, so it needs a solid background (brand purple) or it vanishes in dark tab strips and iOS home screens.

Related: [[project_survivorpulse_reddit_sportsbook_intel]], [[feedback_writing_style]]
