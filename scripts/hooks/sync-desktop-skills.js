#!/usr/bin/env node
/**
 * SessionStart hook: Sync personal skills from Claude Desktop app to ~/.claude/skills/
 *
 * Reads the desktop app's skills-plugin manifest, finds any skills not already
 * present in ~/.claude/skills/, and copies the SKILL.md files over.
 * Only syncs enabled skills. Skips skills that already exist (no overwrite).
 *
 * Source: AppData/Roaming/Claude/local-agent-mode-sessions/skills-plugin/
 * Target: ~/.claude/skills/<skill-name>/SKILL.md
 */
const fs = require('fs');
const path = require('path');

const homeDir = process.env.HOME || process.env.USERPROFILE;
const claudeSkillsDir = path.join(homeDir, '.claude', 'skills');
const desktopPluginBase = path.join(
  homeDir, 'AppData', 'Roaming', 'Claude',
  'local-agent-mode-sessions', 'skills-plugin'
);

function findManifest(baseDir) {
  if (!fs.existsSync(baseDir)) return null;

  const entries = fs.readdirSync(baseDir);
  for (const entry of entries) {
    const entryPath = path.join(baseDir, entry);
    if (!fs.statSync(entryPath).isDirectory()) continue;

    const subEntries = fs.readdirSync(entryPath);
    for (const subEntry of subEntries) {
      const manifestPath = path.join(entryPath, subEntry, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        return { manifestPath, skillsDir: path.join(entryPath, subEntry, 'skills') };
      }
    }
  }
  return null;
}

try {
  const found = findManifest(desktopPluginBase);
  if (!found) process.exit(0);

  const manifest = JSON.parse(fs.readFileSync(found.manifestPath, 'utf8'));
  const skills = manifest.skills || [];

  let synced = 0;

  for (const skill of skills) {
    if (!skill.enabled) continue;

    const targetDir = path.join(claudeSkillsDir, skill.name);
    const targetFile = path.join(targetDir, 'SKILL.md');
    const sourceFile = path.join(found.skillsDir, skill.name, 'SKILL.md');

    // Skip if already exists in ~/.claude/skills/
    if (fs.existsSync(targetFile)) continue;

    // Skip if source doesn't exist
    if (!fs.existsSync(sourceFile)) continue;

    // Copy skill
    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(sourceFile, targetFile);
    synced++;
  }

  if (synced > 0) {
    process.stderr.write(`[sync-desktop-skills] Synced ${synced} new skill(s) from Desktop app\n`);
  }
} catch (e) {
  // Silently fail — sync should never block startup
  process.exit(0);
}
