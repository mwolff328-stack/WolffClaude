---
name: survivorpulse-sportsbook-subs-are-open-fanout-targets
description: "r/sportsbook and r/sportsbetting are open fan-out targets for SurvivorPulse Reddit outreach, not subs to avoid"
metadata: 
  node_type: memory
  type: project
  originSessionId: f4b91940-5144-41fd-88bd-2a9bc3061291
  modified: 2026-09-01T23:49:41.886Z
---

r/sportsbook and r/sportsbetting are valid, untouched fan-out targets for the SurvivorPulse "Build in Public" backtesting series (and Reddit outreach generally) — treat them the same as any other new subreddit, e.g. r/fantasyfootball.

A prior session incorrectly flagged both as "recently posted, wait before re-posting" based on two 2026-08-27 rows in the Outreach Log. Founder correction (2026-09-01): those rows were Mike **replying inside other people's threads** to answer questions, not original community posts. Neither sub has received an original post from this campaign.

**Why:** the Outreach Log doesn't distinguish "we started a thread here" from "we replied in someone else's thread" — both can show up as an activity row for the same sub on the same date. Don't infer "already posted to this sub, avoid over-posting" from a log row alone; check whether the row is a self-post/community post versus a reply/comment before concluding a sub was targeted.

**How to apply:** before excluding any subreddit from a fan-out plan on the grounds that it was "recently posted to," verify the specific row is an original post (a submission), not a comment reply. See [[reference_beta_outreach_notion_databases]] for the Outreach Log's Status/State axis caveat — this is a separate, additional trap in the same data source (post-type ambiguity, not the Status/State filter issue).
