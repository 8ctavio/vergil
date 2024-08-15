---
outline: [2,3]
---

# Skeleton <Badge><pre>.skeleton</pre></Badge>

<script setup>
import { Skeleton } from '@8ctavio/vergil/components'
</script>

## Basic Usage

```vue
<script setup>
import { Skeleton } from '@8ctavio/vergil/components'
</script>

<template>
    <Skeleton/>
</template>

<style>
.skeleton {
    width: 300px;
    height: 80px;
}
</style>
```
<Demo>
    <Skeleton/>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'expanded'` | `''` |

### Configuration options

The following `Skeleton` props' default values can be overwritten under the `skeleton` root-level [configuration option](/configuration).

| `skeleton.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `size` | ✅ |
| `radius` | ✅ |
| `spacing` | ✅ |

## Styling

### Anatomy

<Demo>
    <Anatomy tag="div" classes="skeleton"/>
</Demo>

<style scoped>
.skeleton {
    width: 300px;
    height: 80px;
}
</style>