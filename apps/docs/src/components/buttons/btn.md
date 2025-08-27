---
outline: [2,3]
---

# Btn

> Button element to handle click events

<script setup>
import { Btn } from '@8ctavio/vergil/components'
</script>

## Basic Usage

<Demo>
    <Btn>Keep it Clean!</Btn>
</Demo>

```vue
<script setup>
import { Btn } from '@8ctavio/vergil/components'
</script>

<template>
    <Btn>Keep it Clean!</Btn>
</template>
```

## Props

### Label <Badge type="tip"><pre>label: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

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

### Mask <Badge><pre>mask: ('ghost' | 'form-field')</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn mask="ghost" label="Ghost" variant="solid"/>
            <Btn mask="ghost" label="Ghost" variant="soft"/>
            <Btn mask="ghost" label="Ghost" variant="subtle"/>    
        </div>
        <div class="row center">
            <Btn mask="form-field" label="Form Field" variant="solid"/>
            <Btn mask="form-field" label="Form Field" variant="soft"/>
            <Btn mask="form-field" label="Form Field" variant="subtle"/>  
        </div>
    </div>
</Demo>

### Outline <Badge><pre>outline: (boolean | 'subtle' | 'regular' | 'strong')</pre></Badge>

The `'regular'` and `true` values are equivalent. For the `solid` variant, only buttons with `mask` are affected.

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn variant="solid" outline="subtle" label="Subtle" mask="ghost"/>
            <Btn variant="solid" outline="regular" label="Regular" mask="ghost"/>
            <Btn variant="solid" outline="strong" label="Strong" mask="ghost"/>
        </div>
        <div class="row center">
            <Btn variant="solid" outline="subtle" label="Subtle" mask="form-field"/>
            <Btn variant="solid" outline="regular" label="Regular" mask="form-field"/>
            <Btn variant="solid" outline="strong" label="Strong" mask="form-field"/>
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

### Fill <Badge><pre>fill: boolean</pre></Badge> <Badge type="warning">only for *masked* buttons</Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn fill mask="ghost" variant="solid" label="Hover me!"/>
            <Btn fill mask="ghost" variant="soft" label="Hover me!"/>
            <Btn fill mask="ghost" variant="subtle" label="Hover me!"/>
        </div>
        <div class="row center">
            <Btn fill mask="form-field" variant="solid" label="Hover me!"/>
            <Btn fill mask="form-field" variant="soft" label="Hover me!"/>
            <Btn fill mask="form-field" variant="subtle" label="Hover me!"/>
        </div>
    </div>
</Demo>

### Underline <Badge><pre>underline: boolean</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn underline fill mask="ghost" variant="solid" label="Underline"/>
            <Btn underline fill mask="ghost" variant="soft" label="Underline"/>
            <Btn underline fill mask="ghost" variant="subtle" label="Underline"/>
        </div>
        <div class="row center">
            <Btn underline fill mask="form-field" variant="solid" label="Underline"/>
            <Btn underline fill mask="form-field" variant="soft" label="Underline"/>
            <Btn underline fill mask="form-field" variant="subtle" label="Underline"/>
        </div>
    </div>
</Demo>

### Icon <Badge><pre>icon: string</pre></Badge> <Badge type="info">alias: <pre>icon-left</pre></Badge>

```vue
<Btn icon="rocket_launch"/>
```

<Demo>
    <Btn icon="rocket_launch" theme="brand" variant="solid"/>
    <Btn icon="rocket_launch" theme="brand" variant="soft"/>
    <Btn icon="rocket_launch" theme="brand" variant="subtle" outline="subtle"/>
    <Btn icon="rocket_launch" theme="brand" variant="soft" mask="ghost"/>
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

### Squared <Badge type="tip"><pre>squared: boolean</pre></Badge>

Adding `squared` sets padding to the same value on all sides.

<Demo>
    <Btn squared label="Squared"/>
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
            <Btn variant="solid" mask="ghost" outline theme="brand" label="Brand"/>
            <Btn variant="solid" mask="ghost" outline theme="user" label="User"/>
            <Btn variant="solid" mask="ghost" outline theme="ok" label="Ok"/>
            <Btn variant="solid" mask="ghost" outline theme="info" label="Info"/>
            <Btn variant="solid" mask="ghost" outline theme="warn" label="Warn"/>
            <Btn variant="solid" mask="ghost" outline theme="danger" label="Danger"/>
            <Btn variant="solid" mask="ghost" outline theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="soft" mask="ghost" outline theme="brand" label="Brand"/>
            <Btn variant="soft" mask="ghost" outline theme="user" label="User"/>
            <Btn variant="soft" mask="ghost" outline theme="ok" label="Ok"/>
            <Btn variant="soft" mask="ghost" outline theme="info" label="Info"/>
            <Btn variant="soft" mask="ghost" outline theme="warn" label="Warn"/>
            <Btn variant="soft" mask="ghost" outline theme="danger" label="Danger"/>
            <Btn variant="soft" mask="ghost" outline theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Btn variant="subtle" mask="ghost" outline="subtle" theme="brand" label="Brand"/>
            <Btn variant="subtle" mask="ghost" outline="subtle" theme="user" label="User"/>
            <Btn variant="subtle" mask="ghost" outline="subtle" theme="ok" label="Ok"/>
            <Btn variant="subtle" mask="ghost" outline="subtle" theme="info" label="Info"/>
            <Btn variant="subtle" mask="ghost" outline="subtle" theme="warn" label="Warn"/>
            <Btn variant="subtle" mask="ghost" outline="subtle" theme="danger" label="Danger"/>
            <Btn variant="subtle" mask="ghost" outline="subtle" theme="neutral" label="Neutral"/>
        </div>
    </div>
