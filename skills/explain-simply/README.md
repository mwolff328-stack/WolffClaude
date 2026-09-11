# explain-simply

A [Claude Code](https://code.claude.com/docs) skill that turns hard ideas into explanations you actually walk away understanding — **short, plain-language, and still technically true.**

It auto-triggers on any "explain / break down / how does X work / ELI5" request and steers every explanation between the two ways they usually fail:

- **Too technical** — correct but opaque (jargon on jargon).
- **Too simple** — accessible but hollow or quietly wrong.

The target is the middle: keep the technical truth that matters, wrap it in plain words, and anchor the intuition in **one running example or a real-life analogy**.

## What it does

- Fires automatically whenever you ask to explain or make sense of something — no keyword needed.
- Leads with a one-sentence gist, then anchors it with a single analogy or worked example.
- Introduces jargon *after* the intuition lands, so you leave able to search the term and talk to experts.
- Names where the analogy breaks, so it clarifies instead of misleading.
- Scales to the question — a simple thing gets a sentence, not an essay.

Strongest on technical, mathematical, and jargon-heavy topics, but works on anything.

## Install

Skills live in a folder named after the skill, with a `SKILL.md` file inside. The filename must be exactly `SKILL.md` (capitalized).

**macOS / Linux**

```bash
mkdir -p ~/.claude/skills/explain-simply
curl -o ~/.claude/skills/explain-simply/SKILL.md \
  https://raw.githubusercontent.com/yash2002vardhan/explain-simply/main/SKILL.md
```

**Windows (PowerShell)**

```powershell
mkdir "$env:USERPROFILE\.claude\skills\explain-simply"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/yash2002vardhan/explain-simply/main/SKILL.md" `
  -OutFile "$env:USERPROFILE\.claude\skills\explain-simply\SKILL.md"
```

**Or manually (any OS)**

1. Create the folder `~/.claude/skills/explain-simply/` (Windows: `C:\Users\<YourName>\.claude\skills\explain-simply\`).
2. Open `SKILL.md` on this repo, click **Raw**, and save it into that folder as `SKILL.md`.

Then restart Claude Code (or start a new session) and verify with:

> /skills

and then search for explain-simply.

## License

MIT
