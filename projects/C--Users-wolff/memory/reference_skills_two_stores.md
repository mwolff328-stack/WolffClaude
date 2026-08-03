---
name: reference_skills_two_stores
description: "Desktop app panels read ACCOUNT/cloud stores, NOT ~/.claude — applies to BOTH Skills and Scheduled tasks; the stores don't sync"
metadata: 
  node_type: memory
  type: reference
  originSessionId: d0f04bb0-047d-4fab-968b-ee6f9f7878b8
  modified: 2026-07-22T12:25:38.869Z
---

Skills live in TWO independent stores on Michael's machine that do NOT auto-sync:

1. **Claude Code CLI skills** — `C:\Users\wolff\.claude\skills\<name>\SKILL.md`. Git-backed (WolffClaude). This is what the CLI/terminal session uses. Editing here does NOT touch the desktop panel.

2. **Account / cloud skills** — what the **desktop app "Customize > Skills"** panel and Cowork show. These are account-uploaded skills with IDs like `skill_01PWr5Vt3y4UcMoFVjA7XoxT` and `creatorType: user`. They are mirrored locally (read-only cache) at `C:\Users\wolff\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\<uuid>\<uuid>\skills\` with a server-driven `manifest.json`. Source of truth is the Anthropic account, so overwriting the AppData file gets stomped on the next sync.

**Consequence:** A skill can exist in both with the same name but different content and diverge silently. Editing `~/.claude/skills` does nothing to the panel, and vice versa.

**To update the desktop panel's copy:** edit the account skill at its source — desktop app Skills card `</>` editor, or claude.ai Settings. Do NOT edit the AppData mirror directly.

Discovered 2026-07-16 while personalizing [[reference_wolffclaude_repo]]'s authentic-tone-of-voice skill: CLI copy updated to 125 lines, panel still showed the original 55-line template because it reads the account copy (last updated 2026-03-24).

## SCHEDULED TASKS split the same way (confirmed 2026-07-22)

The desktop app's **Scheduled** panel is the ACCOUNT/cloud task store. The Claude Code `scheduled-tasks` MCP (`create_scheduled_task` / `list_scheduled_tasks`) writes to a SEPARATE CLI-local store. The two registries are disjoint:

- Desktop panel showed: Morning daily brief (6am), Monday weekly plan, Weekly key learning brief, Daily brief update 7am, Daily brief update 8am.
- `list_scheduled_tasks` showed only: build-e2e-ci-ephemeral, sp-daily-brief, sp-friday-sprint-review.

`~/.claude/scheduled-tasks/<name>/SKILL.md` files exist on disk for BOTH kinds, so **presence of a folder proves nothing about which scheduler runs it** — and absence from `list_scheduled_tasks` does NOT mean a task is orphaned. I wrongly called Michael's real 7am/8am jobs "dead weight" on exactly that bad inference; he corrected it with a screenshot.

**Rule:** to create a task Michael will see and manage in the desktop Scheduled panel, he must create it there via **New task** — Claude Code cannot write to the cloud store (no tool for it). Write the prompt to be environment-agnostic (no `ToolSearch select:mcp__...` lines, which are CLI-only; say "use the Notion connector" instead). Desktop schedule times appear to be machine-local (Pacific), so 8am CT = 6am PT.
