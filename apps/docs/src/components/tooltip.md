---
outline: [2,3]
---

# Tooltip

> Tooltips display messages in a popover.

## Demo

<script setup>
import { Tooltip, Btn } from '@8ctavio/vergil/components'
</script>

<Demo>
    <Tooltip text="Lost item can be claimed on lower levels">
        <Btn label="Attention Traveler!"/>
    </Tooltip>
</Demo>

## Props

### Text <Badge><pre>text: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

```vue-html
<Tooltip text="Recon">
    <Btn label="Lost and Found"/>
</Tooltip>
```

<Demo>
    <Tooltip text="Recon">
        <Btn label="Lost and Found"/>
    </Tooltip>
</Demo>

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

Gap distance between reference element and tooltip.

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

### Padding <Badge><pre>padding: number = 6</pre></Badge>

[Shift axis](https://floating-ui.com/docs/shift#mainaxis) virtual padding in `px` left when the tooltip shifts.

### Position <Badge><pre>position: 'absolute' | 'fixed'</pre></Badge>

Tooltip CSS `position` property.

:::tip
If a Tooltip's parent has position `fixed`, use `position: 'fixed'`.
:::

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `text` | `string` | |
| `placement` | `'top' \| 'top-start' \\| 'top-end' \| 'right' \| 'right-start' \| 'right-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end'` | `'top'` |
| `offset` | `number` | `5` |
| `padding` | `number` | `6` |
| `position` | `'absolute' \| 'fixed'` | `'absolute'` |
| `trigger` | `'click' \| 'hover'` | `'hover'` |