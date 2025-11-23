---
outline: [2,3]
---

# InputNumber

<script setup>
import { InputNumber, InputSearch, Btn } from 'vergil/components'
import { onMounted } from 'vue'
import { useModel, toast } from 'vergil'

const demo1 = useModel(0, { shallow: true })
const demo2 = useModel(0, { shallow: true })
const demo3 = useModel(0, { shallow: true })
const demo4 = useModel(0, { shallow: true })
const demo5 = useModel(0, { shallow: true })
const demo6 = useModel(0, { shallow: true })
const demo7 = useModel(0, { shallow: true })
</script>

## Basic Usage

<Demo>
    <div class="col">
        <div class="row center">
            <InputNumber v-model="demo1" label="Number Input"/>
        </div>
        <div class="row center">
            <code>num.value === {{ demo1.value }}</code>
        </div>
    </div>
</Demo>

```vue
<script setup>
import { InputNumber } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const num = useModel(0)
</script>

<template>
    <InputNumber v-model="num" label="Number Input"/>
</template>
```

## Props

All [`InputText`](/components/form/inputText) props, except for `space-evenly`, are available for `InputNumber`.

### Value range <Badge type="tip"><pre>min: number = -Infinity</pre></Badge> <Badge type="tip"><pre>max: number = Infinity</pre></Badge>

```vue
<InputNumber :min="-10" :max="10"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <InputNumber v-model="demo2" :min="-10" :max="10"/>
        </div>
        <div class="row center">
            <code>modelValue === {{ demo2.value }}</code>
        </div>
    </div>
</Demo>

### Fraction <Badge type="tip"><pre>fraction: boolean | number | [number,number] = true</pre></Badge>

The `fraction` prop controls whether to allow fractional digits, and how many digits to allow.

```vue
<!-- No fraction -->
<InputNumber :fraction="false"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <InputNumber v-model="demo3" :fraction="false"/>
        </div>
        <div class="row center">
            <code>modelValue === {{ demo3.value }}</code>
        </div>
    </div>
</Demo>

```vue
<!-- Fixed fractional digits -->
<InputNumber :fraction="2"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <InputNumber v-model="demo4" :fraction="2"/>
        </div>
        <div class="row center">
            <code>modelValue === {{ demo4.value }}</code>
        </div>
    </div>
</Demo>

```vue
<!-- Range of fractional digits [min,max] -->
<InputNumber :fraction="[2,4]"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <InputNumber v-model="demo5" :fraction="[2,4]"/>
        </div>
        <div class="row center">
            <code>modelValue === {{ demo5.value }}</code>
        </div>
    </div>
</Demo>

### Separate thousands <Badge type="tip"><pre>separator: boolean = true</pre></Badge>

```vue
<InputNumber :separator="false"/>
```

<Demo>
    <InputNumber :separator="false"/>
</Demo>

### Step <Badge type="tip"><pre>step: number = 1</pre></Badge>

```vue
<InputNumber :step="0.1"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <InputNumber v-model="demo6" :step="0.1"/>
        </div>
        <div class="row center">
            <code>modelValue === {{ demo6.value }}</code>
        </div>
    </div>
</Demo>


### Steppers <Badge type="tip"><pre>steppers: boolean</pre></Badge>

```vue
<InputNumber steppers :step="0.1" text-align="center"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <InputNumber v-model="demo7" steppers :step="0.1" text-align="center"/>
        </div>
        <div class="row center">
            <code>modelValue === {{ demo7.value }}</code>
        </div>
    </div>
</Demo>

## Elements

| element | tag | description |
| ---- | ---- | ------- |
| `input` | <code class="vp-code-nowrap"><input[type="text"]></code>| `InputNumber`'s underlying input element. |

### Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field input-text input-number">
        <Anatomy tag="div" classes="form-field-label-wrapper">
            <Anatomy tag="label" classes="form-field-label"/>
            <Anatomy tag="span" classes="form-field-hint"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-description"/>
        <Anatomy tag="div" classes="input-text-outer">
            <Anatomy tag="Btn" classes="btn"/>
            <Anatomy tag="div" classes="input-text-wrapper">
                <Anatomy tag="Icon" classes="icon"/>
                <Anatomy tag="p"/>
                <Anatomy tag='input[type="text"]'/>
                <Anatomy tag="label"/>
                <Anatomy tag="p"/>
                <Anatomy tag="Icon" classes="icon"/>
            </Anatomy>
            <Anatomy tag="Btn" classes="btn"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
    </Anatomy>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `number \| string` | `0` |
| `min` | `number` | `-Infinity` |
| `max` | `number` | `Infinity` |
| `fraction` | `boolean \| number \| [number,number]` | `true` |
| `separator` | `boolean` | `true` |
| `step` | `number` | `1` |
| `steppers` | `boolean` | |

### Configuration options

`InputNumber`'s [configuration options](/configuration) options are inherited from [`InputText`](/components/form/inputText#configuration-options).