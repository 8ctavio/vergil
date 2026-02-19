---
outline: [2,3]
---

# PushButton

<script setup>
import { PushButton } from 'vergil/components'
</script>

## Basic Usage

<Demo>
    <PushButton>Keep it Clean!</PushButton>
</Demo>

```vue
<script setup>
import { PushButton } from '@vrgl/vergil/components'
</script>

<template>
    <PushButton>Keep it Clean!</PushButton>
</template>
```

## Props

### Label <Badge type="tip"><pre>label: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

Simple `PushButton` text content can be specified through the default slot or the `label` prop. The slot content overrides the `label` prop.

```vue
<PushButton label="Click"/>
```

### Variant <Badge type="tip"><pre>variant: ('solid' | 'soft' | 'subtle') = 'solid'</pre></Badge>

<Demo>
    <PushButton variant="solid" label="Solid"/>
    <PushButton variant="soft" label="Soft"/>
    <PushButton variant="subtle" label="Subtle"/>
</Demo>

### Outline <Badge><pre>outline: (boolean | 'subtle' | 'regular' | 'strong')</pre></Badge> <Badge type="warning">only for <pre>soft</pre> and <pre>subtle</pre> variants</Badge>

The `'regular'` and `true` values are equivalent.

<Demo>
    <div class="col center">
        <div class="row center">
            <PushButton variant="soft" outline="subtle" label="Subtle"/>
            <PushButton variant="soft" outline="regular" label="Regular"/>    
            <PushButton variant="soft" outline="strong" label="Strong"/>    
        </div>
        <div class="row center">
            <PushButton variant="subtle" outline="subtle" label="Subtle"/>
            <PushButton variant="subtle" outline="regular" label="Regular"/>    
            <PushButton variant="subtle" outline="strong" label="Strong"/>    
        </div>
    </div>
</Demo>

### Icon <Badge type="tip"><pre>icon: string</pre></Badge> <Badge type="info">alias: <pre>icon-left</pre></Badge>

```vue
<PushButton label="Rocket" icon="rocket_launch"/>
```

<Demo>
    <PushButton icon="rocket_launch" label="Rocket" theme="brand" variant="solid"/>
    <PushButton icon="rocket_launch" label="Rocket" theme="brand" variant="soft"/>
    <PushButton icon="rocket_launch" label="Rocket" theme="brand" variant="subtle"/>
</Demo>

### Icon Right <Badge type="tip"><pre>icon-right: string</pre></Badge>

```vue
<PushButton label="Omega" icon-right="special_character"/>
```

<Demo>
    <PushButton label="Omega" icon-right="special_character" variant="solid"/>
    <PushButton label="Omega" icon-right="special_character" variant="soft"/>
    <PushButton label="Omega" icon-right="special_character" variant="subtle"/>
</Demo>

### Squared <Badge type="tip"><pre>squared: boolean</pre></Badge>

Adding `squared` sets padding to the same value on all sides.

<Demo>
    <PushButton squared label="Squared"/>
</Demo>

### Theme <Badge type="tip"><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <PushButton variant="solid" theme="brand" label="Brand"/>
            <PushButton variant="solid" theme="user" label="User"/>
            <PushButton variant="solid" theme="ok" label="Ok"/>
            <PushButton variant="solid" theme="info" label="Info"/>
            <PushButton variant="solid" theme="warn" label="Warn"/>
            <PushButton variant="solid" theme="danger" label="Danger"/>
            <PushButton variant="solid" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <PushButton variant="soft" theme="brand" label="Brand"/>
            <PushButton variant="soft" theme="user" label="User"/>
            <PushButton variant="soft" theme="ok" label="Ok"/>
            <PushButton variant="soft" theme="info" label="Info"/>
            <PushButton variant="soft" theme="warn" label="Warn"/>
            <PushButton variant="soft" theme="danger" label="Danger"/>
            <PushButton variant="soft" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <PushButton variant="subtle" theme="brand" label="Brand"/>
            <PushButton variant="subtle" theme="user" label="User"/>
            <PushButton variant="subtle" theme="ok" label="Ok"/>
            <PushButton variant="subtle" theme="info" label="Info"/>
            <PushButton variant="subtle" theme="warn" label="Warn"/>
            <PushButton variant="subtle" theme="danger" label="Danger"/>
            <PushButton variant="subtle" theme="neutral" label="Neutral"/>
        </div>
    </div>
