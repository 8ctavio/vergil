---
outline: [2,3]
---

# Switch

<script setup>
import { Switch } from '@8ctavio/vergil/components'
import { ref } from 'vue'
const isOn = ref(false)
const skulls = ref([])
</script>

## Basic Usage

<Demo>
    <div class="col">
        <div class="row center">
            <Switch v-model="isOn" label="Switch"/>
        </div>
        <div class="row center">
            <code>isOn.value === {{ isOn }}</code>
        </div>
        <div class="row center">
            <Switch v-model="skulls" value="iron" label="Iron"/>
            <Switch v-model="skulls" value="blind" label="Blind"/>
            <Switch v-model="skulls" value="iwhbyd" label="IWHBYD "/>
        </div>
        <div class="row center">
            <code>skulls.value === {{ skulls }}</code>
        </div>
    </div>
</Demo>

```vue
<script setup>
import { Switch } from '@8ctavio/vergil/components'
import { ref } from 'vue'
const isOn = ref(false)
const skulls = ref([])
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

## Attributes

### Value

In order to bind multiple switches to a component model, all switches must include the `value` attribute and the model's value must be an array. The model's array value includes the `value` of selected switches. Were the model's value not an array, `value` has no effect.

:::tip
The `checked` prop may be used to provide an initial value without a model.
:::

## Props

### On-state value <Badge><pre>value[-on]: (boolean | string) = true</pre></Badge>

The `value-on` prop is the value assigned to the `Switch`'s model value when it gets checked, and the value of the underlying `input[type="checkbox"]` element's `value` attribute.

### Off-state value <Badge><pre>value-off: (boolean | string) = false</pre></Badge>

The `value-off` prop is the value assigned to the `Switch`'s model value when it gets unchecked. If `value-on` is a string, `value-off` defaults to an empty string (`''`).

### Track <Badge><pre>track: ("on" | "off")</pre></Badge>

```vue
<Switch track="off"/>
<Switch track="on"/>
```

<Demo>
    <Switch track="off"/>
    <Switch track="on"/>
</Demo>

### Labels <Badge><pre>label-on: string</pre></Badge> <Badge><pre>label-off: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

```vue
<Switch label-on="On" label-off="Off"/>
```

<Demo>
    <Switch label-on="On" label-off="Off"/>
</Demo>

### Highlight labels <Badge><pre>highlight: boolean</pre></Badge>

```vue
<Switch highlight track="on" label-on="Yearly" label-off="Monthly"/>
```

<Demo>
    <Switch highlight track="on" label-on="Yearly" label-off="Monthly"/>
</Demo>

### Icons <Badge><pre>icon-on: string</pre></Badge> <Badge><pre>icon-off: string</pre></Badge>

```vue
<Switch icon-off="light_mode" icon-on="dark_mode" track="on"/>
```

<Demo>
    <Switch icon-off="light_mode" icon-on="dark_mode" track="on"/>
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

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <Switch size="xs" label-on="On" label-off="Off"/>
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
            <Switch label-on="On" label-off="Off" size="xs" spacing="compact"/>
            <Switch label-on="On" label-off="Off" size="xs"/>
            <Switch label-on="On" label-off="Off" size="xs" spacing="expanded"/>
        </div>
        <div class="row center">
            <Switch label-on="On" label-off="Off" size="sm" spacing="compact"/>
            <Switch label-on="On" label-off="Off" size="sm"/>
            <Switch label-on="On" label-off="Off" size="sm" spacing="expanded"/>
        </div>
        <div class="row center">
            <Switch label-on="On" label-off="Off" size="md" spacing="compact"/>
            <Switch label-on="On" label-off="Off" size="md"/>
            <Switch label-on="On" label-off="Off" size="md" spacing="expanded"/>
        </div>
        <div class="row center">
            <Switch label-on="On" label-off="Off" size="lg" spacing="compact"/>
            <Switch label-on="On" label-off="Off" size="lg"/>
            <Switch label-on="On" label-off="Off" size="lg" spacing="expanded"/>
        </div>
        <div class="row center">
            <Switch label-on="On" label-off="Off" size="xl" spacing="compact"/>
            <Switch label-on="On" label-off="Off" size="xl"/>
            <Switch label-on="On" label-off="Off" size="xl" spacing="expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <Switch disabled checked/>
    <Switch disabled label-on="On" label-off="Off"/>
</Demo>

## Elements

| element | tag | description |
| ---- | ---- | ------- |
| `input` | `<input[type="checkbox"]>` | `Switch`'s underlying input element. |

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
            <Anatomy tag='label' classes="switch-label-off"/>
            <Anatomy tag="span" classes="switch-track">
                <Anatomy tag="span" classes="switch-knob">
                    <Anatomy tag='Icon' classes="icon switch-icon-off"/>
                    <Anatomy tag='Icon' classes="icon switch-icon-on"/>
                </Anatomy>
            </Anatomy>
            <Anatomy tag='label' classes="switch-label-on"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
    </Anatomy>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `checked` | `boolean` | |
| `value` | `boolean \| string` | `undefined` |
| `value-on` | `boolean \| string` | `true` |
| `value-off` | `boolean \| string` | `false` |
| `track` | `'on' \| 'off'` | |
| `label-on` | `string` | |
| `label-off` | `string` | |
| `highlight` | `boolean` | |
| `icon-on` | `string` | |
| `icon-off` | `string` | |
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

`Switch`'s [configuration options](/configuration) allow to overwrite some `Switch` props' default values and may be overwritten under the `switch` root-level configuration option.

| `switch.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ----------------- | ---- | ------- | :------: |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | `'full'` | |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |