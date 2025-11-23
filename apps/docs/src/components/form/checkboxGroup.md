---
outline: [2,3]
---

# CheckboxGroup

<script setup>
import { CheckboxGroup, Checkbox } from '@vrgl/vergil/components'
import { useModel } from '@vrgl/vergil'
import { kebabCase } from '@vrgl/vergil/utilities'

const planets = {
    earth: 'Earth',
    reach: 'Reach',
    harvest: 'Harvest'
}

const demo1 = useModel('', { shallow: true })
const demo2 = useModel('', { shallow: true })
const demo3 = useModel('', { shallow: true })
const demo4 = useModel('', { shallow: true })

const options1 = [
    'Option 1',
    ['Option 2', 'Description 2']
]
const options2 = {
    value1: 'Option 1',
    value2: ['Option 2', 'Description 2']
}
const options3 = [{
    id: '123',
    name: 'Abc Def',
    email: 'abc.def@vergil.com'
},{
    id: '456',
    name: 'Uvw Xyz',
    email: 'uvw.xyz@vergil.com'
}]
</script>

<style>
.checkbox-group > .toggle-group-wrapper.list {
    width: 200px;
}
</style>

## Basic Usage

<Demo>
    <CheckboxGroup label="Planets" :options="planets"/>
    <CheckboxGroup label="Ships">
        <Checkbox value="pillarOfAutumn" label="Pillar of Autumn" checked/>
        <Checkbox value="inAmberClad" label="In Amber Clad" theme="user"/>
        <Checkbox value="forwardUntoDawn" label="Forward Unto Dawn"/>
    </CheckboxGroup>
</Demo>

```vue
<script setup>
import { CheckboxGroup, Checkbox } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const planets = useModel([])
const ships = useModel([])

const planetOptions = {
    earth: 'Earth',
    reach: 'Reach',
    harvest: 'Harvest'
}
</script>

<template>
    <!-- options prop: Checkbox value-label pairs -->
    <CheckboxGroup v-model="planets" :options="planetOptions" label="Planets"/>

    <!-- default slot -->
    <CheckboxGroup v-model="ships" label="Ships">
        <Checkbox value="pillarOfAutumn" label="Pillar of Autumn" checked/>
        <Checkbox value="inAmberClad" label="In Amber Clad" theme="user"/>
        <Checkbox value="forwardUntoDawn" label="Forward Unto Dawn"/>
    </CheckboxGroup>
</template>
```

## Props

Props that affect a [`Checkbox`](/components/form/checkbox) component's appereance are passed to (and, therefore, shared between) all underlying `CheckboxGroup`'s  `Checkbox` components.

### Options <Badge><pre>options: (string | [string, string])[] | Record<string, string | [string, string]> = []</pre></Badge>

The `options` prop is an array or (plain) object that provides the required data to define each *option*'s *value*, *label*, and *description*, which correspond to the `value`, `label`, and `description` props of each underlying `Checkbox` components.

Options' values, labels, and descriptions can be automatically inferred from the values of `options` — each denoted as `option` — if they're either a string or an array of strings.

The following table summarizes how option's label and description are inferred from an `option`.

| Type of `option` | `label` | `description` |
| ---------------- | ------- | ------------- |
| `string` | `option` | `undefined` |
| `string[]` | `option[0]` | `option[1]` |

The following table summarizes how an option's value is inferred depending on the type of `options`.

| Type of `options` | `value` |
| ----------------- | ------- |
| `Array` | Same as `label` |
| `object` | The `option`'s `key` |

##### Example. Options Array

```vue
<script setup>
const options = [
    'Option 1',
    ['Option 2', 'Description 2']
]
</script>

<template>
    <CheckboxGroup v-model="checked" :options/>
</template>
```

<Demo>
    <div class="col">
        <div class="row center">
            <CheckboxGroup v-model="demo1" :options="options1" label="Options array"/>
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo1.value }}'</code>
        </div>
    </div>
</Demo>

##### Example. Options Object

```vue
<script setup>
const options = {
    value1: 'Option 1',
    value2: ['Option 2', 'Description 2']
}
</script>

<template>
    <CheckboxGroup v-model="checked" :options/>
</template>
```

<Demo>
    <div class="col">
        <div class="row center">
            <CheckboxGroup v-model="demo2" :options="options2" label="Options object"/>
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo2.value }}'</code>
        </div>
    </div>
</Demo>

:::tip
The `CheckboxGroup` default slot may be used instead to directly pass `Checkbox` components. In such case, the `options` prop is ignored and `CheckboxGroup` group-level props may be overwritten on each `Checkbox` component.
:::

