---
outline: [2,3]
---

# Badge

<script setup>
import { Badge as VergilBadge } from '@8ctavio/vergil/components'
</script>

## Basic Usage

<Demo>
    <VergilBadge>Welcome. Access Granted.</VergilBadge>
</Demo>

```vue
<script setup>
import { Badge } from '@8ctavio/vergil/components'
</script>

<template>
    <Badge>Welcome. Access Granted.</Badge>
</template>
```

## Props

### Label <Badge><pre>label: string = ''</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

Text content can be specified through the default slot or the `label` prop. The slot content overrides the `label` prop.

```vue
<Badge label="Construction ahead. Expect delays."/>
```

### Variant <Badge><pre>variant: ('solid' | 'soft' | 'subtle') = 'soft'</pre></Badge>

<Demo>
    <VergilBadge variant="solid" label="Solid"/>
    <VergilBadge variant="soft" label="Soft"/>
    <VergilBadge variant="subtle" label="Subtle"/>
</Demo>

### Outline <Badge><pre>outline: (boolean | 'subtle' | 'regular' | 'strong')</pre></Badge> <Badge type="warning">only for <pre>soft</pre> and <pre>subtle</pre> variants</Badge>

The `'regular'` and `true` values are equivalent.

<Demo>
    <div class="col center">
        <div class="row center">
            <VergilBadge variant="soft" outline="subtle" label="Subtle"/>
            <VergilBadge variant="soft" outline="regular" label="Regular"/>    
            <VergilBadge variant="soft" outline="strong" label="Strong"/>    
        </div>
        <div class="row center">
            <VergilBadge variant="subtle" outline="subtle" label="Subtle"/>
            <VergilBadge variant="subtle" outline="regular" label="Regular"/>    
            <VergilBadge variant="subtle" outline="strong" label="Strong"/>    
        </div>
    </div>
</Demo>

### Icon <Badge><pre>icon: string</pre></Badge> <Badge type="info">alias: <pre>icon-left</pre></Badge>

```vue
<Badge icon="rocket_launch"/>
```

<Demo>
    <VergilBadge icon="rocket_launch" theme="brand" variant="solid"/>
    <VergilBadge icon="rocket_launch" theme="brand" variant="soft"/>
    <VergilBadge icon="rocket_launch" theme="brand" variant="subtle"/>
</Demo>

### Icon Right <Badge><pre>icon-right: string</pre></Badge>

```vue
<Badge label="Omega" icon-right="special_character"/>
```

<Demo>
    <VergilBadge label="Omega" icon-right="special_character" variant="solid"/>
    <VergilBadge label="Omega" icon-right="special_character" variant="soft"/>
    <VergilBadge label="Omega" icon-right="special_character" variant="subtle"/>
</Demo>

### Squared <Badge><pre>squared: boolean</pre></Badge>

<Demo>
    <VergilBadge squared label="Squared"/>
</Demo>

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <VergilBadge variant="solid" theme="brand" label="Brand"/>
            <VergilBadge variant="solid" theme="user" label="User"/>
            <VergilBadge variant="solid" theme="ok" label="Ok"/>
            <VergilBadge variant="solid" theme="info" label="Info"/>
            <VergilBadge variant="solid" theme="warn" label="Warn"/>
            <VergilBadge variant="solid" theme="danger" label="Danger"/>
            <VergilBadge variant="solid" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <VergilBadge variant="soft" theme="brand" label="Brand"/>
            <VergilBadge variant="soft" theme="user" label="User"/>
            <VergilBadge variant="soft" theme="ok" label="Ok"/>
            <VergilBadge variant="soft" theme="info" label="Info"/>
            <VergilBadge variant="soft" theme="warn" label="Warn"/>
            <VergilBadge variant="soft" theme="danger" label="Danger"/>
            <VergilBadge variant="soft" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <VergilBadge variant="subtle" theme="brand" label="Brand"/>
            <VergilBadge variant="subtle" theme="user" label="User"/>
            <VergilBadge variant="subtle" theme="ok" label="Ok"/>
            <VergilBadge variant="subtle" theme="info" label="Info"/>
            <VergilBadge variant="subtle" theme="warn" label="Warn"/>
            <VergilBadge variant="subtle" theme="danger" label="Danger"/>
            <VergilBadge variant="subtle" theme="neutral" label="Neutral"/>
        </div>
    </div>
