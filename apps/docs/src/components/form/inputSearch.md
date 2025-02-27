---
outline: [2,3]
---

# InputSearch

<script setup>
import { InputSearch, Btn } from '@8ctavio/vergil/components'
import { toast } from '@8ctavio/vergil'
import { useExposed } from '@8ctavio/vergil'

const exposed = useExposed()
async function handleSearch(){
    await new Promise(r => setTimeout(r,3000))
    toast('warn', 'Not found')
}
function handleClear(){
    toast('info', 'Search query cleared')
}
</script>

## Basic Usage

<Demo>
    <InputSearch label="Search Input"/>
</Demo>

```vue
<script setup>
import { InputSearch } from '@8ctavio/vergil/components'
import { ref } from '@8ctavio/vergil'
const search = ref('')
</script>

<template>
    <InputSearch v-model="search" label="Search Input"/>
</template>
```

## Props

All [`InputText`](/components/form/inputText) props are available for `InputSearch`. The `btn-before` and `btn-after` props have restrictions depending on the `btn-position` prop value.

### Search Icon <Badge type="tip"><pre>icon-search: string = 'search'</pre></Badge>

```vue
<InputSearch icon-search="rocket_launch"/>
```

<Demo>
    <InputSearch icon-search="rocket_launch"/>
</Demo>

### Clear Icon <Badge type="tip"><pre>icon-clear: string = 'search_off'</pre></Badge>

```vue
<InputSearch icon-clear="cancel"/>
```

<Demo>
    <InputSearch icon-clear="cancel"/>
</Demo>

### Btn Position <Badge type="tip"><pre>btn-position: ('before' | 'after') = 'after'</pre></Badge>

Position of the built-in search button. The prop for the button in the selected position (`btn-before` or `btn-after`) only accepts the following `Btn` props:

- `label`
- `variant`
- `ghost`
- `outline`
- `underline`
- `fill`
- `squared`
- If `btn-position` is `'before'`, `iconLeft`, otherwise `iconRight`.

The prop for the other button can be normally passed.

```vue-html
<InputSearch
    btn-position="before"
    :btn-before="{
        label: 'Search',
        iconLeft: 'rocket_launch',
        iconRight: 'star', // ignored
    }"
/>
```

<Demo>
    <InputSearch
        btn-position="before"
        :btn-before="{
            label: 'Search',
            iconLeft: 'rocket_launch',
            iconRight: 'star',
        }"
    />
</Demo>

:::info
The `btn-position` prop does not support reactive values.
:::

## Events

### Search <Badge type="tip"><pre>search</pre></Badge>

```vue
<script setup>
async function handleSearch(){
    await new Promise(r => setTimeout(r,3000))
    toast('warn', 'Not found')
}
</script>

<template>
    <InputSearch @search="handleSearch"/>
</template>
```

<Demo>
    <InputSearch @search="handleSearch"/>
</Demo>

### Clear <Badge type="tip"><pre>clear</pre></Badge>

```vue
<script setup>
function handleClear(){
    toast('info', 'Search query cleared')
}
</script>

<template>
    <InputSearch @clear="handleClear"/>
</template>
```

<Demo>
    <InputSearch @clear="handleClear"/>
</Demo>

## Exposed

### Clear

Method to properly clear `InputSearch`'s text field.

```vue
<script setup>
import { useExposed } from '@8ctavio/vergil'

const exposed = useExposed()
function handleClear() {
    exposed.clear?.()
}
</script>

<template>
    <InputSearch :exposed/>
    <Btn @click="handleClear" label="Clear"/>
</template>
```

<Demo>
    <InputSearch :exposed/>
    <Btn @click="() => exposed.clear?.()" label="Clear"/>
</Demo>

## Elements

| element | tag | description |
| ---- | ---- | ------- |
| `input` | <code class="vp-code-nowrap"><input[type="text"]></code>| `InputSearch`'s underlying input element. |

### Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field input-text input-search">
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
| `icon-search` | `string` | `'search'` |
| `icon-clear` | `string` | `'search_off'` |
| `btn-position` | `'before' \| 'after'` | `'after'` |

### Configuration options

The following `InputSearch` props' default values can be overwritten under the `inputSearch` root-level [configuration option](/configuration).

| `inputSearch.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `btnPosition` | |

Other configuration options are inherited from [`InputText`](/components/form/inputText#configuration-options).