</Demo>

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

Changing the size mainly changes the font-size and adjusts padding accordingly.

<Demo>
    <PushButton size="xs" label="Extra Small"/>
    <PushButton size="sm" label="Small"/>
    <PushButton size="md" label="Medium"/>
    <PushButton size="lg" label="Large"/>
    <PushButton size="xl" label="Extra Large"/>
</Demo>

### Radius <Badge type="tip"><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <PushButton label="Radius" size="xs" radius="none"/>
            <PushButton label="Radius" size="sm" radius="none"/>
            <PushButton label="Radius" size="md" radius="none"/>
            <PushButton label="Radius" size="lg" radius="none"/>
            <PushButton label="Radius" size="xl" radius="none"/>
        </div>
        <div class="row center">
            <PushButton label="Radius" size="xs" radius="sm"/>
            <PushButton label="Radius" size="sm" radius="sm"/>  
            <PushButton label="Radius" size="md" radius="sm"/>
            <PushButton label="Radius" size="lg" radius="sm"/>
            <PushButton label="Radius" size="xl" radius="sm"/>
        </div>
        <div class="row center">
            <PushButton label="Radius" size="xs" radius="md"/>
            <PushButton label="Radius" size="sm" radius="md"/>  
            <PushButton label="Radius" size="md" radius="md"/>
            <PushButton label="Radius" size="lg" radius="md"/>
            <PushButton label="Radius" size="xl" radius="md"/>
        </div>
        <div class="row center">
            <PushButton label="Radius" size="xs" radius="lg"/>
            <PushButton label="Radius" size="sm" radius="lg"/>  
            <PushButton label="Radius" size="md" radius="lg"/>
            <PushButton label="Radius" size="lg" radius="lg"/>
            <PushButton label="Radius" size="xl" radius="lg"/>
        </div>
        <div class="row center">
            <PushButton label="Radius" size="xs" radius="full"/>
            <PushButton label="Radius" size="sm" radius="full"/>
            <PushButton label="Radius" size="md" radius="full"/>
            <PushButton label="Radius" size="lg" radius="full"/>
            <PushButton label="Radius" size="xl" radius="full"/>
        </div>
    </div>
</Demo>

### Spacing <Badge type="tip"><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

Spacing refers to a `PushButton`'s default padding and gap (for a given size). Changing spacing gives either a more compact or spacious look.

<Demo>
    <div class="col center">
        <div class="row center">
            <PushButton size="xs" spacing="compact" label="Compact"/>
            <PushButton size="xs" label="Default"/>
            <PushButton size="xs" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <PushButton size="sm" spacing="compact" label="Compact"/>
            <PushButton size="sm" label="Default"/>
            <PushButton size="sm" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <PushButton size="md" spacing="compact" label="Compact"/>
            <PushButton size="md" label="Default"/>
            <PushButton size="md" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <PushButton size="lg" spacing="compact" label="Compact"/>
            <PushButton size="lg" label="Default"/>
            <PushButton size="lg" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <PushButton size="xl" spacing="compact" label="Compact"/>
            <PushButton size="xl" label="Default"/>
            <PushButton size="xl" spacing="expanded" label="Expanded"/>
        </div>
    </div>
</Demo>



### Disabled <Badge type="tip"><pre>disabled: boolean</pre></Badge>

<Demo>
    <PushButton disabled label="Disabled" variant="solid"/>
    <PushButton disabled label="Disabled" variant="soft"/>
    <PushButton disabled label="Disabled" variant="subtle"/>
</Demo>

### Loading <Badge type="tip"><pre>loading: boolean</pre></Badge>

<Demo>
    <PushButton label="Loading" loading variant="solid"/>
    <PushButton label="Loading" loading variant="soft"/>
    <PushButton label="Loading" loading variant="subtle"/>
