---
outline: [2,3]
---

# Form Components

<script setup>
import { InputText, CheckboxGroup } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'

const planetOptions = {
    earth: 'Earth',
    reach: 'Reach',
    harvest: 'Harvest'
}
const planets = useModel(['earth'], {
    validator(value, error) {
        if(!value.includes('reach')) {
            error('Remember Reach')
        }
    }
})
planets.validate()
</script>

## Component models

Every Vergil Form Field Component (FFC) supports establishing a bidirectional component-model bond with the `v-model` directive. However, altough directly passing a regular ref to `v-model` is supported, Vergil FFCs are designed and implemented to support *component models* created by the [`useModel`](/composables/useModel) composable (see [`useDefineModel`](/composables/useDefineModel)). Therefore, the recommended approach to use Vergil FFC's `v-model` is to directly pass a model object.

```vue
<script setup>
const model = useModel(/* initial value */)
</script>

<template>
    <FormFieldComponent v-model="model"/>
</template>
```

:::tip
Vergil FFCs whose model-values are objects support models with shallowRefs.

```js
useModel([], { shallow: true })
```
:::

:::warning
shallowRefs directly provided through `v-model` are not fully supported by FFCs whose model-values are objects; models should be provided instead:

```diff
<script setup>
- const model = shallowRef(someObject)
+ const model = useModel(someObject, { shallow: true })
</script>

<template>
    <Component v-model="model"/>
</template>
```
:::


Nevertheless, `v-model` is not required for FFCs to properly work. To the contrary, when a model is absent, FFCs create one internally and may still receive initial values and validator functions in compliance with the `useModel`'s API:

- Different FFCs may define their own method to receive initial model-values, but typically, a `value` prop is supported for this purpose (see [Shared props](#shared-props)).
- On the other hand, to support [model-value validation](/composables/useModel#validation-and-error-handling), all FFCs support a `validator` prop through which a `validator` function may be provided.
    ```vue
    <FormFieldComponent :validator="() => { /* ... */ }"/>
    ```

:::tip NOTE
These alternative methods to provide model values and validators are only resorted to if a model is not provided with `v-model`.
:::

### Model (group) validation

FFCs may be considered to have an associated *validation target*. This validation target is the FFC's model if it does not belong to a [ModelGroup](/functions/modelgroup) or its ModelGroup ancestors do not have [group validators](/functions/modelgroup#model-group-validation). Otherwise, the validation target is the model's eldest ModelGroup ancestor with a group validator.

FFCs automatically validate their validation targets upon user interaction. In general, the events that trigger validation are different for each FFC.

By default, FFCs automatic validation is performed in a *lazy* or *optimistic* manner, that is, only while the validation target has errors. Therefore, validation should first be performed programmatically to reveal possible validation errors.

Conversely, FFCs support an `eager-validation` boolean prop that allows them to perform validation in an *eager* or *pessimistic* manner such that validation is always performed upon user interaction, regardless of whether errors have been previously encountered.

### Debounced validation

Some FFCs' automatic validation may be debounced for certain interactions. Moreover, validation debouncing may be lazy or eager (see [`debounce`](/functions/utilities#debounce)) depending on the event that triggered it. Typically, lazy debouncing is performed for `'input'` events, while eager debouncing is used for `'change'` or `'keydown'`-with-`'Enter'`-key events.

FFCs that perform lazy or eager validation debouncing accept, respectively, `validation-delay` and `validation-cooldown` props to adjust the corresponding, underlying debounced function's [`minWait`](/functions/utilities#debounce) parameter.

## Exposed data

Vergil provides an alternative API to consume component exposed data with the [`useExposed`](/composables/useExposed) and [`useElements`](/composables/useElements) composables (see also [`model.exposed`](/composables/useModel#model-exposed)). Vergil form field components support this API and their documentation include exposed data and elements, if any (see [`useDefineExposed`](/composables/useDefineExposed) and [`useDefineElements`](/composables/useDefineElements)).

```vue
<script setup>
const exposed = useExposed()
const elements = useElements()

onMounted(() => {
    // Access component's exposed data/elements
    console.log(exposed.someProperty)
    console.log(elements.someHTMLElement)
})
</script>

<template>
    <FormFieldComponent :exposed :elements/>
</template>
```

## Shared props

Most Vergil form field components, except for the `Calendar`, `Checkbox`, and `Radio` components, have certain props in common. Most notably, the `value` prop may be used to set a component's initial value when `v-model` is not used.

:::tip
- The `value` prop is ignored if the `model-value` prop is passed.
- The `value` prop's type and default value may be consulted in the API reference for each Vergil form field component.
:::

Other shared props are `label`, `hint`, `description`, and `help`, which simply display text around a component; thus, they are of type `string` and support [MiniMarkup](/mini-markup).

For illustration, a component using the beforementioned shared props is displayed below.

```vue-html
<InputText
    value="Initial Value"
    label="Label"
    hint="Hint"
    description="Description"
    help="Help"
/>
```

<Demo>
    <InputText
        value="Initial Value"
        label="Label"
        hint="Hint"
        description="Description"
        help="Help"
    />
</Demo>

In addition, these components also accept a `show-errors` boolean prop to display a model's validation errors.

```vue
<CheckboxGroup show-errors :validator="(value, error) => {
    if(!value.includes('reach')) {
        error('Remember Reach')
    }
}">
```

<Demo>
    <CheckboxGroup v-model="planets" :options="planetOptions" show-errors direction="row"/>
</Demo>