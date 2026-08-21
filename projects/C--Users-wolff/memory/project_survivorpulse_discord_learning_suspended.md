---
name: project_survivorpulse_discord_learning_suspended
description: "SurvivorPulse Discord #learning posting is suspended until OpenClaw is back up"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2c908b2c-d3dc-42fe-a60e-463ec1019ff7
  modified: 2026-08-21T16:38:51.098Z
---

Discord `#learning` posting (part of the `survivorpulse-learning` skill's Luigi weekly-synthesis flow) is suspended as of 2026-08-21, per founder instruction.

**Why:** The Discord posting step was built when the founder was running OpenClaw through Discord. He isn't running OpenClaw right now, so there's no live mechanism on his end to receive/use those posts, and no Discord write tool is connected in Claude Code sessions either.

**How to apply:** Don't attempt to post to Discord `#learning`, don't offer to connect a Discord MCP tool, and don't search the repo for a webhook to route around it — the skill file itself (`~/.claude/skills/survivorpulse-learning/SKILL.md`) now has a suspension notice marking the relevant steps. Everything else in the learning protocol still applies: the mandatory `🎓 Learning:` line on Done transitions, capturing durable patterns to `SurvivorPulse/.claude/skills/learned/`, and Notion comment capture.

**Reinstate when:** The founder says OpenClaw is back up and running — at that point, remove the suspension notice from the skill file and resume Discord posting.
