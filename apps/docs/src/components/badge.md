---
outline: [2,3]
---

# Badge

<script setup>
import { Badge as VergilBadge } from '@8ctavio/vergil/components'
</script>

## Basic Usage

```vue
<script setup>
import { Badge } from '@8ctavio/vergil/components'
</script>

<template>
    <Badge>Welcome. Access Granted.</Badge>
</template>
```
<Demo>
    <VergilBadge>Welcome. Access Granted.</VergilBadge>
</Demo>

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

### Size <Badge type="tip"><pre>size: ('sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

Changing the size mainly changes the font-size and adjusts padding accordingly.

<Demo>
    <VergilBadge size="sm" label="Small"/>
    <VergilBadge size="md" label="Medium"/>
    <VergilBadge size="lg" label="Large"/>
    <VergilBadge size="xl" label="Extra Large"/>
</Demo>

### Radius <Badge type="tip"><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <VergilBadge label="Radius" size="sm" radius="none"/>
            <VergilBadge label="Radius" size="md" radius="none"/>
            <VergilBadge label="Radius" size="lg" radius="none"/>
            <VergilBadge label="Radius" size="xl" radius="none"/>
        </div>
        <div class="row center">
            <VergilBadge label="Radius" size="sm" radius="sm"/>
            <VergilBadge label="Radius" size="md" radius="sm"/>
            <VergilBadge label="Radius" size="lg" radius="sm"/>
            <VergilBadge label="Radius" size="xl" radius="sm"/>
        </div>
        <div class="row center">
            <VergilBadge label="Radius" size="sm" radius="md"/>
            <VergilBadge label="Radius" size="md" radius="md"/>
            <VergilBadge label="Radius" size="lg" radius="md"/>
            <VergilBadge label="Radius" size="xl" radius="md"/>
        </div>
        <div class="row center">
            <VergilBadge label="Radius" size="sm" radius="lg"/>
            <VergilBadge label="Radius" size="md" radius="lg"/>
            <VergilBadge label="Radius" size="lg" radius="lg"/>
            <VergilBadge label="Radius" size="xl" radius="lg"/>
        </div>
        <div class="row center">
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

### Squared <Badge><pre>squared: boolean</pre></Badge>

<Demo>
    <VergilBadge size="sm" squared label="Small"/>
    <VergilBadge size="md" squared label="Medium"/>
    <VergilBadge size="lg" squared label="Large"/>
    <VergilBadge size="xl" squared label="Extra Large"/>
</Demo>

### Icon <Badge><pre>icon: string</pre></Badge> <Badge type="info">alias: <pre>icon-left</pre></Badge>

```vue
<Badge icon="rocket_launch"/>
```

<Demo>
    <div class="row center">
        <VergilBadge icon="rocket_launch" theme="brand" variant="solid"/>
        <VergilBadge icon="rocket_launch" theme="brand" variant="soft"/>
        <VergilBadge icon="rocket_launch" theme="brand" variant="subtle"/>
    </div>
    <div class="row center">
        <VergilBadge icon="rocket_launch" theme="user" variant="solid"/>
        <VergilBadge icon="rocket_launch" theme="user" variant="soft"/>
        <VergilBadge icon="rocket_launch" theme="user" variant="subtle"/>
    </div>
    <div class="row center">
        <VergilBadge icon="rocket_launch" theme="ok" variant="solid"/>
        <VergilBadge icon="rocket_launch" theme="ok" variant="soft"/>
        <VergilBadge icon="rocket_launch" theme="ok" variant="subtle"/>
    </div>
    <div class="row center">
        <VergilBadge icon="rocket_launch" theme="info" variant="solid"/>
        <VergilBadge icon="rocket_launch" theme="info" variant="soft"/>
        <VergilBadge icon="rocket_launch" theme="info" variant="subtle"/>
    </div>
    <div class="row center">
        <VergilBadge icon="rocket_launch" theme="warn" variant="solid"/>
        <VergilBadge icon="rocket_launch" theme="warn" variant="soft"/>
        <VergilBadge icon="rocket_launch" theme="warn" variant="subtle"/>
    </div>
    <div class="row center">
        <VergilBadge icon="rocket_launch" theme="danger" variant="solid"/>
        <VergilBadge icon="rocket_launch" theme="danger" variant="soft"/>
        <VergilBadge icon="rocket_launch" theme="danger" variant="subtle"/>
    </div>
    <div class="row center">
        <VergilBadge icon="rocket_launch" theme="neutral" variant="solid"/>
        <VergilBadge icon="rocket_launch" theme="neutral" variant="soft"/>
        <VergilBadge icon="rocket_launch" theme="neutral" variant="subtle"/>
    </div>
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

<Demo>
    <div class="col center">
        <div class="row center">
            <VergilBadge label="Omega" icon-right="special_character" size="sm" spacing="compact"/>
            <VergilBadge label="Omega" icon-right="special_character" size="sm"/>
            <VergilBadge label="Omega" icon-right="special_character" size="sm" spacing="expanded"/>
        </div>
        <div class="row center">
            <VergilBadge label="Omega" icon-right="special_character" size="md" spacing="compact"/>
            <VergilBadge label="Omega" icon-right="special_character" size="md"/>
            <VergilBadge label="Omega" icon-right="special_character" size="md" spacing="expanded"/>
        </div>
        <div class="row center">
            <VergilBadge label="Omega" icon-right="special_character" size="lg" spacing="compact"/>
            <VergilBadge label="Omega" icon-right="special_character" size="lg"/>
            <VergilBadge label="Omega" icon-right="special_character" size="lg" spacing="expanded"/>
        </div>
        <div class="row center">
            <VergilBadge label="Omega" icon-right="special_character" size="xl" spacing="compact"/>
            <VergilBadge label="Omega" icon-right="special_character" size="xl"/>
            <VergilBadge label="Omega" icon-right="special_character" size="xl" spacing="expanded"/>
        </div>
    </div>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `label` | `string` | `''` |
| `variant` | `'soft' \| 'outline' \| 'solid'` | `'soft'` |
| `outline` | `boolean \| 'subtle' \| 'regular' \| 'strong'` | |
| `icon` | `string` | |
| `iconLeft` | `string` | |
| `iconRight` | `string` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `squared` | `boolean` | |

### Configuration options

The following `Badge` props' default values can be overwritten under the `badge` root-level [configuration option](/configuration).

| `badge.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `variant` | |
| `<variant>.outline` | |
| `theme` | ✅ |
| `size` | ✅ |
| `radius` | ✅ |
| `spacing` | ✅ |
| `squared` | |

## Styling

### Anatomy

<Demo>
    <Anatomy tag="p" classes="badge">
        <Anatomy tag="Icon" classes="icon"/>
        <Anatomy tag='slot name="default"'/>
        <Anatomy tag="Icon" classes="icon"/>
    </Anatomy>
</Demo>