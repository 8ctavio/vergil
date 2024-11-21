---
outline: [2,3]
---

# Icon

> Easily display Material Symbols icons

<script setup>
    import { Icon } from '@8ctavio/vergil/components'
</script>

## Usage

<Demo>
    <Icon code="snowboarding"/>
</Demo>

```vue
<script setup>
    import { Icon } from '@8ctavio/vergil/components'
</script>

<template>
    <Icon code="snowboarding"/>
</template>
```

:::tip
Vergil uses [Material Symbols](https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols). In order for icons to display properly, it is required to import Material Symbols to the project's main css file as follows

```css
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:FILL@1");
:::

## Props

### Code <Badge type="tip"><pre>code: string = ''</pre></Badge>

Material Symbols icon code.

```vue
<Icon :code="iconCode"/>
```

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `code` | `string` | `''` |

## Anatomy

<Demo>
    <Anatomy tag="span" classes="icon"/>
</Demo>