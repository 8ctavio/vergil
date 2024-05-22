---
outline: [2,3]
---

# Btn <Badge type="tip"><pre>.btn</pre></Badge>

> Button element to handle click events

<script setup>
    import { Btn } from '@8ctavio/vergil/components'
</script>

## Basic Usage

```vue
<script setup>
    import { Btn } from '@8ctavio/vergil/components'
</script>

<template>
    <Btn>Keep it Clean!</Btn>
</template>
```
<Demo>
    <Btn>Keep it Clean!</Btn>
</Demo>

## Props

### Label <Badge type="tip"><pre>label: string = ''</pre></Badge>

Simple `Btn` text content can be specified through the default slot or the `label` prop. The slot content overrides the `label` prop.

```vue
<Btn label="Click"/>
```

### Variant <Badge type="tip"><pre>variant: ('default' | 'solid' | 'soft' | 'ghost' | 'text' | 'outline') = 'default'</pre></Badge>

<Demo>
    <Btn variant="default" label="Default"/>
    <Btn variant="solid" label="Solid"/>
    <Btn variant="soft" label="Soft"/>
    <Btn variant="ghost" label="Ghost"/>
    <Btn variant="text" label="Text"/>
    <Btn variant="outline" label="Outline"/>
</Demo>

### Fill  <Badge type="tip"><pre>fill: boolean</pre></Badge> <Badge type="warning">only for <pre>variant = "default"</pre></Badge>

```vue
<Btn fill label="Hover me!"/>
```
<Demo>
    <Btn fill label="Hover me!"/>
</Demo>

### Borderless <Badge type="tip"><pre>borderless: boolean</pre></Badge> <Badge type="warning">only for <pre>variant = "default"</pre></Badge>

```vue
<Btn borderless label="Borderless"/>
```
<Demo>
    <Btn borderless label="Borderless"/>
</Demo>

### Theme <Badge type="tip"><pre>theme: ('brand' | 'ok' | 'info' | 'warn' | 'danger' | 'neutral') = 'brand'</pre></Badge>

There are aliases available for some `theme` prop values:

| Value      | Aliases |
| ---------- | ------- |
| `'ok'`     | `'success', 'check'` |
| `'info'`   | `'help', 'tip'` |
| `'warn'`   | `'warning', 'caution'` |
| `'danger'` | `'error'` |

<Demo>
    <div class="col">
        <div class="row center">
            <Btn variant="default" theme="brand" label="Brand"/>
            <Btn variant="default" theme="ok" label="Ok"/>
            <Btn variant="default" theme="info" label="Info"/>
            <Btn variant="default" theme="warn" label="Warn"/>
            <Btn variant="default" theme="danger" label="Danger"/>
            <Btn variant="default" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="solid" theme="brand" label="Brand"/>
            <Btn variant="solid" theme="ok" label="Ok"/>
            <Btn variant="solid" theme="info" label="Info"/>
            <Btn variant="solid" theme="warn" label="Warn"/>
            <Btn variant="solid" theme="danger" label="Danger"/>
            <Btn variant="solid" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="soft" theme="brand" label="Brand"/>
            <Btn variant="soft" theme="ok" label="Ok"/>
            <Btn variant="soft" theme="info" label="Info"/>
            <Btn variant="soft" theme="warn" label="Warn"/>
            <Btn variant="soft" theme="danger" label="Danger"/>
            <Btn variant="soft" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="ghost" theme="brand" label="Brand"/>
            <Btn variant="ghost" theme="ok" label="Ok"/>
            <Btn variant="ghost" theme="info" label="Info"/>
            <Btn variant="ghost" theme="warn" label="Warn"/>
            <Btn variant="ghost" theme="danger" label="Danger"/>
            <Btn variant="ghost" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="text" theme="brand" label="Brand"/>
            <Btn variant="text" theme="ok" label="Ok"/>
            <Btn variant="text" theme="info" label="Info"/>
            <Btn variant="text" theme="warn" label="Warn"/>
            <Btn variant="text" theme="danger" label="Danger"/>
            <Btn variant="text" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="outline" theme="brand" label="Brand"/>
            <Btn variant="outline" theme="ok" label="Ok"/>
            <Btn variant="outline" theme="info" label="Info"/>
            <Btn variant="outline" theme="warn" label="Warn"/>
            <Btn variant="outline" theme="danger" label="Danger"/>
            <Btn variant="outline" theme="neutral" label="Neutral"/>
        </div>
    </div>
</Demo>

### Size <Badge type="tip"><pre>size: ('sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

Changing the size mainly changes the font-size and adjusts padding accordingly.

<Demo>
    <Btn size="sm" label="Small"/>
    <Btn size="md" label="Medium"/>
    <Btn size="lg" label="Large"/>
    <Btn size="xl" label="Extra Large"/>
</Demo>

### Spacing <Badge type="tip"><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

