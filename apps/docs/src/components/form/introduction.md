---
outline: [2,3]
---

# Form Components

<script setup>
import { InputText } from '@8ctavio/vergil/components'
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

Most Vergil form field components, except from the `Calendar`, `Checkbox`, and `Radio` components, have certain props in common. Most notably, the `value` prop may be used to set a component's initial value when `v-model` is not used.

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