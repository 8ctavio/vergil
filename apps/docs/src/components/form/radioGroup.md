---
outline: [2,3]
---

# RadioGroup

<script setup>
import { RadioGroup, Radio } from '@8ctavio/vergil/components'
import { useModel, kebabCase } from '@8ctavio/vergil'

const demo1 = useModel('')
const demo2 = useModel('')
const demo3 = useModel('')
const demo4 = useModel('')
</script>

## Basic Usage

```vue
<script setup>
import { RadioGroup, Radio } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const vehicle = useModel('')
const armor = useModel('mark-iv')
</script>

<template>
    <!-- options prop: Radio value-label pairs -->
    <RadioGroup v-model="vehicle" name="vehicles" label="Vehicles"
        :options="{
            mongoose: 'Mongoose',
            warthog: 'Warthog',
            scorpion: 'Scorpion'
        }"/>

    <!-- default slot -->
    <RadioGroup v-model="armor" name="armor" label="Armor">
        <Radio value="mark-iv" label="Mark IV"/>
        <Radio value="mark-v" label="Mark V" theme="user"/>
        <Radio value="mark-vi" label="Mark VI"/>
    </RadioGroup>
</template>
```
<Demo>
    <RadioGroup name="vehicles" label="Vehicles"
        :options="{
            mongoose: 'Mongoose',
            warthog: 'Warthog',
            scorpion: 'Scorpion'
        }"/>
    <RadioGroup value="mark-iv" name="armor" label="Armor">
        <Radio value="mark-iv" label="Mark IV"/>
        <Radio value="mark-v" label="Mark V" theme="user"/>
        <Radio value="mark-vi" label="Mark VI"/>
    </RadioGroup>
</Demo>

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

```vue-html
<RadioGroup
    v-model="checked"
    :options="[
        'Option 1',
        ['Option 2', 'Description 2']
    ]"
/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <RadioGroup
                v-model="demo1"
                label="Options array"
                :options="[
                    'Option 1',
                    ['Option 2', 'Description 2']
                ]"/>    
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo1.value }}'</code>
        </div>
    </div>
</Demo>

##### Example. Options Object

```vue-html
<RadioGroup
    v-model="checked"
    :options="{
        value1: 'Option 1',
        value2: ['Option 2', 'Description 2']
    }"
/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <RadioGroup
                v-model="demo2"
                label="Options object"
                :options="{
                    value1: 'Option 1',
                    value2: ['Option 2', 'Description 2']
                }"/>    
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo2.value }}'</code>
        </div>
    </div>
</Demo>

:::tip
The `RadioGroup` default slot may be used instead to directly pass `Radio` components. In such case, the `options` prop is ignored and `RadioGroup` group-level props may be overwritten on each `Radio` component.
:::

### Option's attributes <Badge><pre>option-[value|label|description]: (string | function)</pre></Badge>

The `option-value`, `option-label`, and `option-description` props allow to specify custom options' values, labels, and descriptions.

As strings, these props represent an object key. If an `option` is an object, the resulting value/label/description is obtained by accessing that object with the provided key.

```vue-html
<RadioGroup
    v-model="checked"
    :options="[{
        id: '123',
        name: 'Abc Def',
        email: 'abd.def@vergil.com'
    },{
        id: '456',
        name: 'Uvw Xyz',
        email: 'uvw.xyz@vergil.com'
    }]"
    option-value="id"    
    option-label="name"
    option-description="email"
/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <RadioGroup
                v-model="demo3"
                :options="[{
                    id: '123',
                    name: 'Abc Def',
                    email: 'abd.def@vergil.com'
                },{
                    id: '456',
                    name: 'Uvw Xyz',
                    email: 'uvw.xyz@vergil.com'
                }]"
                option-value="id"    
                option-label="name"
                option-description="email"/>    
        </div>
        <div class="row center">
            <code>checked.value === '{{ demo3.value }}'</code>
        </div>
    </div>
</Demo>

:::tip NOTE
If `options` is an object, `option-value` cannot be used as an object key.
:::

As functions, these props are called for each `option`, receive the `option` as a single argument, and their return value becomes the resulting value/label/description.

```vue-html
<RadioGroup
    v-model="checked"
    :options="[{
        id: '123',
        name: 'Abc Def',
        email: 'abd.def@vergil.com'
    },{
        id: '456',
        name: 'Uvw Xyz',
        email: 'uvw.xyz@vergil.com'
    }]"
    :option-value="option => kebabCase(option.name)"    
    :option-label="option => option.name.split(' ')[0]"
    :option-description="option => `@@mail@@ ${option.email}`"