</Demo>

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <VergilBadge size="xs" label="Extra Small"/>
    <VergilBadge size="sm" label="Small"/>
    <VergilBadge size="md" label="Medium"/>
    <VergilBadge size="lg" label="Large"/>
    <VergilBadge size="xl" label="Extra Large"/>
</Demo>

### Radius <Badge type="tip"><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <VergilBadge label="Radius" size="xs" radius="none"/>
            <VergilBadge label="Radius" size="sm" radius="none"/>
            <VergilBadge label="Radius" size="md" radius="none"/>
            <VergilBadge label="Radius" size="lg" radius="none"/>
            <VergilBadge label="Radius" size="xl" radius="none"/>
        </div>
        <div class="row center">
            <VergilBadge label="Radius" size="xs" radius="sm"/>
            <VergilBadge label="Radius" size="sm" radius="sm"/>
            <VergilBadge label="Radius" size="md" radius="sm"/>
            <VergilBadge label="Radius" size="lg" radius="sm"/>
            <VergilBadge label="Radius" size="xl" radius="sm"/>
        </div>
        <div class="row center">
            <VergilBadge label="Radius" size="xs" radius="md"/>
            <VergilBadge label="Radius" size="sm" radius="md"/>
            <VergilBadge label="Radius" size="md" radius="md"/>
            <VergilBadge label="Radius" size="lg" radius="md"/>
            <VergilBadge label="Radius" size="xl" radius="md"/>
        </div>
        <div class="row center">
            <VergilBadge label="Radius" size="xs" radius="lg"/>
            <VergilBadge label="Radius" size="sm" radius="lg"/>
            <VergilBadge label="Radius" size="md" radius="lg"/>
            <VergilBadge label="Radius" size="lg" radius="lg"/>
            <VergilBadge label="Radius" size="xl" radius="lg"/>
        </div>
        <div class="row center">
            <VergilBadge label="Radius" size="xs" radius="full"/>
            <VergilBadge label="Radius" size="sm" radius="full"/>
            <VergilBadge label="Radius" size="md" radius="full"/>
            <VergilBadge label="Radius" size="lg" radius="full"/>
            <VergilBadge label="Radius" size="xl" radius="full"/>
        </div>
    </div>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <VergilBadge size="xs" spacing="compact" label="Compact"/>
            <VergilBadge size="xs" label="Default"/>
            <VergilBadge size="xs" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <VergilBadge size="sm" spacing="compact" label="Compact"/>
            <VergilBadge size="sm" label="Default"/>
            <VergilBadge size="sm" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <VergilBadge size="md" spacing="compact" label="Compact"/>
            <VergilBadge size="md" label="Default"/>
            <VergilBadge size="md" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <VergilBadge size="lg" spacing="compact" label="Compact"/>
            <VergilBadge size="lg" label="Default"/>
            <VergilBadge size="lg" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <VergilBadge size="xl" spacing="compact" label="Compact"/>
            <VergilBadge size="xl" label="Default"/>
            <VergilBadge size="xl" spacing="expanded" label="Expanded"/>
        </div>
    </div>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `label` | `string` | `''` |
| `variant` | `'soft' \| 'outline' \| 'solid'` | `'soft'` |
| `outline` | `boolean \| 'subtle' \| 'regular' \| 'strong'` | |
| `icon` | `string` | |
| `iconLeft` | `string` | |
| `iconRight` | `string` | |
| `squared` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |

### Configuration options

`Badge`'s [configuration options](/configuration) allow to overwrite some `Badge` props' default values and may be overwritten under the `badge` root-level configuration option.

| `badge.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ---------------- | ---- | ------- | :------: |
| `variant` | `'soft' \| 'outline' \| 'solid'` | `'soft'` | |
| `<variant>.outline` | `boolean \| 'subtle' \| 'regular' \| 'strong'` | | |
| `squared` | `boolean` | | |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |

## Anatomy

<Demo>
    <Anatomy tag="p" classes="badge">
        <Anatomy tag="Icon" classes="icon"/>
        <Anatomy tag='slot name="default"'/>
        <Anatomy tag="Icon" classes="icon"/>
    </Anatomy>
</Demo>