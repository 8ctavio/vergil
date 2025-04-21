---
outline: [2,3]
---

# `entangled`

> Creates an object whose ref properties are automatically unwrapped by default.

## Usage

```js
import { entangled, markDescriptor } from '@8ctavio/vergil'

// Define regular or ref properties
const _entangled = entangled({
    prop1: 1,
    prop2: ref(2)
})

// Ref properties are unwrapped by default
console.log(_entangled.prop1) // 1
console.log(_entangled.prop2) // 2

// Extend entangled and configure properties
_entangled.extend({
    prop3: 3,
    prop4: markDescriptor({
        value: 4,
        enumerable: false,
        writable: false
    }),
    prop5: markDescriptor({
        value: ref(5),
        unwrap: false
    })
})
```

## Description

The `entangled` function creates and returns an *entangled* object.

Entangled objects inherit an `extend` method from their prototype, which is internally called and forwarded `entangled`'s parameters — `properties` and `options` — to define properties of newly created entangled objects.

```js
entangled(properties, options)
// same as
entangled().extend(properties, options)
```

### Property definition

Entangled objects' `extend` method allows to further define properties on entangled objects. The `extend` method returns the entangled object it is called on, and accepts two parameters: `extension` and `options`.

The `extension` parameter is an object whose own key-value pairs *represent* the key and *descriptor* pairs used to define corresponding properties on the entangled object with [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

An entangled object property descriptor may be directly provided through an `extension` property value as a descriptor-marked object returned by the [`markDescriptor`](/functions/descriptor#markdescriptor) function. However, for convenience, any other provided property value `x` is inferred as a data descriptor of the form `{ value: x }`.

```js
entangled().extend({
    foo: markDescriptor({ /* ... */ }),
    bar: baz // equivalent to markDescriptor({ value: baz })
})
```

The `options` parameter is an object whose properties configure the property definition process. The `options.ignore` option, for instance, accepts an array of `extension` property keys not to be defined on the underlying entangled object.

Other `options` properties define the default property values of entangled object descriptors.

### Default descriptor options

By default, entangled object properties *created* with the `extend` method are configurable, enumerable, and writable (if applicable).

```js
// configurable, enumerable, and writable
entangled({ /* ... */ })
```

The default configurability, enumerability, and writability of entangled object properties created with `.extend` may be individually configured through corresponding `options.configurable`, `options.enumerable`, and `options.writable` boolean options.

```js
// configurable, non-enumerable, and non-writable
entangled({ /* ... */ }, { enumerable: false, writable: false })
```

The default value for the `configurable`, `enumerable`, and `writable` options is obtained from the `options.defaults` property, which itself defaults to `true`. Thus, if `options.defaults` is set to `false`, properties created with `extend` are non-configurable, non-enumerable, and non-writable (if applicable), unless some of the descriptor-property-specific options are overwritten.

```js
// non-configurable, enumerable, and non-writable
entangled({ /* ... */ }, { defaults: false, enumerable: true })
```

### Ref unwrapping

Entangled objects' ref properties defined with the `extend` method are automatically unwrapped by default. This is achieved by defining the ref property with an accessor descriptor. Therefore, ref property descriptors may also include custom `get` and `set` methods to overwrite default behavior.

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

In addition, entangled objects inherit a `getRef` method from their prototype to retrieve the underlying ref object of auto-unwrapped ref properties. The `getRef` method accepts a single `key` argument, an auto-unwrapped ref property key. If the entangled object's `key` property is not an auto-unwrapped ref, `getRef` returns `undefined`.

```js
const _entangled = entangled({
    foo: ref()
})

console.log(isRef(_entangled.getRef('foo'))) // true
console.log(_entangled.getRef('bar')) // undefined
```

Finally, in order to support the `getRef` method, custom getters of auto-unwrapped ref properties receive a `shouldUnwrap` boolean argument. When `shouldUnwrap` is `false`, a custom getter should return a ref object; if something else is returned, `getRef` returns `undefined` for that custom getter's property key.

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

interface EntangledOptions {
    defaults?: boolean;
    configurable?: boolean;
    enumerable?: boolean;
    writable?: boolean;
    ignore?: PropertyKey[];
}

type Entangled<E extends Record<PropertyKey, unknown>> = EntangledExtension<E> & {
    getRef(key: PropertyKey): Ref | undefined
    extend(extension: Record<PropertyKey, unknown>, options?: EntangledOptions): object
}
```

#### Parameters

- **`properties`**: Object whose own key-value pairs represent key-descriptor pairs used to define corresponding properties on the underlying entangled object. See [property definition](#property-definition)
- **`options`**:
    - `defaults`: Default value of the `configurable`, `enumerable`, and `writable` options. Defaults to `true`.
    - `configurable`: Default `configurable` property value for descriptors of newly created properties. Defaults to `defaults`.
    - `enumerable`: Default `enumerable` property value for descriptors of newly created properties. Defaults to `defaults`.
    - `writable`: Default `writable` property value for descriptors of newly created properties. Defaults to `defaults`.
    - `ignore`: Array of `properties` property keys not to be defined on the underlying entangled object.

#### Return value

An entangled object.