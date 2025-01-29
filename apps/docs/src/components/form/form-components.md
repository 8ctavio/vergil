---
outline: [2,3]
---

# Form Components

<script setup>
import { InputText } from '@8ctavio/vergil/components'
</script>

## Form component `v-model`

Every Vergil form field component supports the `v-model` directive. However, the `model-value` prop may also be passed a component model object created by the [`useModel`](/composables/useModel) composable.

```vue
<script>
const model = useModel(/* initial value */)
</script>

<template>
    <FormFieldComponent v-model="model"/>
</template>
```

## Shared props

Most Vergil form field components have certain props in common, with the exception of the `Calendar`, `Checkbox`, and `Radio` components. Shared props for other components are shown below.

### Value <Badge type="tip"><pre>value: T</pre></Badge> <Badge type="warning">only if <pre>modelValue</pre> prop is unset</Badge>

The component's initial value. This prop is ignored if the `model-value` prop is passed.

:::tip
Consult each form field component's API reference for its model value type and default value.
:::

### Label <Badge><pre>label: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

```vue
<FormFieldComponent label="Label"/>
```

### Hint <Badge><pre>hint: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

```vue
<FormFieldComponent hint="Hint"/>
```

### Description <Badge><pre>description: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

```vue
<FormFieldComponent description="Description"/>
```

### Help <Badge><pre>help: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

```vue
<FormFieldComponent help="Help"/>
```

### Example

Visualization of some of the previous props in a form field component.

```vue
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