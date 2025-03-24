---
outline: [2,3]
---

# `isModel`

> Assesses whether a value is a [component model](/composables/useModel#description).

## Usage

```js
import { isModel } from '@8ctavio/vergil'

console.log(isModel(useModel())) // true
```

## Definition

```ts
function isModel<T>(value: any, self: boolean): boolean
```

#### Parameters

- **`value`**: Value to test.
- **`self`**: When set to `true`, ensures that `value` is a model created by [`useModel`](/composables/useModel), as opposed to an object that extends a model. Defaults to `false`.

#### Return value

`true` if `value` is a component model.