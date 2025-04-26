---
outline: [2,3]
---

# `useElements`

> Creates a read-only, shallow-ref-unwrapping object to consume component-exposed HTML elements. 

:::tip
Before proceeding with `useElements`, learn first about the [`useExposed`](/composables/useExposed) composable.
:::

## Usage

```vue
<script setup>
import { useElements } from '@8ctavio/vergil'

// Create `elements` object
const elements = useElements()

onMounted(() => {
	// Access component's exposed elements
	console.log(elements.someHTMLElement)
})
</script>

<template>
	<!-- Provide `elements` for component to expose elements -->
	<Component :elements/>
</template>
```

## Description

Vergil provides a custom API to consume component exposed data (see [useExposed](/composables/useExposed)); but besides component specific variables or methods, with `useElements` it is also possible to exclusively and separately consume component element's `HTMLElement` objects. 

The `useElements` composable receives no arguments and simply returns an `elements` empty, read-only, shallow-ref-unwrapping object. This `elements` object is designed to be provided through an `elements` prop to a component that supports it. The component will then make element refs it chooses to expose available through the provided `elements` object.

:::warning
- Exposed `HTMLElement` objects are only accessible when the corresponding elements are mounted. If an element is accessed while unmounted, `null` is returned instead.
- `elements` should only be provided to a single component type (e.g., only to `InputText` components). Otherwise, conflicts may be encountered since different components could expose a different set of elements.
:::

:::tip
Vergil form components that expose elements support the `elements` prop. The documentation for these components lists exposed elements. See the [introduction](/components/form/introduction) to Vergil's form components to learn about their capabilities and features.
:::

Since reading defined `elements` properties unwraps underlying element refs, reactive effects can properly track exposed element changes.

```js
const exposed = useExposed()
watch(() => exposed.someHTMLElement, el => {
	if (el === null) {
		// Element is unmounted
	} else {
		// Element is mounted
	}
})
```

In addition, an `elements` object may also be provided to a component through a *model* created by the [`useModel`](/composables/useModel) composable (see [`model.elements`](/composables/useModel#model-elements)). A model has precedence over the `elements` prop when component elements are exposed. This implies that if a component receives an `elements` object through both a model and the `elements` prop, elements are made available through the model only.

## Definition

```ts
function useElements(): Elements

type Elements = Readonly<Record<string, HTMLElement | null>>
```

#### Return value

A read-only, shallow-ref-unwrapping object to be provided through an `elements` prop to a component with proper `useElements` support.