---
name: project-survivorpulse-local-flake-repro-traps
description: "Reproducing a jsdom/vitest CI flake locally on this box — machine-wide CPU load is the wrong lever, >~20 burners breaks vitest's worker handshake, and concurrent Claude sessions are already loading the machine."
metadata: 
  node_type: memory
  type: project
  originSessionId: 88e4656c-59db-42c0-8330-9ee749022a9b
  modified: 2026-07-30T18:22:47.645Z
---

Traps hit while trying to reproduce a CI-only vitest flake locally (SST-1126, 2026-07-30).
The dev box is 14 cores / 34 GB.

- **Machine-wide CPU starvation is the wrong lever for jsdom timing flakes.** It slows jsdom,
  React and `userEvent` *proportionally*, so `waitFor` budgets and the work they wait on scale
  together. 6 concurrent vitest processes + 10 CPU burners tripled wall-clock and produced
  **0 failures in 240 samples**. Prefer an **in-process** stressor (a `setInterval` that
  busy-blocks the event loop for N ms every M ms) — it perturbs the *interleaving*, which is
  what these races actually depend on, and it neither depends on nor disturbs the rest of the box.
- **Too much load breaks the harness rather than the test.** At ~22+ busy-loop processes,
  vitest dies with `[vitest-pool-runner]: Timeout waiting for worker to respond` (60 s
  handshake) and reports `Test Files no tests` — which **exits in a way that looks like a
  clean run** unless you check the test count. Always assert a non-zero test count in any
  repeat-run harness; this repo has been burned by suites that exit 0 without running.
- **Other Claude sessions run heavy vitest suites on this machine concurrently.** Check
  `Get-CimInstance Win32_Process -Filter "Name='node.exe'"` and read the command lines before
  adding load: heavy machine-wide stress degrades their runs and confounds your own
  measurements. Kill burners by matching their command line, never by killing `node.exe`
  broadly.
- **Burner cleanup is unreliable** when the harness is backgrounded and piped — stray
  busy-loops survive and silently poison the *next* measurement. Verify the count is zero
  between arms.

Related: [[feedback_proving_a_flake_fix_without_reproducing_it]],
the sp-live-verify skill.
