# Replit ~/.bashrc Permission Denied — Shell Alias Workaround

**Extracted:** 2026-03-30
**Context:** Creating persistent shell aliases or shortcuts in a Replit environment

## Problem
Replit restricts writes to `~/.bashrc`, so the standard alias approach fails:

```bash
echo "alias pre-deploy='npm run test:prepublish'" >> ~/.bashrc
# bash: /home/runner/.bashrc: Permission denied
```

## Solution
Create a shell script in the project root instead of using a shell alias.
Persist the executable bit in git so it survives every `git pull`.

**Step 1 — Create the script locally:**
```bash
# pre-deploy (project root)
#!/bin/bash
npm run test:prepublish
```

**Step 2 — Set executable bit in git (not just `chmod`):**
```bash
git update-index --chmod=+x pre-deploy
git commit -m "chore: add pre-deploy script"
git push
```

**Step 3 — Use it in Replit:**
```bash
git pull && ./pre-deploy
```

## Why `git update-index --chmod=+x` matters
`chmod +x` only affects the local filesystem. `git update-index --chmod=+x`
stores the executable bit in the git object, so every clone/pull gets it
automatically — no `chmod` needed after pulling.

## When to Use
- Any time you need a persistent shell shortcut in Replit
- When `~/.bashrc`, `~/.bash_profile`, or `~/.profile` are read-only
- Creating project-scoped command aliases that should work for all contributors
