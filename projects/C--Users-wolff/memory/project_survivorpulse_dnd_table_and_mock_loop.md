---
name: project_survivorpulse_dnd_table_and_mock_loop
description: SST-944 two OOM gotchas — @dnd-kit DndContext must wrap a <table> from OUTSIDE; a useQuery mock returning a fresh array each call infinite-loops any effect keyed on the result
metadata: 
  node_type: memory
  type: project
  originSessionId: bc231bc0-3258-4b70-905f-fd9a5a0ce5e4
  modified: 2026-07-21T20:24:59.208Z
---

SST-944 (fixed 2026-07-21, commit 4aa1e4e6 on 2026-v1): `OverviewEntryRosterTable` OOM'd its own test suite (>3GB in CI). Two independent causes:

1. **@dnd-kit inside a `<table>`:** `DndContext` injects hidden a11y `<div>`s (`DndDescribedBy`, live region) at its position in the tree. It was rendered DIRECTLY inside `<table>` → invalid DOM (`<div> cannot be a child of <table>`) that React re-validated every render and leaked memory on teardown. **Fix/pattern:** `DndContext` must wrap the whole `<table>` from OUTSIDE; only `SortableContext` (emits no DOM) may live inside, wrapping the `<tbody>`. `useSortable` sets the ref on the `<tr>`. Guarded now by an in-repo tripwire ("SST-944 valid DnD-in-table DOM") asserting zero `<div>` direct children of `<table>`/`<tbody>`. `EntryRosterSidebar`/`AllocationGrid` are div-based so unaffected.

2. **Unstable useQuery mock → infinite render loop (no automated guard):** a test that does `mockUseQuery.mockImplementation(() => ({ data: [ {...} ] }))` returns a NEW array literal every call, so any value derived from it changes identity each render. Real react-query returns STABLE references (structural sharing), so this never happens in prod — but in a test it re-fires any effect keyed on the query result (here the custom-order init effect → `setState` loop → runaway-allocation OOM). Always mock a stable reference (a `const` array / the shared `mockEntries()` helper), not a fresh literal per call.

Verified RED→GREEN both ways; whole file 30/30 green ~3.8s at 1024MB and 3072MB. Related: [[feedback_survivorpulse_smoke_over_mocks]], [[project_survivorpulse_local_verification]].
