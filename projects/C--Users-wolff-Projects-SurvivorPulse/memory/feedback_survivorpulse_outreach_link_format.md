---
name: feedback-survivorpulse-outreach-link-format
description: "Use the full https://survivorpulse.com/?ref=... URL (not bare \"survivorpulse.com\") in Discord and X outreach drafts, with a cache-busting query param so X renders a fresh link-preview card."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0a6f5566-de6a-4c0f-9867-4e2d86e83cfa
  modified: 2026-09-01T13:57:53.966Z
---

In Discord DM and X reply/DM drafts, write the link as `https://survivorpulse.com`, not the bare `survivorpulse.com`.

**Why:** founder correction, 2026-08-31, during the fresh-prospect outreach batch (Joncole23 draft) — he explicitly said "Make sure to include https://survivorpulse.com as the link for Discord messages and X posts" after tweaking a draft that used the bare domain.

**How to apply:** when drafting the SurvivorPulse pitch paragraph for a Discord or X message, use the full `https://` link inline. This is about the link *inside the body paragraph* specifically — it does not necessarily change the sign-off convention (X sign-offs still end with a bare "survivorpulse.com" per [[project_survivorpulse_beta_launch_site_decisions]]-adjacent conventions; watch for whether the founder wants the sign-off line changed too, or just the inline mention). Reddit sign-off convention (persona account, no link at all) is unaffected — Reddit doesn't render the same kind of link-preview card, so the cache-busting addition below is moot there.

**Update 2026-09-01 — append a `?ref=` cache-buster.** Verified live: `survivorpulse.com`'s `og:image`/`twitter:card` meta tags are correctly configured and the OG image (`https://survivorpulse.com/og-image.png`, 1200x630, the shield logo) loads fine — this was confirmed by fetching the live page and image directly, not by reading the source. The public reply to @statue_baker (2026-09-01) still rendered a blank/generic link-preview box instead of the logo. Root cause is X's own link-preview cache: X caches a card per exact URL on first crawl, and if `survivorpulse.com` was ever shared before the OG image existed (or a crawl attempt failed), X keeps serving that stale card indefinitely. X pulled its public Card Validator years ago, so there's no reliable self-service way to force a refresh on an already-cached URL.

Founder-directed fix: going forward, use a unique query string per link so X treats it as never-before-crawled, e.g. `https://survivorpulse.com/?ref=x1` or `https://survivorpulse.com/?ref=<platform>-<short-id>` (bump/vary the value each time so it stays a fresh URL to X's crawler). Apply this in Discord and X drafts alongside the full-https rule above. It does not retroactively fix a link already posted — only prevents the blank-card problem on new links. Not needed on Reddit.
