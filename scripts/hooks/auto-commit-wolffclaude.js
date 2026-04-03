#!/usr/bin/env node
/**
 * PostToolUse hook: Auto-commit ~/.claude changes to WolffClaude repo.
 * Fires after Edit/Write tools when the modified file is under ~/.claude/.
 * Async and non-blocking — does not delay the user's workflow.
 */
const { execSync } = require('child_process');
const path = require('path');

const claudeDir = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');

try {
  // Check if there are any changes to commit
  const status = execSync('git status --porcelain', { cwd: claudeDir, encoding: 'utf8' }).trim();
  if (!status) {
    process.exit(0);
  }

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const changedFiles = status.split('\n').map(l => l.trim().split(/\s+/).pop()).join(', ');
  const msg = `chore: auto-sync ${timestamp} — ${changedFiles}`.slice(0, 200);

  execSync('git add -A', { cwd: claudeDir });
  execSync(`git commit -m "${msg}"`, { cwd: claudeDir });
  execSync('git push', { cwd: claudeDir, timeout: 15000 });
} catch (e) {
  // Silently fail — auto-commit should never block the user
  process.exit(0);
}
