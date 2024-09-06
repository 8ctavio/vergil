---
outline: [2,3]
---

# Btn

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

### Label <Badge type="tip"><pre>label: string = ''</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

Simple `Btn` text content can be specified through the default slot or the `label` prop. The slot content overrides the `label` prop.

```vue
<Btn label="Click"/>
```

### Variant <Badge><pre>variant: ('solid' | 'soft' | 'subtle') = 'solid'</pre></Badge>

<Demo>
    <Btn variant="solid" label="Solid"/>
    <Btn variant="soft" label="Soft"/>
    <Btn variant="subtle" label="Subtle"/>
</Demo>

### Ghost <Badge><pre>ghost: (boolean | 'transparent' | 'translucent')</pre></Badge>

The `'transparent'` value is equivalent to `ghost = true`.

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn ghost label="Transparent" variant="solid"/>
            <Btn ghost label="Transparent" variant="soft"/>
            <Btn ghost label="Transparent" variant="subtle"/>    
        </div>
        <div class="row center">
            <Btn ghost="translucent" label="Translucent" variant="solid"/>
            <Btn ghost="translucent" label="Translucent" variant="soft"/>
            <Btn ghost="translucent" label="Translucent" variant="subtle"/>  
        </div>
    </div>
</Demo>

### Outline <Badge><pre>outline: (boolean | 'subtle' | 'regular' | 'strong')</pre></Badge>

For both the `soft` and `subtle` variants, the `'regular'` and `true` values are equivalent. In the case of the `solid` variant, `outline` is always coerced to a boolean, and only `ghost` buttons are affected.

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn variant="solid" ghost outline label="Outline"/>
        </div>
        <div class="row center">
            <Btn variant="soft" outline="subtle" label="Subtle"/>
            <Btn variant="soft" outline="regular" label="Regular"/>    
            <Btn variant="soft" outline="strong" label="Strong"/>    
        </div>
        <div class="row center">
            <Btn variant="subtle" outline="subtle" label="Subtle"/>
            <Btn variant="subtle" outline="regular" label="Regular"/>    
            <Btn variant="subtle" outline="strong" label="Strong"/>    
        </div>
    </div>
</Demo>

### Fill <Badge><pre>fill: boolean</pre></Badge> <Badge type="warning">only for <pre>ghost</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn fill ghost="transparent" variant="solid" label="Hover me!"/>
            <Btn fill ghost="transparent" variant="soft" label="Hover me!"/>
            <Btn fill ghost="transparent" variant="subtle" label="Hover me!"/>
        </div>
        <div class="row center">
            <Btn fill ghost="translucent" variant="solid" label="Hover me!"/>
            <Btn fill ghost="translucent" variant="soft" label="Hover me!"/>
            <Btn fill ghost="translucent" variant="subtle" label="Hover me!"/>
        </div>
    </div>
</Demo>

### Underline <Badge><pre>underline: boolean</pre></Badge> <Badge type="warning">only for <pre>ghost</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn underline fill ghost="transparent" variant="solid" label="Underline"/>
            <Btn underline fill ghost="transparent" variant="soft" label="Underline"/>
            <Btn underline fill ghost="transparent" variant="subtle" label="Underline"/>
        </div>
        <div class="row center">
            <Btn underline fill ghost="translucent" variant="solid" label="Underline"/>
            <Btn underline fill ghost="translucent" variant="soft" label="Underline"/>
            <Btn underline fill ghost="translucent" variant="subtle" label="Underline"/>
        </div>
    </div>
</Demo>