</Demo>

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <Btn size="xs" label="Extra Small"/>
    <Btn size="sm" label="Small"/>
    <Btn size="md" label="Medium"/>
    <Btn size="lg" label="Large"/>
    <Btn size="xl" label="Extra Large"/>
</Demo>

### Radius <Badge type="tip"><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn label="Radius" size="xs" radius="none"/>
            <Btn label="Radius" size="sm" radius="none"/>  
            <Btn label="Radius" size="md" radius="none"/>
            <Btn label="Radius" size="lg" radius="none"/>
            <Btn label="Radius" size="xl" radius="none"/>
        </div>
        <div class="row center">
            <Btn label="Radius" size="xs" radius="sm"/>
            <Btn label="Radius" size="sm" radius="sm"/>
            <Btn label="Radius" size="md" radius="sm"/>
            <Btn label="Radius" size="lg" radius="sm"/>
            <Btn label="Radius" size="xl" radius="sm"/>
        </div>
        <div class="row center">
            <Btn label="Radius" size="xs" radius="md"/>
            <Btn label="Radius" size="sm" radius="md"/>
            <Btn label="Radius" size="md" radius="md"/>
            <Btn label="Radius" size="lg" radius="md"/>
            <Btn label="Radius" size="xl" radius="md"/>
        </div>
        <div class="row center">
            <Btn label="Radius" size="xs" radius="lg"/>
            <Btn label="Radius" size="sm" radius="lg"/>
            <Btn label="Radius" size="md" radius="lg"/>
            <Btn label="Radius" size="lg" radius="lg"/>
            <Btn label="Radius" size="xl" radius="lg"/>
        </div>
        <div class="row center">
            <Btn label="Radius" size="xs" radius="full"/>
            <Btn label="Radius" size="sm" radius="full"/>  
            <Btn label="Radius" size="md" radius="full"/>
            <Btn label="Radius" size="lg" radius="full"/>
            <Btn label="Radius" size="xl" radius="full"/>
        </div>
    </div>
</Demo>

### Spacing <Badge type="tip"><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn size="xs" spacing="compact" label="Compact"/>
            <Btn size="xs" label="Default"/>
            <Btn size="xs" spacing="expanded" label="Expanded"/>
        </div>
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
            <Btn loading label="Loading" mask="ghost" variant="solid"/>
            <Btn loading label="Loading" mask="ghost" variant="soft"/>
            <Btn loading label="Loading" mask="ghost" variant="subtle"/>
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
            <Btn label="Loading" loading size="xs" spacing="compact"/>
            <Btn label="Loading" loading size="xs"/>
            <Btn label="Loading" loading size="xs" spacing="expanded"/>
        </div>
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

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `label` | `string` | |
| `variant` | `'solid' \| 'soft' \| 'subtle'` | `'solid'` |
| `mask` | `'ghost' \| 'form-field'` | |
| `outline` | `boolean \| 'subtle' \| 'regular' \| 'strong'` | |
| `underline` | `boolean` | |
| `fill` | `boolean` | |
| `icon` | `string` | |
| `iconLeft` | `string` | |
| `iconRight` | `string` | |
| `squared` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |

### Configuration options

`Btn`'s [configuration options](/configuration) allow to overwrite some `Btn` props' default values and may be overwritten under the `btn` root-level configuration option.

| `btn.<option>` | type | default | [global](/configuration#global-configuration-options) |
| -------------- | ---- | ------- | :------: |
| `variant` | `'solid' \| 'soft' \| 'subtle'` | `'solid'` | |
| `<variant>.mask` | `'ghost' \| 'form-field'` | | |
| `<variant>.outline` | `boolean \| 'subtle' \| 'regular' \| 'strong'` | | |
| `<variant>.underline` | `boolean` | | |
| `<variant>.fill` | `boolean` | | |
| `squared` | `boolean` | | |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |

## Anatomy

<Demo>
    <Anatomy tag="button" classes="btn">
        <Anatomy tag="span" classes="btn-backdrop"/>
        <Anatomy tag="div" classes="btn-content">
            <Anatomy tag="Icon" classes="icon"/>
            <Anatomy tag='slot name="default"'/>
            <Anatomy tag="Icon" classes="icon"/>
            <Anatomy tag="div" classes="btn-loader">
                <Anatomy tag="span" classes="btn-spinner"/>
            </Anatomy>
        </Anatomy>
        <Anatomy tag='slot name="aside"'/>
    </Anatomy>
</Demo>