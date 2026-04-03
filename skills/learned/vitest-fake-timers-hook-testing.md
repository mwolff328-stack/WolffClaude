---
name: vitest-fake-timers-hook-testing
description: "Test time-based React hooks (debounce, throttle) with vi.useFakeTimers + renderHook in Vitest"
user-invocable: false
origin: auto-extracted
---

# Testing Time-Based React Hooks with Vitest Fake Timers

**Extracted:** 2026-03-30
**Context:** Any React + Vitest project testing hooks that use setTimeout/setInterval internally

## Problem

Hooks like `useDebounce` or `useThrottle` use `setTimeout` internally. Real timers make tests slow and flaky. `vi.useFakeTimers()` replaces the clock, but requires correct ordering with `renderHook` and `act()` to avoid stale-state issues.

## Solution

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('does not fire before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );
    rerender({ value: 'updated', delay: 300 });
    act(() => { vi.advanceTimersByTime(299); });
    expect(result.current).toBe('initial');
  });

  it('fires after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );
    rerender({ value: 'updated', delay: 300 });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('updated');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    );
    rerender({ value: 'b', delay: 300 });
    act(() => { vi.advanceTimersByTime(200); });
    rerender({ value: 'c', delay: 300 });
    act(() => { vi.advanceTimersByTime(200); }); // only 200ms since 'c'
    expect(result.current).toBe('a'); // 'b' never committed
    act(() => { vi.advanceTimersByTime(100); }); // now 300ms since 'c'
    expect(result.current).toBe('c');
  });

  it('cleans up on unmount without errors', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );
    rerender({ value: 'updated', delay: 300 });
    unmount();
    act(() => { vi.advanceTimersByTime(300); }); // no state-update-after-unmount error
    expect(result.current).toBe('initial');
  });
});
```

## Key Rules

1. `vi.useFakeTimers()` in `beforeEach`, `vi.useRealTimers()` in `afterEach` — never skip cleanup
2. `vi.advanceTimersByTime()` must be wrapped in `act()` — state updates inside timers need it
3. Use `renderHook` with `{ initialProps }` when the hook takes parameters that change
4. Test **one tick below delay** (timer does not fire) AND **at delay** (timer fires) as separate cases
5. Always test unmount cleanup — prevents false confidence that stale updates won't throw in production

## When to Use

Any hook that wraps `setTimeout`/`setInterval`/`clearTimeout`: debounce, throttle, polling, rate-limited fetches, autosave timers.
