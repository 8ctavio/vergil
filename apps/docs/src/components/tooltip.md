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
    <ClientOnly>
        <Tooltip text="Lost item can be claimed on lower levels">
            <Btn label="Attention Traveler!"/>
        </Tooltip>
    </ClientOnly>
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

### Delay <Badge><pre>delay: number</pre></Badge>

Popover opening delay in milliseconds. If the `trigger` prop is set to `'hover'`, `delay` defaults to `400`.

```vue-html
<Tooltip text="Tooltip" :delay="0">
    <Btn label="Toggle Tooltip"/>
</Tooltip>
```

<Demo>
    <ClientOnly>
        <Tooltip text="Tooltip" :delay="0">
            <Btn label="Toggle Tooltip"/>
        </Tooltip>
    </ClientOnly>
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
    <ClientOnly>
        <Tooltip text="Hover Trigger" trigger="hover">
            <Btn label="Hover Tooltip"/>
        </Tooltip>
        <Tooltip text="Click Trigger" trigger="click">
            <Btn label="Click Tooltip"/>
        </Tooltip>
    </ClientOnly>
</Demo>

### Arrow <Badge><pre>arrow: boolean</pre></Badge>

```vue-html
<Tooltip text="Tooltip with Arrow" arrow>
    <Btn label="Arrow"/>
</Tooltip>
```

<Demo>
    <ClientOnly>
        <Tooltip text="Tooltip with Arrow" arrow>
            <Btn label="Arrow"/>
        </Tooltip>
    </ClientOnly>
</Demo>

### Offset <Badge><pre>offset: number</pre></Badge>

Distance in `px` of gap between reference element and tooltip.

```vue-html
<Tooltip text="Text" placement="bottom" :offset="0">
    <Btn label="Tooltip"/>
</Tooltip>
```

<Demo>
    <ClientOnly>
        <Tooltip text="Text" placement="bottom" :offset="0">
            <Btn label="Tooltip"/>
        </Tooltip>
    </ClientOnly>
</Demo>

The `offset` prop default value is determined through a function that receives the `arrow` prop. The following function is used by default.

```js
arrow => arrow ? 2 : 5
```

### Padding <Badge><pre>padding: number = 6</pre></Badge>

[Shift axis](https://floating-ui.com/docs/shift#mainaxis) virtual padding in `px` left when the tooltip shifts.

### Placement <Badge><pre>placement: Placement = 'top'</pre></Badge>

Possible `placement` values are shown below.

```ts
type Placement =
    | 'top' | 'top-start' | 'top-end'
    | 'right' | 'right-start' | 'right-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
```

### Position <Badge><pre>position: 'absolute' | 'fixed'</pre></Badge>

Tooltip CSS `position` property.

:::tip
If a Tooltip's parent has position `fixed`, use `position: 'fixed'`.
:::

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `text` | `string` | |
| `arrow` | `boolean` | |
| `delay` | `number` | |
| `padding` | `number` | |
| `placement` | `'top' \| 'top-start' \| 'top-end' \| 'right' \| 'right-start' \| 'right-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end'` | `'top'` |
| `position` | `'absolute' \| 'fixed'` | `'absolute'` |
| `offset` | `number` | `5` |
| `trigger` | `'click' \| 'hover'` | `'hover'` |

### Configuration options

`Tooltip`'s [configuration options](/configuration) allow to overwrite some `Tooltip` props' default values and may be overwritten under the `tooltip` root-level configuration option.

| `tooltip.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ------------------ | ---- | ------- | :------: |
| `arrow` | `boolean` | `false` | |
| `offset` | `(arror: boolean) => number` | `arrow => arrow ? 2 : 5` | |
| `placement` | `'top' \| 'top-start' \| 'top-end' \| 'right' \| 'right-start' \| 'right-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end'` | `'top'` | |