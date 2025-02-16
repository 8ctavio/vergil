---
outline: [2,3]
---

# RadioGroup

<script setup>
import { RadioGroup, Radio } from '@8ctavio/vergil/components'
import { ref } from 'vue'
import { kebabCase } from '@8ctavio/vergil/utilities'

const vehicles = {
    mongoose: 'Mongoose',
    warthog: 'Warthog',
    scorpion: 'Scorpion'
}

const demo1 = ref('')
const demo2 = ref('')
const demo3 = ref('')
const demo4 = ref('')

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

## Basic Usage

<Demo>
    <RadioGroup name="vehicles" :options="vehicles" label="Vehicles"/>
    <RadioGroup value="mark-iv" name="armor" label="Armor">
        <Radio value="mark-iv" label="Mark IV"/>
        <Radio value="mark-v" label="Mark V" theme="user"/>
        <Radio value="mark-vi" label="Mark VI"/>
    </RadioGroup>
</Demo>

```vue
<script setup>
import { RadioGroup, Radio } from '@8ctavio/vergil/components'
import { ref } from 'vue'

const vehicle = ref('')
const armor = ref('mark-iv')

const vehicleOptions = {
    mongoose: 'Mongoose',
    warthog: 'Warthog',
    scorpion: 'Scorpion'
}
</script>

<template>
    <!-- options prop: Radio value-label pairs -->
    <RadioGroup v-model="vehicle" :options="vehicleOptions" name="vehicles" label="Vehicles"/>

    <!-- default slot -->
    <RadioGroup v-model="armor" name="armor" label="Armor">
        <Radio value="mark-iv" label="Mark IV"/>
        <Radio value="mark-v" label="Mark V" theme="user"/>
        <Radio value="mark-vi" label="Mark VI"/>
    </RadioGroup>
</template>
```

## Props

Props that affect a [`Radio`](/components/form/radio) component's appereance are passed to (and, therefore, shared between) all underlying `RadioGroup`'s  `Radio` components.

### Options <Badge><pre>options: (array | object) = []</pre></Badge>

The `options` prop is an array or (plain) object that provides the required data to define each *option*'s *value*, *label*, and *description*, which correspond to the `value`, `label`, and `description` props of each underlying `Radio` components.

Options' values, labels, and descriptions can be automatically inferred from the values of `options` — each denoted as `option` — if they're either a string or an array of strings.

The following table summarizes how option's label and description are inferred from an `option`.

| Type of `option` | `string` | `string[]` |
| ---------------- | -------- | ---------- |
| **`label`** | `option` | `option[0]` |
| **`description`** | `undefined` | `option[1]` |

The following table summarizes how an option's value is inferred depending on the type of `options`.

| Type of `options` | `array` | `object` |
| ----------------- | ------- | -------- |
| **`value`** | Same as `label` | The `option`'s `key` |

##### Example. Options Array

```vue
<script setup>
const options = [
    'Option 1',
    ['Option 2', 'Description 2']
]
</script>

<template>
    <RadioGroup v-model="checked" :options/>
</template>
```

<Demo>
    <div class="col">
        <div class="row center">
            <RadioGroup v-model="demo1" :options="options1" label="Options array"/>    
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo1 }}'</code>
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
    <RadioGroup v-model="checked" :options/>
</template>
```

<Demo>
    <div class="col">
        <div class="row center">
            <RadioGroup v-model="demo2" :options="options2" label="Options object"/>    
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo2 }}'</code>
        </div>
    </div>
</Demo>

:::tip
The `RadioGroup` default slot may be used instead to directly pass `Radio` components. In such case, the `options` prop is ignored and `RadioGroup` group-level props may be overwritten on each `Radio` component.
:::

### Option's attributes <Badge><pre>option-[value|label|description]: (string | function)</pre></Badge>

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
    <RadioGroup v-model="checked" :options
        option-value="id"    
        option-label="name"
        option-description="email"
    />
</template>
```

<Demo>
    <div class="col">
        <div class="row center">
            <RadioGroup v-model="demo3" :options="options3"
                option-value="id"    
                option-label="name"
                option-description="email"
            />    
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo3 }}'</code>
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
    <RadioGroup v-model="checked" :options
        :option-value="option => kebabCase(option.name)"    
        :option-label="option => option.name.split(' ')[0]"
        :option-description="option => `@@mail@@ ${option.email}`"
    />
</template>
```

<Demo>
    <div class="col">
        <div class="row center">
            <RadioGroup v-model="demo4" :options="options3"
                :option-value="option => kebabCase(option.name)"    
                :option-label="option => option.name.split(' ')[0]"
                :option-description="option => `@@mail@@ ${option.email}`"
            />    
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo4 }}'</code>
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

### Options' attributes <Badge><pre>options-attributes: ('object' | 'function')</pre></Badge>

As an object, `options-attributes` contains additional attributes to apply to all underlying `Radio` components.

```vue-html
<RadioGroup
    :options
    :options-attributes="{
        'data-custom': 'data'
    }"
