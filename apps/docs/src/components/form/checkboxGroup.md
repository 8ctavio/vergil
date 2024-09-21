---
outline: [2,3]
---

# CheckboxGroup

<script setup>
import { CheckboxGroup, Checkbox } from '@8ctavio/vergil/components'
</script>

## Basic Usage

```vue
<script setup>
import { CheckboxGroup, Checkbox } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const planets = useModel([])
const ships = useModel([])
</script>

<template>
    <!-- options prop: Checkbox value-label pairs -->
    <CheckboxGroup v-model="planets" label="Planets"
        :options="{
            earth: 'Earth',
            reach: 'Reach',
            harvest: 'Harvest'
        }"/>

    <!-- default slot -->
    <CheckboxGroup v-model="ships" label="Ships">
        <Checkbox value="pillarOfAutumn" label="Pillar of Autumn"/>
        <Checkbox value="inAmberClad" label="In Amber Clad" theme="user"/>
        <Checkbox value="forwardUntoDawn" label="Forward Unto Dawn"/>
    </CheckboxGroup>
</template>
```
<Demo>
    <CheckboxGroup label="Planets"
        :options="{
            earth: 'Earth',
            reach: 'Reach',
            harvest: 'Harvest'
        }"/>
    <CheckboxGroup label="Ships">
        <Checkbox value="pillarOfAutumn" label="Pillar of Autumn"/>
        <Checkbox value="inAmberClad" label="In Amber Clad" theme="user"/>
        <Checkbox value="forwardUntoDawn" label="Forward Unto Dawn"/>
    </CheckboxGroup>
</Demo>

## Props

### Options <Badge><pre>options: object</pre></Badge>

The `options` key-value pairs correspond to the `Checkbox` components' `value` and `label`, respectively.

```vue
<CheckboxGroup :options="{ value1: 'Label 1', value2: 'Label 2' }"/>
```

The `options` values may also be string arrays whose first two elements correspond to the `Checkbox`'s `label` and `description`, respectively.

```vue
<CheckboxGroup :options="{ value: ['Label', 'Description'] }"/>
```

<Demo>
    <CheckboxGroup
        :options="{
            value1: ['Label 1', 'Description 1'],
            value2: ['Label 2', 'Description 2'],
        }"/>
</Demo>

All other props are passed to (and, therefore, shared between) the `CheckboxGroup` underlying `Checkbox` components.

The `CheckboxGroup` default slot may be used instead to directly pass `Checkbox` components. In such case, the `options` prop is ignored and `CheckboxGroup` group-level props may be overwritten on each `Checkbox` component.

### Variant <Badge><pre>variant: ('classic' | 'card' | 'toggle' | 'list') = 'classic'</pre></Badge>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="classic" label="Classic"/>
</Demo>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="card" label="Card"/>
</Demo>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="toggle" label="Toggle"/>
</Demo>

<Demo>
    <CheckboxGroup :options="['Label 1', 'Label 2', 'Label 3']" variant="list" label="List"/>
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
    <CheckboxGroup :value="[0]" theme="brand" :options="['Brand 1', 'Brand 2']" label="Brand"/>
    <CheckboxGroup :value="[0]" theme="user" :options="['User 1', 'User 2']" label="User"/>
    <CheckboxGroup :value="[0]" theme="ok" :options="['Ok 1', 'Ok 2']" label="Ok"/>
    <CheckboxGroup :value="[0]" theme="info" :options="['Info 1', 'Info 2']" label="Info"/>
    <CheckboxGroup :value="[0]" theme="warn" :options="['Warn 1', 'Warn 2']" label="Warn"/>
    <CheckboxGroup :value="[0]" theme="danger" :options="['Danger 1', 'Danger 2']" label="Danger"/>
    <CheckboxGroup :value="[0]" theme="neutral" :options="['Neutral 1', 'Neutral 2']" label="Neutral"/>
</Demo>

### Size <Badge><pre>size: ('sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <CheckboxGroup :value="[0]" size="sm" :options="['Small 1', 'Small 2']" label="Small"/>
    <CheckboxGroup :value="[0]" size="md" :options="['Medium 1', 'Medium 2']" label="Medium"/>
    <CheckboxGroup :value="[0]" size="lg" :options="['Large 1', 'Large 2']" label="Large"/>
    <CheckboxGroup :value="[0]" size="xl" :options="['Extra Large 1', 'Extra Large 2']" label="Extra Large"/>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'full'</pre></Badge>

<Demo>
    <CheckboxGroup :value="[0]" radius="none" :options="['None 1', 'None 2']" label="None"/>
    <CheckboxGroup :value="[0]" radius="sm" :options="['Small 1', 'Small 2']" label="Small"/>
    <CheckboxGroup :value="[0]" radius="md" :options="['Medium 1', 'Medium 2']" label="Medium"/>
    <CheckboxGroup :value="[0]" radius="lg" :options="['Large 1', 'Large 2']" label="Large"/>
    <CheckboxGroup :value="[0]" radius="full" :options="['Full 1', 'Full 2']" label="Full"/>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <CheckboxGroup :value="[0]" :options="['SM Compact 1', 'SM Compact 2']" label="SM Compact" size="sm" spacing="compact"/>
            <CheckboxGroup :value="[0]" :options="['SM Default 1', 'SM Default 2']" label="SM Default" size="sm"/>
            <CheckboxGroup :value="[0]" :options="['SM Expanded 1', 'SM Expanded 2']" label="SM Expanded" size="sm" spacing="expanded"/>
        </div>
        <div class="row center">
            <CheckboxGroup :value="[0]" :options="['MD Compact 1', 'MD Compact 2']" label="MD Compact" size="md" spacing="compact"/>
            <CheckboxGroup :value="[0]" :options="['MD Default 1', 'MD Default 2']" label="MD Default" size="md"/>
            <CheckboxGroup :value="[0]" :options="['MD Expanded 1', 'MD Expanded 2']" label="MD Expanded" size="md" spacing="expanded"/>
        </div>
        <div class="row center">
            <CheckboxGroup :value="[0]" :options="['LG Compact 1', 'LG Compact 2']" label="LG Compact" size="lg" spacing="compact"/>
            <CheckboxGroup :value="[0]" :options="['LG Default 1', 'LG Default 2']" label="LG Default" size="lg"/>
            <CheckboxGroup :value="[0]" :options="['LG Expanded 1', 'LG Expanded 2']" label="LG Expanded" size="lg" spacing="expanded"/>
        </div>
        <div class="row center">
            <CheckboxGroup :value="[0]" :options="['XL Compact 1', 'XL Compact 2']" label="XL Compact" size="xl" spacing="compact"/>
            <CheckboxGroup :value="[0]" :options="['XL Default 1', 'XL Default 2']" label="XL Default" size="xl"/>
            <CheckboxGroup :value="[0]" :options="['XL Expanded 1', 'XL Expanded 2']" label="XL Expanded" size="xl" spacing="expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <CheckboxGroup :value="[0]" :options="['Disabled', 'Disabled']" label="Disabled" disabled/>
</Demo>

<style>
    .fixed-width{
        width: 150px;
    }
</style>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `array \| string` | `[]` |
| `options` | `object` | |
| `variant` | `'classic' \| 'card' \| 'toggle' \| 'list'` | `'classic'` |
| `direction` | `'column' \| 'row'` | `'column'` |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `disabled` | `boolean` | |

### Configuration options

The `CheckboxGroup` is configured through the `Checkbox` configuration options.

## Styling

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