### Option's attributes <Badge><pre>option-[value|label|description]: (string | Function)</pre></Badge>

The `option-value`, `option-label`, and `option-description` props allow to specify custom options' values, labels, and descriptions.

As strings, these props represent an object key. If an `option` is an object, the resulting value/label/description is obtained by accessing that object with the provided key.

```vue
<script setup>
const options = [{
    id: '123',
    name: 'Abc Def',
    email: 'abc.def@vergil.com'
},{
    id: '456',
    name: 'Uvw Xyz',
    email: 'uvw.xyz@vergil.com'
}]
</script>

<template>
    <CheckboxGroup v-model="checked" :options
        option-value="id"    
        option-label="name"
        option-description="email"
    />
</template>
```

<Demo>
    <div class="col">
        <div class="row center">
            <CheckboxGroup v-model="demo3" :options="options3"
                option-value="id"    
                option-label="name"
                option-description="email"
            />    
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo3.value }}'</code>
        </div>
    </div>
</Demo>

As functions, these props are called for each `option`, receive the `option` and its `key` (index for arrays) as arguments, and their return value becomes the resulting value/label/description.

```vue
<script setup>
const options = [{
    id: '123',
    name: 'Abc Def',
    email: 'abc.def@vergil.com'
},{
    id: '456',
    name: 'Uvw Xyz',
    email: 'uvw.xyz@vergil.com'
}]
</script>

<template>
    <CheckboxGroup v-model="checked" :options
        :option-value="option => kebabCase(option.name)"    
        :option-label="option => option.name.split(' ')[0]"
        :option-description="option => `@@mail@@ ${option.email}`"
    />
</template>
```

<Demo>
    <div class="col">
        <div class="row center">
            <CheckboxGroup v-model="demo4" :options="options3"
                :option-value="option => kebabCase(option.name)"    
                :option-label="option => option.name.split(' ')[0]"
                :option-description="option => `@@mail@@ ${option.email}`"/>    
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo4.value }}'</code>
        </div>
    </div>
</Demo>

The following functions are the default values for the `option-value`, `option-label`, and `option-description` props.

```js
function defaultOptionValue(option, key) {
    return typeof key === 'number'
        ? Array.isArray(option) ? option[0] : option
        : key
}
function defaultOptionLabel(option) {
    return Array.isArray(option) ? option[0] : option
}
function defaultOptionDescription {
    return Array.isArray(option) ? option[1] : undefined
}
```

### Options' attributes <Badge><pre>options-attributes: Record<string, unknown> | ((...Args) => Record<string, unknown>)</pre></Badge>

As an object, `options-attributes` contains additional attributes to apply to all underlying `Checkbox` components.

```vue-html
<CheckboxGroup
    :options
    :options-attributes="{
        'data-custom': 'data'
    }"
/>
```

As a function, `options-attributes` is called for each option, receives the computed `Checkbox` component's `key`, `value`, `label`, and `description`, and its return object becomes the additional attributes.

```vue-html
<CheckboxGroup
    :options
    :options-attributes="(key,value,label,description) => ({
        /* additional attributes */
    })
/>
```

### Variant <Badge><pre>variant: ('classic' | 'card' | 'toggle' | 'list') = 'classic'</pre></Badge>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="classic" label="Classic"/>
</Demo>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="card" label="Card"/>
</Demo>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="list" label="List"/>
</Demo>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="toggle" label="Toggle"/>
</Demo>

### Show symbol <Badge><pre>show-symbol: boolean</pre></Badge>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" show-symbol variant="card" label="Card"/>
</Demo>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" show-symbol variant="list" label="List"/>
</Demo>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" show-symbol variant="toggle" label="Toggle"/>
</Demo>

### Direction <Badge><pre>direction: ('column' | 'row') = 'column'</pre></Badge>

<Demo>
    <div class="col center">
        <CheckboxGroup :options="['Label 1', 'Label 2']" direction="column" label="Column"/>
        <CheckboxGroup :options="['Label 1', 'Label 2']" direction="row" label="Row"/>
    </div>
</Demo>

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <CheckboxGroup value="0" :option-value="(_,i) => i" theme="brand" :options="['Brand 1', 'Brand 2']" label="Brand"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" theme="user" :options="['User 1', 'User 2']" label="User"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" theme="ok" :options="['Ok 1', 'Ok 2']" label="Ok"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" theme="info" :options="['Info 1', 'Info 2']" label="Info"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" theme="warn" :options="['Warn 1', 'Warn 2']" label="Warn"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" theme="danger" :options="['Danger 1', 'Danger 2']" label="Danger"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" theme="neutral" :options="['Neutral 1', 'Neutral 2']" label="Neutral"/>
</Demo>

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <CheckboxGroup value="0" :option-value="(_,i) => i" size="xs" :options="['Extra Small 1', 'Extra Small 2']" label="Extra Small"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" size="sm" :options="['Small 1', 'Small 2']" label="Small"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" size="md" :options="['Medium 1', 'Medium 2']" label="Medium"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" size="lg" :options="['Large 1', 'Large 2']" label="Large"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" size="xl" :options="['Extra Large 1', 'Extra Large 2']" label="Extra Large"/>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'full'</pre></Badge>

