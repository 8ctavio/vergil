---
outline: [2,3]
---

# `entangled`

> Creates an object whose ref properties are automatically unwrapped by default.

## Usage

```js
import { entangled } from '@vrgl/vergil'

// Define regular or ref properties
const _entangled = entangled({
    prop1: 1,
    prop2: ref(2)
})

// Ref properties are unwrapped by default
console.log(_entangled.prop1) // 1
console.log(_entangled.prop2) // 2
```

## Description

The `entangled` function creates and defines properties on an object, with ref-property unwrapping support enabled by default. Created objects with both regular and reactive (ref-unwrapped) properties are referred to as *entangled* objects.

### Property definition

The `entangled` function accepts two parameters: the `properties` to define, and `options` to configure property definition. Internally, these parameters are forwarded to the [`defineEntangledProperties`](#defineentangledproperties) function, which receives the target `object` as its first argument, defines properties with ref-unwrapping support, and returns that object.


```js
entangled(properties, options)
// same as
defineEntangledProperties(entangled(), properties, options)
```

The `properties` parameter is an object whose own key-value pairs *represent* the key and *descriptor* pairs used to define corresponding properties on the entangled object with [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

An entangled property descriptor may be directly provided through a `properties` property value as a descriptor-marked object returned by the [`markDescriptor`](/functions/descriptor#markdescriptor) function. However, for convenience, any other provided property value `x` is inferred as a data descriptor of the form `{ value: x }`.

```js
entangled({
    foo: markDescriptor({ /* ... */ }),
    bar: baz // equivalent to markDescriptor({ value: baz })
})
```

The `options` parameter is an object whose properties configure the property definition process. The `options.ignore` option, for instance, accepts an array of `properties` property keys not to be defined on the underlying entangled object.

Other `options` properties define the default property values of entangled descriptors.

### Default descriptor options

By default, properties defined with `defineEntangledProperties` are configurable, enumerable, and writable (if applicable).

```js
// configurable, enumerable, and writable
entangled({ /* ... */ })
```

The default configurability, enumerability, and writability of entangled properties may be individually configured through corresponding `options.configurable`, `options.enumerable`, and `options.writable` boolean options.

```js
// configurable, non-enumerable, and non-writable
entangled({ /* ... */ }, { enumerable: false, writable: false })
```

The default value for the `configurable`, `enumerable`, and `writable` options is obtained from the `options.defaults` property, which itself defaults to `true`. Thus, if `options.defaults` is set to `false`, properties defined with `defineEntangledProperties` are non-configurable, non-enumerable, and non-writable (if applicable), unless some of the descriptor-property-specific options are overwritten.

```js
// non-configurable, enumerable, and non-writable
entangled({ /* ... */ }, { defaults: false, enumerable: true })
```

### Ref unwrapping

Ref properties provided to `defineEntangledProperties` are defined with accessor descriptors to support ref-unwrapping by default. Therefore, ref property descriptors may also include `get` and `set` methods for custom behavior.

```js
const _entangled = entangled({
    foo: ref(0),
    bar: markDescriptor({
        value: ref(),
        get: () => {
            console.log('custom getter')
        },
        set: (value) => {
            console.log('custom setter')
        }
    })
})

watchSyncEffect(() => {
    console.log(_entangled.foo)
})
_entangled.foo++
_entangled.bar = _entangled.bar

// Logs:
// 0
// 1
// custom getter
// custom setter
```

Nevertheless, non-unwrapped refs can be defined on entangled objects by providing the refs through descriptor-marked objects with an `unwrap` property set to `false`.

```js
const _entangled = entangled({
    foo: markDescriptor({
        value: ref(),
        unwrap: false
    })
})

console.log(isRef(_entangled.foo)) // true
```

In addition, entangled objects include a `$ref` method to retrieve the underlying ref object of auto-unwrapped ref properties. The `$ref` method accepts a single `key` argument, an auto-unwrapped ref property key. If no auto-unwrapped ref is found with propery key `key`, `$ref` returns `undefined`.

```js
const _entangled = entangled({
    foo: ref()
})

console.log(isRef(_entangled.$ref('foo'))) // true
console.log(_entangled.$ref('bar')) // undefined
```

Finally, in order to support the `$ref` method, custom getters of auto-unwrapped ref properties receive a `shouldUnwrap` boolean argument. When `shouldUnwrap` is `false`, a custom getter should return a ref object; if something else is returned, `$ref` returns `undefined` for that custom getter's property key.

```js
entangled({
    foo: markDescriptor({
        value: ref(),
        get(shouldUnwrap) {
            if (!shouldUnwrap) {
                // should return a ref
                return /* ... */
            }
        }
    })
})
```

## Definition

```ts
function entangled<T extends Record<PropertyKey, unknown> = {}>(
    properties?: T,
    options?: EntangledOptions
): Entangled<T>

type EntangledOptions = {
    defaults?: boolean;
    configurable?: boolean;
    enumerable?: boolean;
    writable?: boolean;
    ignore?: PropertyKey[];
}

type Entangled<P extends Record<PropertyKey, unknown>> = EntangledProperties<P> & {
    $ref(key: PropertyKey): Ref | undefined
}
```

#### Parameters

- **`properties`**: Object whose own key-value pairs represent key-descriptor pairs used to define corresponding properties on the underlying entangled object. See [property definition](#property-definition)
- **`options`**:
    - `defaults`: Default value of the `configurable`, `enumerable`, and `writable` options. Defaults to `true`.
    - `configurable`: Default `configurable` property value for descriptors of newly created properties. Defaults to `defaults`.
    - `enumerable`: Default `enumerable` property value for descriptors of newly created properties. Defaults to `defaults`.
    - `writable`: Default `writable` property value for descriptors of newly created properties. Defaults to `defaults`.
    - `ignore`: Array of property keys not to be defined on the underlying entangled object.

#### Return value

An entangled object.

## `defineEntangledProperties`

> Defines properties with automatic ref unwrapping by default.

#### Usage

```ts
import { defineEntangledProperties } from "@vrgl/vergil"
import { markDescriptor } from "@vrgl/vergil/utilities"

const withEntangled = defineEntangledProperties({}, {
    foo: 3,
    bar: markDescriptor({
        value: 4,
        enumerable: false,
        writable: false
    }),
    baz: markDescriptor({
        value: ref(5),
        unwrap: false
    })
})
```

#### Definition

```ts
function defineEntangledProperties<
    O extends object,
    P extends Record<PropertyKey, unknown>
>(
    object: O,
    properties: P,
    options?: EntangledOptions
): WithEntangled<O, P>
```

#### Parameters

- **`object`**: Object to define properties on.
- For others see [`entangled`'s parameters](#parameters)

#### Return value

The received `object`.