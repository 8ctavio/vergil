---
outline: [2,3]
---

# `useModel`

> Creates or consumes a component model.

## Usage

```vue
<script>
import { useModel } from '@8ctavio/vergil'

// Create new model
const model = useModel('initial value')

// Interact with the model value
model.value = 'updated value'
console.log(model.value) // 'updated value'

// Reset the model value
model.reset()
console.log(model.value) // 'initial value'
</script>

<template>
    <!-- Provide model to a component -->
    <Component v-model="model"/>
</template>
```

## Description

The `useModel` composable creates a *model* for a custom component. Here, a model may be understood as an encapsulation of component state and utilities to conveniently interact with it.

A created model should be provided to a component with special support for models created with `useModel` via the `v-model` directive. Therefore, the `useModel` composable is an alternative for two-way data binding with regular refs.

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

Objects returned by `useModel` are [extendedRefs](/composables/extendedRef). See [Difference with ref](/composables/extendedRef#difference-with-ref) to learn the main pragmatic differences with regular refs.

### Features

#### `reset`

Models have a `reset` method to reset the model's value to its initial specified value. Its usage is similar to that of the [resetRef](/composables/resetRef) composable.

#### `el`

The `el` property is an automatically unwrapped ref property intented to store a component's HTML element reference. The `el` underlyng ref object may be accessed with the `getRef` method: `model.getRef('el')`.

## Definition

```ts
function useModel<T>(value?: T | ExtendedRef<T>): ExtendedRef<T>
```

#### Parameters

- **`value`**: The initial value for a new model. To consume a model, `value` must be a model created by `useModel`.

#### Return value

An `ExtendedRef` object.

## Component support for `useModel`

In order for a custom component to support a model created with `useModel`, it must *consume* the model with `useModel`.

```js
const model = useModel(/* existing model created by parent */)
```

There are different alternatives to receive a model in the component. The recommended approach is to receive it through the `modelValue` prop so the `v-model` directive can be used to provide it.

```js
import { isModel, ExtendedRef } from '@8ctavio/vergil'

const props = defineProps({
    modelValue: {
        type: ExtendedRef,
        validator: isModel
    }
})

const model = useModel(props.modelValue)
```

The `useModel` composable is analogous to the `defineModel` macro. When used to consume an already created model, `useModel` wraps the model in a new extendedRef for specific use inside the custom component. However, in practice, the APIs of a wrapped consumed model and a newly created model are essentially the same.

### Listen to external model mutations

When authoring a component, it may be required to perform certain operations only if the model value was programmatically mutated outside the component. For this purpose, a wrapped consumed model has an `onMutated` callback registration method. It expects a function that will be called every time the original model object its programmatically mutated by writing to its `value` property. The callback function receives as a single argument the value assigned to the original model value. 

:::tip IMPORTANT
If registered, the `onMutated` callback is responsible for updating the model value.
:::

```js
model.onMutated(v => {
    console.log('External programmatic mutation')
    // The callback is responsible for updating the model value
    model.value = v
})
```

:::tip
See [Listening to external programmatic model mutations with `defineModel`](https://github.com/vuejs/core/discussions/11250).
:::

### Reference a DOM element

The `el` property present on a model is intented to store a reference to a component's DOM element instance. A model can easily get a DOM component reference with a template ref and the `getRef` method.

```vue
<element :ref="model.getRef('el')"/>
```