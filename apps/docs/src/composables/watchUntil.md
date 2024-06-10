---
outline: [2,3]
---

# `watchUntil`

> Watches `sources` until `callback` returns `true` or another configurable value.

### Usage

```js
import { watchUnitl } from '@8ctavio/vergil'
```

### Definition

```js
function watchUntil(
    sources: WatchSource<T>,
    callback: ~WatchCallback,
    options: {
        fulfill: any;
        timeout: number;
    } = { fulfill: true }
): Promise<T>
```

#### Parameters

- **`sources`**: See [watch](https://vuejs.org/api/reactivity-core.html#watch)
- **`callback`**: See [watch](https://vuejs.org/api/reactivity-core.html#watch)
- **`fulfill`**: `callback` return value that stops the watcher. Defaults to `true`.
- **`timeout`**: Duration of watcher timeout in milliseconds. If set and `callback` is not fulfilled after `timeout` milliseconds, the watcher stops.

#### Return value

A promise. Resolves to `WatchSource` value that fulfilled the callback.

### Examples

```js
watchUntil(src, (v, oldV) => {
    if(condition(v, oldV)){
        // ...
        return true  // watchUntil resolves to v
    }
})
```