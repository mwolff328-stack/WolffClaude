---
name: feedback_never_dump_env_in_bash_output
description: "Never run export, env, printenv or set in a Bash call here; this machine's environment holds live API keys and tokens that then sit in the saved session transcript"
metadata:
  node_type: memory
  type: feedback
  originSessionId: b3a3ec9a-5f81-4e83-a696-2e0401a6b780
  modified: 2026-10-03T15:41:21.553Z
---

2026-10-02, ship-aggregator session: a stray `export -n` tacked onto a Bash command printed the whole environment into the tool result. It held live Apify, ElevenLabs, GitHub and Notion credentials. Nothing was repeated in chat, written to a file or sent anywhere, and the founder was told straight away, but the values now sit in that session's local transcript file.

**Why:** a tool result is saved verbatim. Once a secret is printed it cannot be un-printed, only rotated, and the founder has to decide whether that is worth doing.

**How to apply:** the helper scripts read `NOTION_TOKEN` from the environment on their own, so there is never a reason to display it. To check a variable exists, print a count or a boolean only (`printenv NOTION_TOKEN | wc -c`, or `[ -n "$NOTION_TOKEN" ] && echo set`). Never run bare `export`, `env`, `set` or `printenv`, and never `echo` a token. If one does leak, tell the founder in plain words in the same turn and do not repeat the values.

Related: [[feedback_survivorpulse_bash_tool_quote_parse_failures_use_script_files]]
