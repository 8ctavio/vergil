---
outline: [2,3]
---

# Radio

<script setup>
import { Radio } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const vehicles = useModel('')
</script>

## Basic Usage

```vue
<script setup>
import { Radio } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const vehicles = useModel('')
</script>

<template>
    <Radio v-model="vehicles" name="vehicles" value="mongoose" label="Mongoose"/>
    <Radio v-model="vehicles" name="vehicles" value="warthog" label="Warthog"/>
    <Radio v-model="vehicles" name="vehicles" value="scorpion" label="Scorpion"/>
</template>
```
<Demo>
    <div class="col">
        <div class="row center">
            <Radio v-model="vehicles" name="vehicles" value="mongoose" label="Mongoose"/>
            <Radio v-model="vehicles" name="vehicles" value="warthog" label="Warthog"/>
            <Radio v-model="vehicles" name="vehicles" value="scorpion" label="Scorpion"/>
        </div>
        <div class="row center">
            <code>vehicles.value === '{{vehicles.value}}'</code>
        </div>
    </div>
</Demo>

## Attributes

All attributes (except `class`) passed to `Radio` are applied to its underlying [`<input type="radio">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) element. Just like with the native form field element, it is important to set the `name` and `value` attributes.

:::tip
Always provide `name` to improve (keyboard) usability and accessibility.
:::

## Props

### Label <Badge><pre>label: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

The `label` slot may be use instead. The slot content overrides the `label` prop.

```vue
<Radio name="armor" value="mark-iv" label="Mark IV"/>
<Radio name="armor" value="mark-v" label="Mark V"/>
<Radio name="armor" value="mark-vi" label="Mark VI"/>
```

<Demo>
    <Radio name="armor" value="mark-iv" label="Mark IV"/>
    <Radio name="armor" value="mark-v" label="Mark V"/>
    <Radio name="armor" value="mark-vi" label="Mark VI"/>
</Demo>

### Description <Badge><pre>description: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

The `description` slot may be use instead. The slot content overrides the `description` prop.

```vue
<Radio label="Label" description="Description"/>
```

<Demo>
    <Radio value="-" label="Label" description="Description"/>
</Demo>

### Variant <Badge><pre>variant: ('classic' | 'card' | 'toggle' | 'list') = 'classic'</pre></Badge>

<Demo>
    <div class="col starts">
        <div class="row center">
            <Radio name="variant" value="1" variant="classic" label="Classic"/>
            <Radio name="variant" value="2" variant="card" label="Card"/>
            <Radio name="variant" value="3" variant="toggle" label="Toggle"/>
            <Radio name="variant" value="4" variant="list" label="List"/>
        </div>
        <div class="row center">
            <Radio name="variant" value="5" variant="classic" label="Classic" description="Description"/>
            <Radio name="variant" value="6" variant="card" label="Card" description="Description"/>
            <Radio name="variant" value="7" variant="toggle" label="Toggle" description="Description"/>
            <Radio name="variant" value="8" variant="list" label="List" description="Description"/>
        </div>
    </div>
</Demo>

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <Radio name="theme" value="brand" theme="brand" label="Brand" checked/>
    <Radio name="theme" value="user" theme="user" label="User"/>
    <Radio name="theme" value="ok" theme="ok" label="Ok"/>
    <Radio name="theme" value="info" theme="info" label="Info"/>
    <Radio name="theme" value="warn" theme="warn" label="Warn"/>
    <Radio name="theme" value="danger" theme="danger" label="Danger"/>
    <Radio name="theme" value="neutral" theme="neutral" label="Neutral"/>
</Demo>

### Size <Badge><pre>size: ('sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <Radio name="size" value="sm" size="sm" label="Small"/>
    <Radio name="size" value="md" size="md" label="Medium"/>
    <Radio name="size" value="lg" size="lg" label="Large"/>
    <Radio name="size" value="xl" size="xl" label="Extra Large"/>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'full'</pre></Badge>

<Demo>
    <Radio name="radius" value="none" label="None" radius="none"/>
    <Radio name="radius" value="sm" label="Small" radius="sm"/>
    <Radio name="radius" value="md" label="Medium" radius="md"/>
    <Radio name="radius" value="lg" label="Large" radius="lg"/>
    <Radio name="radius" value="full" label="Full" radius="full"/>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <Radio name="spacing-sm" value="compact" size="sm" spacing="compact" label="Compact"/>
            <Radio name="spacing-sm" value="deafult" size="sm" label="Default"/>
            <Radio name="spacing-sm" value="expanded" size="sm" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Radio name="spacing-md" value="compact" size="md" spacing="compact" label="Compact"/>
            <Radio name="spacing-md" value="deafult" size="md" label="Default"/>
            <Radio name="spacing-md" value="expanded" size="md" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Radio name="spacing-lg" value="compact" size="lg" spacing="compact" label="Compact"/>
            <Radio name="spacing-lg" value="deafult" size="lg" label="Default"/>
            <Radio name="spacing-lg" value="expanded" size="lg" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Radio name="spacing-xl" value="compact" size="xl" spacing="compact" label="Compact"/>
            <Radio name="spacing-xl" value="deafult" size="xl" label="Default"/>
            <Radio name="spacing-xl" value="expanded" size="xl" spacing="expanded" label="Expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Radio disabled label="Disabled" variant="classic" checked/>
            <Radio disabled label="Disabled" variant="classic"/>
        </div>
        <div class="row center">
            <Radio disabled label="Disabled" variant="card" checked/>
            <Radio disabled label="Disabled" variant="card"/>    
        </div>
        <div class="row center">
            <Radio disabled label="Disabled" variant="toggle" checked/>
            <Radio disabled label="Disabled" variant="toggle"/>    
        </div>
        <div class="row center">
            <Radio disabled label="Disabled" variant="list" checked/>
            <Radio disabled label="Disabled" variant="list"/>    
        </div>
    </div>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `name` | `string` | |
| `label` | `string` | |
| `description` | `string` | |
| `variant` | `'classic' \| 'card' \| 'toggle' \| 'list'` | `'classic'` |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'full'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `disabled` | `boolean` | |

### Configuration options

The following `Radio` props' default values can be overwritten under the `radio` root-level [configuration option](/configuration).

| `radio.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `variant` | |
| `theme` | ✅ |
| `size` | ✅ |
| `radius` | ✅ |
| `spacing` | ✅ |

:::tip
For the `'classic'` variant the `radius` global configuration option is ignored. If the `radio` component configuration option is not set, the `'full'` value is applied.
:::

## Styling

### Anatomy

<Demo>
    <Anatomy tag="label" classes="radio">
        <Anatomy tag='input[type="radio"]'/>
        <Anatomy tag="span" classes="toggle-button">
            <Anatomy tag="svg" classes="toggle-radio"/>
        </Anatomy>
        <Anatomy tag="p" classes="toggle-label">
            <Anatomy tag="slot #default"/>
        </Anatomy>
        <Anatomy tag="p" classes="toggle-description">
            <Anatomy tag="slot #description"/>
        </Anatomy>
    </Anatomy>
</Demo>