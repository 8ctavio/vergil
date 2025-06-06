---
outline: [2,3]
---

# Textarea

<script setup>
import { Textarea } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'

const size = useModel('', { shallow: true })
const radius = useModel('', { shallow: true })
const spacing = useModel('', { shallow: true })
</script>

## Basic Usage

<Demo>
    <Textarea label="Textarea"/>
</Demo>

```vue
<script setup>
import { Textarea } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const text = useModel('')
</script>

<template>
    <Textarea v-model="text" label="Textarea"/>
</template>
```

## Props

### Placeholder <Badge type="tip"><pre>placeholder: string</pre></Badge>

```vue
<Textarea placeholder="Textarea"/>
```

<Demo>
    <Textarea placeholder="Textarea"/>
</Demo>

### Max <Badge type="tip"><pre>max: string</pre></Badge>

The maximum string length that can be entered into the textarea.

```vue
<Textarea max="10" placeholder="Up to 10 characters"/>
```

<Demo>
    <Textarea max="10" placeholder="Up to 10 characters"/>
</Demo>

### Text align <Badge type="tip"><pre>text-align: ('left' | 'center' | 'right') = 'left'</pre></Badge>

```vue
<Textarea text-align="left" placeholder="Left"/>
<Textarea text-align="center" placeholder="Center"/>
<Textarea text-align="right" placeholder="Right"/>
```

<Demo>
    <div class="col center">
        <Textarea text-align="left" placeholder="Left"/>
        <Textarea text-align="center" placeholder="Center"/>
        <Textarea text-align="right" placeholder="Right"/>
    </div>
</Demo>

### Rows <Badge type="tip"><pre>rows: string</pre></Badge>

```vue
<Textarea rows="5" placeholder="Five rows"/>
```

<Demo>
    <Textarea rows="5" placeholder="Five rows"/>
</Demo>

### Resize <Badge type="tip"><pre>resize: boolean</pre></Badge>

```vue
<Textarea resize placeholder="Resizable"/>
```

<Demo>
    <Textarea resize placeholder="Resizable"/>
</Demo>

### Float label <Badge type="tip"><pre>float-label: boolean</pre></Badge>

```vue
<Textarea label="Textarea" float-label/>
```

<Demo>
    <Textarea label="Textarea" float-label/>
</Demo>

:::tip NOTE
`float-label` only works if the `placeholder` and `description` props are unset.
:::

### Underline <Badge type="tip"><pre>underline: boolean</pre></Badge>

<Demo>
    <Textarea underline placeholder="Underline"/>
</Demo>

### Theme <Badge type="tip"><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <Textarea underline theme="brand" placeholder="Brand"/>
    <Textarea underline theme="user" placeholder="User"/>
    <Textarea underline theme="ok" placeholder="Ok"/>
    <Textarea underline theme="info" placeholder="Info"/>
    <Textarea underline theme="warn" placeholder="Warn"/>
    <Textarea underline theme="danger" placeholder="Danger"/>
    <Textarea underline theme="neutral" placeholder="Neutral"/>
</Demo>

### Size <Badge type="tip"><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <div class="col center">
        <Textarea v-model="size" size="xs" class="fixed-width" placeholder="Extra Small"/>
        <Textarea v-model="size" size="sm" class="fixed-width" placeholder="Small"/>
        <Textarea v-model="size" size="md" class="fixed-width" placeholder="Medium"/>
        <Textarea v-model="size" size="lg" class="fixed-width" placeholder="Large"/>
        <Textarea v-model="size" size="xl" class="fixed-width" placeholder="Extra Large"/>
    </div>
</Demo>

