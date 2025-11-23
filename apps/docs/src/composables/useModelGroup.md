---
outline: [2,3]
---

# `useModelGroup`

> Creates a collection of component models.

:::tip
Before proceeding with `useModelGroup`, learn first about the [`useModel`](/composables/useModel) composable.
:::

## Usage

```vue
<script setup>
import { useModelGroup } from '@vrgl/vergil'

const modelGroup = useModelGroup({
	username: { value: '' },
	password: { value: '' }
})
</script>

<template>
	<InputText v-model="modelGroup.username"/>
	<InputText v-model="modelGroup.password" type="password"/>
</template>
```

## Description

The `useModelGroup` composable creates an object of component models that allows to perform bulk operations with them; it accepts two parameters: `fields` and `validator`.

The `fields` parameter expects an object whose own enumerable string-keyed properties are mapped into the `useModelGroup`'s created object as model objects with the same property names. The `fields` property values must be *model specification objects* which are internally used to create corresponding models with the [`useModel`](/composables/useModel) composable; a model specification object's `value` property and the rest of the properties are used, respectively, as the `useModel`'s `value` and `options` parameters. Therefore, in general, an specification object of the form `{ value, ...options }` is transformed into the model `useModel(value, options)`.

```js
useModelGroup({
	model: { value, ...options } // ↦ useModel(value, options)
})
```

