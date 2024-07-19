---
outline: [2,3]
---

# `extendedReactive`

> Defines additional object properties through descriptors with special ref support.

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

The `extendedReactive` composable creates a new `ExtendedReactive` object instance, defines on it the specified properties, and returns it. Internally, it defines properties with [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). However, it provides a convenient API to easily define different types of properties with default descriptor options, including special support for reactive properties created with `ref`.

In practice, `extendedReactive` creates an object that can have both regular properties and automatically unwrapped ref properties. Therefore, it behaves similar to a Vue `reactive` object, but with additional control over which properties are reactive.

### Property definition

#### Descriptors

An extendedReactive object property to be defined is described with a data or accessor [descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#descriptor) object. There are, however, two additional data descriptor options available if the descriptor's `value` is a ref: `unwrap` and `readonly`.

- `unwrap`: If set to `true`, the ref property will be automatically unwrapped for read and write operations. This is achieved by defining the property with an accessor descriptor. If set to `false`, the ref object itself is used as the property's value. Defaults to `true`
- `readonly`: If set to `true`, wraps the ref object with the Vue's `readonly` function. Defaults to `false`.

In order to specify custom descriptors, `extendedReactive` must receive as a single argument a callback function which itself receives as an argument a helper function to specify property descriptors. The callback function must return an object whose entries (key-value pairs) represent the properties' names and descriptors, respectively.

```js
extendedReactive(withDescriptor => ({
    // Define property with descriptor
    prop: withDescriptor({ /* descriptor */ })
}))
```

:::tip
Defined `Function` properties are automatically [bound](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) to the `ExtendedReactive` instance.
:::

#### Default descriptor options

The provided `withDescriptor` function expects a descriptor object. Missing descriptor options fallback to default values. Different types of properties have different default descriptor options.

Default accessor descriptor options are the same as when using `Object.defineProperty`. Default data descriptor options when using `extendedReactive` are summarized in the following table.

| Property type | `enumerable` | `writable` |
| ------------- | ------------ | ---------- |
| `UnwrapRef` | `false` | n/a |
| `Ref` | `true` | `false` |
| `Function` | `true` | `false` |
| other | `true` | `true` |

Additionally, custom `get` and `set` methods can be defined for unwrapped refs.

#### Descriptor inference

A descriptor may not be specified with the provided `withDescriptor` function but with any other value `x`, in which case a data descriptor of the form `{ value: x }` is inferred. Furthermore, if `withDescriptor` is not used at all, a plain object may instead be passed to `extendedReactive`.

```js
// The following extendedReactive calls are equivalent
extendedReactiev(withDescriptor => ({
    foo: withDescriptor({
        value: bar
    })
}))
extendedReactive(() => ({
    foo: bar
}))
extendedReactive({
    foo: bar
})
```

### `ExtendedReactive` class

Objects returned by `extendedReactive` are instances of the `ExtendedReactive` class. It can be imported to assess whether an object is an `ExtendedReactive` object. Vergil also provides an `isExtendedReactive` utility function for this same purpose.

```js
import { ExtendedReactive } from '@8ctavio/vergil'
```

:::warning
The `ExtendedReactive` constructor does not define object properties.
:::

An `ExtendedReactive` object internally stores an index of the underlying ref objects of automatically unwrapped reactive properties. It provides two methods to interact with those ref objects: `getRef` and `setRef`.

:::tip
The `getRef` and `setRef` properties are reserved for an `ExtendedReactive` object. Therefore, these properties cannot be overwritten with `extendedReactive`.
:::

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

An `ExtendedReactive` object.

### `ExtendedReactive`

```ts
interface ExtendedReactive<T> {
    getRef: (property?: keyof T) => Ref | undefined;
    setRef: (property?: keyof T, refProperty: Ref) => void;
    [P in keyof T]: T[P];
}
```