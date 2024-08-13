---
outline: [2,3]
---

# Switch <Badge><pre>.switch</pre></Badge>

<script setup>
import { Switch } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const isOn = useModel(false)
const skulls = useModel([])
</script>

## Basic Usage

```vue
<script setup>
import { Switch } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const isOn = useModel(false)
const skulls = useModel([])
</script>

<template>
    <!-- Single boolean value -->
    <Switch v-model="isOn" label="Switch"/>

    <!-- Multiple values -->
    <Switch v-model="skulls" value="iron" label="Iron"/>
    <Switch v-model="skulls" value="blind" label="Blind"/>
    <Switch v-model="skulls" value="iwhbyd" label="IWHBYD "/>
</template>
```
<Demo>
    <div class="col">
        <div class="row center">
            <Switch v-model="isOn" label="Switch"/>
        </div>
        <div class="row center">
            <code>isOn.value === {{ isOn.value }}</code>
        </div>
        <div class="row center">
            <Switch v-model="skulls" value="iron" label="Iron"/>
            <Switch v-model="skulls" value="blind" label="Blind"/>
            <Switch v-model="skulls" value="iwhbyd" label="IWHBYD "/>
        </div>
        <div class="row center">
            <code>skulls.value === {{ skulls.value }}</code>
        </div>
    </div>
</Demo>

## Attributes

### Value

In order to bind multiple switches to a component model, all switches must include the `value` attribute and the model's value must be an array. The model's array value includes the `value` of selected switches. Were the model's value not an array, `value` has no effect.

:::tip
The `checked` prop may be used to provide an initial value without a model.
:::

## Props

### On-state value <Badge><pre>value-on: (boolean | string) = true</pre></Badge>

Alias for Vue's [`true-value`](https://vuejs.org/guide/essentials/forms.html#checkbox-1) prop.

### Off-state value <Badge><pre>value-off: (boolean | string) = false</pre></Badge>

Alias for Vue's [`false-value`](https://vuejs.org/guide/essentials/forms.html#checkbox-1) prop. If `value-on` is a string, `value-off` defaults to an empty string (`''`).

### Labels <Badge><pre>label-on: string</pre></Badge> <Badge><pre>label-off: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

```vue
<Switch label-on="On" label-off="Off"/>
```

<Demo>
    <Switch label-on="On" label-off="Off"/>
</Demo>

### Even track <Badge><pre>even-track: boolean</pre></Badge>

```vue
<Switch label-on="Yearly" label-off="Monthly" even-track/>
```

<Demo>
    <Switch label-on="Yearly" label-off="Monthly" even-track/>
</Demo>

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <Switch theme="brand" checked/>
    <Switch theme="user" checked/>
    <Switch theme="ok" checked/>
    <Switch theme="info" checked/>
    <Switch theme="warn" checked/>
    <Switch theme="danger" checked/>
    <Switch theme="neutral" checked/>
</Demo>

### Size <Badge><pre>size: ('sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <Switch size="sm" label-on="On" label-off="Off"/>
    <Switch size="md" label-on="On" label-off="Off"/>
    <Switch size="lg" label-on="On" label-off="Off"/>
    <Switch size="xl" label-on="On" label-off="Off"/>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'full'</pre></Badge>

<Demo>
    <Switch label-on="On" label-off="Off" radius="none"/>
    <Switch label-on="On" label-off="Off" radius="sm"/>
    <Switch label-on="On" label-off="Off" radius="md"/>
    <Switch label-on="On" label-off="Off" radius="lg"/>
    <Switch label-on="On" label-off="Off" radius="full"/>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <Switch label-on="On" label-off="Off" size="sm" spacing="compact" placeholder="Compact"/>
            <Switch label-on="On" label-off="Off" size="sm" placeholder="Default"/>
            <Switch label-on="On" label-off="Off" size="sm" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Switch label-on="On" label-off="Off" size="md" spacing="compact" placeholder="Compact"/>
            <Switch label-on="On" label-off="Off" size="md" placeholder="Default"/>
            <Switch label-on="On" label-off="Off" size="md" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Switch label-on="On" label-off="Off" size="lg" spacing="compact" placeholder="Compact"/>
            <Switch label-on="On" label-off="Off" size="lg" placeholder="Default"/>
            <Switch label-on="On" label-off="Off" size="lg" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Switch label-on="On" label-off="Off" size="xl" spacing="compact" placeholder="Compact"/>
            <Switch label-on="On" label-off="Off" size="xl" placeholder="Default"/>
            <Switch label-on="On" label-off="Off" size="xl" spacing="expanded" placeholder="Expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <Switch disabled checked/>
    <Switch disabled label-on="On" label-off="Off"/>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `checked` | `boolean` | |
| `value-on` | `boolean \| string` | `true` |
| `value-off` | `boolean \| string` | `false` |
| `label-on` | `string` | |
| `label-off` | `string` | |
| `even-track` | `boolean` | |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'full'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `disabled` | `boolean` | |

### Configuration options

The following `Switch` props' default values can be overwritten under the `switch` root-level [configuration option](/configuration).

| `switch.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `theme` | ✅ |
| `size` | ✅ |
| `radius` | |
| `spacing` | ✅ |

## Styling

### Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field switch">
        <Anatomy tag="div" classes="form-field-label-wrapper">
            <Anatomy tag="label" classes="form-field-label"/>
            <Anatomy tag="span" classes="form-field-hint"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-description"/>
        <Anatomy tag="div" classes="switch-button">
            <Anatomy tag='input[type="checkbox"]'/>
            <Anatomy tag='label'/>
            <Anatomy tag="span" classes="switch-track">
                <Anatomy tag="span" classes="switch-circle"/>
            </Anatomy>
            <Anatomy tag='label'/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
    </Anatomy>
</Demo>