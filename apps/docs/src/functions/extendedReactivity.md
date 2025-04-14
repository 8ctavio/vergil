---
outline: [2,3]
---

# Extended reactivity

## Usage

```js
import { <fn> } from '@8ctavio/vergil'
```

## `isEntangled`

> Assesses whether a value is an entangled object.

```ts
function isEntangled<T>(value: T): value is T extends Entangled ? T : never
```

#### Return value

`true` if `value` is an entangled object, and `false` otherwise.

## `isExtendedRef`

> Assesses whether a value is an extendedRef object.

```ts
function isExtendedRef<T>(value: T): value is T extends ExtendedRef ? T : never
```

#### Return value

`true` if `value` is an extendedRef object, and `false` otherwise.