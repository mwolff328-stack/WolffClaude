---
name: survivorpulse-dev-workflow
description: "SurvivorPulse development workflow: skip bootstrap, treat Notion stories as PRD/use-cases/QA docs, Kanban approach"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 05ccac44-e27d-4fd9-9c82-33667d4544ae
---

Groomed Notion stories (Description + AC + TCs) are treated as equivalent to PRD, use cases, and QA test case docs. Felix's technical review of a story satisfies the architecture review requirement from the bootstrap phase. The formal `/bootstrap-feature` pipeline (generating docs/PRD.md, docs/use-cases/, docs/qa/) is SKIPPED for SurvivorPulse.

**Why:** Founder prefers a lightweight Kanban development approach. The grooming process is already rigorous and produces the equivalent artifacts. Heavy documentation pipeline is overhead that doesn't add value here.

**How to apply:**
- When a story is marked Ready in Notion: go directly to Felix generating implementation slices → TDD implementation
- Do NOT run prd-writer, ba-analyst, or qa-planner agents before implementation
- Felix MUST move story Status to "In Progress" in Notion when he begins work on it
- Felix MUST post a Notion comment on the story documenting what was implemented — at minimum one comment per slice, plus a build summary comment when all slices are complete
- Felix MUST push `2026-v1` to remote (`git push origin 2026-v1`) after all slices are committed — this is pre-approved and does not require founder sign-off
- Felix MUST capture architectural implications either as comments on the relevant Notion story or in a dedicated architecture document in the repo
- Use `/implement-slice` pattern (tests first → implement → verify → commit) without the bootstrap prefix

**After Felix completes all slices — In Review, not Done:**
- Felix moves the story to "In Review" (NOT Done) and posts a build summary comment
- For UI stories: a full Playwright E2E test suite must be run and results linked in the story comments before In Review begins — this is the shared artifact all UI reviewers use
- The story then requires sign-off from all required reviewers per the In Review model (Operating Model §4.3):
  - **Always required:** Vlad (QA, validates all Test Cases) + Ann (business acceptance, validates all AC)
  - **Conditional on scope:** Deb (UI stories), Stan (research/calc stories), Rita (integration stories), Sky (UI copy stories)
- Each reviewer logs a verdict comment (pass or fail with detail)
- **Non-compliance:** any reviewer who finds an issue logs a comment and sends the story back to Felix (code/logic) or Deb (UI/design) to resolve; the story must pass full re-review before Done
- Only after all required reviewers sign off does the story move to Done

**Learning capture (mandatory at Done):**
- Each persona's Done transition comment must include a `🎓 Learning:` line — use a category tag (`[BUILD]`, `[QA]`, `[PRODUCT]`, `[DESIGN]`, `[RESEARCH]`, or `[PROCESS]`) + the learning statement. N/A is acceptable; silence is not.
- Luigi runs a weekly synthesis: reads all Done story and bug comments from the past 7 days, promotes learnings that appear across 2+ stories to `learned/` skill files, posts to Discord `#learning`. See Operating Model §4.7 and the `survivorpulse-learning` skill.