Spacing refers to a `Btn`'s default padding and gap (for a given size). Changing spacing gives either a more compact or spacious look.

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn size="sm" spacing="compact" label="Compact"/>
            <Btn size="sm" label="Default"/>
            <Btn size="sm" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Btn size="md" spacing="compact" label="Compact"/>
            <Btn size="md" label="Default"/>
            <Btn size="md" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Btn size="lg" spacing="compact" label="Compact"/>
            <Btn size="lg" label="Default"/>
            <Btn size="lg" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Btn size="xl" spacing="compact" label="Compact"/>
            <Btn size="xl" label="Default"/>
            <Btn size="xl" spacing="expanded" label="Expanded"/>
        </div>
    </div>
</Demo>

### Squared <Badge type="tip"><pre>squared: boolean</pre></Badge>

Adding `squared` sets padding to the same value on all sides.

<Demo>
    <Btn size="sm" squared label="Small"/>
    <Btn size="md" squared label="Medium"/>
    <Btn size="lg" squared label="Large"/>
    <Btn size="xl" squared label="Extra Large"/>
</Demo>

### Disabled <Badge type="tip"><pre>disabled: boolean</pre></Badge>

<Demo>
    <Btn disabled variant="default" label="Disabled"/>
    <Btn disabled variant="solid" label="Disabled"/>
    <Btn disabled variant="soft" label="Disabled"/>
    <Btn disabled variant="ghost" label="Disabled"/>
    <Btn disabled variant="text" label="Disabled"/>
    <Btn disabled variant="outline" label="Disabled"/>
</Demo>

### Loading <Badge type="tip"><pre>loading: boolean</pre></Badge>

<Demo>
    <Btn label="Loading" loading variant="default"/>
    <Btn label="Loading" loading variant="solid"/>
    <Btn label="Loading" loading variant="soft"/>
    <Btn label="Loading" loading variant="ghost"/>
    <Btn label="Loading" loading variant="text"/>
    <Btn label="Loading" loading variant="outline"/>
</Demo>

<Demo>
    <div class="row center">
        <Btn label="Loading" loading theme="ok" variant="default"/>
        <Btn label="Loading" loading theme="ok" variant="solid"/>
        <Btn label="Loading" loading theme="ok" variant="soft"/>
        <Btn label="Loading" loading theme="ok" variant="ghost"/>
        <Btn label="Loading" loading theme="ok" variant="text"/>
        <Btn label="Loading" loading theme="ok" variant="outline"/>
    </div>
    <div class="row center">
        <Btn label="Loading" loading theme="info" variant="default"/>
        <Btn label="Loading" loading theme="info" variant="solid"/>
        <Btn label="Loading" loading theme="info" variant="soft"/>
        <Btn label="Loading" loading theme="info" variant="ghost"/>
        <Btn label="Loading" loading theme="info" variant="text"/>
        <Btn label="Loading" loading theme="info" variant="outline"/>
    </div>
    <div class="row center">
        <Btn label="Loading" loading theme="warn" variant="default"/>
        <Btn label="Loading" loading theme="warn" variant="solid"/>
        <Btn label="Loading" loading theme="warn" variant="soft"/>
        <Btn label="Loading" loading theme="warn" variant="ghost"/>
        <Btn label="Loading" loading theme="warn" variant="text"/>
        <Btn label="Loading" loading theme="warn" variant="outline"/>
    </div>
    <div class="row center">
        <Btn label="Loading" loading theme="danger" variant="default"/>
        <Btn label="Loading" loading theme="danger" variant="solid"/>
        <Btn label="Loading" loading theme="danger" variant="soft"/>
        <Btn label="Loading" loading theme="danger" variant="ghost"/>
        <Btn label="Loading" loading theme="danger" variant="text"/>
        <Btn label="Loading" loading theme="danger" variant="outline"/>
    </div>
    <div class="row center">
        <Btn label="Loading" loading theme="neutral" variant="default"/>
        <Btn label="Loading" loading theme="neutral" variant="solid"/>
        <Btn label="Loading" loading theme="neutral" variant="soft"/>
        <Btn label="Loading" loading theme="neutral" variant="ghost"/>
        <Btn label="Loading" loading theme="neutral" variant="text"/>
        <Btn label="Loading" loading theme="neutral" variant="outline"/>
    </div>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn label="Loading" loading size="sm" spacing="compact"/>
            <Btn label="Loading" loading size="sm"/>
            <Btn label="Loading" loading size="sm" spacing="expanded"/>
        </div>
        <div class="row center">
            <Btn label="Loading" loading size="md" spacing="compact"/>
            <Btn label="Loading" loading size="md"/>
            <Btn label="Loading" loading size="md" spacing="expanded"/>
        </div>
        <div class="row center">
            <Btn label="Loading" loading size="lg" spacing="compact"/>
            <Btn label="Loading" loading size="lg"/>
            <Btn label="Loading" loading size="lg" spacing="expanded"/>
        </div>
        <div class="row center">
            <Btn label="Loading" loading size="xl" spacing="compact"/>
            <Btn label="Loading" loading size="xl"/>
            <Btn label="Loading" loading size="xl" spacing="expanded"/>
        </div>
    </div>
