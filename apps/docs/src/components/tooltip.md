---
outline: [2,3]
---

# Tooltip

> Tooltips display messages in a popover.

## Basic Usage

<script setup>
import { Tooltip, Btn } from '@8ctavio/vergil/components'
</script>

<Demo>
    <Tooltip text="Lost item can be claimed on lower levels">
        <Btn label="Attention Traveler!"/>
    </Tooltip>
</Demo>

```vue
<script setup>
import { Tooltip, Btn } from '@8ctavio/vergil/components'
</script>

<template>
    <Tooltip text="Lost item can be claimed on lower levels">
        <Btn label="Attention Traveler!"/>
    </Tooltip>
</template>
```

## Props

All [`Popover`](/composables/usePopover#popover) props are available for `Tooltip`.

### Text <Badge><pre>text: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

```vue-html
<Tooltip text="Recon">
    <Btn label="Lost and Found"/>
</Tooltip>
```

### Placement <Badge><pre>placement: string = 'top'</pre></Badge>

Possible `placement` values are shown below.

```ts
type placement
    = 'top' | 'top-start' | 'top-end'
    | 'right' | 'right-start' | 'right-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
```

### Offset <Badge><pre>offset: number = 5</pre></Badge>

Distance in `px` of gap between reference element and tooltip.

```vue-html
<Tooltip text="Text" placement="bottom" :offset="0">
    <Btn label="Tooltip"/>
</Tooltip>
```

<Demo>
    <Tooltip text="Text" placement="bottom" :offset="0">
        <Btn label="Tooltip"/>
    </Tooltip>
</Demo>

### Padding <Badge><pre>padding: number = 6</pre></Badge>

[Shift axis](https://floating-ui.com/docs/shift#mainaxis) virtual padding in `px` left when the tooltip shifts.

### Delay <Badge><pre>delay: number</pre></Badge>

Popover opening delay in milliseconds. If the `trigger` prop is set to `'hover'`, `delay` defaults to `400`.

```vue-html
<Tooltip text="Tooltip" :delay="0">
    <Btn label="Toggle Tooltip"/>
</Tooltip>
```

<Demo>
    <Tooltip text="Tooltip" :delay="0">
        <Btn label="Toggle Tooltip"/>
    </Tooltip>
</Demo>

### Trigger <Badge><pre>trigger: 'click' | 'hover' = 'hover'</pre></Badge>

```vue-html
<Tooltip text="Hover Trigger" trigger="hover">
    <Btn label="Hover Tooltip"/>
</Tooltip>
<Tooltip text="Click Trigger" trigger="click">
    <Btn label="Click Tooltip"/>
</Tooltip>
```

<Demo>
    <Tooltip text="Hover Trigger" trigger="hover">
        <Btn label="Hover Tooltip"/>
    </Tooltip>
    <Tooltip text="Click Trigger" trigger="click">
        <Btn label="Click Tooltip"/>
    </Tooltip>
</Demo>

### Position <Badge><pre>position: 'absolute' | 'fixed'</pre></Badge>

Tooltip CSS `position` property.

:::tip
If a Tooltip's parent has position `fixed`, use `position: 'fixed'`.
:::

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `text` | `string` | |
| `placement` | `'top' \| 'top-start' \| 'top-end' \| 'right' \| 'right-start' \| 'right-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end'` | `'top'` |
| `offset` | `number` | `5` |
| `padding` | `number` | |
| `delay` | `number` | |
| `trigger` | `'click' \| 'hover'` | `'hover'` |
| `position` | `'absolute' \| 'fixed'` | `'absolute'` |

### Configuration options

The following `Tooltip` props' default values can be overwritten under the `tooltip` root-level [configuration option](/configuration).

| `tooltip.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `placement` | |
| `offset` | |