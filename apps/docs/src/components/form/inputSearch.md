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

All [`InputText`](/components/form/inputText) props are available for `InputSearch`. For the `btn-after` prop, only the following `Btn` props are available:

- `label`
- `variant`
- `fill`
- `borderless`
- `squared`
- `icon-right`

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

### Configuration options

Inherited from [`InputText`](/components/form/inputText#configuration-options).