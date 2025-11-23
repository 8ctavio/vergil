---
outline: [2,3]
---

# Placeholder

<script setup>
import { Placeholder } from 'vergil/components'
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

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `label` | `string` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |

### Configuration options

`Placeholder`'s [configuration options](/configuration) allow to overwrite some `Placeholder` props' default values and may be overwritten under the `placeholder` root-level configuration option.

| `placeholder.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ---------------------- | ---- | ------- | :------: |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |

## Anatomy

<Demo>
    <Anatomy tag="div" classes="placeholder">
        <Anatomy tag="Badge" classes="badge"/>
    </Anatomy>
</Demo>

<style>
.placeholder {
    width: 300px;
    height: 80px;
}
</style>