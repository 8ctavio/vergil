---
outline: [2,3]
---

# InputSearch

<script setup>
import { useExposed, toast } from 'vergil'
import { InputSearch, Button } from 'vergil/components'

const exposed = useExposed()
async function handleSearch(s) {
    await new Promise(r => setTimeout(r,3000))
    toast('warn', 'Not found')
}
function handleClear() {
    toast('info', 'Search query cleared')
}
</script>

## Basic Usage

<Demo>
    <InputSearch label="Search Input"/>
</Demo>

```vue
<script setup>
import { useModel } from '@vrgl/vergil'
import { InputSearch } from '@vrgl/vergil/components'
const search = useModel('')
</script>

<template>
    <InputSearch v-model="search" label="Search Input"/>
</template>
```

## Props

All [`InputText`](/components/form/inputText) props are available for `InputSearch`. The `button-before` and `button-after` props have restrictions depending on the `button-position` prop value.

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

### Button Position <Badge type="tip"><pre>button-position: ('before' | 'after') = 'after'</pre></Badge>

Position of the built-in search button. The prop for the button in the selected position (`button-before` or `button-after`) only accepts the following `Button` props:

- `label`
- `variant`
- `mask`
- `outline`
- `underline`
- `fill`
- `squared`
- If `button-position` is `'before'`, `iconLeft`, otherwise `iconRight`.

The prop for the other button can be normally passed.

```vue
<InputSearch
    button-position="before"
    :button-before="{
        label: 'Search',
        iconLeft: 'rocket_launch',
        iconRight: 'star', // ignored
    }"
/>
```

<Demo>
    <InputSearch
        button-position="before"
        :button-before="{
            label: 'Search',
            iconLeft: 'rocket_launch',
            iconRight: 'star',
        }"
    />
</Demo>

## Events

### Search <Badge type="tip"><pre>onSearch: (searchQuery: string) => void</pre></Badge>

```vue
<script setup>
async function handleSearch() {
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

### Clear <Badge type="tip"><pre>onClear: () => void</pre></Badge>

```vue
<script setup>
function handleClear() {
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
import { useExposed } from '@vrgl/vergil'

const exposed = useExposed()
function handleClear() {
    exposed.clear?.()
}
</script>

<template>
    <InputSearch :exposed/>
    <Button @click="handleClear" label="Clear"/>
</template>
```

<Demo>
    <InputSearch :exposed/>
    <Button @click="() => exposed.clear?.()" label="Clear"/>
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
            <Anatomy tag="Button" classes="button"/>
            <Anatomy tag="div" classes="input-text-wrapper">
                <Anatomy tag="Icon" classes="icon"/>
                <Anatomy tag="p"/>
                <Anatomy tag='input[type="text"]'/>
                <Anatomy tag="label"/>
                <Anatomy tag="p"/>
                <Anatomy tag="Icon" classes="icon"/>
            </Anatomy>
            <Anatomy tag="Button" classes="button"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
    </Anatomy>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `icon-search` | `string` | `'search'` |
| `icon-clear` | `string` | `'search_off'` |
| `button-position` | `'before' \| 'after'` | `'after'` |
| `exposed` | `object` | |

### Configuration options

`InputSearch`'s [configuration options](/configuration) allow to overwrite some `InputSearch` props' default values and may be overwritten under the `inputSearch` root-level configuration option.

| `inputSearch.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ---------------------- | ---- | ------- | :------: |
| `buttonPosition` | `'before' \| 'after'` | `'after'` | |

Other configuration options are inherited from [`InputText`](/components/form/inputText#configuration-options).