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

The `extendedRef` composable receives two arguments: `value` and `extension`. The former represents the (initial) value of the ref to be extended (analogous to the `ref` function argument). The latter argument is, in its simplest form, an *extension object* which essentially is a template of additional properties to be defined on the extendedRef with their corresponding (initial) values.

### Extend properties

The `extendedRef` composable employs [`defineReactiveProperties`](/composables/defineReactiveProperties) to define additional properties. Therefore, the `extendedRef`'s `extension` parameter is analogous to the `properties` parameter of `defineReactiveProperties`. The `options` parameter is available for `extendedRef` as well. See [Property Definition](/composables/defineReactiveProperties#property-definition) to learn about defining additional properties.

### Additional features

The `extendedRef` composable does not directly modifies a ref object, but creates and returns an [`ExtendedRef`](/utilities/classes#extendedref) object instance which extends the [`ExtendedReactive`](/utilities/classes#extendedreactive) class. Therefore, a `refs` index is also available in an extendedRef.

`ExtendedRef` defines two additional properties: `value` and `ref`. The `ref` property stores the extendedRef's underlying ref object. The `value` property, on the other hand, is defined with accessors (getter and setter) to read from and write to that inner ref's value.

### Difference with ref

Even though `extendedRef` attempts to emulate regular refs, since the `extendedRef` returned object is not a `Ref` object, they don't always behave the same way. Pragmatically, there are two major differences between an extendedRef and a regular ref.

**1. An extendedRef cannot be substituted where a ref is expected.**

Consider, for instance, the `watch` function:

```js
const extended = extendedRef()
watch(extended, callback) // extended is not a valid watch source
```

The included `ref` property may be used instead.

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
    value: T | (() => T) | Ref<T> | ExtendedRef<T,F>,
    extension?: E | (withDescriptor: function) => E,
    options?: {
        ignore?: string[];
        configurable?: boolean;
    }
): ExtendedRef<T, E | E extends F>
```

#### Parameters

- **`value`**: Value to normalize into the ref to be extended.
- **`extension`**: Extension object or callback that returns extension object. The extension object keys represent the names or symbols of the properties to be defined while its values represent the properties' initial values or descriptors.
- **`options.ignore`**: Array of property keys to be ignored from the `extension` object.
- **`options.configurable`**: Default value for data descriptors' `configurable` option. Defaults to `true`.

#### Return value

An `ExtendedRef` object.

## Utilities

### Usage

```js
import { <util> } from '@8ctavio/vergil'
```

### `ExtendedReactive`

> Stores `refs` index of automatically unwrapped reactive properties.

```ts
interface ExtendedReactive<T> {
    refs: object;
    [P in keyof T]: T[P];
}
```

### `isExtendedReactive`

> Assesses whether a value is an `ExtendedReactive` object.

```js
function isExtendedReactive(value: any): boolean
```

#### Return value

`true` if `value` is an `ExtendedReactive`.