### Theme <Badge type="tip"><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <Btn variant="solid" theme="brand" label="Brand"/>
            <Btn variant="solid" theme="user" label="User"/>
            <Btn variant="solid" theme="ok" label="Ok"/>
            <Btn variant="solid" theme="info" label="Info"/>
            <Btn variant="solid" theme="warn" label="Warn"/>
            <Btn variant="solid" theme="danger" label="Danger"/>
            <Btn variant="solid" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="soft" theme="brand" label="Brand"/>
            <Btn variant="soft" theme="user" label="User"/>
            <Btn variant="soft" theme="ok" label="Ok"/>
            <Btn variant="soft" theme="info" label="Info"/>
            <Btn variant="soft" theme="warn" label="Warn"/>
            <Btn variant="soft" theme="danger" label="Danger"/>
            <Btn variant="soft" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="soft" outline="subtle" theme="brand" label="Brand"/>
            <Btn variant="soft" outline="subtle" theme="user" label="User"/>
            <Btn variant="soft" outline="subtle" theme="ok" label="Ok"/>
            <Btn variant="soft" outline="subtle" theme="info" label="Info"/>
            <Btn variant="soft" outline="subtle" theme="warn" label="Warn"/>
            <Btn variant="soft" outline="subtle" theme="danger" label="Danger"/>
            <Btn variant="soft" outline="subtle" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="soft" outline="regular" theme="brand" label="Brand"/>
            <Btn variant="soft" outline="regular" theme="user" label="User"/>
            <Btn variant="soft" outline="regular" theme="ok" label="Ok"/>
            <Btn variant="soft" outline="regular" theme="info" label="Info"/>
            <Btn variant="soft" outline="regular" theme="warn" label="Warn"/>
            <Btn variant="soft" outline="regular" theme="danger" label="Danger"/>
            <Btn variant="soft" outline="regular" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="soft" outline="strong" theme="brand" label="Brand"/>
            <Btn variant="soft" outline="strong" theme="user" label="User"/>
            <Btn variant="soft" outline="strong" theme="ok" label="Ok"/>
            <Btn variant="soft" outline="strong" theme="info" label="Info"/>
            <Btn variant="soft" outline="strong" theme="warn" label="Warn"/>
            <Btn variant="soft" outline="strong" theme="danger" label="Danger"/>
            <Btn variant="soft" outline="strong" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="subtle" theme="brand" label="Brand"/>
            <Btn variant="subtle" theme="user" label="User"/>
            <Btn variant="subtle" theme="ok" label="Ok"/>
            <Btn variant="subtle" theme="info" label="Info"/>
            <Btn variant="subtle" theme="warn" label="Warn"/>
            <Btn variant="subtle" theme="danger" label="Danger"/>
            <Btn variant="subtle" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="subtle" outline="subtle" theme="brand" label="Brand"/>
            <Btn variant="subtle" outline="subtle" theme="user" label="User"/>
            <Btn variant="subtle" outline="subtle" theme="ok" label="Ok"/>
            <Btn variant="subtle" outline="subtle" theme="info" label="Info"/>
            <Btn variant="subtle" outline="subtle" theme="warn" label="Warn"/>
            <Btn variant="subtle" outline="subtle" theme="danger" label="Danger"/>
            <Btn variant="subtle" outline="subtle" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="subtle" outline="regular" theme="brand" label="Brand"/>
            <Btn variant="subtle" outline="regular" theme="user" label="User"/>
            <Btn variant="subtle" outline="regular" theme="ok" label="Ok"/>
            <Btn variant="subtle" outline="regular" theme="info" label="Info"/>
            <Btn variant="subtle" outline="regular" theme="warn" label="Warn"/>
            <Btn variant="subtle" outline="regular" theme="danger" label="Danger"/>
            <Btn variant="subtle" outline="regular" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="subtle" outline="strong" theme="brand" label="Brand"/>
            <Btn variant="subtle" outline="strong" theme="user" label="User"/>
            <Btn variant="subtle" outline="strong" theme="ok" label="Ok"/>
            <Btn variant="subtle" outline="strong" theme="info" label="Info"/>
            <Btn variant="subtle" outline="strong" theme="warn" label="Warn"/>
            <Btn variant="subtle" outline="strong" theme="danger" label="Danger"/>
            <Btn variant="subtle" outline="strong" theme="neutral" label="Neutral"/>
        </div>
    </div>
</Demo>

<Demo>
    <div class="col">
        <div class="row center">
            <Btn variant="solid" ghost outline theme="brand" label="Brand"/>
            <Btn variant="solid" ghost outline theme="user" label="User"/>
            <Btn variant="solid" ghost outline theme="ok" label="Ok"/>
            <Btn variant="solid" ghost outline theme="info" label="Info"/>
            <Btn variant="solid" ghost outline theme="warn" label="Warn"/>
            <Btn variant="solid" ghost outline theme="danger" label="Danger"/>
            <Btn variant="solid" ghost outline theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="soft" ghost outline theme="brand" label="Brand"/>
            <Btn variant="soft" ghost outline theme="user" label="User"/>
            <Btn variant="soft" ghost outline theme="ok" label="Ok"/>
            <Btn variant="soft" ghost outline theme="info" label="Info"/>
            <Btn variant="soft" ghost outline theme="warn" label="Warn"/>
            <Btn variant="soft" ghost outline theme="danger" label="Danger"/>
            <Btn variant="soft" ghost outline theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="subtle" ghost outline="subtle" theme="brand" label="Brand"/>
            <Btn variant="subtle" ghost outline="subtle" theme="user" label="User"/>
            <Btn variant="subtle" ghost outline="subtle" theme="ok" label="Ok"/>
            <Btn variant="subtle" ghost outline="subtle" theme="info" label="Info"/>
            <Btn variant="subtle" ghost outline="subtle" theme="warn" label="Warn"/>
            <Btn variant="subtle" ghost outline="subtle" theme="danger" label="Danger"/>
            <Btn variant="subtle" ghost outline="subtle" theme="neutral" label="Neutral"/>
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

