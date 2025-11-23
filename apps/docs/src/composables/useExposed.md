---
outline: [2,3]
---

# `useExposed`

> Creates a read-only, shallow-ref-unwrapping object to consume component exposed data. 

## Usage

```vue
<script setup>
import { useExposed } from '@vrgl/vergil'

// Create `exposed` object
const exposed = useExposed()

onMounted(() => {
	// Access component's exposed data
	console.log(exposed.someProperty)
	exposed.someMethod()
})
</script>

<template>
	<!-- Provide `exposed` for component to expose data -->
	<Component :exposed/>
</template>
```

## Description

The conventional method to consume components' exposed data in Vue involves using the `useTemplateRef` composable and the special `ref` attribute. Vergil, however, provides an analogous API for this same purpose, which relies instead on the `useExposed` composable and an `exposed` component prop.

The `useExposed` composable receives no arguments and simply returns an `exposed` empty, read-only, shallow-ref-unwrapping object. This `exposed` object is designed to be provided through an `exposed` prop to a component that supports it. The component will then make data it chooses to expose available through the provided `exposed` object.

:::warning
Exposed data is defined in the `setup` function of the component exposing it, and undefined when the component is unmounted.
:::

:::tip
Vergil form components that expose data support the `exposed` prop. The documentation for these components include the shape of the exposed data. See the [introduction](/components/form/introduction) to Vergil's form components to learn about their capabilities and features.
:::

In addition, an `exposed` object may also be provided to a component through a *model* created by the [`useModel`](/composables/useModel) composable (see [`model.exposed`](/composables/useModel#model-exposed)). A model has precedence over the `exposed` prop when component data is exposed, meaning that if a component receives an `exposed` object through both a model and the `exposed` prop, exposed data is made available only for the model's `exposed` object.

The main advantage of `useExposed` over `useTemplateRef` to consume component exposed data is that `.value` notation is not required with `useExposed`, while exposed reactive property access is still properly tracked for effects to be triggered after a component has been set up or unmounted.

```vue
<script setup>
const show = ref(true)
const exposed = useExposed()
watch(() => exposed.someUnwrappedRef, () => {
	// Properly triggered when component is set up and unmounted
})
</script>

<template>
	<button @click="show = !show">toggle component</button>
	<Component v-if="show" :exposed/>
</template>
```

On the other hand, the main drawback of `useExposed` is that an `exposed` object should only be provided to a single component type (e.g., only to `InputText` components), while a template ref may hold exposed data of different components during its lifecycle. However, overall, it seems that it would be a good practice to use a single exposed-data-object for a single component instance. 

## Definition

```ts
type Exposed = Readonly<Record<string, any>>

function useExposed(): Exposed
```

#### Return value

A read-only, shallow-ref-unwrapping object to be provided through an `exposed` prop to a component with proper `useExposed` support.