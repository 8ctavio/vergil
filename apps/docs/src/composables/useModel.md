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

### Validation and error handling

Models support an API to validate their model-values and handle validation errors. A `validator` function is used to peform model-value validation and collect encountered validation errors into an array. A validation error is simply an error message string.

A model can be provided its own `validator` function through the `useModel`'s [`options`](#definition) object. In addition, a model includes a shallowRef [`errors`](#model-errors) property with an array where its `validator` collects errors into. Thus, this `errors` array is emptied just before the model's `validator` is invoked.

A `validator` function receives three parameters:

- `value`: The model's value to validate.
- `error`: A function to register a validation error; it receives as its single argument an error message string. In practice, `error` simply *pushes* a validation error into the underlying model's `errors` array.
- `checkpoint`: A function to preemptively exit `validator` if errors have already been collected. This allows to control which errors can be collected together. In practice, if at least one error has been collected when `checkpoint` is called, an (internally handled) exception is thrown to exit `validator`.

To illustrate, consider the example below. The errors `'Error 1.1'` and `'Error 3.1'` may only be present into the model's `errors` individually; on the other hand, `'Error 2.1'` and `'Error 2.2'` could be simultaneously collected.

```js
const model = useModel('', {
    validator(value, error, checkpoint) {
        if(test1(value)) {
            error('Error 1.1')
        }
        checkpoint()

        if(test2(value)) {
            error('Error 2.1')
        } if(test3(value)) {
            error('Error 2.2')
        }
        checkpoint()

        if(test4(value)) {
            error('Error 3.1')
        }
    }
})
```

:::warning
A model's value should not be mutated inside that model's validator.
:::

Models include a few methods (presented below) to directly interact with their validators and error arrays. Some Vergil form components may use these methods to perform model-value validation upon user interaction.

:::tip
See the [introduction](/components/form/introduction) to Vergil's form components to learn how they interact with the model's validation and error handling API.
:::

### `model.errors`

The `errors` property stores a (non-unwrapped) readonly shallowRef which in turn stores an array where a provided model's `validator` function collects validation errors into (see [Validation and error handling](#validation-and-error-handling)).

The `model.errors` shallowRef is always triggered internally when the [`model.validate`](#model-validate) and [`model.clear`](#model-clear) methods are called.

```js
watch(model.errors, () => {
    // model-value validated or errors cleared
})
```

### `model.error`

The `model.error` property is a readonly accessor property that returns a trackable boolean indicating whether there are validation errors in the `model.errors.value` array.

```js
watchEffect(() => {
    const hasErrors = model.error
})
```

### `model.validate`

The `validate` method allows to invoke a model's `validator` function: it first empties the model's `errors` array and then calls the provided `validator`. If no validation errors are collected, `validate` returns `true`, and `false` otherwise.

If a model-value is revalidated and has not changed since the last validation, however, `validate` does not invoke `validator` but simply returns the previous validation result. Nevertheless, `model.validate` accepts a single `force` boolean argument to force the execution of `validator` if required.

```js
const model = useModel('', { validator: () => { /* ... */ } })
let isValid
isValid = model.validate()      // validator executed
isValid = model.validate()      // validator not executed
isValid = model.validate(true)  // validator forced to execute
```

### `model.clear`

The `clear` method simply empties the underlying model's `errors` array.

```js
const model = useModel(0, {
    validator(value, error) {
        error('Invalid')
    }
})
model.validate()
console.log(model.error) // true
model.clear()
console.log(model.error) // false
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
        validator: (
            value: T,
            error: (msg: string) => void,
            checkpoint: () => void
        ) => void;
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
    - `validator`: Function to peform model-value validation and collect encountered validation errors (see [Validation and error handling](#validation-and-error-handling)).
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