### Radius <Badge type="tip"><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn label="Radius" size="sm" radius="none"/>
            <Btn label="Radius" size="md" radius="none"/>
            <Btn label="Radius" size="lg" radius="none"/>
            <Btn label="Radius" size="xl" radius="none"/>
        </div>
        <div class="row center">
            <Btn label="Radius" size="sm" radius="sm"/>
            <Btn label="Radius" size="md" radius="sm"/>
            <Btn label="Radius" size="lg" radius="sm"/>
            <Btn label="Radius" size="xl" radius="sm"/>
        </div>
        <div class="row center">
            <Btn label="Radius" size="sm" radius="md"/>
            <Btn label="Radius" size="md" radius="md"/>
            <Btn label="Radius" size="lg" radius="md"/>
            <Btn label="Radius" size="xl" radius="md"/>
        </div>
        <div class="row center">
            <Btn label="Radius" size="sm" radius="lg"/>
            <Btn label="Radius" size="md" radius="lg"/>
            <Btn label="Radius" size="lg" radius="lg"/>
            <Btn label="Radius" size="xl" radius="lg"/>
        </div>
        <div class="row center">
            <Btn label="Radius" size="sm" radius="full"/>
            <Btn label="Radius" size="md" radius="full"/>
            <Btn label="Radius" size="lg" radius="full"/>
            <Btn label="Radius" size="xl" radius="full"/>
        </div>
    </div>
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
    <div class="col center">
        <div class="row center">
            <Btn disabled label="Disabled" variant="solid"/>
            <Btn disabled label="Disabled" variant="soft"/>
            <Btn disabled label="Disabled" variant="subtle"/>
        </div>
        <div class="row center">
            <Btn disabled label="Disabled" outline variant="solid"/>
            <Btn disabled label="Disabled" outline variant="soft"/>
            <Btn disabled label="Disabled" outline variant="subtle"/>
        </div>
        <div class="row center">
            <Btn disabled label="Disabled" underline variant="solid"/>
            <Btn disabled label="Disabled" underline variant="soft"/>
            <Btn disabled label="Disabled" underline variant="subtle"/>
        </div>
    </div>
</Demo>

### Loading <Badge><pre>loading: boolean</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn loading label="Loading" ghost variant="solid"/>
            <Btn loading label="Loading" ghost variant="soft"/>
            <Btn loading label="Loading" ghost variant="subtle"/>
        </div>
        <div class="row center">
            <Btn loading label="Loading" outline="subtle" variant="solid"/>
            <Btn loading label="Loading" outline="subtle" variant="soft"/>
            <Btn loading label="Loading" outline="subtle" variant="subtle"/>
        </div>
        <div class="row center">
            <Btn loading label="Loading" underline variant="solid"/>
            <Btn loading label="Loading" underline variant="soft"/>
            <Btn loading label="Loading" underline variant="subtle"/>
        </div>
    </div>
</Demo>

<Demo>
    <div class="row center">
        <Btn label="Loading" loading theme="user" variant="solid"/>
        <Btn label="Loading" loading theme="user" variant="soft"/>
        <Btn label="Loading" loading theme="user" variant="subtle"/>
    </div>
    <div class="row center">
        <Btn label="Loading" loading theme="ok" variant="solid"/>
        <Btn label="Loading" loading theme="ok" variant="soft"/>
        <Btn label="Loading" loading theme="ok" variant="subtle"/>
    </div>
    <div class="row center">
        <Btn label="Loading" loading theme="info" variant="solid"/>
        <Btn label="Loading" loading theme="info" variant="soft"/>
        <Btn label="Loading" loading theme="info" variant="subtle"/>
    </div>
    <div class="row center">
        <Btn label="Loading" loading theme="warn" variant="solid"/>
        <Btn label="Loading" loading theme="warn" variant="soft"/>
        <Btn label="Loading" loading theme="warn" variant="subtle"/>
    </div>
    <div class="row center">
        <Btn label="Loading" loading theme="danger" variant="solid"/>
        <Btn label="Loading" loading theme="danger" variant="soft"/>
        <Btn label="Loading" loading theme="danger" variant="subtle"/>
    </div>
    <div class="row center">
        <Btn label="Loading" loading theme="neutral" variant="solid"/>
        <Btn label="Loading" loading theme="neutral" variant="soft"/>
        <Btn label="Loading" loading theme="neutral" variant="subtle"/>
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

