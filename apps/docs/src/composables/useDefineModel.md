---
outline: [2,4]
---

# `useDefineModel`

> Defines a bidirectional model-value bond between a (provided) model and a component, and creates a model wrapper with additional utilities to separately handle internal and external model value mutations.

## Usage

```vue
<script setup lang="ts">
import { useDefineModel } from '@vrgl/vergil'
import type { ModelValueProp, ModelValidatorProp } from '@vrgl/vergil'

type ModelValue = /* ... */

defineProps({
	modelValue: {
		type: [/* ModelValueType */, Object] as ModelValueProp<ModelValue>,
		default: defaultModelValue
	},
	['onUpdate:modelValue']: Function,
	validator: Function as ModelValidatorProp<ModelValue>
})

const model = useDefineModel<
	ModelValue,
	IncludeExposed,
	CaptureExposed,
	IncludeElements,
	CaptureElements
>()
</script>
```

## Description

The `useDefineModel` composable is analogous to the `defineModel` macro in that it creates an object to conveniently interact with component props to establish a model-component bond through the model's value.

However, `useDefineModel` is primarly designed to support *component model objects* created by the [`useModel`](/composables/useModel) composable and received through the `model-value` prop. Thus, the recommended approach to bind a model with a component implementing `useDefineModel` is by providing a model object via the `v-model` directive. Nevertheless, `useDefineModel` still supports for regular refs to instead be provided through `v-model`.