The `validator` parameter is a function, similar to that of a model, but here used to validate a [model group's payload](#modelgroup-getpayload) (see [Model group validation](#model-group-validation)).

### Nested model groups

A model group may be nested into another model group. The `useModelGroup`'s `fields` parameter, however, does not directly accept `useModelGroup`-returned objects. In order to nest a model group, a `fields` property value must be an object returned by the `useModelGroup.nested` method. This method's parameters are the same as the `useModelGroup`'s, but returns an special object internally handled and used to create a corresponding model group object.

```js
const group = useModelGroup({
	foo: { /* ... */ },
	bar: useModelGroup.nested({
		baz: { /* ... */ },
	})
})

console.log(isModel(group.foo))			// true
console.log(isModelGroup(group.bar))    // true
console.log(isModel(group.bar.baz))		// true
```

### Model group validation

The `useModelGroup` composable accepts as a second argument a `validator` function to validate a [model group's payload](#modelgroup-getpayload), and which is invoked by the [`validate`](#modelgroup-validate) method after all group descendants are validated.

An `useModelGroup`'s `validator` function accepts three parameters:

- `payload`: The model group's `payload` to validate.
- `error`: A function to register validation errors; it receives two arguments: `path` and `message`, where `path` is the model group's dot-notation path string to the nested model on which to register the error, and `message` is the error message string.
- `isValid`: A function to determine if a nested model has collected any errors up to that moment. It receives as a single argument a model group's dot-notation path string to the model to inspect.

To illustrate, consider the example below. If `testFoo` returns `true`, the `group.foo` model will have a new error registered. On the other hand, the `group.bar.baz` model is further validated only if it has had no errors registered (e.g., in the model's validator).

```js
const group = useModelGroup({
	foo: { /* ... */ },
	bar: useModelGroup.nested({
		baz: { /* ... */ },
	})
}, groupValidator)

function groupValidator(payload, error, isValid) {
    if (testFoo(payload.foo)) {
        error('foo', 'Error Foo')
    }
    if (isValid('bar.baz') && testBaz(payload.bar.baz)) {
        error('bar.baz', 'Error Bar-Baz')
    }
}
```

:::warning
Model group's nested model values should not be mutated inside that model group's validator.
:::

### `modelGroup.reset`

The `reset` method recursively resets all model group's models.

### `modelGroup.getPayload`

The `getPayload` method creates and returns a model group's *payload*, which is an object of the same structure as the model group's, but whose own property values store either the model-values of the corresponding model group's models, or the payloads of the corresponding nested model groups.

```js
const group = useModelGroup({
	foo: { value: 1 },
	bar: useModelGroup.nested({
		baz: { value: 2 },
	})
})

console.log(group.getPayload())
// {
//     foo: 1,
//     bar: { baz: 2 }
// }
```

### `modelGroup.validate`

The `validate` method recursively validates all model group's models. If the model group was created with a `validator` function, it is executed after descendants are validated.

By default, `validate` returns a boolean indicating whether all model group's descendant models are valid, i.e., none have any errors.

In addition, `validate` accepts an `includePayload` boolean parameter that defaults to `false`. When `includePayload` is set to `true`, a two-element array is returned instead, where the first element is the normally returned, validation result boolean, and the second element is the [model group's payload](#modelgroup-getpayload).

```js
const isValid = modelGroup.validate()
// or...
const [isValid, payload] = modelGroup.validate(true)
```

### `modelGroup.clear`

The `clear` method recursively clears errors of all model group's models.

### `modelGroup.error`

The `error` property is a trackable, readonly accessor property that returns a boolean indicating whether any model group's nested model has errors.

### `modelGroup.forErrors`

The `forErrors` method allows to recursively iterate over all model errors in a model group. It receives as its first argument a `callback` function executed for each nested model with errors. The callback receives four arguments: 

- `errors`: the current model's errors array,
- `field`: the property name the current model is stored at in its owner model group object,
- `path`: a dot-separated property name list that represents the current model's location or path within its root model group object, and
- `model`: the current model object.

Additionally, `forErrors` accepts as a second argument a `filter` function to exclude models from the iteration. This function is called for both model and model group objects, and receives four arguments:

- `actions`: An object whose properties should be returned by `filter` to handle how to filter the current model or model group; available properties are `SKIP`, `ACCEPT`, `ACCEPT_CHILDREN`, and `ACCEPT_DESCENDANTS` (detailed below),
- `path`: the current model or model group's path from its root model group object as a dot-separated property name list,
- `isGroup`: a boolean indicating whether the value at the given path is a model group object, and
- `value`: the current model or model group object.

The type of object passed to, and the value returned by the `filter` function determine how a model or model group is filtered. If a model is received, either `actions.SKIP` or `actions.ACCEPT` should be returned to respectively skip or include a model in the `forErrors` iteration. On the other hand, when `filter` is passed a model group object, multiple descendant models may be affected by the returned `actions` property:

- `SKIP`: All model group's descendant models are excluded from the iteration (this implies that no model group's nested object is further passed to `filter`).
- `ACCEPT`: All model group's child objects continue to be passed to `filter`. 
- `ACCEPT_CHILDREN`: All model group's child models are included in the iteration (only child model groups continue to be passed to `filter`).
- `ACCEPT_DESCENDANTS`: All model group's descendant models are included in the iteration (no model group's descendant object is further passed to `filter`).

:::tip
When `forErrors` is called, `errors` refs of models included in the iteration can be tracked by effects.
:::

## Definition

```ts
function useModelGroup(
    fields: ModelGroupFields,
    validator?: ModelGroupValidator
): ModelGroup

function useModelGroup.nested(
    fields: ModelGroupFields,
    validator?: ModelGroupValidator
): ModelGroupSpec

type ModelGroupFields = {
    [Key: string]: ModelSpec | (ModelGroupFields & ModelGroupInternal)
}

type ModelGroupValidator = (
    payload: Record<string, unknown>,
    error: (path: string, msg: string) => void,
    isValid: (path: string) => boolean
) => void

type ModelGroup<F extends ModelGroupFields> = {
    reset(): void
    getPayload(): ModelGroupPayload
    validate(includePayload?: boolean): boolean | [boolean, ModelGroupPayload]
    clear(): void
    get error(): boolean
    forErrors(
        callback: (
            errors: string[],
            field: string,
            path: string,
            model: Model
        ) => void,
        filter: (
            actions: FilterActions,
            path: string,
            isGroup: boolean,
            value: Model | ModelGroup
        ) => FilterActions[keyof FilterActions]
    ): void
} & {
    [K in keyof F]: Model | ModelGroup;
}

type ModelGroupPayload = Record<string, unknown>

interface ModelSpec<T> extends ModelOptions<any> {
    value: T;
    formLabel?: string;
}

type ModelGroupSpec<F extends ModelGroupFields> = F & ModelGroupInternal

type ModelGroupInternal = {
    readonly __modelGroup: true;
    readonly __validator: ModelGroupValidator;
}

type FilterActions = {
    SKIP: false;
    ACCEPT: true;
    ACCEPT_CHILDREN: 1;
    ACCEPT_DESCENDANTS: 2;
}
```