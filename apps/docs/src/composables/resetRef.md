---
outline: [2,3]
---

# `resetRef`

> Returns extended ref with reset method.

## Usage

```js
import { resetRef } from '@8ctavio/vergil'

// Static reset value
const str = resetRef('')
str.value = "Vergil"
str.reset()
console.log(str.value) // ''

// Dynamic reset value
const reference = ref(0)
const num = resetRef(reference)
console.log(num.value) // 0
reference.value = 8
num.reset()
console.log(num.value) // 8
```

## Definition

```ts
function resetRef<T>(initial: T | Ref<T> | () => T): ExtendedRef
```

#### Parameters

- **`initial`**: The extend ref's initial and reset value. A ref or getter can be used for a dynamic reset value.

#### Return value

An `ExtendedRef` object with a `reset` method.