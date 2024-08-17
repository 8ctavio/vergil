---
outline: [2,3]
---

# RadioGroup <Badge><pre>.radio-group</pre></Badge>

<script setup>
import { RadioGroup, Radio } from '@8ctavio/vergil/components'
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

### Options <Badge><pre>options: object</pre></Badge>

The `options` key-value pairs correspond to the `Radio` components' `value` and `label`, respectively.

```vue
<RadioGroup :options="{ value1: 'Label 1', value2: 'Label 2' }"/>
```

The `options` values may also be string arrays whose first two elements correspond to the `Radio`'s `label` and `description`, respectively.

```vue
<RadioGroup :options="{ value: ['Label', 'Description'] }"/>
```

<Demo>
    <RadioGroup name="options"
        :options="{
            value1: ['Label 1', 'Description 1'],
            value2: ['Label 2', 'Description 2'],
        }"/>
</Demo>

All other props are passed to (and, therefore, shared between) the `RadioGroup` underlying `Radio` components.

The `RadioGroup` default slot may be used instead to directly pass `Radio` components. In such case, the `options` prop is ignored and `RadioGroup` group-level props may be overwritten on each `Radio` component.

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

<style>
    .fixed-width{
        width: 150px;
    }
</style>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `string` | `''` |
| `options` | `object` | |
| `name` | `string` | |
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

The following `RadioGroup` props' default values can be overwritten under the `radioGroup` root-level [configuration option](/configuration).

| `radioGroup.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `theme` | ✅ |
| `size` | ✅ |
| `radius` | |
| `spacing` | ✅ |

## Styling

### Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field radio-group">
        <Anatomy tag="div" classes="form-field-label-wrapper">
            <Anatomy tag="label" classes="form-field-label"/>
            <Anatomy tag="span" classes="form-field-hint"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-description"/>
        <Anatomy tag="div" classes="radio-group-wrapper">
            <Anatomy tag="slot #default">
                <Anatomy tag='Radio v-for="(label,value) in options"'/>
            </Anatomy>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
    </Anatomy>
</Demo>