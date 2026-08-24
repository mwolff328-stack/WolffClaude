---
name: feedback-survivorpulse-signoff-links-to-site
description: "Standing instruction to hyperlink \"SurvivorPulse\" to survivorpulse.com whenever it appears as a sign-off/brand mention in outbound content"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 16b54d0b-61e5-4bb4-8536-5ae93d660452
  modified: 2026-08-24T04:58:59.852Z
---

Whenever "SurvivorPulse" appears as a brand mention or sign-off (e.g. the "Mike / SurvivorPulse" line in welcome/outreach emails), make it a hyperlink to https://survivorpulse.com.

**Why:** Founder instruction (2026-08-23), given right after the will17 welcome email went out with a plain-text "SurvivorPulse" sign-off. Treat as a standing default going forward, not a one-off fix to that email.

**How to apply:** Applies to HTML-capable outbound sends (Gmail drafts support `htmlBody`) — use an `<a href="https://survivorpulse.com">SurvivorPulse</a>` anchor in the HTML body rather than plain text. If a channel is plain-text only (e.g. Reddit DM, SMS), this doesn't apply — link where the medium supports it. See [reference_beta_outreach_notion_databases](reference_beta_outreach_notion_databases.md) for the outreach logging this touches.
