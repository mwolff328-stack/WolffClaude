---
name: survivorpulse-discord-connector-is-read-only
description: "The discord-reader MCP connector available to sessions can only list/get/search messages — it cannot post. Relevant whenever a skill instructs posting to a #stan-*, #infra, #backtesting-prototype, or #learning Discord channel."
metadata: 
  node_type: memory
  type: project
  originSessionId: 9993d1e9-832b-4c4b-8899-555d49920869
  modified: 2026-09-23T16:34:46.890Z
---

The Discord tools available in SurvivorPulse sessions (`mcp__discord-reader__*`) are read-only: `list_guild_channels`, `get_channel_info`, `get_messages`, `search_messages`. There is no send/post/webhook tool exposed. This was hit 2026-09-23 when stan-the-scout finished the stacking-vs-spreading backtest (`docs/research/backtesting/stan-stacked-vs-spread-entry-scale-research.md`) and its skill (`survivorpulse-backtesting-research`) instructed posting the findings to `#stan-backtesting-research` (channel 1492758599393349673) — the agent correctly declined to fabricate having posted, and instead handed back the ready-to-paste post text for the founder to drop in himself.

**Why:** several skills (survivorpulse-backtesting-research, -market-research, -infra, -learning, -backtesting) instruct agents to "post to Discord channel X" as their deliverable's last step, but the actual send capability isn't wired into these sessions — only [SST-1571](project_survivorpulse_discord_ci_webhook_dead_sst1571.md)'s separate CI webhook exists, and that's for automated CI notifications, not agent research posts.

**How to apply:** when a task or skill asks to post research/findings to a Discord channel, do the work and produce the exact post text in the standard format, but tell the user directly that no send tool is available and hand them the copy-pasteable text — don't silently skip the step or claim it was posted. Check first whether a send-capable Discord tool has since been added (`ToolSearch` for "discord") before assuming this limitation still holds.
