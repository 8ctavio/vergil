---
outline: [2,3]
---

# InputText <Badge type="tip"><pre>.input-text</pre></Badge>

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
<Demo>
    <InputText label="Text Input"/>
</Demo>

## Props

### Value <Badge type="tip"><pre>value: string = ''</pre></Badge> <Badge type="warning">only if <pre>modelValue</pre> prop is unset</Badge>

```vue
<InputText value="Initial Value"/>
```

<Demo>
    <InputText value="Initial Value"/>
</Demo>

### Type <Badge type="tip"><pre>type: ('text' | 'password') = 'text'</pre></Badge>

```vue
<InputText type='text' placeholder="Username"/>
<InputText type='password' placeholder="Password"/>
```

<Demo>
    <InputText type='text' placeholder="Username"/>
    <InputText type='password' placeholder="Password"/>
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

### Max <Badge type="tip"><pre>max: string</pre></Badge>

The maximum string length that can be entered into the text input.

```vue
<InputText max="10" placeholder="Up to 10 characters"/>
```

<Demo>
    <InputText max="10" placeholder="Up to 10 characters"/>
</Demo>

### Placeholder <Badge type="tip"><pre>placeholder: string</pre></Badge>

```vue
<InputText placeholder="Text Input"/>
```

<Demo>
    <InputText placeholder="Text Input"/>
</Demo>

### Label <Badge type="tip"><pre>label: string</pre></Badge>

```vue
<InputText label="Text Input"/>
```

<Demo>
    <InputText label="Text Input"/>
</Demo>

### Float label <Badge type="tip"><pre>float-label: boolean</pre></Badge>


```vue
<InputText label="Text Input" float-label/>
```

<Demo>
    <InputText label="Text Input" float-label/>
</Demo>

:::tip NOTE
`float-label` only works if the `description`, `prefix`, and `icon[-left]` props are unset.
:::

### Hint <Badge type="tip"><pre>hint: string</pre></Badge>

```vue
<InputText label="Text Input" hint="optional"/>
```

<Demo>
    <InputText label="Text Input" hint="optional"/>
</Demo>

### Description <Badge type="tip"><pre>description: string</pre></Badge>

```vue
<InputText label="Text Input" description="Description and additional details"/>
```

<Demo>
    <InputText label="Text Input" description="Description and additional details"/>
</Demo>

### Help <Badge type="tip"><pre>help: string</pre></Badge>

```vue
<InputText label="Text Input" help="Help and additional details"/>
```

<Demo>
    <InputText label="Text Input" help="Help and additional details"/>
</Demo>

### Prefix and Suffix <Badge type="tip"><pre>prefix: string</pre></Badge> <Badge type="tip"><pre>suffix: string</pre></Badge>

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

The default `Btn` variant is `'outline'`.

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

### Size <Badge type="tip"><pre>size: ('sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

> Adjusts font-size and padding.

<Demo>
    <div class="col center">
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

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `string` | `''` |
| `type` | `'text' \| 'password'` | `'text'` |
| `text-align` | `'left' \| 'center' \| 'right'` | `'left'` |
| `max` | `string` | |
| `placeholder` | `string` | |
| `label` | `string` | |
| `float-label` | `boolean` | `false` |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| `prefix` | `string` | |
| `suffix` | `string` | |
| `icon` | `string` | |
| `icon-left` | `string` | |
| `icon-right` | `string` | |
| `btn-before` | `object` | |
| `btn-after` | `object` | |
| `underline` | `boolean` | `false` |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `disabled` | `boolean` | `false` |

### Configuration options

The following `InputText` props' default values can be overwritten under the `inputText` root-level [configuration option](/configuration).

| `inputText.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `underline` | |
| `theme` | ✅ |
| `size` | ✅ |
| `radius` | ✅ |
| `spacing` | ✅ |