## Configuration Management

### WolffClaude Repository

The `~/.claude` directory is version-controlled at **https://github.com/mwolff328-stack/WolffClaude.git**.

- A SessionStart hook runs `git pull --ff-only` to sync the latest config from the repo
- A PostToolUse hook auto-commits and pushes changes after any Edit/Write to files under `~/.claude/`
- `settings.json` is gitignored (contains GitHub PAT) — use `settings.json.example` as template
- Transient files (caches, sessions, metrics, paste-cache, shell-snapshots) are excluded via `.gitignore`

### Notion Config Changelog

After any **significant** `~/.claude` configuration change session (not routine auto-commits), log a summary to the "Claude Code Config Changelog" Notion sub-page under:
**AI Knowledge & Implementation > Claude** (page ID: `33029ce5833d8124b9c9c70755408648`)

Include: date, what changed, why, and any trade-offs or follow-up items.