### Radius <Badge type="tip"><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="col center w-initial">
        <Textarea v-model="radius" class="fixed-width" placeholder="None" radius="none"/>
        <Textarea v-model="radius" class="fixed-width" placeholder="Small" radius="sm"/>
        <Textarea v-model="radius" class="fixed-width" placeholder="Medium" radius="md"/>
        <Textarea v-model="radius" class="fixed-width" placeholder="Large" radius="lg"/>
        <Textarea v-model="radius" class="fixed-width" placeholder="Full" radius="full"/>
    </div>
    <div class="col center w-initial">
        <Textarea v-model="radius" class="fixed-width" underline placeholder="None" radius="none"/>
        <Textarea v-model="radius" class="fixed-width" underline placeholder="Small" radius="sm"/>
        <Textarea v-model="radius" class="fixed-width" underline placeholder="Medium" radius="md"/>
        <Textarea v-model="radius" class="fixed-width" underline placeholder="Large" radius="lg"/>
        <Textarea v-model="radius" class="fixed-width" underline placeholder="Full" radius="full"/>
    </div>
</Demo>

### Spacing <Badge type="tip"><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <Textarea v-model="spacing" class="fixed-width" size="xs" spacing="compact" placeholder="Compact"/>
            <Textarea v-model="spacing" class="fixed-width" size="xs" placeholder="Default"/>
            <Textarea v-model="spacing" class="fixed-width" size="xs" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Textarea v-model="spacing" class="fixed-width" size="sm" spacing="compact" placeholder="Compact"/>
            <Textarea v-model="spacing" class="fixed-width" size="sm" placeholder="Default"/>
            <Textarea v-model="spacing" class="fixed-width" size="sm" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Textarea v-model="spacing" class="fixed-width" size="md" spacing="compact" placeholder="Compact"/>
            <Textarea v-model="spacing" class="fixed-width" size="md" placeholder="Default"/>
            <Textarea v-model="spacing" class="fixed-width" size="md" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Textarea v-model="spacing" class="fixed-width" size="lg" spacing="compact" placeholder="Compact"/>
            <Textarea v-model="spacing" class="fixed-width" size="lg" placeholder="Default"/>
            <Textarea v-model="spacing" class="fixed-width" size="lg" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Textarea v-model="spacing" class="fixed-width" size="xl" spacing="compact" placeholder="Compact"/>
            <Textarea v-model="spacing" class="fixed-width" size="xl" placeholder="Default"/>
            <Textarea v-model="spacing" class="fixed-width" size="xl" spacing="expanded" placeholder="Expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge type="tip"><pre>disabled: boolean</pre></Badge>

<Demo>
    <Textarea disabled placeholder="Disabled"/>
    <Textarea disabled placeholder="Disabled" underline/>
</Demo>

<style>
.fixed-width{
    width: 150px;
}
</style>

## Elements

| element | tag | description |
| ---- | ---- | ------- |
| `input` | <code class="vp-code-nowrap">\<textarea\></code>| `Textarea`'s underlying textarea element. |

### Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field textarea">
        <Anatomy tag="div" classes="form-field-label-wrapper">
            <Anatomy tag="label" classes="form-field-label"/>
            <Anatomy tag="span" classes="form-field-hint"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-description"/>
        <Anatomy tag="div" classes="textarea-wrapper">
            <Anatomy tag="textarea"/>
            <Anatomy tag="label"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
    </Anatomy>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `string` | `''` |
| `placeholder` | `string` | `''` |
| `max` | `string` | |
| `text-align` | `'left' \| 'center' \| 'right'` | `'left'` |
| `rows` | `string` | |
| `resize` | `boolean` | |
| `disabled` | `boolean` | |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| `float-label` | `boolean` | `false` |
| `underline` | `boolean` | `false` |
| `showErrros` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `validator` | `Function` | |
| `eagerValidation` | `boolean` | |
| `elements` | `object` | |
| `validationDelay` | `number` | `300` |

### Configuration options

`Textarea`'s [configuration options](/configuration) allow to overwrite some `Textarea` props' default values and may be overwritten under the `textarea` root-level configuration option.

| `textarea.<option>` | type | default | [global](/configuration#global-configuration-options) |
| -------------------- | ---- | ------- | :------: |
| `underline` | `boolean` | | |
| `validationDelay` | `number` | | ✅ |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |