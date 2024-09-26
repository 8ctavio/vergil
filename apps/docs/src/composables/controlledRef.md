---
outline: [2,3]
---

# `controlledRef`

> Creates an extended ref with custom `.value` accessors (getter and setter) and methods to control (a) effect tracking and triggering and (b) calling custom or default getter and setter.

## Usage

```js
import { controlledRef } from '@8ctavio/vergil'

const controlled = controlledRef(0, {
    get({ getValue }) {
        console.log('custom getter')
        return getValue()
    },
    set(v, { setValue }) {
        console.log('custom setter')
        setValue(v)
    }
})

//----- Control effect tracking/triggering -----
watchEffect(() => {
    console.log(controlled.value) // tracked
})
watchEffect(() => {
    console.log(controlled.peek()) // not tracked
})

controlled.value = 1 // trigger effects
controlled.lay(2) // does not trigger effects

controlled.get({ track: false }) // sames as .peek()
controlled.set(3, { trigger: false }) // same as .lay()

//----- Control calling custom getter/setter -----
// return extended ref's inner value without running custom getter
controlled.get({ custom: false })
// update extended ref's inner value without running custom setter
controlled.set(4, { custom: false })
```

## Description

The first argument is the extended ref's (initial) value and the second is a custom accessor object (object with `get` and `set` methods). The `get` and `set` methods receive an object with `getValue` and `setValue` methods to interact with the extended ref's inner value.

```js
controlledRef(value, {
    get({ getValue, setValue }){},
    set(v, { getValue, setValue }){}
})
```
If either the `get` or `set` method is not provided, the `getValue` and `setValue` functions are used instead, respectively.

```js
const {
    get = getValue,
    set = setValue,
} = customAccessor
```

:::tip
The provided `get` and `set` methods are called with the extended ref as their `this` value.
:::

### Additional methods

The `controlledRef` composable adds two `get` and `set` methods to read from and write to the extended ref's inner value, respectively. Both methods receive options to control (a) effect tracking and triggering and (b) calling custom or default getter and setter.

```ts
{
    get: (options: {
        track: boolean = true;
        custom: boolean = true;
    }) => T,
    set: (v: U, options: {
        trigger: boolean = true;
        custom: boolean = true;
    }) => void
}
```

- The `track` and `trigger` options control whether to track and trigger effects when reading and writing the extended ref's value, respectively.
- The `custom` option controls whether to call the provided `get` and `set` functions (custom accessors) or directly fallback to the `getValue` and `setValue` functions.

:::tip NOTE
The extended ref's `value` accessors internally call these two methods with default options. That is, when reading or writing with `.value`, effects are always tracked and triggered, and the custom accessors (if provided) are always invoked.
:::

There are two more methods — `.peek` and `.lay` — that wrap the `get` and `set` methods, respectively, but with the `track` and `trigger` options always set to `false`.

```ts
{
    peek: (options: { custom: boolean = true }) => T,
    lay: (v: U, options: { custom: boolean = true; }) => void
}
```

## Definition

```ts
function controlledRef<T,U=T>(
    value: T,
    customAccessor?: ({
        get?: ({ getValue, setValue }: {
            getValue: () => T;
            setValue: (v: T) => void;
        }) => T;
        set?: (v: U, { getValue, setValue }: {
            getValue: () => T;
            setValue: (v: T) => void;
        }) => void;
    })
): ExtendedRef<T, ControlledRefExtension<T,U>>

interface ControlledRefExtension<T,U> {
    get: (options: {
        track: boolean = true;
        custom: boolean = true;
    }) => T;
    set: (v: U, options: {
        trigger: boolean = true;
        custom: boolean = true;
    }) => void;
    peek: (options: { custom: boolean = true }) => T;
    lay: (v: U, options: { custom: boolean = true; }) => void;
}
```

#### Parameters

- **`value`**: The controlled ref's inner value.
- **`customAccessor`**:  An object with `get` and `set` methods — the controlled ref's custom accessors.

#### Return value

An extended controlled ref.