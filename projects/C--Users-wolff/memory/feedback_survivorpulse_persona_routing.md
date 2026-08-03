---
name: survivorpulse-persona-routing
description: "Route implementation work to the correct SurvivorPulse persona agent (Felix=backend only, Deb=frontend/UI) — Felix will correctly refuse pure front-end tasks"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 44b0b154-1de0-401c-9b8c-1df6cf97b4bf
---

Felix (felix-the-forge agent) enforces a hard boundary: he refuses front-end/UI implementation tasks outright ("Felix does not implement front-end code. Full stop... hand off to Deb before writing a line of code"), even when the task is phrased as generic "implement this story." Deb (deb-the-designer agent) is the correct target for any page/component/UI rendering work, form embedding, visual states, etc.

**Why:** discovered 2026-07-03 during SE-85 overnight implementation — dispatched SST-706 (No-Pools Fast Setup Flow, 100% front-end: inline page state, form embedding, banner visibility) to Felix by mistake. He correctly refused and returned a clear split recommendation rather than doing frontend work outside his mandate or guessing. Re-dispatching to Deb with the same prompt worked cleanly.

**How to apply:** before dispatching a SurvivorPulse implementation task, classify it first — if it touches `.tsx` pages/components, visual states, forms, or anything user-facing with no new backend endpoint/schema/logic, send it to Deb, not Felix. Mixed backend+frontend stories should either be split into two dispatches (Felix for the API/data layer, Deb for the UI consuming it) or sent to Deb with a note that she should flag if a backend piece is missing. Felix should only get tasks with a real server/data-layer component.
