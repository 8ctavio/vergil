---
outline: [2,3]
---

# `defineReactiveProperties`

> Defines object properties similar to `Object.defineProperties` but with convenient default descriptors, special support for extendedReactive and extendedRef objects, and additional features for ref properties.

## Usage

```js
import { defineReactiveProperties } from '@8ctavio/vergil'

// Define regular or reactive properties with default descriptors
const obj = defineReactiveProperties({}, {
    prop1: 1,
    prop2: ref(2)
})
// Reactive properties are unwrapped by default
console.log(obj.prop1) // 1
console.log(obj.prop2) // 2

// Configure properties
defineReactiveProperties(obj, withDescriptor => ({
    prop3: 3,
    prop4: withDescriptor({
        value: 4,
        enumerable: false,
        writable: false
    }),
    prop5: withDescriptor({
        value: ref(5),
        unwrap: false,
        readonly: true
    })
}))
```

## Description

As the name implies, `defineReactiveProperties` defines properties on an object, and then returns the object. It is analogous to the [`Object.defineProperties`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) static method, but provides a convenient API to easily define properties with default descriptor options, special support for `ExtendedReactive` and `ExtendedRef` objects, and additional features for properties created with `ref`.

### Property definition

The first argument of `defineReactiveProperties` is the object on which to define properties, whereas the second argument is used to provide the properties to be defined.


#### Descriptors

A property to be defined is described with a data or accessor [descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#descriptor) object. There are, however, two additional data descriptor options available if the descriptor's `value` is a ref: `unwrap` and `readonly`.

- `unwrap`: If set to `true`, the ref property will be automatically unwrapped for read and write operations. This is achieved by defining the property with an accessor descriptor. If set to `false`, the ref object itself is used as the property's value. Defaults to `true`
- `readonly`: If set to `true`, wraps the ref object with the Vue's `readonly` function. Defaults to `false`.

In order to specify custom descriptors, `defineReactiveProperties` must receive as its second argument a callback function which itself receives as an argument a helper function to mark objects as property descriptors. The callback function must return an object whose entries (key-value pairs) represent the properties' names and descriptors, respectively.

```js
defineReactiveProperties({}, withDescriptor => ({
    // Define property with descriptor
    prop: withDescriptor({ /* descriptor */ })
}))
```

:::tip
Defined `Function` properties are automatically [bound](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) to the object.
:::

#### Default descriptor options

The provided `withDescriptor` function expects a descriptor object. Missing descriptor options fallback to default values. Different types of properties have different default descriptor options.

Default accessor descriptor options are the same as when using [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). Default data descriptor options when using `defineReactiveProperties` are summarized in the following table.

| Property type | `enumerable` | `writable` |
| ------------- | ------------ | ---------- |
| `UnwrapRef` | `true` | n/a |
| `Ref` | `true` | `false` |
| `Function` | `true` | `false` |
| other | `true` | `true` |

Additionally, custom `get` and `set` methods can be defined for unwrapped refs.

#### Descriptor inference

A descriptor may not be specified with the provided `withDescriptor` function but with any other value `x`, in which case a data descriptor of the form `{ value: x }` is inferred. Furthermore, if `withDescriptor` is not used at all, a plain object may instead be passed as the second argument of `defineReactiveProperties`.

```js
// The following `defineReactiveProperties` calls are equivalent
defineReactiveProperties({}, withDescriptor => ({
    foo: withDescriptor({
        value: bar
    })
}))
defineReactiveProperties({}, () => ({
    foo: bar
}))
defineReactiveProperties({}, {
    foo: bar
})
```

#### `ExtendedReactive` and `ExtendedRef` support

When defining properties of `ExtendedReactive` or `ExtendedRef` objects, provided properties with those objects' reserved keys are ignored (see [`extendedReactive`'s](/composables/extendedReactive#additional-features) and [`extendedRef`'s](/composables/extendedRef#additional-features) additional features). That is, reserved `ExtendedReactive` and `ExtendedRef` properties and methods cannot be overwritten with `defineReactiveProperties`.

In the case of `ExtendedReactive` objects, `defineReactiveProperties` automatically stores in the object internal index the underlying ref objects of unwrapped ref properties.

## Definition

```ts
function defineReactiveProperties<T>(
    object: object,
    properties?: T | (withDescriptor: function) => T,
    ignore?: string[]
): ExtendedRef<T>
```

#### Parameters

- **`object`**: The object on which to define properties.
- **`properties`**: An object, or function that returns an object, whose keys represent the names of the properties to be defined and whose values represent either the properties' (initial) values or descriptors.
- **`ignore`**: Array of property keys to be ignored from the extension object.

#### Return value

The passed `object`.