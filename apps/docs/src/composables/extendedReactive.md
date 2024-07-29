---
outline: [2,3]
---

# `extendedReactive`

> Defines additional `ExtendedReactive` object properties through descriptors with special ref support.

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

The `extendedReactive` composable creates a new [`ExtendedReactive`](/utilities/classes#extendedreactive) object instance, defines on it the specified properties with [`defineReactiveProperties`](/composables/defineReactiveProperties), and returns it

The `extendedReactive`'s single argument corresponds to the `properties` argument of `defineReactiveProperties`. See [Property Definition](/composables/defineReactiveProperties#property-definition) to learn how to define properties.

In practice, `extendedReactive` creates an object that can have both regular properties and automatically unwrapped ref properties. Therefore, it behaves similar to a Vue `reactive` object, but with additional control over which properties are reactive.

### Additional features

An `ExtendedReactive` object internally stores an index of the underlying ref objects of automatically unwrapped reactive properties. It provides two methods to interact with those ref objects: `getRef` and `setRef`.

The `getRef` method receives the property name of an automatically unwrapped ref property and returns its underlying ref object. If the property does not exist `undefined` is returned.

The `setRef` method receives the property name of an automatically unwrapped ref property and a ref. It stores the ref in the internal index.

:::warning
Usage of the `setRef` method should be avoided. Its only purpose is for internal implementation.
:::

## Definition

```ts
function extendedReactive<T>(
    properties?: T | (withDescriptor: function) => T
): ExtendedRef<T>
```

#### Parameters

- **`properties`**: An object, or function that returns an object, whose keys represent the names of the properties to be defined and whose values represent either the properties' (initial) values or descriptors.

#### Return value

An [`ExtendedReactive`](/utilities/classes#extendedreactive) object.