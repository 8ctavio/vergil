---
outline: [2,3]
---

# `watchUntil`

> Watches `source` until `callback` returns `true` or another configurable value.

## Usage

```js
import { watchUnitl } from '@8ctavio/vergil'

watchUntil(src, (v,u) => {
    if (condition(v,u)){
        // ...
        return true  // watchUntil resolves to v
    }
})
```

## Definition

```ts
// Single watch source
function watchUntil<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T, T | undefined>,
    options?: WatchUntilOptions;
): Promise<T | undefined>

// Multiple watch sources
function watchUntil<T>(
    source: WatchSource<T>[],
    callback: WatchCallback<T[], (T | undefined)[]>,
    options?: WatchUntilOptions;
): Promise<T[] | undefined>

type WatchUntilOptions = {
    fulfill?: unknown;
    timeout?: number;
    signal?: AbortSignal;
    deep?: boolean | number;
    flush?: 'pre' | 'post' | 'sync';
}
```

#### Parameters

- **`fulfill`**: `callback` return value that stops the watcher. Defaults to `true`.
- **`timeout`**: Duration of watcher timeout in milliseconds. If set and `callback` is not fulfilled after `timeout` milliseconds, the watcher stops. Defaults to `0`.
- **`signal`**: `AbortSignal` to abort watcher with a corresponding [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
- For others, see [watch](https://vuejs.org/api/reactivity-core.html#watch).

#### Return value

A promise. Resolves to the `WatchSource` value that fulfilled the callback. If aborted, the promise rejects with the abort signal's abort reason (`signal.reason`).