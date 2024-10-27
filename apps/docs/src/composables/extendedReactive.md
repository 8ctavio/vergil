---
outline: [2,3]
---

# `extendedReactive`

> Defines object properties through descriptors with special ref support.

:::tip
Before proceeding with `extendedReactive`, learn first about [`defineReactiveProperties`](/composables/defineReactiveProperties).
:::


## Usage

```js
import { extendedReactive } from '@8ctavio/vergil'

// Define regular or reactive properties
const extendedA = extendedReactive({
    prop1: 1,
    prop2: ref(2)
})
// Reactive properties are unwrapped by default
console.log(extendedA.prop1) // 1
console.log(extendedA.prop2) // 2

// Configure properties
const extendedB = extendedReactive(withDescriptor => ({
    prop1: 1,
    prop2: withDescriptor({
        value: 2,
        enumerable: false,
        writable: false
    }),
    prop3: withDescriptor({
        value: ref(3),
        unwrap: false,
        readonly: true
    })
}))
```

## Description

The `extendedReactive` composable creates a new [`ExtendedReactive`](/utilities/classes#extendedreactive) object instance, defines on it the specified properties with [`defineReactiveProperties`](/composables/defineReactiveProperties), and returns it.

The `extendedReactive`'s parameters correspond to the `properties` and `options` parameters of `defineReactiveProperties`, respectively. See [Property Definition](/composables/defineReactiveProperties#property-definition) to learn how to define properties.

In practice, `extendedReactive` creates an object that can have both regular properties and automatically unwrapped ref properties. Therefore, it behaves similar to a Vue `reactive` object, but with additional control over which properties are reactive.

### Additional features

An `ExtendedReactive` object internally stores an index of the underlying ref objects of automatically unwrapped reactive properties as a non-writable object under the `refs` property.

```js
const extended = extendedReactive({ foo: ref() })
console.log(isRef(extended.foo)) // false
console.log(isRef(extended.refs.foo)) // true
```

## Definition

```ts
function extendedReactive<T>(
    properties?: T | (withDescriptor: function) => T,
    options?: {
        ignore?: string[];
        configurable?: boolean;
    }
): ExtendedReactive<T>
```

#### Parameters

- **`properties`**: An object, or function that returns an object, whose keys represent the names or symbols of the properties to be defined and whose values represent either the properties' (initial) values or descriptors.
- **`options.ignore`**: Array of property keys to be ignored from the `properties` object.
- **`options.configurable`**: Default value for data descriptors' `configurable` option. Defaults to `true`.

#### Return value

An [`ExtendedReactive`](/utilities/classes#extendedreactive) object.

## Utilities

### Usage

```js
import { <util> } from '@8ctavio/vergil'
```

### `ExtendedRef`

> Stores a ref object and defines `value` accessor methods to read from and write to that ref's value.

```ts
interface ExtendedRef<T,E> extends ExtendedReactive<E> {
    ref: Ref<T>;
    value: T;
}
```

### `isExtendedRef`

> Assesses whether a value is an `ExtendedRef` object.

```js
function isExtendedRef(value: any): boolean
```

#### Return value

`true` if `value` is an `ExtendedRef`.