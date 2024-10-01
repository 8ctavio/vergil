---
outline: [2,3]
---

# `useCustomRef`

> Creates ref with custom `.value` accessors (getter and setter) and control over tracking and triggering effects.

## Usage

```js
import { useCustomRef } from '@8ctavio/vergil'

// Custom ref with factory function
const custom = useCustomRef(0, ({ track, trigger, getValue, setValue }) => ({
    get() {
        if(readEnabled) {
            track()
            return getValue()
        }
    },
    set(v) {
        if(writeEnabled) {
            setValue(v)
            trigger()
        }
    }
}))

// Ref with custom accessor
const custom = useCustomRef('', {
    get({ getValue }) {
        return readEnabled ? getValue() : 'default'
    },
    set(v, { setValue }) {
        setValue(writeEnabled ? setValue(v) : 'default')
    }
})
```

## Description

The `useCustomRef` composable is a wrapper around Vue's [`customRef`](https://vuejs.org/api/reactivity-advanced.html#customref) that manages the ref's inner value.

The first argument is the ref's (initial) value and the second is a custom accessor object (object with `get` and `set` methods), or a factory function that returns one. If either the `get` or `set` method is not provided, a default function is used instead.

#### Factory function

The factory function works the same way as `customRef`, but it receives different arguments. Instead of receiving the `track` and `trigger` function as the first two arguments, they are passed in the first argument as object properties along with two additional functions — `getValue` and `setValue` — to interact with the ref's inner value.

```js
useCustomRef(value, ({ track, trigger, getValue, setValue }) => ({}))
```

##### Default getter and setter

```js
const {
    get = () => {
        track()
        return getValue()
    },
    set = v => {
        setValue(v)
        trigger()
    }
} = customAccessor
```

##### Custom getter and setter

If a custom accessor object is passed, the ref's getter and setter are updated, but tracking and triggering effects is normally performed (`track` invoked before `get` and `trigger` invoked after `set`). To interact with the ref's inner value, the `get` and `set` methods receive an object with the `getValue` and `setValue` functions.

```js
useCustomRef(value, {
    get({ getValue, setValue }){},
    set(v, { getValue, setValue }){}
})
```

##### Default getter and setter

```js
const {
    get = getValue,
    set = setValue,
} = customAccessor
```

## Definition

```ts
function useCustomRef<T,U=T>(
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
    } | (({ track, trigger, getValue, setValue }: {
        track: () => void;
        trigger: () => void;
        getValue: () => T;
        setValue: (v: T) => void;
    }) => {
        get?: () => T;
        set?: (v: U) => T;
    }))
): Ref<T>
```

#### Parameters

- **`value`**: The ref's inner value.
- **`customAccessor`**: An object with `get` and `set` methods, or function that returns one.

#### Return value

A custom ref.