</Demo>

### Icon <Badge type="tip"><pre>icon: string</pre></Badge> <Badge type="info">alias: <pre>icon-left</pre></Badge>

```vue
<Btn icon="rocket_launch"/>
```

<Demo>
    <div class="row center">
        <Btn icon="rocket_launch" theme="brand" variant="default"/>
        <Btn icon="rocket_launch" theme="brand" variant="solid"/>
        <Btn icon="rocket_launch" theme="brand" variant="soft"/>
        <Btn icon="rocket_launch" theme="brand" variant="ghost"/>
        <Btn icon="rocket_launch" theme="brand" variant="text"/>
        <Btn icon="rocket_launch" theme="brand" variant="outline"/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="ok" variant="default"/>
        <Btn icon="rocket_launch" theme="ok" variant="solid"/>
        <Btn icon="rocket_launch" theme="ok" variant="soft"/>
        <Btn icon="rocket_launch" theme="ok" variant="ghost"/>
        <Btn icon="rocket_launch" theme="ok" variant="text"/>
        <Btn icon="rocket_launch" theme="ok" variant="outline"/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="info" variant="default"/>
        <Btn icon="rocket_launch" theme="info" variant="solid"/>
        <Btn icon="rocket_launch" theme="info" variant="soft"/>
        <Btn icon="rocket_launch" theme="info" variant="ghost"/>
        <Btn icon="rocket_launch" theme="info" variant="text"/>
        <Btn icon="rocket_launch" theme="info" variant="outline"/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="warn" variant="default"/>
        <Btn icon="rocket_launch" theme="warn" variant="solid"/>
        <Btn icon="rocket_launch" theme="warn" variant="soft"/>
        <Btn icon="rocket_launch" theme="warn" variant="ghost"/>
        <Btn icon="rocket_launch" theme="warn" variant="text"/>
        <Btn icon="rocket_launch" theme="warn" variant="outline"/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="danger" variant="default"/>
        <Btn icon="rocket_launch" theme="danger" variant="solid"/>
        <Btn icon="rocket_launch" theme="danger" variant="soft"/>
        <Btn icon="rocket_launch" theme="danger" variant="ghost"/>
        <Btn icon="rocket_launch" theme="danger" variant="text"/>
        <Btn icon="rocket_launch" theme="danger" variant="outline"/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="neutral" variant="default"/>
        <Btn icon="rocket_launch" theme="neutral" variant="solid"/>
        <Btn icon="rocket_launch" theme="neutral" variant="soft"/>
        <Btn icon="rocket_launch" theme="neutral" variant="ghost"/>
        <Btn icon="rocket_launch" theme="neutral" variant="text"/>
        <Btn icon="rocket_launch" theme="neutral" variant="outline"/>
    </div>
</Demo>

### Icon Right <Badge type="tip"><pre>icon-right: string</pre></Badge>

```vue
<Btn label="Omega" icon-right="special_character"/>
```

<Demo>
    <Btn label="Omega" icon-right="special_character" variant="default"/>
    <Btn label="Omega" icon-right="special_character" variant="solid"/>
    <Btn label="Omega" icon-right="special_character" variant="soft"/>
    <Btn label="Omega" icon-right="special_character" variant="ghost"/>
    <Btn label="Omega" icon-right="special_character" variant="text"/>
    <Btn label="Omega" icon-right="special_character" variant="outline"/>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn label="Omega" icon-right="special_character" size="sm" spacing="compact"/>
            <Btn label="Omega" icon-right="special_character" size="sm"/>
            <Btn label="Omega" icon-right="special_character" size="sm" spacing="expanded"/>
        </div>
        <div class="row center">
            <Btn label="Omega" icon-right="special_character" size="md" spacing="compact"/>
            <Btn label="Omega" icon-right="special_character" size="md"/>
            <Btn label="Omega" icon-right="special_character" size="md" spacing="expanded"/>
        </div>
        <div class="row center">
            <Btn label="Omega" icon-right="special_character" size="lg" spacing="compact"/>
            <Btn label="Omega" icon-right="special_character" size="lg"/>
            <Btn label="Omega" icon-right="special_character" size="lg" spacing="expanded"/>
        </div>
        <div class="row center">
            <Btn label="Omega" icon-right="special_character" size="xl" spacing="compact"/>
            <Btn label="Omega" icon-right="special_character" size="xl"/>
            <Btn label="Omega" icon-right="special_character" size="xl" spacing="expanded"/>
        </div>
    </div>
</Demo>

## Styling

### Anatomy

![Btn Anatomy](../../assets/btn-anatomy.png)

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `label` | `string` | `''` |
| `variant` | `'default' \| 'solid' \| 'soft' \| 'ghost' \| 'text' \| 'outline'` | `'default'` |
| `fill` | `boolean` | `false` |
| `borderless` | `boolean` | `false` |
| `theme` | `'brand' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `squared` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `icon` | `string` | `''` |
| `icon-left` | `string` | `''` |
| `icon-right` | `string` | `''` |