/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <RadioGroup
                v-model="demo4"
                :options="[{
                    id: '123',
                    name: 'Abc Def',
                    email: 'abd.def@vergil.com'
                },{
                    id: '456',
                    name: 'Uvw Xyz',
                    email: 'uvw.xyz@vergil.com'
                }]"
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
function defaultOptionValue(option) {
    return Array.isArray(option) ? option[0] : option
}
function defaultOptionLabel(option) {
    return Array.isArray(option) ? option[0] : option
}
function defaultOptionDescription {
    return Array.isArray(option) ? option[1] : undefined
}
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
    <RadioGroup value="0" theme="brand" name="theme-brand" :options="['Brand 1', 'Brand 2']" label="Brand"/>
    <RadioGroup value="0" theme="user" name="theme-user" :options="['User 1', 'User 2']" label="User"/>
    <RadioGroup value="0" theme="ok" name="theme-ok" :options="['Ok 1', 'Ok 2']" label="Ok"/>
    <RadioGroup value="0" theme="info" name="theme-info" :options="['Info 1', 'Info 2']" label="Info"/>
    <RadioGroup value="0" theme="warn" name="theme-warn" :options="['Warn 1', 'Warn 2']" label="Warn"/>
    <RadioGroup value="0" theme="danger" name="theme-danger" :options="['Danger 1', 'Danger 2']" label="Danger"/>
    <RadioGroup value="0" theme="neutral" name="theme-neutral" :options="['Neutral 1', 'Neutral 2']" label="Neutral"/>
</Demo>

### Size <Badge><pre>size: ('sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <RadioGroup value="0" size="sm" name="size-sm" :options="['Small 1', 'Small 2']" label="Small"/>
    <RadioGroup value="0" size="md" name="size-md" :options="['Medium 1', 'Medium 2']" label="Medium"/>
    <RadioGroup value="0" size="lg" name="size-lg" :options="['Large 1', 'Large 2']" label="Large"/>
    <RadioGroup value="0" size="xl" name="size-xl" :options="['Extra Large 1', 'Extra Large 2']" label="Extra Large"/>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'full'</pre></Badge>

<Demo>
    <RadioGroup value="0" radius="none" name="radius-none" :options="['None 1', 'None 2']" label="None"/>
    <RadioGroup value="0" radius="sm" name="radius-sm" :options="['Small 1', 'Small 2']" label="Small"/>
    <RadioGroup value="0" radius="md" name="radius-md" :options="['Medium 1', 'Medium 2']" label="Medium"/>
    <RadioGroup value="0" radius="lg" name="radius-lg" :options="['Large 1', 'Large 2']" label="Large"/>
    <RadioGroup value="0" radius="full" name="radius-full" :options="['Full 1', 'Full 2']" label="Full"/>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <RadioGroup value="0" name="sm-compact" :options="['SM Compact 1', 'SM Compact 2']" label="SM Compact" size="sm" spacing="compact"/>
            <RadioGroup value="0" name="sm-default" :options="['SM Default 1', 'SM Default 2']" label="SM Default" size="sm"/>
            <RadioGroup value="0" name="sm-expanded" :options="['SM Expanded 1', 'SM Expanded 2']" label="SM Expanded" size="sm" spacing="expanded"/>
        </div>
        <div class="row center">
            <RadioGroup value="0" name="md-compact" :options="['MD Compact 1', 'MD Compact 2']" label="MD Compact" size="md" spacing="compact"/>
            <RadioGroup value="0" name="md-default" :options="['MD Default 1', 'MD Default 2']" label="MD Default" size="md"/>
            <RadioGroup value="0" name="md-expanded" :options="['MD Expanded 1', 'MD Expanded 2']" label="MD Expanded" size="md" spacing="expanded"/>
        </div>
        <div class="row center">
            <RadioGroup value="0" name="lg-compact" :options="['LG Compact 1', 'LG Compact 2']" label="LG Compact" size="lg" spacing="compact"/>
            <RadioGroup value="0" name="lg-default" :options="['LG Default 1', 'LG Default 2']" label="LG Default" size="lg"/>
            <RadioGroup value="0" name="lg-expanded" :options="['LG Expanded 1', 'LG Expanded 2']" label="LG Expanded" size="lg" spacing="expanded"/>
        </div>
        <div class="row center">
            <RadioGroup value="0" name="xl-compact" :options="['XL Compact 1', 'XL Compact 2']" label="XL Compact" size="xl" spacing="compact"/>
            <RadioGroup value="0" name="xl-default" :options="['XL Default 1', 'XL Default 2']" label="XL Default" size="xl"/>
            <RadioGroup value="0" name="xl-expanded" :options="['XL Expanded 1', 'XL Expanded 2']" label="XL Expanded" size="xl" spacing="expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <RadioGroup value="0" :options="['Disabled', 'Disabled']" label="Disabled" disabled/>
</Demo>

### Untabbable <Badge><pre>untabbable: boolean</pre></Badge>

Makes underlying `Radio` components untabbable (with `tabindex="-1"`).

```vue-html
<RadioGroup :options="['Option']" untabbable/>
```

<Demo>
    <RadioGroup :options="['Option']" untabbable/>
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
| `variant` | `'classic' \| 'card' \| 'list' \| 'toggle'` | `'classic'` |
| `showSymbol` | `boolean` | |
| `direction` | `'column' \| 'row'` | `'column'` |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'full'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `disabled` | `boolean` | |
| `untabbable` | `boolean` | |

### Configuration options

The `RadioGroup` is configured through the `Radio` configuration options.

## Styling

### Anatomy

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