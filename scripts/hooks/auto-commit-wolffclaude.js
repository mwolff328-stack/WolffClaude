#!/usr/bin/env node
/**
 * PostToolUse hook: Auto-commit ~/.claude changes to WolffClaude repo.
 * Fires after Edit/Write tools when the modified file is under ~/.claude/.
 * Async and non-blocking — does not delay the user's workflow.
 *
 * Hardened 2026-07-02: a stale local branch name once broke the SessionStart
 * pull hook silently for ~80 commits, and a plaintext credential file once
 * showed up untracked and un-gitignored. This version refuses to run off
 * 'main', skips if a suspicious filename is staged, and logs every
 * skip/failure to hooks.log instead of failing silently.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const claudeDir = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');
const logPath = path.join(claudeDir, 'hooks.log');

function log(message) {
  const timestamp = new Date().toISOString();
  try {
    fs.appendFileSync(logPath, `[${timestamp}] auto-commit-wolffclaude: ${message}\n`);
  } catch (e) {
    // logging must never throw
  }
}

const SENSITIVE_PATTERNS = [/credential/i, /secret/i, /\.key$/i, /\.pem$/i, /token/i, /\.env$/i, /\.pfx$/i];

try {
  const status = execSync('git status --porcelain', { cwd: claudeDir, encoding: 'utf8' }).trim();
  if (!status) {
    process.exit(0);
  }

  const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: claudeDir, encoding: 'utf8' }).trim();
  if (branch !== 'main') {
    log(`SKIPPED — on branch '${branch}', expected 'main'. Not committing/pushing (avoids repeating the master/main drift incident).`);
    process.exit(0);
  }

  const changedPaths = status.split('\n').map(l => l.trim().split(/\s+/).pop());
  const suspicious = changedPaths.filter(p => SENSITIVE_PATTERNS.some(re => re.test(p)));
  if (suspicious.length > 0) {
    log(`SKIPPED — suspicious filename(s) staged, needs manual review before committing: ${suspicious.join(', ')}`);
    process.exit(0);
  }

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const changedFiles = changedPaths.join(', ');
  const msg = `chore: auto-sync ${timestamp} — ${changedFiles}`.slice(0, 200);

  execSync('git add -A', { cwd: claudeDir });
  execSync(`git commit -m "${msg}"`, { cwd: claudeDir });
  execSync('git push', { cwd: claudeDir, timeout: 15000 });
  log(`committed and pushed: ${changedFiles}`);
} catch (e) {
  log(`FAILED — ${(e && e.message) || e}`);
  process.exit(0);
}
