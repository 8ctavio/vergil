---
outline: [2,3]
---

# `watchUntil`

> Watches `sources` until `callback` returns `true` or another configurable value.

## Usage

```js
import { watchUnitl } from '@8ctavio/vergil'

watchUntil(src, (v,u) => {
    if(condition(v,u)){
        // ...
        return true  // watchUntil resolves to v
    }
})
```

## Definition

```ts
function watchUntil<T>(
    sources: WatchSource<T>,
    callback: WatchCallback<T>,
    options: {
        fulfill: any = true;
        timeout: number = 0;
        signal: AbortSignal;
        deep: number;
        flush: 'pre' | 'post' | 'sync';
    }
): Promise<T>
```

#### Parameters

- **`fulfill`**: `callback` return value that stops the watcher. Defaults to `true`.
- **`timeout`**: Duration of watcher timeout in milliseconds. If set and `callback` is not fulfilled after `timeout` milliseconds, the watcher stops.
- **`signal`**: `AbortSignal` to abort watcher with a corresponding [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
- For others, see [watch](https://vuejs.org/api/reactivity-core.html#watch).

#### Return value

A promise. Resolves to the `WatchSource` value that fulfilled the callback. If aborted, the promise rejects with the abort signal's abort reason (`signal.reason`).