The `useDefineModel` composable accepts as a single argument an `options` object (see [Parameters](#parameters)) and returns a *wrapped* version of a provided model, which has access to the regular model properties and includes additional methods to [separately handle internal and external model value updates](#handle-internal-and-external-model-value-updates). If, however, a model is not provided, `useDefineModel` creates one internally with a `validator` function taken from the component's `validator` prop to support [model-value validation](/composables/useModel#validation-and-error-handling).

:::warning
A model wrapper returned by `useDefineModel` is still an [extendedRef](/reactivity/extendedRef). See [Difference with ref](/reactivity/extendedRef#difference-with-ref) to learn the main pragmatic differences with regular refs.
:::

:::tip NOTE
Components implementing `useDefineModel` need to manually define the `modelValue`, `onUpdate:modelValue`, and `validator` props.
:::

:::info
For brevity, custom components that implement `useDefineModel` to support bidirectional model-value binding will be referred to as **Form Field Components (FFC)**.
:::

### Nesting models

Some FFC implementations may require to share their underlying model object with other nested FFCs. In order to further pass models down an FFC tree, model wrappers created by `useDefineModel` should be directly provided through the `model-value` prop of child FFCs. `useDefineModel` is able to properly identify and handle provided model wrappers.

```vue
<!-- Root -->
<script setup>
defineProps(/* ... */)
const model = useDefineModel()
</script>

<template>
	<!-- Directly provide model wrapper -->
	<Nested :model-value="model"/>
</template>
```

### Handle internal and external model value updates

The `useDefineModel`'s API allows to separately handle internal and external model value updates. Here, internal and external refer to *where*, in relation to an FFC's context/scope, is a model-value update performed. Three types of model value updates are considered:

- **Local**: Updates performed *within* an FFC's own scope.
- **Internal**: Updates performed in any *nested* FFC.
- **External**: Updates performed anywhere *outside* an FFC's scope; in particular: in ancestor, sibling, or sibling's descendant scopes.

:::tip
To illustrate, consider the following component tree where all components have access to the same model. The update type `Reference` would perceive when some component updates the model value is hinted in parenthesis.

<Demo>
	<Anatomy tag="App (external)">
		<Anatomy tag="Root (external)">
			<Anatomy tag="Reference (local)">
				<Anatomy tag="Nested (internal)"/>
			</Anatomy>
			<Anatomy tag="Sibling (external)">
				<Anatomy tag="Nested (external)"/>
			</Anatomy>
		</Anatomy>
	</Anatomy>
</Demo>
:::

The following two requirements must be met for FFCs to properly identify model value update types:

1. In order to share an FFC's underlying model with other child FFCs, child components must be provided with the parent component's model wrapper created by `useDefineModel` (see [Nesting models](#nesting-models)).
2. The `model.update` or `model.updateDecorator` methods included in an FFC's model wrapper must be used to perform local model value updates.

:::tip
In general, an FFC's local model value updates should always be performed with `model.update` or `model.updateDecorator` to ensure proper behavior.
:::

The `model.update` method receives as a single argument a value to assign to the model's value. However, sometimes multiple model-value assignments (or write operations) need to be performed consecutively. When this is the case, `model.update` may receive instead a callback function where (synchronous) model value updates can be normally performed and which is immediately invoked. Similarly, the `model.updateDecorator` method receives a callback where the model value can be normally updated; but instead of immediately executing the callback, a new function that wraps the callback is created.

```js
model.update(newValue)
model.update(() => {
	model.value = newValue
})
const eventHandler = model.updateDecorator(event => {
	model.value = event.target.value
})
```

Then, if these requisites are satisfied, the `model.onInternalUpdate` and `model.onExternalUpdate` methods included in model wrappers can be used to handle internal and external model value updates, respectively. Both of these methods register callbacks to be executed when a corresponding model update is detected. They accept two parameters: the callback function and an `options` object. The configuration options they have in common are `immediate`, `once`, and `flush`, which all share the same possible values and behavior as the corresponding watcher options. Both methods return a function to unregister the provided callback. On the other hand, the arguments received by their registered callbacks are slightly different, and `model.onExternalUpdate` accepts an additional configuration option.

#### `onInternalUpdate`

Callbacks registered with `onInternalUpdate` have the same signature as regular watch callbacks:

```js
model.onInternalUpdate((newModelValue, oldModelValue, onCleanup) => {
	/* ... */
})
```

#### `onExternalUpdate`

Callbacks registered with `onExternalUpdate` receive four arguments, the first two being the new and old model values, while `onCleanup` is passed as the fourth argument. An additional `isProgrammatic` boolean is passed as the third argument; it indicates whether the model value update was performed *programmatically*.

Conceptually, a model value update is considered programmatic if it is performed outside an FFC tree, which corresponds to the scope where an FFC is being consumed rather than implemented. Comparatively, model value updates performed anywhere inside an FFC tree may be considered *interactive* in the sense that they (directly or indirectly) originate from user interaction with the rendered template of FFCs.

Once again, the beforementioned requirements must be fulfilled in order for model value updates to be properly identified as programmatic. In practice, model value updates not performed with `model.update` or `model.updateDecorator` will be perceived as programmatic.

```js
model.onExternalUpdate((newModelValue, oldModelValue, isProgrammatic) => {
	/* ... */
})
```

Additionally, `onExternalUpdate` accepts an `onMounted` boolean configuration option. When set to true, the callback's registration and immediate execution are deferred until the FFC is mounted.

### Exposed data

A model's `exposed` and `elements` objects (see [`model.exposed`](/composables/useModel#model-exposed)) are not made available to a model wrapper by default; their inclusion and behavior in a model wrapper can be configured with `useDefineModel` to address three scenarios: forwarding, sharing, and consuming exposed data.

#### Forwarding

When a component with a [nested model](#nesting-models) does not expose data of its own, it could directly expose its nested component's data instead. For this purpose, a model wrapper can *capture* its component's received `exposed` or `elements` objects and *forward* them to its nested component, which in turn exposes its data into the captured objects.

To capture `exposed` and `elements` objects the `useDefineModel`'s `captureExposed` and `captureElements` options should respectively be set to `true`. In practice, captured objects are simply attached to the corresponding model wrapper's `exposed` and `elements` properties.

```vue
<script setup>
defineProps(/* ... */)
const model = useDefineModel({
	captureExposed: true,
	captureElements: true
})
</script>

<template>
	<!-- Forward captured objects (if any) to Nested -->
	<Nested v-model="model"/>
</template>
```

Although `useDefineModel` "attempts" to capture `exposed` and `elements` objects, if none are received (i.e., no exposed data is requested), the `exposed` and `elements` properties will not be attached to the model wrapper.

#### Sharing

When in addition to forwarding `exposed` and `elements` objects, a component requires access to its nested component's exposed data for implementation purposes, `exposed` and `elements` objects can be *shared* when they are captured, and created for internal use when not provided.

To share captured `exposed` and `elements` objects the `useDefineModel`'s `includeExposed` and `includeElements` options should respectively be set to `true`. These options ensure that when no objects are captured, corresponding objects are created and attached to the model wrapper.

```vue
<script setup>
const model = useDefineModel({
	captureExposed: true,
	includeExposed: true,
	captureElements: true,
	includeElements: true
})
onMounted(() => {
	// Exposed data is always available
    console.log(model.exposed.someProperty)
    console.log(model.elements.someHTMLElement)
})
</script>

<template>
	<Nested v-model="model"/>
</template>
```

#### Consuming

When capturing/forwarding is not required, `exposed` and `elements` objects can still be defined separately into model wrappers for them to *consume* nested component's exposed data like a regular model would. With this approach, exposed data definition should be handled by the [`useDefineExposed`](/composables/useDefineExposed)  and [`useDefineElements`](/composables/useDefineElements) composables.

To create `exposed` and `elements` objects to consume exposed data only the `useDefineModel`'s `includeExposed` and `includeElements` options should respectively be set to `true`.

```vue
<script setup>
defineProps(/* ... */)
const model = useDefineModel({
	includeExposed: true,
	includeElements: true
})
onMounted(() => {
	// Exposed data available internally, but independent
	// of external `exposed` and `elements` objects.
    console.log(model.exposed.someProperty)
    console.log(model.elements.someHTMLElement)
})
</script>

<template>
	<Nested :model-value="model"/>
</template>
```

## Definition

```ts
function useDefineModel<T>(options?: DefineModelOptions): ModelWrapper<T>

interface DefineModelOptions {
	includeExposed?: boolean;
	captureExposed?: boolean;
	includeElements?: boolean;
	captureElements?: boolean;
	maybeObject?: boolean;
}

type ModelWrapper<T> = Omit<Model<T>, 'exposed' | 'elements'> & {
	update<F extends Function>(
		callback: F,
		thisArg?: unknown,
		args?: Parameters<F>
	): ReturnType<F>;
	update(v: unknown): void;
	updateDecorator<F extends Function>(fn: F): F;
	onExternalUpdate(
		callback: ExternalModelUpdateCallback<T>,
		options?: Omit<WatchOptions, 'deep'> & { onMounted?: boolean }
	): () => void;
	onInternalUpdate(
		callback: WatchCallback<T>,
		options?: Omit<WatchOptions, 'deep'>
	): () => void;
	handleValidation(eager?: boolean): void;
	useDebouncedValidation(
		minWait: number,
		options?: { eager?: boolean }
	): (eager?: boolean) => void;
	triggerIfShallow(): void;
	exposed?: Exposed;
	elements?: Elements;
}

type ExternalModelUpdateCallback<T> = (
	value: T,
	oldValue: T | undefined,
	isProgrammatic: boolean,
	onCleanup: OnCleanup
) => any;
```

#### Parameters

- **options**:
	- **`includeExposed`/`includeElements`**: Whether to include an `exposed`/`elements` object into the model wrapper. Defaults to `false`.
	- **`captureExposed`/`captureElements`**: Whether to attach to the model wrapper the `exposed`/`elements` object provided to its associated component (either through a model or the `exposed`/`elements` prop). Defaults to `false`.
	- **`maybeObject`**: Whether the model value could be an object. Defaults to `false`.

#### Return value

A model wrapper object. Additional methods include:

- `onExternalUpdate`
- `onInternalUpdate`
- `update`
- `updateDecorator`
- `handleValidation`: Validates its associated *validation target* if it has errors. The validation target is the model's eldest [validating model group](/composables/ModelGroup#model-group-validation), or the model itself if no such group exists. In addition, `handleValidation` accepts a single boolean `eager` parameter that defaults to `false`; when set to `true`, the validation target is validated even if it does not have errors. The following is a simplified representation of this method's implementation.
	```js
	handleValidation(eager = false) {
		if (eager || validationTarget.hasErrors) {
			validationTarget.validate()
		}
	}
	```
	This utility method helps to handle a component's model validation in response to component interaction.
- `useDebouncedValidation`: Creates a method similar to `handleValidation`, but where the validation target's validation is debounced. Receives two parameters, `minWait` and `options`, corresponding to those of the [`debounce`](/utilities#debounce) function. Additionally, the created debounced function's `cancel` method is automatically called when the model's value is validated (with `model.validate`) or model errors are cleared (with `model.clear`).
	```js
	const handleDebouncedValidation = model.useDebouncedValidation(300)
	handleDebouncedValidation() // debounced validation
	```
- `triggerIfShallow`: Triggers the underlying model's `ref` object if shallow. This utility method helps implement components that support models with underlying shallow refs.
	```js
	model.triggerIfShallow()
	// same as
	if (isShallow(model.ref)) {
		triggerRef(model.ref)
	}
	```