---
outline: [2,3]
---

# `useDefineExposed`

> Defines component's exposed data. 

## Usage

```vue
<script setup lang="ts">
import { useDefineExposed } from '@vrgl/vergil'
import type { Exposed } from '@vrgl/vergil'

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

The `useDefineExposed` composable accepts any number of arguments, each representing a `source`, which is an object whose own enumerable, string-keyed properties are to be exposed, or an effect function that returns such object.

When a `source` effect is provided, the properties of its returned object are used to update/patch exposed properties. In addition, a `source` effect may return `null` to reset its exposed properties to `undefined`.

```js
useDefineExposed(() => {
	// Track someRefOrGetter
	const v = toValue(someRefOrGetter)
	// Update exposed properties when someRefOrGetter is triggered
	return v ? useSomething(v) : null
})
```

The previous approach, however, may not always be appropriate since other side-effects could track unwanted dependencies. For more precise control over which dependencies to track, a two-element array with a watch source (or a watch source array) and a callback may be provided instead, which behaves similar to `watch`'s `source` and `callback` parameters, except that the callback should return an object or `null`.

```js
useDefineExpose([someRefOrGetter, v => v ? useSomething(v) : null])
```

When multiple `source`s are provided, `useDefineExposed` exposes the properties of all resolved source objects. Therefore, it is important to ensure sources do not have property keys in common; otherwise, they could be overwritten.

```js
useDefineExposed(
	{ foo, bar },
	() => toValue(someRefOrGetter) ? { baz, qux } : null
)
```

Component data may only be exposed once per component instance with `useDefineExposed`. When a component instance is unmounted, its exposed data properties are set to `undefined`.

:::warning
`useExposed` and `useDefineExposed` are designed for a component's exposed property keys to always be the same. Therefore, each `source` provided to `useDefineExposed` in a given component implementation should always expose the same property keys.
:::

## Definition

```ts
function useDefineExposed<T>(...sources: (
	| object
	| (() => object | null)
	| [WatchSources<T>, DefineExposedCallback<T>]
)[]): void

type DefineExposedCallback<T> = (...args: Parameters<WatchCallback<T, T|undefined>>) => object | null
```

#### Parameters

- **`sources`**: Objects whose own enumerable, string-keyed properties are to be exposed, or effects that return such objects.