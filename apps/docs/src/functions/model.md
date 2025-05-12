---
outline: [2,3]
---

# Model

## Usage

```js
import { <fn> } from '@8ctavio/vergil'
```

## `isModel`

> Assesses whether a value is a [component model](/composables/useModel#description).

```ts
function isModel(value: unknown, self?: boolean): value is Model
```

#### Parameters

- **`value`**
- **`self`**: When set to `true`, ensures that `value` is a model created by [`useModel`](/composables/useModel), as opposed to an object that extends a model. Defaults to `false`.

#### Return value

`true` if `value` is a component model, and `false` otherwise.

## `isModelGroup`

> Assesses whether a value is a [model group](/composables/useModelGroup#description).

```ts
function isModelGroup(value: unknown): value is ModelGroup
```

#### Return value

`true` if `value` is a model group object, and `false` otherwise.