### Icon <Badge><pre>icon: string</pre></Badge> <Badge type="info">alias: <pre>icon-left</pre></Badge>

```vue
<Btn icon="rocket_launch"/>
```

<Demo>
    <div class="row center">
        <Btn icon="rocket_launch" theme="brand" variant="solid"/>
        <Btn icon="rocket_launch" theme="brand" variant="soft"/>
        <Btn icon="rocket_launch" theme="brand" variant="subtle" outline="subtle"/>
        <Btn icon="rocket_launch" theme="brand" variant="soft" ghost/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="user" variant="solid"/>
        <Btn icon="rocket_launch" theme="user" variant="soft"/>
        <Btn icon="rocket_launch" theme="user" variant="subtle" outline="subtle"/>
        <Btn icon="rocket_launch" theme="user" variant="soft" ghost/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="ok" variant="solid"/>
        <Btn icon="rocket_launch" theme="ok" variant="soft"/>
        <Btn icon="rocket_launch" theme="ok" variant="subtle" outline="subtle"/>
        <Btn icon="rocket_launch" theme="ok" variant="soft" ghost/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="info" variant="solid"/>
        <Btn icon="rocket_launch" theme="info" variant="soft"/>
        <Btn icon="rocket_launch" theme="info" variant="subtle" outline="subtle"/>
        <Btn icon="rocket_launch" theme="info" variant="soft" ghost/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="warn" variant="solid"/>
        <Btn icon="rocket_launch" theme="warn" variant="soft"/>
        <Btn icon="rocket_launch" theme="warn" variant="subtle" outline="subtle"/>
        <Btn icon="rocket_launch" theme="warn" variant="soft" ghost/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="danger" variant="solid"/>
        <Btn icon="rocket_launch" theme="danger" variant="soft"/>
        <Btn icon="rocket_launch" theme="danger" variant="subtle" outline="subtle"/>
        <Btn icon="rocket_launch" theme="danger" variant="soft" ghost/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" theme="neutral" variant="solid"/>
        <Btn icon="rocket_launch" theme="neutral" variant="soft"/>
        <Btn icon="rocket_launch" theme="neutral" variant="subtle" outline="subtle"/>
        <Btn icon="rocket_launch" theme="neutral" variant="soft" ghost/>
    </div>
</Demo>

### Icon Right <Badge><pre>icon-right: string</pre></Badge>

```vue
<Btn label="Omega" icon-right="special_character"/>
```

<Demo>
    <Btn label="Omega" icon-right="special_character" variant="solid"/>
    <Btn label="Omega" icon-right="special_character" variant="soft"/>
    <Btn label="Omega" icon-right="special_character" variant="subtle"/>
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

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `label` | `string` | |
| `variant` | `'solid' \| 'soft' \| 'subtle'` | `'solid'` |
| `ghost` | `boolean \| 'transparent' \| 'translucent'` | |
| `outline` | `boolean \| 'subtle' \| 'regular' \| 'strong'` | |
| `underline` | `boolean` | |
| `fill` | `boolean` | |
| `icon` | `string` | |
| `iconLeft` | `string` | |
| `iconRight` | `string` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `squared` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |

### Configuration options

The following `Btn` props' default values can be overwritten under the `btn` root-level [configuration option](/configuration).

| `btn.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `variant` | |
| `<variant>.ghost` | |
| `<variant>.outline` | |
| `<variant>.underline` | |
| `<variant>.fill` | |
| `theme` | ✅ |
| `size` | ✅ |
| `radius` | ✅ |
| `spacing` | ✅ |
| `squared` | |

## Styling

### Anatomy

<Demo>
    <Anatomy tag="button" classes="btn">
        <Anatomy tag="span" classes="btn-backdrop"/>
        <Anatomy tag="div" classes="btn-content">
            <Anatomy tag="Icon" classes="icon"/>
            <Anatomy tag="slot #default"/>
            <Anatomy tag="Icon" classes="icon"/>
            <Anatomy tag="div" classes="btn-loader">
                <Anatomy tag="span" classes="btn-spinner"/>
            </Anatomy>
        </Anatomy>
    </Anatomy>
</Demo>