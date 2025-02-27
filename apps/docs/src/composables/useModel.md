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

Most notably, models store a *model-value*, which represents a component's main state property value, characterized by being modified through user interaction. The purpose of this model value is to establish a bidirectional component-model bond (see [Form input bindings](https://vuejs.org/guide/essentials/forms.html#form-input-bindings)). Therefore, component models are an alternative for two-way data binding with regular refs. As such, models are designed to be provided to components (with special model support) via the `v-model` directive.

```vue
<script setup>
const model = useModel()
</script>

<template>
    <Component v-model="model"/>
</template>
```

:::tip
All Vergil form components support models created by `useModel`. See the [introduction](/components/form/introduction) to Vergil's form components to learn about their capabilities and features.
:::

The `useModel` composable accepts two parameters: `value` and `options`, where `value` is the initial model-value and `options` is an object whose properties further configure `useModel`'s behavior (see [Parameters](#parameters)).

A model returned by `useModel` is an [extendedRef](/composables/extendedRef). The model's value is stored in the extendedRef's underlying `ref` object. Thus, the model value is accessible through the extendedRef's `value` property.

```js
const model = useModel()
v = model.value // Read model value
model.value = v // Write model value
```

:::warning
See [Difference with ref](/composables/extendedRef#difference-with-ref) to learn the main pragmatic differences between extended and regular refs.
:::

Additional model features to conveniently interact with components' state are presented below.

### `model.reset`

Models include a `reset` method to reset the model's value to its initial value. Its usage is similar to that of [resetRef](/composables/resetRef).

```js
const model = useModel('initial value')
model.value = 'new value'
model.reset()
console.log(model.value) // 'initial value'
```

### `model.exposed`

Vue's conventional way of consuming exposed component data is by means of the `useTemplateRef` composable and the special `ref` attribute. Vergil, on the other hand, provides an analogous API for this same purpose (see [`useExposed`](/composables/useExposed)), whereby components support an `exposed` prop that expects an `exposed` object returned by the `useExposed` composable. 

In addition, however, an `exposed` object may instead be provided to a component through a model. By default, models include an `exposed` property which stores an `exposed` object returned by `useExposed`. Component exposed data will be made available to this model's `exposed` object, if present.

```vue
<script setup>
const model = useModel()
onMounted(() => {
    console.log(model.exposed.property) // Read exposed properties
    model.exposed.method() // Call exposed methods
})
</script>

<template>
    <Component v-model="model"/>
</template>
```
:::warning
- Exposed data gets defined when the component exposing it is set up, and undefined when the component is unmounted.
- If `exposed` is included in a model, sharing the model between multiple components will produce exposed data conflicts. See [Component model sharing](#component-model-sharing).
:::

:::tip
Each Vergil's form component documents the shape of exposed data, if any.
:::

### `model.elements`

Vergil's alternative API to consume component exposed data also allows to exclusively and separately consume component element's `HTMLElement` objects (see [`useElements`](/composables/useElements)). For this, and analogous to `useExposed`, the `useElements` composable returns an `elements` object to be provided to a component's `elements` prop.

In the same way as with exposed data, `elements` may be provided through a model. By default, models include an `elements` property storing an `elements` object returned by `useElements`. Component elements will be made available to this model's `elements` object, if present.
 
```vue
<script setup>
const model = useModel()
onMounted(() => {
    console.log(model.elements.input) // an HTMLElement
})
</script>

<template>
    <Component v-model="model"/>
</template>
```

:::warning
- Exposed `HTMLElement` objects are only accessible when the corresponding elements are mounted. If an element is accessed while unmounted, `null` is returned instead.
- If `elements` is included in a model, sharing the model between multiple components will produce exposed elements conflicts. See [Component model sharing](#component-model-sharing).
:::

:::tip
Each Vergil's form component documents its exposed elements, if any.
:::

### Component model sharing

Component models are mainly designed to be provided to a single component. Nevertheless, is possible and supported to share a model between multiple components, if required. To achieve this, both the model's `exposed` and `elements` objects need to be excluded so that conflicts where different components try to expose data into the same model are prevented. These objects may be excluded through the `includeExposed` and `includeElements` [configuration options](#parameters).

## Definition

```ts
function useModel<T>(
    value?: T | Ref<T>,
    options?: {
        shallow: boolean;
        extendRef: boolean;
        includeElements: boolean;
        includeExposed: boolean;
    }
): ExtendedRef<T>
```

#### Parameters

- **`value`**: Component model's initial value.
- **`options`**:
    - `shallow`: Whether to use `shallowRef` for the model's internal `ref` object. Defaults to `false`.
    ```js
    const model = useModel(0, { shallow: true })
    console.log(isShallow(model.ref)) // true
    ```
    - `extendRef`: If `value` is a ref, whether to use the provided ref itself as the extendedRef's underlying `ref` object. When set to `false`, the `value` ref is instead used as the dynamic source of reset values. When set to `true`, the reset value will be the `value` ref's initial value. Defaults to `false`.
    ```js
    const v = ref(0)
    const model = useModel(v, { extendRef: true })
    console.log(v === model.ref) // true
    ```
    - `includeExposed`/`includeElements`: Whether to include the `exposed`/`elements` object into the model. Defaults to `true`.
    
    ```js
    const model = useModel(0, {
        includeExposed: false,
        includeElements: false,
    })
    console.log(model.exposed) // undefined
    console.log(model.elements) // undefined
    ```
    :::tip
    It is recommended to exclude `exposed`/`elements` if it will not be used.
    :::

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