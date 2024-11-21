---
outline: [2,3]
---

# Placeholder

<script setup>
import { Placeholder } from '@8ctavio/vergil/components'
</script>

## Basic Usage

<Demo>
    <Placeholder/>
</Demo>

```vue
<script setup>
import { Placeholder } from '@8ctavio/vergil/components'
</script>

<template>
    <Placeholder/>
</template>

<style>
.placeholder {
    width: 300px;
    height: 80px;
}
</style>
```

## Props

The `Placeholder` component features a [`Badge`](/components/badge) to display details. All `Placeholder` props are forwarded to its inner `Badge`.

```vue
<Placeholder label="Placeholder" outline size="sm"/>
```

<Demo>
    <Placeholder label="Placeholder" outline size="sm"/>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `label` | `string` | |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |

### Configuration options

The following `Placeholder` props' default values can be overwritten under the `placeholder` root-level [configuration option](/configuration).

| `placeholder.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `size` | ✅ |
| `radius` | ✅ |

## Anatomy

<Demo>
    <Anatomy tag="div" classes="placeholder">
        <Anatomy tag="Badge" classes="badge"/>
    </Anatomy>
</Demo>

<style scoped>
.placeholder {
    width: 300px;
    height: 80px;
}
</style>