---
outline: [2,3]
---

# `useModelWrapper`

> Creates component a model wrapper to conveniently implement component's two-way data binding and handle external programmatic mutations.

## Usage

```vue
<script setup>
const props = defineProps({
	modelValue: {
		type: [String, Object],
		default: ''
	},
	['onUpdate:modelValue']: Function
})

const model = useModelWrapper(props)
</script>
```

## Description

The `useModelWrapper` composable is analogous to the `defineModel` macro in that it creates an object to conveniently interact with a custom component's `modelValue` and `onUpdate:modelValue` props to support two-way data binding.

However, `useModelWrapper` also support passing a *component model object* created with [`useModel`](/composables/useModel) through `modelValue`. Additionally, `useModelWrapper` internally creates a *wrapped* version of a model object which includes the same properties as the regular model plus additional methods to [handle external programmatic mutations](#handle-external-mutations).

`useModelWrapper` is designed to accept as its first argument the custom component's `props` object (the `modelValue` and `onUpdate:modelValue` props should be defined inside `defineProps`). However, a plain object with a `modelValue` property may also be provided.

:::warning
A model wrapper returned by `useModelWrapper` is an [extendedRef](/composables/extendedRef). See [Difference with ref](/composables/extendedRef#difference-with-ref) to learn the main pragmatic differences with regular refs.
:::

### Motivation

The `useModelWrapper` composable enables custom components implementations to separately handle model changes depending on their source. In general, component model's value changes can be originated from two distinct sources:

- **Internal**. Changes derived from user-interaction events.
- **External**. Programmatic mutations performed outside of the component's context/scope (e.g., by the component's parent).

Internal changes are typically handled with event listeners. The `useModelWrapper` API allows to register callbacks only called when external programmatic mutations are performed in order to handle them separately.

### Nested components

Consider a `Root` component that wraps another `Nested` component, and that their models are implemented with `useModelWrapper`. The model wrapper created in `Root` should be directly passed to `Nested` to keep them linked and avoid creating multiple model wrappers.

```vue
<!-- Root -->
<script setup>
const props = defineProps(/* ... */)
const model = useModelWrapper(props)
</script>
<template>
	<Nested :model-value="model"/>
</template>
```

### Handle external mutations

Model programmatic mutations can be easily detected with watchers. However, since the model value needs to be *internally* updated in response to user-interaction events, all model-value-subscribed watchers would be triggered by those updates, rendering them unable to distinguish between internal and external changes.

To prevent watcher effects from being triggered by internal changes, `useModelWrapper` relies on two composables: [`watchControlled`](/composables/watchControlled) and [`useWatchers`](/composables/useWatchers).

A model wrapper provides two methods to register watcher effects: `onExternalUpdate` and `onExternalMutation`. Both methods receive a `WatchCallback` and `WatchOptions`, and their registered callbacks are only triggered when the model value is mutated outside the component — if internal model updates are properly ignored. There are, of course, some differences between these methods:

- `onExternalUpdate` can only register one effect per component instance. Subsequent calls stop the previous watcher, and creates a new one. `onExternalMutation` is similar to a regular `watch` in that multiple callbacks can be registered.
- `onExernalUpdate` accepts an additiona option: `{ onMounted: boolean; }`. When `onMounted` is set to `true`, the effect is created on the `onMounted` life-cycle hook with `immediate: true`.
- If a component model object is shared between components (see [Nested components](#nested-components)), `onExternalMutation` is only triggered when the model value is mutated outside those components.

As previously mentioned, in order for the `onExternalUpdate` and `onExternalMutation` effects to be skipped, internal updates should properly be ignored. Two model wrapper methods are provided for this end: `update` and `updateDecorator`.

The `update` method accepts as a single argument the value to update the model's value with. Additionally, to perform more elaborate operations, a function may be passed instead: synchronous model value updates inside the function are properly ignored. Similarly, the `updateDecorator` method accepts a function and modifies it so that synchronous model value updates are properly ignored.

```js
model.onExternalUpdate(modelValue => {
	/* ... */
})
model.onExternalMutation(modelValue => {
	/* ... */
})

// Do not execute model.onExternalUpdate/Mutation callbacks
model.update(newValue)
model.update(() => {
	model.value = newValue
})
const handler = model.updateDecorator(event => {
	model.value = event.target.value
})
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

const props = defineProps(/* ... */)
const model = useModel(props)

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

## Definition

```ts
function useModelWrapper<T>(
	props: {
		value?: T;
		modelValue?: T | ExtendedRef<T>;
		['onUpdate:modelValue']: () => void;
	},
	options?: {
		isCollection?: boolean;
	}
): ExtendedRef<T>
```

#### Parameters

- **props**:
	- **`value`**: model defaul value.
	- **`modelValue`**: model value or component model object.
- **options**:
	- **`isCollection`**: Whether the model value may be a collection-like data type (e.g., array, object).

#### Return value

An `ExtendedRef` object.