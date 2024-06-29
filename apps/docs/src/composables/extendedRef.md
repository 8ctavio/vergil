---
outline: [2,3]
---

# `extendedRef`

> Extends a ref with additional properties.

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
const extendedB = extendedRef(0, (withOptions) => ({
    extra1: withOptions(1, { enumerable: false, writable: false }),
    extra2: withOptions(ref(2), { enumerable: true, readonly: true })
}))
```

## Description

As the name implies, the `extendedRef` composable serves to provide additional functionality to regular refs.

A ref object accesses its inner reactive value through its `value` property. The `extendedRef` function effectively appends more properties to a ref.

However, `extendedRef` does not directly modifies a ref object, but creates a new `ExtendedRef` object which uses accessors (getter and setter) to read from and write to an inner ref object. This has two major implications:

**1. The `extendedRef` returned object is not a ref.**

An extendedRef cannot be subsituted where a `Ref` object is expected, such as in the `watch` function.

```js
const extended = extendedRef()
watch(extended, callback) // extended is not a valid watch source
```

An extendedRef includes a `.ref` property that returns its underlying ref object. 

```js
watch(extended.ref, callback) // ok
watch(() => extended.value, callback) // getter also works
```

**2. `extendedRef`s are not unwrapped in a SFC template.**

To access an extendedRef's value in the template, full `.value` notation is requried. This is a requirement in order for the extended properties to be accessible in the template.

```vue
<template>
    <p>value: {{ extended.value }}</p>
    <button @click="extended.reset">reset</button>
</template>
```

### Extended ref-properties

Other refs can be appended to an extendedRef. Additional refs are automatically unwrapped. Therefore, in a way, `extendedRef` is a combination of `ref` and `reactive` but with more control over which properties are reactive.

An extendedRef includes a `.getRef()` method to get an extended property's ref object. It receives the name of the extended property. If no property is specified, `.getRef()` returns the internal ref (same as the `.ref` property). If the provided property does not store a ref, `undefined` is returned.

```js
const extended = extendedRef(0, { extra: ref(0) })

// ref extended properties are unwrapped
watch(extended.getRef('extra'), () => {
    console.log(extended.extra)
})
extended.extra = 'some value'
```

### The extension object

In its simplest form, `extendedRef` receives an *extension object* as its second parameter. It is essentially a template of additional properties to be appended to the `extendedRef` with their corresponding (initial) values.

Extended properties are configurable through three boolean configuration options: `enumerable`, `writable`, and `readonly`. Both `enumerable` and `writable` are property descriptor options used to define extended properties with [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). In the other hand, the `readonly` option is only applicable to ref properties and wraps passed refs with the [`readonly`](https://vuejs.org/api/reactivity-core.html#readonly) function.

Different types of properties have different configuration by default. Default property configuration options are summarized in the following table.

| Property type | Descriptor | `enumerable` | `writable` | `readonly` |
| ------------- | ---------- | ------------ | ---------- | ---------- |
| `Ref` | accessor | `false` | n/a | `false` |
| `Function` | data | `true` | `false` | n/a |
| other | data | `true` | `true` | n/a |

:::tip
Extended `function` properties are automatically [bound](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) to the `ExtendedRef` instance.
:::

In order to configure property options, a function that returns an extension object should instead be passed to `extendedRef`. It receives as an argument a `withOptions` function to specify property configuration options.

```js
extendedRef(initial, withOptions => ({
    extra: withOptions(value, options)
}))
```

### The `ExtendedRef` class

Objects returned by `extendedRef` are instances of the `ExtendedRef` class. It can be imported to assess whether an object is an `ExtendedRef`. Vergil also provides an `isExtendedRef` utility function for this same purpose.

```js
import { ExtendedRef, isExtendedRef } from '@8ctavio/vergil'
```

:::warning
Although `ExtendedRef`'s constructor may be used to create extendedRefs, it is recommended to exclusively use the `extendedRef` function.
:::


## Definition

```ts
function extendedRef<T,E>(
    initial: T | (() => T) | Ref<T> | ExtendedRef<T,F>,
    extension?: E | (withOptions: function) => E
): ExtendedRef<T, E | E extends F>
```

#### Parameters

- **`initial`**: The initial value or getter for the ref to be extended. A ref or extendedRef object may instead be provided.
- **`extension`**: Extension object or callback that returns extension object. The extension object entries (key-value pairs) are the names and (initial) values of the extended properties, respectively.

#### Return value

An `ExtendedRef` object.

### `ExtendedRef`

```ts
interface ExtendedRef<T,E> {
    value: T
    ref: Ref<T>
    getRef: (property?: keyof E) => Ref
    [P in keyof E]: E[P]
}
```

### `withOptions`

```ts
function withOptions(
    value: any,
    options: {
        enumerable: boolean;
        writable: boolean;
        readonly: boolean;
    }
)
```