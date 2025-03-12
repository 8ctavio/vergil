---
outline: [2,3]
---

# InputText

<script setup>
import { InputText, Btn } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'

const size = useModel('')
const radius = useModel('')
const spacing = useModel('')

const btnBeforeProps = {
    icon: 'bolt'
}
const btnAfterProps = {
    icon: 'science'
}
</script>

## Basic Usage

<Demo>
    <InputText label="Text Input"/>
</Demo>

```vue
<script setup>
import { InputText } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const text = useModel('')
</script>

<template>
    <InputText v-model="text" label="Text Input"/>
</template>
```

## Props

### Placeholder <Badge type="tip"><pre>placeholder: string</pre></Badge>

```vue
<InputText placeholder="Text Input"/>
```

<Demo>
    <InputText placeholder="Text Input"/>
</Demo>

### Max <Badge type="tip"><pre>max: string</pre></Badge>

The maximum string length that can be entered into the text input.

```vue
<InputText max="10" placeholder="Up to 10 characters"/>
```

<Demo>
    <InputText max="10" placeholder="Up to 10 characters"/>
</Demo>

### Text align <Badge type="tip"><pre>text-align: ('left' | 'center' | 'right') = 'left'</pre></Badge>

```vue
<InputText text-align="left" placeholder="Left"/>
<InputText text-align="center" placeholder="Center"/>
<InputText text-align="right" placeholder="Right"/>
```

<Demo>
    <div class="col center">
        <InputText text-align="left" placeholder="Left"/>
        <InputText text-align="center" placeholder="Center"/>
        <InputText text-align="right" placeholder="Right"/>
    </div>
</Demo>

### Type <Badge><pre>type: ('text' | 'password') = 'text'</pre></Badge>

```vue
<InputText type='text' placeholder="Username"/>
<InputText type='password' placeholder="Password"/>
```

<Demo>
    <InputText type='text' placeholder="Username"/>
    <InputText type='password' placeholder="Password"/>
</Demo>

### Autoselect <Badge><pre>boolean</pre></Badge>

Selects `InputText`'s text when focused.

```vue
<InputText value="Focus me!" autoselect/>
```

<Demo>
    <InputText value="Focus me!" autoselect/>
</Demo>

### Prefix and Suffix <Badge><pre>prefix: string</pre></Badge> <Badge type="tip"><pre>suffix: string</pre></Badge>

```vue
<InputText prefix="Prefix" suffix="Suffix"/>
```

<Demo>
    <InputText prefix="Prefix" suffix="Suffix"/>
</Demo>

### Icons<Badge type="tip"><pre>icon[-left]: string</pre></Badge> <Badge type="tip"><pre>icon-right: string</pre></Badge>

```vue
<InputText icon="person" icon-right="lock"/>
<!-- or -->
<InputText icon-left="person" icon-right="lock"/>
```

<Demo>
    <InputText icon-left="person" icon-right="lock"/>
</Demo>

### Side Buttons <Badge type="tip"><pre>btn-before: object</pre></Badge> <Badge type="tip"><pre>btn-after: object</pre></Badge>

The `btn-before` and `btn-after` props receive objects representing the props for [`Btn`](/components/buttons/btn) components to be displayed before and after the input field area, respectively.

The following `Btn` props are ignored from the `btn-before` and `btn-after` props, and are rather taken from the `InputField`'s props:

- `theme`
- `size`
- `radius`
- `spacing`

The `Btn` `disabled` prop is bound to the `InputField` `disabled` prop. That is, both `btn-before` and `btn-after` accept a `disabled` prop, but if the `InputField` is disabled, then the side buttons will also get disabled.

```vue
<script setup>
const btnBeforeProps = {
    icon: 'bolt'
}
const btnAfterProps = {
    icon: 'science'
}
</script>

<template>
    <InputText :btn-before="btnBeforeProps" :btn-after="btnAfterProps"/>
</template>
```

<Demo>
    <InputText :btn-before="btnBeforeProps" :btn-after="btnAfterProps"/>
</Demo>

### Float label <Badge type="tip"><pre>float-label: boolean</pre></Badge>

```vue
<InputText label="Text Input" float-label/>
```

<Demo>
    <InputText label="Text Input" float-label/>
</Demo>

:::tip NOTE
`float-label` only works if the `placeholder`, `description`, `prefix`, and `icon[-left]` props are unset.
:::

### Space evenly <Badge><pre>boolean</pre></Badge>

When set to `true`, `InputText`'s value is trimmed and consecutive whitespace characters (`/\s+/`) are replaced with a single space character (`" "`) when the `Enter` key is pressed or the element loses focus.

```vue
<InputText space-evenly/>
```

<Demo>
    <InputText space-evenly placeholder="Space evenly"/>
</Demo>

### Underline <Badge type="tip"><pre>underline: boolean</pre></Badge>

<Demo>
    <InputText underline placeholder="Underline"/>
</Demo>

