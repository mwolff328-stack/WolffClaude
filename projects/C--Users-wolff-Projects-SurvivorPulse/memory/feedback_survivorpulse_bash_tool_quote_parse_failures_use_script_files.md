---
name: bash-tool-quote-parse-failures-use-script-files
description: "In this environment the Bash tool aborts with `unexpected EOF while looking for matching '` on node -e / heredoc commands containing apostrophes; codex-rescue subagents hit it on every retry. Write a .mjs/.md file with the Write tool instead."
metadata:
  node_type: memory
  type: feedback
  originSessionId: fa6cc5d2-cfff-45ad-8b3c-dee81cdfeb44
  modified: 2026-09-25T22:34:37.720Z
---

On this Windows box, Bash-tool commands that embed apostrophes or nested quotes inside `node -e "..."`, `node - <<'EOF'`, or `$(cat <<'EOF' ...)` fail before running: `/usr/bin/bash: -c: line NN: unexpected EOF while looking for matching '''` (the line number does not move when the text changes). Seen 2026-09-25 on my own commands (twice) AND on a `codex:codex-rescue` subagent, which tried 6 variants (heredoc, read, single-line double-quoted) and all failed, so a whole Cass review silently did not run.

**Why:** the failure is in the tool's shell wrapper, not the command text, so rewording the prompt does not help.
**How to apply:** for anything with quotes, write the script or prompt to a file with the Write tool, then run `node file.mjs`. For Codex/Cass: put the prompt in the worktree's gitignored `tmp/cass/prompt-*.md` and run it yourself with `node "<plugin>/scripts/codex-companion.mjs" task --background --write --prompt-file tmp/cass/prompt-x.md` (plugin path: `C:/Users/wolff/.claude/plugins/cache/openai-codex/codex/1.0.6/scripts/`), then `status <task-id> --wait --timeout-ms 1500000` in a background Bash call; the result file the prompt names appears in the worktree (about 3-15 min). Do not delegate that call to a `codex:codex-rescue` subagent. Related: [[cass-codex-needs-write-mode-and-quota-budget]].
