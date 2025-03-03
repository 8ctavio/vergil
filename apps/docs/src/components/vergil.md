---
outline: [2,3]
---

# Vergil

> Application wrapper for global enablement of some components.

<script setup>
import { DataList, Btn } from '@8ctavio/vergil/components'
</script>

## Usage

```vue
<script setup>
import { Vergil } from '@8ctavio/vergil/components'
</script>

<template>
    <Vergil>
        <AppLayout/>
    </Vergil>
</template>
```

## Description

Applications should be wrapped with `Vergil` in order to globally enable the use of some components. In particular, `Vergil` enables popovers created by [`usePopover`](/composables/usePopover), and other components may be enabled through props.

## Props

### Confirm <Badge><pre>confirm: boolean</pre></Badge>

Enables the [`Confirm`](/components/confirm) component.

### Popup <Badge><pre>popup: boolean</pre></Badge>

Allows to display [`Popup`](/components/popup) components as modal windows.

### Toaster <Badge><pre>toaster: boolean</pre></Badge>

Enables [Toasters](/components/toast#toaster-8203) to programatically display [`Toast`](/components/toast) components.

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `confirm` | `boolean` | |
| `popup` | `boolean` | |
| `toaster` | `boolean` | |