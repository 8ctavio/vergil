---
outline: [2,3]
---

# `extendedRef`

> Extends a ref with additional properties.

:::tip
Before proceeding with `extendedRef`, learn first about [`entangled`](/reactivity/entangled).
:::

## Usage

```js
import { extendedRef, markDescriptor } from '@8ctavio/vergil'

const extended = extendedRef(0, { extra1: 0 })

// normally read and write inner reactive value
extended.value = extended.value + 8

// read and write extended properties
extended.extra1 = extended.extra1 + 1

// create and configure properties
extended.extend({
    extra2: 2,
    extra3: markDescriptor({
        value: 3,
        enumerable: false,
        writable: false
    }),
    extra4: markDescriptor({
        value: ref(4),
        unwrap: false
    })
})
```

## Description

The `extendedRef` function creates and returns an *extendedRef* object. In practice, as the name suggests, an extendedRef behaves similar to a regular ref with additional properties.

An extendedRef, however, is not a modified ref object, but an [entangled](/reactivity/entangled) object with additional features to emulate a regular ref. In particular, extendedRefs include a `ref` property with a regular ref (the ref to be "extended") whose inner reactive value can be read and written through extendedRefs' `value` property accessors.

```js
const extended = extendedRef()

console.log(isRef(extended))        // false
console.log(isRef(extended.ref))    // true

extended.value = extended.value
// same as
extended.ref.value = extended.ref.value
```

The `extendedRef` function accepts three parameters: `value`, `extension`, and `options`. The `value` parameter is converted to a ref with [`toRef`](https://vuejs.org/api/reactivity-utilities.html#toref), and becomes the created extendedRef's `ref` property value. On the other hand, `extension` and `options` are used to define extendedRef properties, and correspond to the entangled objects' `extend` method parameters (see [property definition](/reactivity/entangled#property-definition)).

In addition, `get` and `set` properties may be provided to the `extendedRef`'s `options` object in order to define custom getter and setter functions for an extendedRef's `value` property.

```js
const extended = extendedRef(undefined, null, {
    get() {
        console.log('custom getter')
    },
    set(value) {
        console.log('custom setter')
    }
})

extended.value = extended.value

// Logs:
// custom getter
// custom setter
```

Similarly, an `extendedRef`-exclusive `shallow` boolean option may be set to `true` for an extendedRef's regular ref to be created with `shallowRef`.

```js
const extended = extendedRef(undefined, null, { shallow: true })

console.log(isShallow(extended.ref)) // true
```

### Difference with ref

Even though an extendedRef attempts to emulate a regular ref, they do not always behave in the same way since extendedRefs are not ref objects. Pragmatically, there are two major differences between extended and regular refs:

**1. extendedRefs cannot be provided where refs are expected.**

Consider, for instance, the `watch` function:

```js
const extended = extendedRef()
watch(extended, callback) // extended is not a valid watch source
```

The extendedRef's `ref` property should be used instead:

```js
watch(extended.ref, callback) // ok
watch(() => extended.value, callback) // getter also works
```

**2. extendedRefs are not unwrapped in SFC templates.**

To access an extendedRef's inner ref value in SFC templates, full `.value` notation is typically necessary. This is a requirement in order for extended properties to be accessible in the template.

```vue
<template>
    <p>value: {{ extended.value }}</p>
    <button @click="extended.reset">reset</button>
</template>
```

Nevertheless, extendedRefs implement a `Symbol.toPrimitive` method that simply unwraps their underlying refs. Thus, for situations where an extendedRef would be coerced to a primitive, `.value` notation might be omitted.

```diff
 <template>
-    <p>value: {{ extended.value }}</p>
+    <p>value: {{ extended }}</p>
     <button @click="extended.reset">reset</button>
 </template>
```

## Definition

```ts
function extendedRef<
    T extends MaybeRefOrGetter | ExtendedRef,
    U = T extends ExtendedRef<infer R> ? UnwrapRef<R> : UnwrapRef<T>,
    Extension extends Record<PropertyKey, unknown> | null = {}
>(
    value: T,
    extension?: Extension,
    options?: ExtendedRefOptions<T extends ExtendedRef<infer R> ? UnwrapRef<R> : UnwrapRef<T>, U>
): T extends ExtendedRef<infer R, infer V, infer E>
    ? ExtendedRef<R, V, E & Extension>
    : ExtendedRef<T, U, Extension>

interface ExtendedRefOptions<T = unknown, U = T> extends EntangledOptions {
	shallow?: boolean;
	get?: () => T;
	set?: (value: U) => void;
}

type ExtendedRef<
	T extends MaybeRefOrGetter = unknown,
	U = UnwrapRef<T>,
	Extension extends Record<PropertyKey, unknown> = {},
> = {
	get value(): UnwrapRef<T>;
	set value(v: U);
	ref: ToRef<T>
} & Entangled<Omit<Extension, 'ref' | 'value'>>
```

#### Parameters

- **`value`**: Value to normalize into the ref to be extended.
- **`extension`**: Extension object whose keys represent the names or symbols of extendedRef properties to be defined, while its values represent those properties' initial values or descriptors (see [property definition](/reactivity/entangled#property-definition)).
- **`options`**:
    - `shallow`: Whether the created extendedRef's underlying ref is shallow. Defaults to `false`.
    - `get`: Custom extendedRef's `value` getter function.
    - `set`: Custom extendedRef's `value` setter function.
    - `defaults`: Default value of the `configurable`, `enumerable`, and `writable` options. Defaults to `true`.
    - `configurable`: Default `configurable` property value for descriptors of newly created properties. Defaults to `defaults`.
    - `enumerable`: Default `enumerable` property value for descriptors of newly created properties. Defaults to `defaults`.
    - `writable`: Default `writable` property value for descriptors of newly created properties. Defaults to `defaults`.
    - `ignore`: Array of `extension` property keys not to be defined on the underlying extendedRef object.

#### Return value

An extendedRef object.