---
outline: [2,3]
---

# Extended reactivity

## Usage

```js
import { <fn> } from '@vrgl/vergil'
```

## `isEntangled`

> Assesses whether a value is an entangled object.

```ts
function isEntangled(value: unknown): value is Entangled
```

#### Return value

`true` if `value` is an entangled object, and `false` otherwise.

## `isExtendedRef`

> Assesses whether a value is an extendedRef object.

```ts
function isExtendedRef(value: unknown): value is ExtendedRef
```

#### Return value

`true` if `value` is an extendedRef object, and `false` otherwise.