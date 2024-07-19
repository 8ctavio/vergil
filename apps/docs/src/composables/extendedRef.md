---
outline: [2,3]
---

# `extendedRef`

> Extends a ref with additional properties.

:::tip
Before proceeding with `extendedRef`, learn first about the [`extendedReactive`](/composables/extendedReactive) composable.
:::

## Usage

```js
import { extendedRef } from '@8ctavio/vergil'

const extendedA = extendedRef(0, { extra: '' })

// read and write inner reactive value normally
extendedA.value = 8
console.log(extendedA.value)

// read and write extended properties
extendedA.extra = 'some value'
console.log(extendedA.extra)

// Configure extended properties
const extendedB = extendedRef(0, (withDescriptor) => ({
    extra1: 1,
    extra2: withDescriptor({ value: 2, enumerable: false, writable: false }),
    extra3: withDescriptor({ value: ref(3), enumerable: true, readonly: true })
}))
```

## Description

As the name suggests, the `extendedRef` composable serves to provide additional functionality to refs. A regular ref object accesses its inner reactive value through its `value` property. In practice, `extendedRef` allows to define additional properties on a ref.

The `extendedRef` composable receives two arguments: `initial` and `extension`. The former represents the (initial) value of the ref to be extended (analogous to the `ref` function argument). The latter argument is, in its simplest form, an *extension object* which essentially is a template of additional properties to be defined on the extendedRef with their corresponding (initial) values.

### Extend properties

The `extendedRef` composable employs the same method for defining additional properties as the [`extendedReactive`](/composables/extendedReactive) composable. Therefore, the `extendedRef`'s `extension` argument is analogous to the `extendedReactive`'s `properties` argument. See [Property Definition](/composables/extendedReactive#property-definition) to learn about defining additional properties.

### `ExtendedRef` class

The `extendedRef` composable does not directly modifies a ref object, but creates and returns an `ExtendedRef` object instance. The `ExtendedRef` class extends the [`ExtendedReactive`](/composables/extendedReactive#extendedreactive-class) class. Therefore, the `getRef` and `setRef` reserved property methods are also available in an extendedRef.

`ExtendedRef` defines two additional properties: `value` and `ref`. The `ref` property stores the extendedRef's underlying ref object. The `value` property, on the other hand, is defined with accessors (getter and setter) to read from and write to that inner ref's value.

:::tip
The `value` and `ref` properties are reserved for an `ExtendedRef` object. Therefore, these properties cannot be overwritten with `extendedRef`.
:::

The `ExtendedRef` class can be imported to assess whether an object is an `ExtendedRef` object. Vergil also provides an `isExtendedRef` utility function for this same purpose.

```js
import { ExtendedRef } from '@8ctavio/vergil'
```

:::warning
The `ExtendedRef` constructor does not define additional properties.
:::

### Difference with ref

Even though `extendedRef` attempts to emulate regular refs, since the `extendedRef` returned object is not a `Ref` object, they don't always behave the same way. Pragmatically, there are two major differences between an extendedRef and a regular ref.

**1. An extendedRef cannot be substituted where a ref is expected.**

Consider, for instance, the `watch` function.

```js
const extended = extendedRef()
watch(extended, callback) // extended is not a valid watch source
```

The provided `ref` property may be used instead.

```js
watch(extended.ref, callback) // ok
watch(() => extended.value, callback) // getter also works
```

**2. extendedRefs are not unwrapped in a SFC template.**

To access an extendedRef's inner ref value in the template, full `.value` notation is required. This is a requirement in order for the extended properties to be accessible in the template.

```vue
<template>
    <p>value: {{ extended.value }}</p>
    <button @click="extended.reset">reset</button>
</template>
```

## Definition

```ts
function extendedRef<T,E>(
    initial: T | (() => T) | Ref<T> | ExtendedRef<T,F>,
    extension?: E | (withDescriptor: function) => E
): ExtendedRef<T, E | E extends F>
```

#### Parameters

- **`initial`**: Value to normalize into the ref to be extended. If an extendedRef is provided, it is extended without creating a new `ExtendedRef` object.
- **`extension`**: Extension object or callback that returns extension object. The extension object keys represent the names of the properties to be defined while its values represent the properties' initial values or descriptors.

#### Return value

An `ExtendedRef` object.

### `ExtendedRef`

```ts
interface ExtendedRef<T,E> extends ExtendedReactive<E> {
    ref: Ref<T>;
    value: T;
}
```