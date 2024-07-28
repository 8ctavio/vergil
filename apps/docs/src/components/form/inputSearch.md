---
outline: [2,3]
---

# InputSearch <Badge type="tip"><pre>.input-search</pre></Badge>

<script setup>
import { InputSearch } from '@8ctavio/vergil/components'
import { useModel, toast } from '@8ctavio/vergil'

async function handleSearch(){
    await new Promise(r => setTimeout(r,3000))
    toast('warn', 'Not found')
}
function handleClear(){
    toast('info', 'Search query cleared')
}
</script>

## Basic Usage

```vue
<script setup>
import { InputSearch } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const search = useModel('')
</script>

<template>
    <InputSearch v-model="search" label="Search Input"/>
</template>
```
<Demo>
    <InputSearch label="Search Input"/>
</Demo>

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
- `fill`
- `borderless`
- `squared`
- If `btn-position` is `'before'`, `iconLeft`, otherwise `iconRight`.

The prop for the other button can be normally passed.

```vue
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
The `btn-position` prop does not support reactive properties.
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
