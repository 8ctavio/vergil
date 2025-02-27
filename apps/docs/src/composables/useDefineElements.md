---
outline: [2,3]
---

# `useDefineElements`

> Defines component's exposed element property names and creates corresponding shallowRefs to reference exposed HTML elements.

## Usage

```vue
<script setup>
import { useDefineElements } from '@8ctavio/vergil'

defineProps({
	elements: Object
})

const elements = useDefineElements(['root', 'input'])
onMounted(() => {
	console.log(elements.root) // HTMLDivElement
	console.log(elements.input) // HTMLInputElement
})
</script>

<template>
	<!-- Reference exposed elements with `ref` attribute -->
	<div :ref="elements.refs.root">
		<input :ref="elements.refs.input"/>
	</div>
</template>
```

## Description

The `useDefineElements` composable allows to define and expose component's HTML element references which can be consumed through an *`elements`* object created by [`useElements`](/composables/useElements).

A component implementing `useDefineModel` should be provided with an `elements` object either through the `elements` prop or a component model (see [`useDefineModel`](/composables/useDefineModel)). Thus, the `elements` prop should be properly defined.

`useDefineElements` receives as its only argument a `keys` string array whose elements represent property names through which `elements` objects may access corresponding exposed HTML elements. Internally, shallowRefs (with `null` value) are created as required for each element to expose, and should be directly provided through the `ref` attribute to reference corresponding HTML element objects. For this purpose, `useDefineElements` creates and returns an [`extendedReactive`](/composables/extendedReactive) object where shallowRefs are defined with their associated property name and unwrapped; thus, shallowRef objects are accessible through the extendedReactive's `refs` property (see [extendedReactive's additional features](/composables/extendedReactive#additional-features)).

```js
const elements = useDefineElements(['input'])
elements.refs.input // input's shallowRef object
elements.input // unwrapped input's shallowRef object
```

:::warning
- `useElements` and `useDefineElements` are designed for component's exposed element property names to be always the same. Therefore, the `keys` array provided to `useDefineExposed` in a given component implementation should always include the same property names.
- Component elements may only be exposed once per component instance with `useDefineElements`.
:::

## Definition

```ts
function useDefineElements(keys: string[]): void
```

#### Parameters

- **`keys`**: String array whose elements represent exposed element property names.