<Demo>
    <CheckboxGroup value="0" :option-value="(_,i) => i" radius="none" :options="['None 1', 'None 2']" label="None"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" radius="sm" :options="['Small 1', 'Small 2']" label="Small"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" radius="md" :options="['Medium 1', 'Medium 2']" label="Medium"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" radius="lg" :options="['Large 1', 'Large 2']" label="Large"/>
    <CheckboxGroup value="0" :option-value="(_,i) => i" radius="full" :options="['Full 1', 'Full 2']" label="Full"/>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['XS Compact 1', 'XS Compact 2']" label="XS Compact" size="xs" spacing="compact"/>
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['XS Default 1', 'XS Default 2']" label="XS Default" size="xs"/>
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['XS Expanded 1', 'XS Expanded 2']" label="XS Expanded" size="xs" spacing="expanded"/>
        </div>
        <div class="row center">
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['SM Compact 1', 'SM Compact 2']" label="SM Compact" size="sm" spacing="compact"/>
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['SM Default 1', 'SM Default 2']" label="SM Default" size="sm"/>
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['SM Expanded 1', 'SM Expanded 2']" label="SM Expanded" size="sm" spacing="expanded"/>
        </div>
        <div class="row center">
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['MD Compact 1', 'MD Compact 2']" label="MD Compact" size="md" spacing="compact"/>
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['MD Default 1', 'MD Default 2']" label="MD Default" size="md"/>
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['MD Expanded 1', 'MD Expanded 2']" label="MD Expanded" size="md" spacing="expanded"/>
        </div>
        <div class="row center">
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['LG Compact 1', 'LG Compact 2']" label="LG Compact" size="lg" spacing="compact"/>
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['LG Default 1', 'LG Default 2']" label="LG Default" size="lg"/>
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['LG Expanded 1', 'LG Expanded 2']" label="LG Expanded" size="lg" spacing="expanded"/>
        </div>
        <div class="row center">
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['XL Compact 1', 'XL Compact 2']" label="XL Compact" size="xl" spacing="compact"/>
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['XL Default 1', 'XL Default 2']" label="XL Default" size="xl"/>
            <CheckboxGroup value="0" :option-value="(_,i) => i" :options="['XL Expanded 1', 'XL Expanded 2']" label="XL Expanded" size="xl" spacing="expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <CheckboxGroup value="Disabled 1" :options="['Disabled 1', 'Disabled 2']" label="Disabled" disabled/>
</Demo>

## Elements

| element | tag | description |
| ---- | ---- | ------- |
| `options` | <code class="vp-code-nowrap"><div.toggle-group-wrapper></code> | Wrapper of underlying `Checkbox` components. |

### Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field checkbox-group">
        <Anatomy tag="div" classes="form-field-label-wrapper">
            <Anatomy tag="label" classes="form-field-label"/>
            <Anatomy tag="span" classes="form-field-hint"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-description"/>
        <Anatomy tag="div" classes="toggle-group-wrapper">
            <Anatomy tag='slot name="default"'>
                <Anatomy tag='Checkbox v-for="(text,value) in options"'/>
            </Anatomy>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
    </Anatomy>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `array \| string` | `[]` |
| `options` | `(string \| [string, string])[] \| Record<string, string \| [string, string]>` | `[]` |
| `optionValue` | `string \| ((option: unknown, key: string \| number) => string)` | |
| `optionLabel` | `string \| ((option: unknown, key: string \| number) => string)` | |
| `optionDescription` | `string \| ((option: unknown, key: string \| number) => string)` | |
| `optionsAttributes` | `Record<string, unknown> \| ((key: string \| number, value: string, label: string, description: string) => Record<string, unknown>)` | |
| `variant` | `'classic' \| 'card' \| 'list' \| 'toggle'` | `'classic'` |
| `showSymbol` | `boolean` | |
| `direction` | `'column' \| 'row'` | `'column'` |
| `disabled` | `boolean` | |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| `showErrros` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `validator` | `Function` | |
| `eagerValidation` | `boolean` | |
| `elements` | `object` | |

### Configuration options

The `CheckboxGroup` is configured through the `Checkbox` configuration options.