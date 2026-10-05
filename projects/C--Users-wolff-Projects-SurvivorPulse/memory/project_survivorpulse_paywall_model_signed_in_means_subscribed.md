---
name: project_survivorpulse_paywall_model_signed_in_means_subscribed
description: "Founder's paywall model: once the paywall is on there is no such thing as a signed-in non-subscriber; the free tier is SIGNED-OUT visitors on the public page, capped at current-and-earlier weeks (ticket SST-1797). Today (open access) signed-in users get all weeks."
metadata:
  node_type: memory
  type: project
  originSessionId: 16cf4f84-760d-4785-80fa-19543ac4e60f
  modified: 2026-10-02T18:49:51.835Z
---

Founder rulings, chat, 2026-10-02 (while closing out SST-1789):

- **Signed-out visitors** on the public `/rankings` (and `/week-1`) page may browse only the
  **current week and ALL earlier weeks**; never a future week. Filed as SST-1797 (Enhancement,
  Backlog, not groomed).
- **Signed-in users are not capped.** Today, under `OPEN_ACCESS_MODE = true`, every signed-in
  user gets all weeks. Once the paywall is on: *"there will be no such thing as a signed-in
  non-subscriber. All signed-in users will have to subscribe."* So the free/paid line is
  **signed-in vs signed-out**, not subscribed vs unsubscribed.

**Why it matters:** I wrongly treated "signed-in non-subscriber" as a lasting user group and
built a follow-up (SST-1790, a stranded-user bug on `/rankings`) and a panel dissent on it. The
founder voided it; SST-1790 was cancelled. The code does have an "authenticated, no
subscription" state (`SubscriptionGateShell` shows the paywall card in the public `Layout`),
but it is a transient or locked state (between signup and checkout, a lapsed user, an admin in
Support Mode on a locked target), not a product tier to design for.

**How to apply:** before designing for an "unpaid signed-in user", check whether that user can
exist in the founder's model; usually the right question is signed-out vs signed-in. A server
cap on `GET /api/public/week-picks` must be auth-aware, because signed-in viewers use that same
endpoint (SST-1580 AC-8: "the data source never changes with auth") and must not be capped; the
route's `public, max-age=60` cache and "byte-identical for every visitor" property then need
rethinking (SST-1797 point 2). Related: [[project_survivorpulse_open_access_mode]],
[[project_survivorpulse_two_season_selectors_desktop_vs_mobile]].