</Demo>

<Demo>
    <div class="row center">
        <PushButton label="Loading" loading theme="user" variant="solid"/>
        <PushButton label="Loading" loading theme="user" variant="soft"/>
        <PushButton label="Loading" loading theme="user" variant="subtle"/>
    </div>
    <div class="row center">
        <PushButton label="Loading" loading theme="ok" variant="solid"/>
        <PushButton label="Loading" loading theme="ok" variant="soft"/>
        <PushButton label="Loading" loading theme="ok" variant="subtle"/>
    </div>
    <div class="row center">
        <PushButton label="Loading" loading theme="info" variant="solid"/>
        <PushButton label="Loading" loading theme="info" variant="soft"/>
        <PushButton label="Loading" loading theme="info" variant="subtle"/>
    </div>
    <div class="row center">
        <PushButton label="Loading" loading theme="warn" variant="solid"/>
        <PushButton label="Loading" loading theme="warn" variant="soft"/>
        <PushButton label="Loading" loading theme="warn" variant="subtle"/>
    </div>
    <div class="row center">
        <PushButton label="Loading" loading theme="danger" variant="solid"/>
        <PushButton label="Loading" loading theme="danger" variant="soft"/>
        <PushButton label="Loading" loading theme="danger" variant="subtle"/>
    </div>
    <div class="row center">
        <PushButton label="Loading" loading theme="neutral" variant="solid"/>
        <PushButton label="Loading" loading theme="neutral" variant="soft"/>
        <PushButton label="Loading" loading theme="neutral" variant="subtle"/>
    </div>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <PushButton label="Loading" loading size="xs" spacing="compact"/>
            <PushButton label="Loading" loading size="xs"/>
            <PushButton label="Loading" loading size="xs" spacing="expanded"/>
        </div>
        <div class="row center">
            <PushButton label="Loading" loading size="sm" spacing="compact"/>
            <PushButton label="Loading" loading size="sm"/>
            <PushButton label="Loading" loading size="sm" spacing="expanded"/>
        </div>
        <div class="row center">
            <PushButton label="Loading" loading size="md" spacing="compact"/>
            <PushButton label="Loading" loading size="md"/>
            <PushButton label="Loading" loading size="md" spacing="expanded"/>
        </div>
        <div class="row center">
            <PushButton label="Loading" loading size="lg" spacing="compact"/>
            <PushButton label="Loading" loading size="lg"/>
            <PushButton label="Loading" loading size="lg" spacing="expanded"/>
        </div>
        <div class="row center">
            <PushButton label="Loading" loading size="xl" spacing="compact"/>
            <PushButton label="Loading" loading size="xl"/>
            <PushButton label="Loading" loading size="xl" spacing="expanded"/>
        </div>
    </div>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `label` | `string` | `''` |
| `variant` | `'solid' \| 'soft' \| 'subtle'` | `'solid'` |
| `outline` | `boolean \| 'subtle' \| 'regular' \| 'strong'` | |
| `icon` | `string` | |
| `iconLeft` | `string` | |
| `iconRight` | `string` | |
| `squared` | `boolean` | |
| `disabled` | `boolean` | |
| `loading` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |

### Configuration options

`PushButton`'s [configuration options](/configuration) allow to overwrite some `PushButton` props' default values and may be overwritten under the `pushButton` root-level configuration option.

| `pushButton.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ---------------- | ---- | ------- | :------: |
| `variant` | `'solid' \| 'soft' \| 'subtle'` | `'solid'` | |
| `<variant>.outline` | `boolean \| 'subtle' \| 'regular' \| 'strong'` | | |
| `squared` | `boolean` | | |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |

## Anatomy

<Demo>
    <Anatomy tag="button" classes="push-button">
        <Anatomy tag="Icon" classes="icon"/>
        <Anatomy tag='slot name="default"'/>
        <Anatomy tag="Icon" classes="icon"/>
        <Anatomy tag="div" classes="btn-loader">
            <Anatomy tag="span" classes="btn-spinner"/>
        </Anatomy>
    </Anatomy>
</Demo>