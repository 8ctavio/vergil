---
outline: [2,3]
---

# `waitFor` <Badge><pre>syncFor</pre></Badge>

> Watches `source` until a condition is fulfilled. The condition can be specified as a chained method.

## Usage

```js
import { waitFor } from '@8ctavio/vergil'
import { syncFor } from '@8ctavio/vergil'

waitFor(src).toBe(true).then(() => {
    // Do something when toValue(src) === true
})

// Wait until [1,2,3].includes(toValue(src))
await syncFor(src).toBeIn([1,2,3])

// Wait until toValue(src) !== null
await syncFor(src).not.toBeNull()
```

## Definition

```js
function waitFor(
    source: WatchSource,
    options: { timeout: number; }
): methods
```

#### Parameters

- **`source`**: See [watch](https://vuejs.org/api/reactivity-core.html#watch).
- **`timeout`**: Duration of watcher timeout in milliseconds. If set and condition is not fulfilled after `timeout` milliseconds, the watcher stops.

#### Return value

Condition methods. Available methods are:

- `.toMatch(condition: ~WatchCallback)`
- `.toChange(nTimes: number)`
- For a single watch source:
    - `.toBe(equalTo: any)`
    - `.toBeIn(arr: Array)`
    - `.toBeNull()`
    - `.toBeUndefined()`
    - `.toBeTruthy()`
    - `.toBeNaN()`
    - `.toContain(value: any)`
- For two or more watch sources:
    - `toBeEqual()`

Additionally, condition methods (except for `.toChange`) can be prefixed with `.not` in order to negate the condition.

All methods return a promise that resolves to the `src` value (`toValue(src)`) that fulfilled the condition.