### Theme <Badge type="tip"><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <div class="row center">
        <InputText underline theme="brand" placeholder="Brand"/>
        <InputText underline theme="user" placeholder="User"/>
        <InputText underline theme="ok" placeholder="Ok"/>
        <InputText underline theme="info" placeholder="Info"/>
        <InputText underline theme="warn" placeholder="Warn"/>
        <InputText underline theme="danger" placeholder="Danger"/>
        <InputText underline theme="neutral" placeholder="Neutral"/>
    </div>
</Demo>

### Size <Badge type="tip"><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

> Adjusts font-size and padding.

<Demo>
    <div class="col center">
        <InputText v-model="size" size="xs" class="fixed-width" placeholder="Extra Small"/>
        <InputText v-model="size" size="sm" class="fixed-width" placeholder="Small"/>
        <InputText v-model="size" size="md" class="fixed-width" placeholder="Medium"/>
        <InputText v-model="size" size="lg" class="fixed-width" placeholder="Large"/>
        <InputText v-model="size" size="xl" class="fixed-width" placeholder="Extra Large"/>
    </div>
</Demo>

### Radius <Badge type="tip"><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="col center w-initial">
        <InputText v-model="radius" class="fixed-width" placeholder="None" radius="none"/>
        <InputText v-model="radius" class="fixed-width" placeholder="Small" radius="sm"/>
        <InputText v-model="radius" class="fixed-width" placeholder="Medium" radius="md"/>
        <InputText v-model="radius" class="fixed-width" placeholder="Large" radius="lg"/>
        <InputText v-model="radius" class="fixed-width" placeholder="Full" radius="full"/>
    </div>
    <div class="col center w-initial">
        <InputText v-model="radius" class="fixed-width" underline placeholder="None" radius="none"/>
        <InputText v-model="radius" class="fixed-width" underline placeholder="Small" radius="sm"/>
        <InputText v-model="radius" class="fixed-width" underline placeholder="Medium" radius="md"/>
        <InputText v-model="radius" class="fixed-width" underline placeholder="Large" radius="lg"/>
        <InputText v-model="radius" class="fixed-width" underline placeholder="Full" radius="full"/>
    </div>
</Demo>

### Spacing <Badge type="tip"><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

> Adjusts padding and gap for a every size.

<Demo>
    <div class="col">
        <div class="row center">
            <InputText v-model="spacing" class="fixed-width" size="xs" spacing="compact" placeholder="Compact"/>
            <InputText v-model="spacing" class="fixed-width" size="xs" placeholder="Default"/>
            <InputText v-model="spacing" class="fixed-width" size="xs" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <InputText v-model="spacing" class="fixed-width" size="sm" spacing="compact" placeholder="Compact"/>
            <InputText v-model="spacing" class="fixed-width" size="sm" placeholder="Default"/>
            <InputText v-model="spacing" class="fixed-width" size="sm" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <InputText v-model="spacing" class="fixed-width" size="md" spacing="compact" placeholder="Compact"/>
            <InputText v-model="spacing" class="fixed-width" size="md" placeholder="Default"/>
            <InputText v-model="spacing" class="fixed-width" size="md" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <InputText v-model="spacing" class="fixed-width" size="lg" spacing="compact" placeholder="Compact"/>
            <InputText v-model="spacing" class="fixed-width" size="lg" placeholder="Default"/>
            <InputText v-model="spacing" class="fixed-width" size="lg" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <InputText v-model="spacing" class="fixed-width" size="xl" spacing="compact" placeholder="Compact"/>
            <InputText v-model="spacing" class="fixed-width" size="xl" placeholder="Default"/>
            <InputText v-model="spacing" class="fixed-width" size="xl" spacing="expanded" placeholder="Expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge type="tip"><pre>disabled: boolean</pre></Badge>

<Demo>
    <InputText disabled placeholder="Disabled"/>
    <InputText disabled placeholder="Disabled" underline/>
</Demo>

<style>
.fixed-width{
    width: 150px;
}
</style>

## Elements

| element | tag | description |
| ---- | ---- | ------- |
| `input` | <code class="vp-code-nowrap">\<input\></code>| `InputText`'s underlying input element. |

### Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field input-text">
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
                <Anatomy tag="input"/>
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
| `value` | `string` | `''` |
| `placeholder` | `string` | `''` |
| `max` | `string` | |
| `text-align` | `'left' \| 'center' \| 'right'` | `'left'` |
| `type` | `'text' \| 'password'` | `'text'` |
| `autoselect` | `boolean` | |
| `prefix` | `string` | |
| `suffix` | `string` | |
| `icon` | `string` | |
| `icon-left` | `string` | |
| `icon-right` | `string` | |
| `btn-before` | `object` | |
| `btn-after` | `object` | |
| `spaceEvenly` | `boolean` | |
| `underline` | `boolean` | |
| `disabled` | `boolean` | |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| `showErrros` | `boolean` | |
| `floatLabel` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `validator` | `function` | |
| `elements` | `object` | |

### Configuration options

`InputText`'s [configuration options](/configuration) allow to overwrite some `InputText` props' default values and may be overwritten under the `inputText` root-level configuration option.

| `inputText.<option>` | type | default | [global](/configuration#global-configuration-options) |
| -------------------- | ---- | ------- | :------: |
| `underline` | `boolean` | | |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |