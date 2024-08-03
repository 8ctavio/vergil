---
outline: [2,3]
---

# Introduction

<script setup>
import { InputText } from '@8ctavio/vergil/components'
</script>

## Component model

Every Vergil form field component is associated with a component model created by the `useModel` composable. See [`useModel`](/composables/useModel) to learn about component models.

## Form field props

All Vergil form field components accept the following props.

### Value <Badge type="tip"><pre>value: T</pre></Badge> <Badge type="warning">only if <pre>modelValue</pre> prop is unset</Badge>

The component's initial value. This prop is ignored if the `model-value` prop is passed.

:::tip
Consult each form field component's API reference for its model value type and default value.
:::

### Model value <Badge type="tip"><pre>model-value: ExtendedRef\<T\> = useModel(props.value)</pre></Badge>

```vue
<script>
const model = useModel(/* initial value */)
</script>

<template>
    <FormFieldComponent :model-value="model"/>
    <!-- or -->
    <FormFieldComponent v-model="model"/>
</template>
```

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