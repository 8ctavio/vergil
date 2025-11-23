---
outline: [2,3]
---

# `resetRef`

> Returns extendedRef with reset method.

## Usage

```js
import { resetRef } from '@vrgl/vergil'

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
function resetRef<
	T = undefined,
	U = T,
	Shallow extends boolean = false
>(
	value?: MaybeRef<T>,
	options?: {
		shallow?: Shallow
		get?: () => T
		set?: (v: U) => void
		cloneResetValue?: boolean
	}
): ExtendedRef<T, U, { reset: () => void }, Shallow>
```

#### Parameters

- **`reference`**: The extendedRef's initial and reset values. A ref may be used for dynamic reset values.
- **`options`**:
	- `shallow`: Whether the created extendedRef's underlying ref is shallow. Defaults to `false`.
	- `get`: Custom resetRef's `value` getter function.
	- `set`: Custom resetRef's `value` setter function.
	- `cloneResetValue`: Whether to clone the reset value if it is an object. Defaults to `!isRef(value)`.

#### Return value

An extendedRef object with a `reset` method.