/>
```

As a function, `options-attributes` is called for each option, receives the computed `Radio` component's `key`, `value`, `label`, and `description`, and its return object becomes the additional attributes.

```vue-html
<RadioGroup
    :options
    :options-attributes="(key,value,label,description) => ({
        /* additional attributes */
    })
/>
```

### Variant <Badge><pre>variant: ('classic' | 'card' | 'toggle' | 'list') = 'classic'</pre></Badge>

<Demo>
    <RadioGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="classic" name="classic" label="Classic"/>
</Demo>

<Demo>
    <RadioGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="card" name="card" label="Card"/>
</Demo>

<Demo>
    <RadioGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="list" name="list" label="List"/>
</Demo>

<Demo>
    <RadioGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="toggle" name="toggle" label="Toggle"/>
</Demo>

<style scoped>
.toggle-group-wrapper.list {
    width: 250px;
}
</style>

### Show symbol <Badge><pre>show-symbol: boolean</pre></Badge>

<Demo>
    <RadioGroup :options="['Label 1', 'Label 2', 'Label 3']" show-symbol variant="card" name="symbol-card" label="Card"/>
</Demo>

<Demo>
    <RadioGroup :options="['Label 1', 'Label 2', 'Label 3']" show-symbol variant="list" name="symbol-list" label="List"/>
</Demo>

<Demo>
    <RadioGroup :options="['Label 1', 'Label 2', 'Label 3']" show-symbol variant="toggle" name="symbol-toggle" label="Toggle"/>
</Demo>

<style scoped>
.radio-group > :deep(.toggle-group-wrapper.list) {
    width: 200px;
}
</style>

### Direction <Badge><pre>direction: ('column' | 'row') = 'column'</pre></Badge>

<Demo>
    <div class="col center">
        <RadioGroup :options="['Label 1', 'Label 2']" name="dir-col" direction="column" label="Column"/>
        <RadioGroup :options="['Label 1', 'Label 2']" name="dir-row" direction="row" label="Row"/>
    </div>
</Demo>

### Name <Badge><pre>name: string</pre></Badge>

The `name` prop is used as the `name` attribute for all the `RadioGroup`'s `Radio` members.

```vue
<RadioGroup name="group-name"/>
```

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <RadioGroup value="0" :option-value="(_,i) => i" theme="brand" name="theme-brand" :options="['Brand 1', 'Brand 2']" label="Brand"/>
    <RadioGroup value="0" :option-value="(_,i) => i" theme="user" name="theme-user" :options="['User 1', 'User 2']" label="User"/>
    <RadioGroup value="0" :option-value="(_,i) => i" theme="ok" name="theme-ok" :options="['Ok 1', 'Ok 2']" label="Ok"/>
    <RadioGroup value="0" :option-value="(_,i) => i" theme="info" name="theme-info" :options="['Info 1', 'Info 2']" label="Info"/>
    <RadioGroup value="0" :option-value="(_,i) => i" theme="warn" name="theme-warn" :options="['Warn 1', 'Warn 2']" label="Warn"/>
    <RadioGroup value="0" :option-value="(_,i) => i" theme="danger" name="theme-danger" :options="['Danger 1', 'Danger 2']" label="Danger"/>
    <RadioGroup value="0" :option-value="(_,i) => i" theme="neutral" name="theme-neutral" :options="['Neutral 1', 'Neutral 2']" label="Neutral"/>
</Demo>

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <RadioGroup value="0" :option-value="(_,i) => i" size="xs" name="size-xs" :options="['Extra Small 1', 'Extra Small 2']" label="Extra Small"/>
    <RadioGroup value="0" :option-value="(_,i) => i" size="sm" name="size-sm" :options="['Small 1', 'Small 2']" label="Small"/>
    <RadioGroup value="0" :option-value="(_,i) => i" size="md" name="size-md" :options="['Medium 1', 'Medium 2']" label="Medium"/>
    <RadioGroup value="0" :option-value="(_,i) => i" size="lg" name="size-lg" :options="['Large 1', 'Large 2']" label="Large"/>
    <RadioGroup value="0" :option-value="(_,i) => i" size="xl" name="size-xl" :options="['Extra Large 1', 'Extra Large 2']" label="Extra Large"/>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'full'</pre></Badge>

<Demo>
    <RadioGroup value="0" :option-value="(_,i) => i" radius="none" name="radius-none" :options="['None 1', 'None 2']" label="None"/>
    <RadioGroup value="0" :option-value="(_,i) => i" radius="sm" name="radius-sm" :options="['Small 1', 'Small 2']" label="Small"/>
    <RadioGroup value="0" :option-value="(_,i) => i" radius="md" name="radius-md" :options="['Medium 1', 'Medium 2']" label="Medium"/>
    <RadioGroup value="0" :option-value="(_,i) => i" radius="lg" name="radius-lg" :options="['Large 1', 'Large 2']" label="Large"/>
    <RadioGroup value="0" :option-value="(_,i) => i" radius="full" name="radius-full" :options="['Full 1', 'Full 2']" label="Full"/>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <RadioGroup value="0" :option-value="(_,i) => i" name="xs-compact" :options="['XS Compact 1', 'XS Compact 2']" label="XS Compact" size="xs" spacing="compact"/>
            <RadioGroup value="0" :option-value="(_,i) => i" name="xs-default" :options="['XS Default 1', 'XS Default 2']" label="XS Default" size="xs"/>
            <RadioGroup value="0" :option-value="(_,i) => i" name="xs-expanded" :options="['XS Expanded 1', 'XS Expanded 2']" label="XS Expanded" size="xs" spacing="expanded"/>
        </div>
        <div class="row center">
            <RadioGroup value="0" :option-value="(_,i) => i" name="sm-compact" :options="['SM Compact 1', 'SM Compact 2']" label="SM Compact" size="sm" spacing="compact"/>
            <RadioGroup value="0" :option-value="(_,i) => i" name="sm-default" :options="['SM Default 1', 'SM Default 2']" label="SM Default" size="sm"/>
            <RadioGroup value="0" :option-value="(_,i) => i" name="sm-expanded" :options="['SM Expanded 1', 'SM Expanded 2']" label="SM Expanded" size="sm" spacing="expanded"/>
        </div>
        <div class="row center">
            <RadioGroup value="0" :option-value="(_,i) => i" name="md-compact" :options="['MD Compact 1', 'MD Compact 2']" label="MD Compact" size="md" spacing="compact"/>
            <RadioGroup value="0" :option-value="(_,i) => i" name="md-default" :options="['MD Default 1', 'MD Default 2']" label="MD Default" size="md"/>
            <RadioGroup value="0" :option-value="(_,i) => i" name="md-expanded" :options="['MD Expanded 1', 'MD Expanded 2']" label="MD Expanded" size="md" spacing="expanded"/>
        </div>
        <div class="row center">
            <RadioGroup value="0" :option-value="(_,i) => i" name="lg-compact" :options="['LG Compact 1', 'LG Compact 2']" label="LG Compact" size="lg" spacing="compact"/>
            <RadioGroup value="0" :option-value="(_,i) => i" name="lg-default" :options="['LG Default 1', 'LG Default 2']" label="LG Default" size="lg"/>
            <RadioGroup value="0" :option-value="(_,i) => i" name="lg-expanded" :options="['LG Expanded 1', 'LG Expanded 2']" label="LG Expanded" size="lg" spacing="expanded"/>
        </div>
        <div class="row center">
            <RadioGroup value="0" :option-value="(_,i) => i" name="xl-compact" :options="['XL Compact 1', 'XL Compact 2']" label="XL Compact" size="xl" spacing="compact"/>
            <RadioGroup value="0" :option-value="(_,i) => i" name="xl-default" :options="['XL Default 1', 'XL Default 2']" label="XL Default" size="xl"/>
            <RadioGroup value="0" :option-value="(_,i) => i" name="xl-expanded" :options="['XL Expanded 1', 'XL Expanded 2']" label="XL Expanded" size="xl" spacing="expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <RadioGroup value="Disabled 1" :options="['Disabled 1', 'Disabled 2']" label="Disabled" disabled/>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `string` | `''` |
| `name` | `string` | |
| `options` | `array \| object` | `[]` |
| `optionValue` | `string \| function` | |
| `optionLabel` | `string \| function` | |
| `optionDescription` | `string \| function` | |
| `optionsAttributes` | `object \| function` | |
| `variant` | `'classic' \| 'card' \| 'list' \| 'toggle'` | `'classic'` |
| `showSymbol` | `boolean` | |
| `direction` | `'column' \| 'row'` | `'column'` |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| `disabled` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'full'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |

### Configuration options

The `RadioGroup` is configured through the `Radio` configuration options.

## Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field radio-group">
        <Anatomy tag="div" classes="form-field-label-wrapper">
            <Anatomy tag="label" classes="form-field-label"/>
            <Anatomy tag="span" classes="form-field-hint"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-description"/>
        <Anatomy tag="div" classes="toggle-group-wrapper">
            <Anatomy tag='slot name="default"'>
                <Anatomy tag='Radio v-for="(text,value) in options"'/>
            </Anatomy>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
    </Anatomy>
</Demo>