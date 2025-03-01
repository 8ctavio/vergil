---
outline: [2,3]
---

# Skeleton

<script setup>
import { Skeleton } from '@8ctavio/vergil/components'
</script>

## Basic Usage

<Demo>
    <Skeleton/>
</Demo>

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

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `descendant` | `boolean` | |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'expanded'` | `''` |

### Configuration options

`Skeleton`'s [configuration options](/configuration) allow to overwrite some `Skeleton` props' default values and may be overwritten under the `skeleton` root-level configuration option.

| `skeleton.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ------------------- | ---- | ------- | :------: |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |

## Anatomy

<Demo>
    <Anatomy tag="div" classes="skeleton"/>
</Demo>

<style scoped>
.skeleton {
    width: 300px;
    height: 80px;
}
</style>