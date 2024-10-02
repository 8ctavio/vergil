---
outline: [2,3]
---

# `useModel`

> Creates or wraps a component model.

## Usage

```vue
<script>
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

A model should be provided to a component with special support for models created with `useModel` via the `v-model` directive. Therefore, the `useModel` composable is an alternative for two-way data binding with regular refs.

```vue
<script>
const model = useModel()
</script>

<template>
    <Component v-model="model"/>
</template>
```

### Motivation

Besides providing additional features, `useModel` allows to build components with improved functionality compared to regular refs. See the [Listening to external programmatic model mutations with `defineModel`](https://github.com/vuejs/core/discussions/11250) discussion to learn more about why an API like the `useModel`'s is required.

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
function useModel<T>(value?: T | ExtendedRef<T>): ExtendedRef<T>
```

#### Parameters

- **`value`**: The initial value to create a model with or the model to wrap. Wrapped models are directly returned.

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

The `useModel` composable is analogous to the `defineModel` macro. When used with an already created model, `useModel` returns a wrapped version for specific use inside the custom component. However, in practice, the APIs of a model and a model wrapper are very similar.

### Nested component

Consider a `Root` component that wraps another `Nested` component which supports models. The `Root` component may need to wrap the received model to perform certain operations. Then, the model could be directly passed to the `Nested` component.

```vue
<!-- Root -->
<script setup>
const { modelValue } = defineProps(/* ... */)
const model = useModel(modelValue)
</script>
<template>
    <Nested :model-value="modelValue"/>
</template>
```

Altough this could work, two different model wrappers would be created for the same model (one for `Root` and one for `Nested`). To avoid creating multiple model wrappers, the model wrapper created in `Root` can be directly provided to `Nested`. 

```diff
-    <Nested :model-value="modelValue"/>
+    <Nested :model-value="model"/>
```

When `useModel` receives a model wrapper, that wrapper is simply returned. Thefore, the `Nested` model implementation is not affected.

### Listen to external model mutations

When authoring a component, it may be required to perform certain operations only if the model value was programmatically mutated outside the component. For this purpose, a model wrapper has an `onMutated` callback registration method. It expects a function that will be called every time the original model object its programmatically mutated by writing to its `value` property. The callback function receives as a single argument the value assigned to the original model value. 

:::tip IMPORTANT
If registered, the `onMutated` callback is responsible for updating the model value.
:::

```js
model.onMutated(v => {
    console.log('External programmatic mutation')
    // IMPORTANT: The callback is responsible for updating the model value
    model.value = v
})
```

:::tip
See [Listening to external programmatic model mutations with `defineModel`](https://github.com/vuejs/core/discussions/11250).
:::

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