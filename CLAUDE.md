## ⚠️ Operating Model Precedence (READ FIRST)

**A project's Operating Model supersedes the generic pipeline.** If the active project defines a Product & Development Operating Model, follow that — the generic pipeline applies only where the project's model is silent.

- **SurvivorPulse** has a canonical operating model: see [`OPERATING_MODEL.md`](./OPERATING_MODEL.md) → **[Notion: Product & Development Operating Model](https://app.notion.com/p/37629ce5833d81eca755f86e4e001a33)**. For SurvivorPulse the heavy generic doc pipeline is **overridden** — groomed Notion stories serve as PRD/use-cases/QA, and the named persona team (Pam, Ann, Deb, Felix, Vlad, Luigi…) owns the flow, wielding the generic agents as tools.

Authority order: **founder's explicit instruction → project operating model → project `CLAUDE.md` → this global default.**

---

## Generic Development Pipeline (no project Operating Model)

Before planning or implementing a feature in a project that has **no** Operating Model of its own, read [`pipelines/generic-development-pipeline.md`](./pipelines/generic-development-pipeline.md) — it defines the documentation-first pipeline (PRD → use cases → architecture review → QA test cases → TDD slices → quality gates), the agency-role table, what a plan file must contain, and the mandatory Plan Critic pass before `ExitPlanMode`.

Trivial non-code tasks (typo fixes, comment edits) are exempt. Skip this file entirely for SurvivorPulse work.

## Claude Config Management

Before editing anything under `~/.claude` (this directory), read [`pipelines/config-management.md`](./pipelines/config-management.md) — it covers the WolffClaude git-backed repo, the auto-commit hook, and the Notion changelog requirement for significant config sessions.

## Default Response Style

Apply the `explain-simply` skill's principles to every response by default, in every session, without waiting to be asked or invoked — the user (Michael) wants plain-language, skimmable answers as the standing default, not an opt-in.

- At the start of each session (or before your first substantive response), invoke the `explain-simply` skill via the Skill tool once, so its current guidance loads into context.
- Apply its principles throughout the session from then on: gist-first, one running example/analogy over jargon, technical terms introduced only after the plain idea, bullets and selective **bold** over dense paragraphs (see "Format for skimming" in the skill).
- The skill already scales itself down for simple questions and technical/code work — trust that self-limiting behavior rather than forcing the full arc onto every reply. A one-line factual answer stays one line.
- This default does not override an explicit request for a different style (e.g. "give me the raw technical detail," "no bullets," a formal document) — honor that instruction for as long as it's in effect.
