---
outline: [2,3]
---

# `watchUntil`

> Watches `source` until `callback` returns `true` or another configurable value.

## Usage

```js
import { watchUntil } from '@vrgl/vergil'

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
function watchUntil<T, O extends WatchUntilOptions>(
    source: WatchSource<T>,
    callback: WatchUntilCallback<T,O>,
    options?: O
): Promise<T>

// Multiple watch sources
function watchUntil<T, O extends WatchUntilOptions>(
    source: WatchSource<T>[],
    callback: WatchUntilCallback<T[], O>,
    options?: O
): Promise<T[]>

type WatchUntilOptions = {
    fulfill?: unknown;
    signal?: AbortSignal;
    deep?: boolean | number;
    flush?: 'pre' | 'post' | 'sync';
}

type WatchUntilCallback<T, O extends WatchUntilOptions> =
	(...args: Parameters<WatchCallback<T, MaybeUndefined<T>>>) => 
		| (O extends { fulfill: infer F } ? F : boolean)
		| void
```

#### Parameters

- **`fulfill`**: The return value required to stop the watcher. Defaults to `true`.
- **`signal`**: An [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) to abort watcher.
- For others, see [watch](https://vuejs.org/api/reactivity-core.html#watch).

#### Return value

A promise. Resolves to the `WatchSource` value that fulfilled the callback. If aborted, the promise is rejected with the abort signal's abort reason (`signal.reason`).