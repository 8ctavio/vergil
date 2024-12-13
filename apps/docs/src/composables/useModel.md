---
outline: [2,3]
---

# `useModel`

> Creates or wraps a component model.

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

### Motivation

Besides providing some [additional features](#features), the `useModel` composable enables custom components implementations to separately handle model changes depending on their source. In general, component model's value changes can be originated from two distinct sources:

- **Internal**. Changes derived from user-interaction events.
- **External**. Programmatic mutations performed outside of the component's context/scope (e.g., by the component's parent).

Internal changes are typically handled with event listeners. The `useModel` API allows to register callbacks only called when external programmatic mutations are performed in order to handle them separately. See [Handle external mutations](#handle-external-mutations) for more details.

Also, see [Listening to external programmatic model mutations with `defineModel`](https://github.com/vuejs/core/discussions/11250) to learn more about why the described approach to implement components is required.

### Considerations

A model returned by `useModel` is an [extendedRef](/composables/extendedRef). See [Difference with ref](/composables/extendedRef#difference-with-ref) to learn the main pragmatic differences with regular refs.

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
    value?: T | ExtendedRef<T>,
    options?: { deep: boolean | number }
): ExtendedRef<T>
```

#### Parameters

- **`value`**: The initial value to create a model with or the model to wrap. Wrapped models are directly returned.
- **options**:
    - **`deep`**: Depth of model wrapper watchers.

#### Return value

An `ExtendedRef` object.

## Component support for `useModel`

In order for a custom component to support a model created with `useModel`, it must *wrap* the model with `useModel`.

```js
const model = useModel(/* existing model created by parent */)
```

There are different alternatives to receive a model in the component. The recommended approach is to receive it through the `modelValue` prop so the `v-model` directive can be used to provide it.

```js
import { useModel, isModel } from '@8ctavio/vergil'

const { modelValue } = defineProps({
    modelValue: {
        validator: isModel,
        default: () => useModel()
    }
})

const model = useModel(modelValue)
```

The `useModel` composable is analogous to the `defineModel` macro. When used with an already created model, `useModel` returns a wrapped version for specific use inside the custom component. The wrapped model includes the same properties as the regular model plus additional properties to handle external programmatic mutations.

### Nested component

Consider a `Root` component that wraps another `Nested` component which supports models. The model wrapped in `Root` should be directly passed to `Nested` to avoid creating multiple model wrappers.

```vue
<!-- Root -->
<script setup>
const { modelValue } = defineProps(/* ... */)
const model = useModel(modelValue)
</script>
<template>
    <Nested :model-value="model"/>
</template>
```

When `useModel` receives a model wrapper, that wrapper is simply returned. Thefore, the `Nested` model implementation is not affected.

### Handle external mutations

The `useModel` composable is intended to enable component implementations to separately handle [internal and external model changes](#motivation).

Programmatic mutations can be easily detected with watchers. However, since the model value needs to be *internally* updated in response to user-interaction events, all model-value-subscribed watchers would be triggered by those updates, rendering them unable to distinguish between internal and external changes.

To prevent watchers from being triggered by internal changes, Vergil provides two composables: [`watchControlled`](/composables/watchControlled) and [`useWatchers`](/composables/useWatchers).

In order to sync model value mutations with the component's state, the `watchControlled` composable may be used.

```js
// Core Component
const model = useModel(modelValue)

const modelWatcher = watchControlled(model.ref, modelValue => {
    // Sync component state with new model value
})
function eventHandler(event) {
    modelWatcher.pause()
    model.watchers.pause()
    // Sync model value with new component state
    // Changes to model.value here don't trigger modelWatcher
    model.watchers.resume()
    modelWatcher.pause()
}
```

Additionally, wrapped models include a `watchers` property, which is an instance of `useWatchers`'s returned object. All watcher callbacks attached to `model.watchers` can be used to detect external programmatic mutations if internal changes are properly ignored:

```js
const model = useModel(modelValue)

// On external programmatic mutation
model.watchers.onUpdated(modelValue => {
    /* ... */
})

function eventHandler(event) {
    model.watchers.pause()
    // Does not execute model.watchers callbacks
    model.value = event.target.value
    model.watchers.resume()
}
```

### Reference a DOM element

The `el` property present on a model is intented to store a reference to a component's DOM element instance. A model can easily get a DOM component reference with a template ref and the `refs` index.

```vue
<element :ref="model.refs.el"/>
```

### Expose data

In order to expose component data such as methods and properties to make them available for the parent component, `defineReactiveProperties` should be used to define additional properties on the model's `exposed` property:

```js
import { useModel, defineReactiveProperties } from '@8ctavio/vergil'

const { modelValue } = defineProps(/* ... */)
const model = useModel(modelValue)

function method(){ /* ... */ }
const property = ref(/* ... */)

// Expose data
defineReactiveProperties(model.exposed, withDescriptor => ({
    method,
    property: withDescriptor({
        value: property,
        readonly: true
    })
}))
```

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