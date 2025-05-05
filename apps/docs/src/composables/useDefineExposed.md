---
outline: [2,3]
---

# `useDefineExposed`

> Defines component's exposed data. 

## Usage

```vue
<script setup lang="ts">
import { useDefineExposed, type Exposed } from '@8ctavio/vergil'

defineProps({
	exposed: Object as PropType<Exposed>
})

useDefineExposed({
	// Properties to expose
})
</script>
```

## Description

The `useDefineExposed` composable allows to define a component's exposed data which could be consumed with [`useExposed`](/composables/useExposed).

A component implementing `useDefineExpose` should be provided with an `exposed` object returned by `useExposed` either through an `exposed` prop or a component model (see [`useDefineModel`](/composables/useDefineModel)). Therefore, the `exposed` prop should be properly defined.

The `useDefineExposed` composable receives as its only argument a `source` object whose own enumerable, string-keyed properties are to be exposed. Component data may only be exposed once per component instance with `useDefineExposed`. When a component instance is unmounted, its exposed data properties are set to `undefined`.

:::warning
`useExposed` and `useDefineExposed` are designed for component's exposed property names to be always the same. Therefore, the `source` object provided to `useDefineExposed` in a given component implementation should always include the same property names.
:::

## Definition

```ts
function useDefineExposed(source: Record<string, unknown>): void
```

#### Parameters

- **`source`**: Plain object whose own enumerable, string-keyed properties are to be exposed.