---
outline: [2,3]
---

# `waitFor`

> Watches `source` until a condition is fulfilled. The condition can be specified as a chained method.

## Usage

```js
import { waitFor } from '@vrgl/vergil'

waitFor(src).toBe(true).then(() => {
    // Do something when Object.is(toValue(src), true)
})

// Wait until [1,2,3].includes(toValue(src))
await waitFor(src).toBeIn([1,2,3])

// Wait until !Object.is(toValue(src), null)
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
    toFulfill(condition: WatchCallback): Promise<S | undefined>
    toBe<T><(value: MaybeRefOrGetter<T>): Promise<S | [S,T] | undefined>
    toEqual<T><(value: MaybeRefOrGetter<T>): Promise<S | [S,T] | undefined>
    toBeIn<T extends unknown[]>(value: MaybeRefOrGetter<T>): Promise<S | [S,T] | undefined>
    toContain<T><(value: MaybeRefOrGetter<T>): Promise<S | [S,T] | undefined>
    toBeOfType<T><(value: MaybeRefOrGetter<TypeOfResult>): Promise<S | [S,T] | undefined>
    toBeTruthy(): Promise<S | undefined>;
    toMatch<T><(value: MaybeRefOrGetter<RegExp>): Promise<S | [S,T] | undefined>
} & (F extends true ? {
    toChange<T extends number>(times?: MaybeRefOrGetter<T>): Promise<S | [S,T] | undefined>
    get not(): WaitForMethods_SingleSource<S, false>
} : {})

type WaitForMethods_MultiSource<S, F extends boolean = true> = {
    toFulfill(condition: WatchCallback): Promise<S[] | undefined>
    toBeEqual(): Promise<S[] | undefined>
} & (F extends true ? {
    toChange<T extends number>(times?: MaybeRefOrGetter<T>): Promise<S[] | (S | T)[] | undefined>
    get not(): WaitForMethods_MultiSource<S, false>
} : {})

type TypeOfResult = "object" | "function" | "undefined" | "boolean" | "number" | "bigint" | "string" | "symbol"
```

#### Options

- **`timeout`**: Duration of watcher timeout in milliseconds. If set, and condition is not fulfilled after `timeout` milliseconds, the watcher stops.
- **`signal`**: `AbortSignal` to abort watcher with a corresponding [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
- For others, see [watch](https://vuejs.org/api/reactivity-core.html#watch).

#### Return value

An object with methods. Each method has an associated condition, and returns a promise that resolves to the `source` value (`toValue(source)`) that fulfills the method's condition. In addition, returned methods (except for `toChange`) can be prefixed with `.not` to negate their condition.

If a provided `AbortSignal` receives an abort request, a method's returned promise rejects with the `signal`'s abort reason (`signal.reason`).

Available methods are briefly described below.

##### Base methods

| Method | Description |
| ------ | --------- |
| `.toFulfill(condition)` | Defines a custom condition. `condition` is a function called when `source` is updated (and when `.toFulfill` is called), and receives current and previous `source` values. The returned promise is resolved when `condition` returns `true`. |
| `.toChange(n)` | Resolves until `source` has changed (at least) `n` times. |

##### Single-source methods
 
| Method | Description |
| ------ | --------- |
| `.toBe(value)` | Resolves until `source` is the same as `value`; values are compared with `Object.is`. |
| `.toEqual(value)` | Resolves until `source` equals `value`; values are compared with the strict equality operator (`===`). |
| `.toBeIn(arr)` | Resolves until `source` is in `arr`; `Array.prototype.includes` is used internally. |
| `.toContain(value)` | Resolves until `source` contains `value`; `Array.prototype.includes` is used internally. |
| `.toBeOfType(type)` | Resolves until `source` if of type `type`; the type of `source` is retrieved with the `typeof` operator. |
| `.toBeTruthy()` | Resolves until `source` is truthy. |
| `.toMatch(regex)` | Resolves until `source` matches `regex`; `RegExp.prototype.test` is used internally. |

##### Multi-source methods

| Method | Description |
| ------ | --------- |
| `.toBeEqual()` | Resolves until all `source` values are equal; values are compared with the strict equality operator (`===`). |