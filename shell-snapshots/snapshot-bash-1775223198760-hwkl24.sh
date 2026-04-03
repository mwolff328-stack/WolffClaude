# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
shopt -s expand_aliases
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  alias rg=''\''C:\Users\wolff\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\vendor\ripgrep\x64-win32\rg.exe'\'''
fi
export PATH='/c/Users/wolff/bin:/mingw64/bin:/usr/local/bin:/usr/bin:/bin:/mingw64/bin:/usr/bin:/c/Users/wolff/bin:/c/Program Files/Python311/Scripts:/c/Program Files/Python311:/c/Python313/Scripts:/c/Python313:/c/WINDOWS/system32:/c/WINDOWS:/c/WINDOWS/System32/Wbem:/c/WINDOWS/System32/WindowsPowerShell/v1.0:/c/WINDOWS/System32/OpenSSH:/c/Program Files/nodejs:/c/ProgramData/chocolatey/bin:/cmd:/c/Program Files/GitHub CLI:/c/Users/wolff/AppData/Local/Microsoft/WindowsApps:/c/Users/wolff/AppData/Local/Programs/Microsoft VS Code/bin:/c/Users/wolff/AppData/Roaming/npm:/c/Users/wolff/AppData/Local/Programs/cursor/resources/app/bin:/usr/bin/vendor_perl:/usr/bin/core_perl:/c/Users/wolff/.claude/plugins/cache/claude-plugins-official/superpowers/5.0.7/bin:/c/Users/wolff/.claude/plugins/cache/claude-plugins-official/github/unknown/bin:/c/Users/wolff/.claude/plugins/cache/everything-claude-code/everything-claude-code/1.8.0/bin'
