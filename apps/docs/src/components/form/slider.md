---
outline: [2,3]
---

# Slider

<script setup>
import { Slider } from '@8ctavio/vergil/components'
import { separateThousands } from '@8ctavio/vergil/utilities'

function formatValue(value){
    return `**${separateThousands(value * 1000)}**`
}
</script>

## Basic Usage

<Demo>
    <Slider label="Slider" value="80"/>
</Demo>

```vue
<script setup>
import { Slider } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const progress = useModel(80)
</script>

<template>
    <Slider v-model="progress" label="Slider"/>
</template>
```

## Attributes

The `Slider` component wraps an `input[type="range"]` element. Common [range input attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range#additional_attributes) are supported: 

- `min`: The greatest value in the range of permitted values.
- `max`: The lowest value in the range of permitted values.
- `step`: The range value granularity.

## Props

### Display value <Badge><pre>display-value: boolean | ((value: number) => string)</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

```vue
<Slider display-value/>
```

<Demo>
    <Slider display-value/>
</Demo>

:::tip
The `Slider`'s value is displayed inside a `p.slider-value` element which auto-adjusts its width based on the `max` prop's `length` property in order to prevent the `Slider`'s width from changing when numbers of different lengths are displayed.
:::

The `display-value` prop also accepts a callback function that receives the `Slider`'s value, and returns a formatted string to display.

```vue
<script setup>
import { separateThousands } from '@8ctavio/vergil/utilities'

function formatValue(value) {
    return `**${separateThousands(value * 1000)}**`
}
</script>

<template>
    <Slider :display-value="formatValue" min="1" max="10"/>
</template>

<style>
.slider > .slider-outer > .slider-value {
    font-family: var(--font-mono);
    width: 60px;
}
</style>
```
<Demo>
    <Slider :display-value="formatValue" min="1" max="10" class="formatted"/>
</Demo>

:::tip
When displaying formatted strings, consider setting the `p.slider-value` width greater than the longest displayed string's width.
:::

### Virtual range <Badge><pre>virtual-min: number</pre></Badge> <Badge><pre>virtual-max: number</pre></Badge> 

```vue
<Slider :virtual-min="20" :virtual-max="80" display-value/>
```

<Demo>
    <Slider :virtual-min="20" :virtual-max="80" display-value/>
</Demo>

### Fixed progress <Badge><pre>fixed-progress: boolean</pre></Badge>

```vue
<Slider fixed-progress display-value/>
```

<Demo>
    <Slider fixed-progress display-value/>
</Demo>

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <Slider value="50" theme="brand"/>
    <Slider value="50" theme="user"/>
    <Slider value="50" theme="ok"/>
    <Slider value="50" theme="info"/>
    <Slider value="50" theme="warn"/>
    <Slider value="50" theme="danger"/>
    <Slider value="50" theme="neutral"/>
</Demo>

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <Slider value="50" size="xs"/>
    <Slider value="50" size="sm"/>
    <Slider value="50" size="md"/>
    <Slider value="50" size="lg"/>
    <Slider value="50" size="xl"/>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'full'</pre></Badge>

<Demo>
    <Slider value="50" radius="none"/>
    <Slider value="50" radius="sm"/>
    <Slider value="50" radius="md"/>
    <Slider value="50" radius="lg"/>
    <Slider value="50" radius="full"/>
</Demo>

:::tip NOTE
The `Slider`'s `radius` prop is not affected by the `descendant` prop.
:::

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <Slider value="50" display-value size="xs" spacing="compact" label="Compact"/>
            <Slider value="50" display-value size="xs" label="Default"/>
            <Slider value="50" display-value size="xs" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Slider value="50" display-value size="sm" spacing="compact" label="Compact"/>
            <Slider value="50" display-value size="sm" label="Default"/>
            <Slider value="50" display-value size="sm" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Slider value="50" display-value size="md" spacing="compact" label="Compact"/>
            <Slider value="50" display-value size="md" label="Default"/>
            <Slider value="50" display-value size="md" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Slider value="50" display-value size="lg" spacing="compact" label="Compact"/>
            <Slider value="50" display-value size="lg" label="Default"/>
            <Slider value="50" display-value size="lg" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Slider value="50" display-value size="xl" spacing="compact" label="Compact"/>
            <Slider value="50" display-value size="xl" label="Default"/>
            <Slider value="50" display-value size="xl" spacing="expanded" label="Expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <Slider disabled value="50" display-value/>
</Demo>

## Elements

| element | tag | description |
| ---- | ---- | ------- |
| `input` | <code class="vp-code-nowrap"><input[type="range"]></code>| `Slider`'s underlying input element. |

### Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field slider">
        <Anatomy tag="div" classes="form-field-label-wrapper">
            <Anatomy tag="label" classes="form-field-label"/>
            <Anatomy tag="span" classes="form-field-hint"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-description"/>
        <Anatomy tag="div" classes="slider-outer">
            <Anatomy tag="div" classes="slider-wrapper">
                <Anatomy tag='span'/>
                <Anatomy tag='input[type="range"]'/>
                <Anatomy tag="span" classes="slider-track">
                    <Anatomy tag="span" classes="slider-progress">
                        <Anatomy tag="span" classes="switch-knob"/>
                    </Anatomy>
                </Anatomy>
                <Anatomy tag='label'/>
            </Anatomy>
            <Anatomy tag='p' classes="slider-value"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
    </Anatomy>
</Demo>


## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `string \| number` | `'0'` |
| `min` | `string \| number` | `'0'` |
| `max` | `string \| number` | `'100'` |
| `virtualMin` | `number` | |
| `virtualMax` | `number` | |
| `displayValue` | `boolean \| ((value: number) => string)` | |
| `fixedProgress` | `boolean` | |
| `disabled` | `boolean` | |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| `showErrros` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'full'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `validator` | `Function` | |
| `eagerValidation` | `boolean` | |
| `elements` | `object` | |
| `validationDelay` | `number` | `300` |

### Configuration options

`Slider`'s [configuration options](/configuration) allow to overwrite some `Slider` props' default values and may be overwritten under the `slider` root-level configuration option.

| `slider.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ----------------- | ---- | ------- | :------: |
| `validationDelay` | `number` | | ✅ |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | `'full'` | |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |

<style>
.slider.formatted > .slider-outer > .slider-value {
    font-family: var(--font-mono);
    width: 60px;
}
</style>