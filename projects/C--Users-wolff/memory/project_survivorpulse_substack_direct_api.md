---
name: project_survivorpulse_substack_direct_api
description: "sp-social-listening's Substack channel now uses direct public HTTP calls, not Apify — do not reintroduce the Apify substack-scraper actor"
metadata: 
  node_type: memory
  type: project
  originSessionId: 267dc707-93c9-4e20-9c62-deda05c7077a
  modified: 2026-08-13T17:05:07.399Z
---

Fixed 2026-08-13: the `cryptosignals/substack-scraper` Apify actor's keyword search was broken (input schema mismatch, always returned nothing). Replaced entirely with two free, unauthenticated HTTP endpoints confirmed live via curl:

- Keyword search: `https://substack.com/api/v1/top/search?query=<url-encoded>&fromSuggestedSearch=false` — the same endpoint substack.com/search itself calls. Returns JSON `items` with `type: post` (title, canonical_url, post_date), `type: comment` (Substack Notes, unused), `type: profileSearchResults`.
- Per-publication watch: `https://<subdomain>.substack.com/feed` — standard public RSS/Atom feed, works for any known Substack publication with no login.

**Why:** Substack's actual site uses these same endpoints client-side, discovered by opening the in-app Browser, navigating to substack.com/search, and reading the network requests — then confirmed reachable via plain `curl` outside any logged-in session.

**How to apply:** [reference_survivorpulse_operating_model] / the sp-social-listening SKILL.md (`C:\Users\wolff\.claude\scheduled-tasks\sp-social-listening\SKILL.md`) Step 2 Substack section now documents this. Confirmed subdomain for the pending candidate "The Sports Commish" is `thesportscommish.substack.com` (verified live 2026-08-13) — use this once it clears its 3-distinct-day promotion bar, don't re-derive it.

Medium's search runs through an internal GraphQL API, not a simple URL — reverse-engineering it wasn't worth it since a live check showed Medium's search results for this niche are mostly 2016-2022 content, no current signal. Left Medium on its existing tag-page Apify scraper (`automation-lab/medium-scraper`), which is already the better tool for it.
