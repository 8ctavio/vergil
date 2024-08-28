---
outline: [2,3]
---

# Checkbox

<script setup>
import { Checkbox } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const checked = useModel(false)
const planet = useModel('')
const planets = useModel([])
</script>

## Basic Usage

```vue
<script setup>
import { Checkbox } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const checked = useModel(false)
const planet = useModel('')
const planets = useModel([])
</script>

<template>
    <!-- Single boolean value -->
    <Checkbox v-model="checked" label="Checkbox"/>

    <!-- Multiple values, single selection -->
    <Checkbox v-model="planet" value="earth" label="Earth"/>
    <Checkbox v-model="planet" value="reach" label="Reach"/>
    <Checkbox v-model="planet" value="harvest" label="Harvest"/>

    <!-- Multiple values, multiple selection -->
    <Checkbox v-model="planets" value="Arcadia" label="Arcadia"/>
    <Checkbox v-model="planets" value="requiem" label="Requiem"/>
    <Checkbox v-model="planets" value="sanghelios" label="Sanghelios"/>
</template>
```
<Demo>
    <div class="col">
        <div class="row center">
            <Checkbox v-model="checked" label="Checkbox"/>
        </div>
        <div class="row center">
            <code>checked.value === {{ checked.value }}</code>
        </div>
        <div class="row center">
            <Checkbox v-model="planet" value="earth" label="Earth"/>
            <Checkbox v-model="planet" value="reach" label="Reach"/>
            <Checkbox v-model="planet" value="harvest" label="Harvest"/>
        </div>
        <div class="row center">
            <code>planet.value === '{{ planet.value }}'</code>
        </div>
        <div class="row center">
            <Checkbox v-model="planets" value="arcadia" label="Arcadia"/>
            <Checkbox v-model="planets" value="requiem" label="Requiem"/>
            <Checkbox v-model="planets" value="sanghelios" label="Sanghelios"/>
        </div>
        <div class="row center">
            <code>planets.value === {{ planets.value }}</code>
        </div>
    </div>
</Demo>

## Props

### Checked value <Badge><pre>value[-checked]: (boolean | string) = true</pre></Badge>

The `value-checked` prop is used both as the underlying `input[type="checkbox"]` element's `value` attribute and as the Vue's [`true-value`](https://vuejs.org/guide/essentials/forms.html#checkbox-1) prop.

### Unchecked value <Badge><pre>value-unchecked: (boolean | string) = false</pre></Badge>

Alias for Vue's [`false-value`](https://vuejs.org/guide/essentials/forms.html#checkbox-1) prop. If `value-checked` is a string, `value-unchecked` defaults to an empty string (`''`).

### Label <Badge><pre>label: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

The `label` slot may be use instead. The slot content overrides the `label` prop.

### Description <Badge><pre>description: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

The `description` slot may be use instead. The slot content overrides the `description` prop.

```vue
<Checkbox label="Label" description="Description"/>
```

<Demo>
    <Checkbox label="Label" description="Description"/>
</Demo>

### Variant <Badge><pre>variant: ('classic' | 'card' | 'toggle' | 'list') = 'classic'</pre></Badge>

<Demo>
    <div class="col starts">
        <div class="row center">
            <Checkbox variant="classic" label="Classic"/>
            <Checkbox variant="card" label="Card"/>
            <Checkbox variant="toggle" label="Toggle"/>
            <Checkbox variant="list" label="List"/>
        </div>
        <div class="row center">
            <Checkbox variant="classic" label="Classic" description="Description"/>
            <Checkbox variant="card" label="Card" description="Description"/>
            <Checkbox variant="toggle" label="Toggle" description="Description"/>
            <Checkbox variant="list" label="List" description="Description"/>
        </div>
    </div>
</Demo>

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <Checkbox theme="brand" label="Brand" checked/>
    <Checkbox theme="user" label="User"/>
    <Checkbox theme="ok" label="Ok"/>
    <Checkbox theme="info" label="Info"/>
    <Checkbox theme="warn" label="Warn"/>
    <Checkbox theme="danger" label="Danger"/>
    <Checkbox theme="neutral" label="Neutral"/>
</Demo>

### Size <Badge><pre>size: ('sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <Checkbox size="sm" label="Small"/>
    <Checkbox size="md" label="Medium"/>
    <Checkbox size="lg" label="Large"/>
    <Checkbox size="xl" label="Extra Large"/>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <Checkbox radius="none" label="None"/>
    <Checkbox radius="sm" label="Small"/>
    <Checkbox radius="md" label="Medium"/>
    <Checkbox radius="lg" label="Large"/>
    <Checkbox radius="full" label="Full"/>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <Checkbox size="sm" spacing="compact" label="Compact"/>
            <Checkbox size="sm" label="Default"/>
            <Checkbox size="sm" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Checkbox size="md" spacing="compact" label="Compact"/>
            <Checkbox size="md" label="Default"/>
            <Checkbox size="md" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Checkbox size="lg" spacing="compact" label="Compact"/>
            <Checkbox size="lg" label="Default"/>
            <Checkbox size="lg" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Checkbox size="xl" spacing="compact" label="Compact"/>
            <Checkbox size="xl" label="Default"/>
            <Checkbox size="xl" spacing="expanded" label="Expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Checkbox disabled label="Disabled" variant="classic" checked/>
            <Checkbox disabled label="Disabled" variant="classic"/>
        </div>
        <div class="row center">
            <Checkbox disabled label="Disabled" variant="card" checked/>
            <Checkbox disabled label="Disabled" variant="card"/>    
        </div>
        <div class="row center">
            <Checkbox disabled label="Disabled" variant="toggle" checked/>
            <Checkbox disabled label="Disabled" variant="toggle"/>    
        </div>
        <div class="row center">
            <Checkbox disabled label="Disabled" variant="list" checked/>
            <Checkbox disabled label="Disabled" variant="list"/>    
        </div>
    </div>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `checked` | `string` | |
| `value` | `boolean \| string` | `undefined` |
| `valueChecked` | `boolean \| string` | `true` |
| `valueUnchecked` | `boolean \| string` | `false` |
| `label` | `string` | |
| `description` | `string` | |
| `variant` | `'classic' \| 'card' \| 'toggle' \| 'list'` | `'classic'` |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `disabled` | `boolean` | |

### Configuration options

The following `Checkbox` props' default values can be overwritten under the `checkbox` root-level [configuration option](/configuration).

| `checkbox.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `variant` | |
| `theme` | ✅ |
| `size` | ✅ |
| `radius` | ✅ |
| `spacing` | ✅ |

## Styling

### Anatomy

<Demo>
    <Anatomy tag="label" classes="checkbox">
        <Anatomy tag='input[type="checkbox"]'/>
        <Anatomy tag="span" classes="toggle-button">
            <Anatomy tag="svg" classes="toggle-check"/>
        </Anatomy>
        <Anatomy tag="p" classes="toggle-label">
            <Anatomy tag="slot #default"/>
        </Anatomy>
        <Anatomy tag="p" classes="toggle-description">
            <Anatomy tag="slot #description"/>
        </Anatomy>
    </Anatomy>
</Demo>