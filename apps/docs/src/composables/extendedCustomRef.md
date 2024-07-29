---
outline: [2,3]
---

# `extendedCustomRef`

> Extends a ref with additional properties and custom accessor.

:::tip
Before proceeding with `extendedCustomerRef`, learn first about the [`extendedRef`](/composables/extendedRef) composable.
:::

## Usage

```js
import { extendedCustomRef } from '@8ctavio/vergil'

let n
const extended = extendedCustomRef(0, {
    get(){
        console.log('inner value retrieved')
        return this.ref.value
    },
    set(v){
        this.ref.value = v
        console.log('inner value updated')
    }
}, withDescriptor => ({
    extra: ''
}))

extended.value = 8 // 'inner value updated'
n = extended.value // 'inner value retrieved'
```

## Description

An extendedCustomRef is essentially an [extendedRef](/composables/extendedRef) with custom `value` accessor methods (getter and setter). The extendedRef's `value` property simply reads from and writes to the inner ref's value. If additional control over operations to perform when reading from and writing to the `value` property, an `extendedCustomRef` can be used.

The `extendedCustomRef` composable returns an `ExtendedRef` object and receives three arguments: `initial`, `accessor`, and `extension`. The `initial` and `extension` are the same as for the `extendedRef` composable. The `accessor` argument is an object with optional `get` and `set` methods, the custom accessor methods for the `value` property.

## Definition

```ts
function extendedCustomRef<T,E>(
    initial: T | (() => T) | Ref<T>,
    accessor: { get?: () => T, set?: () => void },
    extension?: E | (withDescriptor: function) => E
): ExtendedRef<T,E>
```

#### Parameters

- **`initial`**: Value to normalize into the ref to be extended.
- **`accessor`**: Custom `value` property accessor.
- **`extension`**: Extension object or callback that returns extension object. The extension object keys represent the names of the properties to be defined while its values represent the properties' initial values or descriptors.

#### Return value

An `ExtendedRef` object.