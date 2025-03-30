---
outline: [2,3]
---

# `waitFor`

> Watches `source` until a condition is fulfilled. The condition can be specified as a chained method.

## Usage

```js
import { waitFor } from '@8ctavio/vergil'

waitFor(src).toBe(true).then(() => {
    // Do something when toValue(src) === true
})

// Wait until [1,2,3].includes(toValue(src))
await waitFor(src).toBeIn([1,2,3])

// Wait until toValue(src) !== null
await waitFor(src).not.toBe(null)
```

## Definition

```js
function waitFor(
    source: WatchSource,
    options: {
        timeout: number = 0;
        signal: AbortSignal;
        deep: number;
        flush: 'pre' | 'post' | 'sync';
    }
): ConditionMethods
```

#### Parameters

- **`timeout`**: Duration of watcher timeout in milliseconds. If set and condition is not fulfilled after `timeout` milliseconds, the watcher stops.
- **`signal`**: `AbortSignal` to abort watcher with a corresponding [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
- For others, see [watch](https://vuejs.org/api/reactivity-core.html#watch).

#### Return value

Condition methods. Available methods are:

- `.toMatch(condition: ~WatchCallback)`
- `.toChange(nTimes: number)`
- For a single watch source:
    - `.toBe(equalTo: any)`
    - `.toBeIn(arr: Array)`
    - `.toBeTruthy()`
    - `.toBeNaN()`
    - `.toContain(value: any)`
- For two or more watch sources:
    - `toBeEqual()`

Additionally, condition methods (except for `.toChange`) can be prefixed with `.not` in order to negate the condition.

All methods return a promise that resolves to the `src` value (`toValue(src)`) that fulfilled the condition. If aborted, the promise rejects with the abort signal's abort reason (`signal.reason`).