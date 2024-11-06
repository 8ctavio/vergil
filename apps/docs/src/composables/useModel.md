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

Besides providing some [additional features](#features), the `useModel` composable enables custom components implementations to separately handle model changes depending on their source. In general, component model's value changes can be originated from two distinct sources:

- **Internal**. Changes derived from user-interaction events.
- **External**. Programmatic mutations performed outside of the component's context/scope (e.g., by the component's parent).

Internal changes are typically handled with event listeners. On the other hand, the `useModel` API allows to **intercept** external programmatic mutations in order to handle them separately. See [Handle external mutations](#handle-external-mutations) for more details.

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

### Handle external mutations

The `useModel` composable is intended to enable component implementations to separately handle [internal and external model changes](#motivation). Vergil provides two approaches to detect external programmatic mutations:

#### 1. Intercept mutations

The `useModel` composable allows to intercept write operations to the `value` property of models. Model wrappers have an `onMutated` callback registration method that expects a function to be called every time a `.value` assignment on the original model is intercepted. This way, the model wrapper is able to detect and separately handle external programmatic mutations, as well as to freely update the model value.

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

:::warning
The `onMutated` callback can properly intercept programmatic mutations of scalar model values (string, number, boolean). However, programmatic mutations of object model values cannot be fully intercepted since objects can be further mutated by (deeply nested) object properties.

Due to this limitation, `useModel` implementation might change significantly in the future. For that reason, it is recommended to use an alternative approach to detect external programmatic mutations.
:::

#### 2. Observe mutations

Programmatic mutations can be easily detected with watchers. However, since the model value needs to be *internally* updated in response to user-interaction events, all model-value-subscribed watchers would be triggered by those updates, rendering them unable to distinguish between internal and external changes.

The [watchControlled](/composables/watchControlled) composable can be used instead for the watcher to explicitly ignore *internal* model mutations.


```js
const model = useModel(modelValue)

// Same signature as regular watch
const controller = watchControlled(model.ref, () => {}) 

function eventHandler(event) {
    controller.pause()
    // Does not execute watch callback
    model.value = event.target.value
    controller.resume()
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

### `isModelWrapper`

> Assesses whether a value is a model wrapped by `useModel`.

```js
function isModelWrapper(value: any): boolean
```

#### Return value

`true` if `value` is a model wrapped by `useModel`.