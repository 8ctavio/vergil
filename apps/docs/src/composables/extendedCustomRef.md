---
outline: [2,3]
---

# `extendedCustomRef`

> Extends a ref with additional properties and custom accessor methods.

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

n = extended.value // 'inner value retrieved'
extended.value = 8 // 'inner value updated'
```

## Description

An extendedCustomRef is essentially an [extendedRef](/composables/extendedRef) with custom `value` accessor methods (getter and setter). The extendedRef's `value` property simply reads from and writes to the inner ref's value. If additional control is required over operations to perform when reading from and writing to the `value` property, an `extendedCustomRef` can be used.

The `extendedCustomRef` composable returns an `ExtendedRef` object and receives four arguments: `initial`, `accessor`, `extension`, and `options`. The `initial`, `extension`, and `options` parameters are the same as those of the `extendedRef` composable. The `accessor` argument is an object with optional `get` and `set` methods, the custom accessor methods for the `value` property.

If at least one accessor method is provided, the following functions are provided as default.

```js
const {
    get = () => this.ref.value,
    set = v => this.ref.value = v
} = accessor
```

## Definition

```ts
function extendedCustomRef<T,E>(
    initial: T | (() => T) | Ref<T>,
    accessor: { get?: () => T, set?: () => void },
    extension?: E | (withDescriptor: function) => E,
    options?: {
        ignore?: string[];
        configurable?: boolean;
    }
): ExtendedRef<T,E>
```

#### Parameters

- **`initial`**: Value to normalize into the ref to be extended.
- **`accessor`**: Custom `value` accessor methods.
- **`extension`**: Extension object or callback that returns extension object. The extension object keys represent the names or symbols of the properties to be defined while its values represent the properties' initial values or descriptors.
- **`options.ignore`**: Array of property keys to be ignored from the `extension` object.
- **`options.configurable`**: Default value for data descriptors' `configurable` option. Defaults to `true`.

#### Return value

An `ExtendedRef` object.