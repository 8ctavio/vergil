---
outline: [2,3]
---

# InputNumber

<script setup>
import { InputNumber, InputSearch, Btn } from '@8ctavio/vergil/components'
import { ref, onMounted } from 'vue'
import { toast } from '@8ctavio/vergil'

const demo1 = ref(0)
const demo2 = ref(0)
const demo3 = ref(0)
const demo4 = ref(0)
const demo5 = ref(0)
const demo6 = ref(0)
const demo7 = ref(0)
</script>

## Basic Usage

<Demo>
    <div class="col">
        <div class="row center">
            <InputNumber v-model="demo1" label="Number Input"/>
        </div>
        <div class="row center">
            <code>num.value === {{ demo1 }}</code>
        </div>
    </div>
</Demo>

```vue
<script setup>
import { InputNumber } from '@8ctavio/vergil/components'
import { ref } from 'vue'
const num = ref(0)
</script>

<template>
    <InputNumber v-model="num" label="Number Input"/>
</template>
```

## Props

All [`InputText`](/components/form/inputText) props are available for `InputNumber`.

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
            <code>modelValue === {{ demo2 }}</code>
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
            <code>modelValue === {{ demo3 }}</code>
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
            <code>modelValue === {{ demo4 }}</code>
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
            <code>modelValue === {{ demo5 }}</code>
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
            <code>modelValue === {{ demo6 }}</code>
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
            <code>modelValue === {{ demo7 }}</code>
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

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `number \| string` | `0` |
| `min` | `number` | `-Infinity` |
| `max` | `number` | `Infinity` |
| `fraction` | `boolean \| number \| [number,number]` | `true` |
| `separator` | `boolean` | `true` |
| `step` | `number` | `1` |
| `steppers` | `boolean` | |
| `disabled` | `boolean` | |