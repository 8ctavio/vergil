---
outline: [2,3]
---

# `useModel`

> Creates a component model.

## Usage

```vue
<script setup>
import { useModel } from '@8ctavio/vergil'

// Create new model
const model = useModel('initial value')

// Interact with the model value
model.value = 'updated value'
console.log(model.value) // 'updated value'
</script>

<template>
    <!-- Provide model to a component -->
    <Component v-model="model"/>
</template>
```

## Description

The `useModel` composable creates a *model* for a custom component. Here, a model may be understood as an encapsulation of component state and utilities to conveniently interact with it.

A model should be provided to a component with special support for `useModel`-created-models via the `v-model` directive. Therefore, the `useModel` composable is an alternative for two-way data binding with regular refs.

```vue
<script>
const model = useModel()
</script>

<template>
    <Component v-model="model"/>
</template>
```

:::warning
A model returned by `useModel` is an [extendedRef](/composables/extendedRef). See [Difference with ref](/composables/extendedRef#difference-with-ref) to learn the main pragmatic differences with regular refs.
:::


### Features

- **`reset`**: Models have a `reset` method to reset the model's value to its initial specified value. Its usage is similar to that of the [resetRef](/composables/resetRef) composable.

- **`el`**: The `el` property is an automatically unwrapped ref property intented to store a component's HTML element reference. The `el` underlying ref object may be accessed through the `refs` index: `model.refs.el`.

- `exposed`: Models store an [extendedReactive](/composables/extendedReactive) object under a  `exposed` key whose purpose is to have components with support for models to define or *expose* methods or properties on it with [`defineReactiveProperties`](/composables/defineReactiveProperties). This is, therefore, an alternative of exposing data with `defineExpose`.
    
    By defining properties on `exposed`, the parent component can easily access exposed data from `model.exposed` and enjoy of extendedReactive features such as automatically unwrapped refs.

    ```js
    const model = useModel()
    // Read properties
    console.log(model.exposed.property)
    // Call methods
    model.exposed.method()
    ```

## Definition

```ts
function useModel<T>(
    value?: T | ExtendedRef<T>;
    isShallow?: boolean;
): ExtendedRef<T>
```

#### Parameters

- **`value`**: Component model's initial value.
- **`isShallow`**: Whether to use `shallowRef` for the model's internal `value` ref.

#### Return value

An `ExtendedRef` object.

## Utilities

### Usage

```js
import { <util> } from '@8ctavio/vergil'
```

### `isModel`

> Assesses whether a value is a model created by `useModel`.

```js
function isModel(value: any): boolean
```

#### Return value

`true` if `value` is a model created by `useModel`.