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

```ts
// Single watch source
function waitFor<T>(
    source: WatchSource<T>,
    options?: WaitForOptions;
): WaitForMethods_SingleSource<T>

// Multiple watch sources
function waitFor<T>(
    source: WatchSource<T>[],
    options?: WaitForOptions;
): WaitForMethods_MultiSource<T>

type WaitForOptions = {
    timeout?: number;
    signal?: AbortSignal;
    deep?: boolean | number;
    flush?: 'pre' | 'post' | 'sync';
}

type WaitForMethods_SingleSource<S, F extends boolean = true> = {
    toMatch(condition: WatchCallback): Promise<S | undefined>;
    toBe<T><(value: MaybeRefOrGetter<T>): Promise<S | [S,T] | undefined>;
    toBeIn<T extends unknown[]>(value: MaybeRefOrGetter<T>): Promise<S | [S,T] | undefined>;
    toBeTruthy(): Promise<S | undefined>;
    toBeNaN(): Promise<S | undefined>;
    toContain<T><(value: MaybeRefOrGetter<T>): Promise<S | [S,T] | undefined>;
} & (F extends true ? {
    toChange<T extends number>(times?: MaybeRefOrGetter<T>): Promise<S | [S,T] | undefined>;
    get not(): WaitForMethods_SingleSource<S, false>
} : {})

type WaitForMethods_MultiSource<S, F extends boolean = true> = {
    toMatch(condition: WatchCallback): Promise<S[] | undefined>;
    toBeEqual(): Promise<S[] | undefined>;
} & (F extends true ? {
    toChange<T extends number>(times?: MaybeRefOrGetter<T>): Promise<S[] | (S | T)[] | undefined>;
    get not(): WaitForMethods_MultiSource<S, false>
} : {})
```

#### Parameters

- **`timeout`**: Duration of watcher timeout in milliseconds. If set and condition is not fulfilled after `timeout` milliseconds, the watcher stops.
- **`signal`**: `AbortSignal` to abort watcher with a corresponding [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
- For others, see [watch](https://vuejs.org/api/reactivity-core.html#watch).

#### Return value

Condition methods. Available methods are:

- `.toMatch`
- `.toChange`
- For a single watch source:
    - `.toBe`
    - `.toBeIn`
    - `.toBeTruthy`
    - `.toBeNaN`
    - `.toContain`
- For watch source array:
    - `toBeEqual`

Additionally, condition methods (except for `.toChange`) can be prefixed with `.not` in order to negate the condition.

All methods return a promise that resolves to the `src` value (`toValue(src)`) that fulfilled the condition. If aborted, the promise rejects with the abort signal's abort reason (`signal.reason`).