---
outline: [2,3]
---

# Checkbox <Badge><pre>.checkbox</pre></Badge>

<script setup>
import { Checkbox } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const checked = useModel(false)
const planets = useModel([])
</script>

## Basic Usage

```vue
<script setup>
import { Checkbox } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const checked = useModel(false)
const planets = useModel([])
</script>

<template>
    <!-- Single boolean value -->
    <Checkbox v-model="checked" label="Checkbox"/>

    <!-- Multiple values -->
    <Checkbox v-model="planets" value="earth" label="Earth"/>
    <Checkbox v-model="planets" value="reach" label="Reach"/>
    <Checkbox v-model="planets" value="harvest" label="Harvest"/>
</template>
```
<Demo>
    <div class="col">
        <div class="row center">
            <Checkbox v-model="checked"/>
        </div>
        <div class="row center">
            <code>checked.value === {{ checked.value }}</code>
        </div>
        <div class="row center">
            <Checkbox v-model="planets" value="earth" label="Earth"/>
            <Checkbox v-model="planets" value="reach" label="Reach"/>
            <Checkbox v-model="planets" value="harvest" label="Harvest"/>
        </div>
        <div class="row center">
            <code>planets.value === {{ planets.value }}</code>
        </div>
    </div>
</Demo>

## Attributes

### Value

In order to bind multiple checkboxes to a component model, all checkboxes must include the `value` attribute and the model's value must be an array. The model's array value includes the `value` of checked checkboxes. Were the model's value not an array, `value` has no effect.

## Props

### Checked value <Badge><pre>value-checked: (boolean | string) = true</pre></Badge>

Alias for Vue's [`true-value`](https://vuejs.org/guide/essentials/forms.html#checkbox-1) prop.

### Unchecked value <Badge><pre>value-unchecked: (boolean | string) = false</pre></Badge>

Alias for Vue's [`false-value`](https://vuejs.org/guide/essentials/forms.html#checkbox-1) prop. If `value-checked` is a string, `value-unchecked` defaults to an empty string (`''`).

### Label <Badge><pre>label: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

The default slot may be use instead. The slot content overrides the `label` prop.

### Description <Badge><pre>description: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

The `description` slot may be use instead. The slot content overrides the `description` prop.

```vue
<Checkbox label="Label" description="Description"/>
```

<Demo>
    <Checkbox label="Label" description="Description"/>
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
    <Checkbox disabled label="Disabled" checked/>
    <Checkbox disabled label="Disabled"/>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `checked` | `string` | |
| `valueChecked` | `boolean \| string` | `true` |
| `valueUnchecked` | `boolean \| string` | `false` |
| `label` | `string` | |
| `description` | `string` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `disabled` | `boolean` | |

### Configuration options

The following `Checkbox` props' default values can be overwritten under the `checkbox` root-level [configuration option](/configuration).

| `checkbox.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `theme` | ✅ |
| `size` | ✅ |
| `radius` | ✅ |
| `spacing` | ✅ |

## Styling

### Anatomy

<Demo>
    <Anatomy tag="label" classes="checkbox">
        <Anatomy tag='input[type="checkbox"]'/>
        <Anatomy tag="span" classes="checkbox-box">
            <Anatomy tag="svg" classes="checkbox-check"/>
        </Anatomy>
        <Anatomy tag="div">
            <Anatomy tag="p" classes="checkbox-label">
                <Anatomy tag="slot #default"/>
            </Anatomy>
            <Anatomy tag="p" classes="checkbox-description">
                <Anatomy tag="slot #description"/>
            </Anatomy>
        </Anatomy>
    </Anatomy>
</Demo>