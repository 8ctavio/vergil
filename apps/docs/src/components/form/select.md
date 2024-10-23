---
outline: [2,3]
---

# Select

<script setup>
import { Select } from '@8ctavio/vergil/components'
import { useModel, kebabCase } from '@8ctavio/vergil'

const demo1 = useModel('')
const demo2 = useModel('')
const demo3 = useModel('')
const demo4 = useModel('')
</script>

## Basic Usage

```vue
<script setup>
import { Select } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const difficulty = useModel('')
const skulls = useModel([])
</script>

<template>
    <!-- Single Selection -->
    <Select
        v-model="difficulty"
        label="Difficulty"
        placeholder="Choose difficulty"
        :options="{
            easy: 'Easy',
            normal: 'Normal',
            heroic: 'Heroic',
            legendary: 'Legendary'
        }"/>
    <!-- Multiple Selection -->
    <Select
        v-model="skulls"
        label="Skulls"
        placeholder="Select skulls"
        :options="{
            anger: 'Anger',
            blind: 'Blind',
            catch: 'Catch',
            ghost: 'Ghost',
        }"/>
</template>
```
<Demo>
    <div class="col center">
        <Select
            label="Difficulty"
            placeholder="Choose difficulty"
            :options="{
                easy: 'Easy',
                normal: 'Normal',
                heroic: 'Heroic',
                legendary: 'Legendary'
            }"/>
        <Select
            :value="[]"
            label="Skulls"
            placeholder="Select skulls"
            :options="{
                anger: 'Anger',
                blind: 'Blind',
                catch: 'Catch',
                ghost: 'Ghost',
            }"/>
    </div>
</Demo>

## Props

### Options <Badge><pre>options: (array | object) = []</pre></Badge>

The `options` prop is an array or (plain) object that provides the required data to define each *option*'s *value*, *label*, and *description*, which correspond to the `value`, `label`, and `description` props of underlying [`Checkbox`](/components/form/checkbox) components.

Options' values, labels, and descriptions can be automatically inferred from the values of `options` — each denoted as `option` — if they're either a string or an array of strings.

The following table summarizes how option's label and description are inferred from an `option`.

| Type of `option` | `string` | `string[]` |
| ---------------- | -------- | ---------- |
| **`label`** | `option` | `option[0]` |
| **`description`** | `undefined` | `option[1]` |

The following table summarizes how an option's value is inferred depending on the type of `options`.

| Type of `options` | `array` | `object` |
| ----------------- | ------- | -------- |
| **`value`** | Same as `label` | The `option`'s `key` |

##### Example. Options Array

```vue-html
<Select
    v-model="selected"
    :options="[
        'Option 1',
        ['Option 2', 'Description 2']
    ]"
/>
```

<Demo>
    <Select
        v-model="demo1"
        placeholder="Options array"
        :options="[
            'Option 1',
            ['Option 2', 'Description 2']
        ]"/>    
    <code>selected.value === '{{ demo1.value }}'</code>
</Demo>

##### Example. Options Object

```vue-html
<Select
    v-model="selected"
    :options="{
        value1: 'Option 1',
        value2: ['Option 2', 'Description 2']
    }"
/>
```

<Demo>
    <Select
        v-model="demo2"
        placeholder="Options object"
        :options="{
            value1: 'Option 1',
            value2: ['Option 2', 'Description 2']
        }"/>  
    <code>selected.value === '{{ demo2.value }}'</code>
</Demo>

### Option's attributes <Badge><pre>option-[value|label|description]: (string | function)</pre></Badge>

The `option-value`, `option-label`, and `option-description` props allow to specify custom options' values, labels, and descriptions.

As strings, these props represent an object key. If an `option` is an object, the resulting value/label/description is obtained by accessing that object with the provided key.

```vue-html
<Select
    v-model="selected"
    :options="[{
        id: '123',
        name: 'Abc Def',
        email: 'abd.def@vergil.com'
    },{
        id: '456',
        name: 'Uvw Xyz',
        email: 'uvw.xyz@vergil.com'
    }]"
    option-value="id"    
    option-label="name"
    option-description="email"
/>
```

<Demo>
    <Select
        v-model="demo3"
        placeholder="Select option"
        :options="[{
            id: '123',
            name: 'Abc Def',
            email: 'abd.def@vergil.com'
        },{
            id: '456',
            name: 'Uvw Xyz',
            email: 'uvw.xyz@vergil.com'
        }]"
        option-value="id"    
        option-label="name"
        option-description="email"/>
    <code>checked.value === '{{ demo3.value }}'</code>
</Demo>

:::tip NOTE
If `options` is an object, `option-value` cannot be used as an object key.
:::

As functions, these props are called for each `option`, receive the `option` as a single argument, and their return value becomes the resulting value/label/description.

```vue-html
<Select
    v-model="selected"
    :options="[{
        id: '123',
        name: 'Abc Def',
        email: 'abd.def@vergil.com'
    },{
        id: '456',
        name: 'Uvw Xyz',
        email: 'uvw.xyz@vergil.com'
    }]"
    :option-value="option => kebabCase(option.name)"    
    :option-label="option => option.name.split(' ')[0]"
    :option-description="option => `@@mail@@ ${option.email}`"
/>
```

<Demo>
    <Select
        v-model="demo4"
        placeholder="Select option"
        :options="[{
            id: '123',
            name: 'Abc Def',
            email: 'abd.def@vergil.com'
        },{
            id: '456',
            name: 'Uvw Xyz',
            email: 'uvw.xyz@vergil.com'
        }]"
        :option-value="option => kebabCase(option.name)"    
        :option-label="option => option.name.split(' ')[0]"
        :option-description="option => `@@mail@@ ${option.email}`"/>  
    <code>checked.value === '{{ demo4.value }}'</code>
</Demo>

The following functions are the default values for the `option-value`, `option-label`, and `option-description` props.

```js
function defaultOptionValue(option) {
    return Array.isArray(option) ? option[0] : option
}
function defaultOptionLabel(option) {
    return Array.isArray(option) ? option[0] : option
}
function defaultOptionDescription {
    return Array.isArray(option) ? option[1] : undefined
}
```

### Placeholder <Badge><pre>placeholder: string</pre></Badge>

```vue-html
<Select placeholder="Select option"/>
```

### Placeholder fallback <Badge><pre>placeholder-fallback: (n: number) => string</pre></Badge>

When selecting multiple options, the selected options are displayed in the select button as a comma-separated string of those options' labels. If that string overflows its container, a fallback placeholder is obtained from the `placeholder-fallback` function and displayed instead.

The `placeholder-fallback` function receives as its only argument the number of selected options.

```vue-html
<Select
    :value="[]"
    :options="['The Fall of Reach', 'The Flood', 'First Strike']"
    :placeholder-fallback="n => {
        return `${n} Option${n > 1 ? 's':''} Selected`
    }"
    placeholder="Select option"
/>
```

<Demo>
    <Select
        :value="[]"
        :options="['The Fall of Reach', 'The Flood', 'First Strike']"
        :placeholder-fallback="n => {
            return `${n} Option${n > 1 ? 's':''} Selected`
        }"
        placeholder="Select option"
    />
</Demo>

The following function is used as the default `placeholder-fallback` value.

```js
n => `${n} Selected`
```

:::tip
The `placeholder-fallback` prop only takes effect in multiple selection mode.
:::

### Filter <Badge><pre>filter: boolean</pre></Badge>

```vue-html
<Select
    :options="['abc','uvw','xyz']"
    placeholder="Select option"
    filter
/>
```

<Demo>
    <Select
        :options="['abc','uvw','xyz']"
        placeholder="Select option"
        filter
    />
</Demo>

### Filter input <Badge><pre>filter-input: object</pre></Badge>

The `filter-input` prop is an object of props forwarded to the filter's `InputText` component.

```vue-html
<Select
    :options="['Option']"
    placeholder="Select option"
    filter
    :filter-input="{
        placeholder: 'Filter users',
        icon: 'person_search',
        max: '10'
    }"
/>
```

<Demo>
    <Select
        :options="['Option']"
        placeholder="Select option"
        filter
        :filter-input="{
            placeholder: 'Filter users',
            icon: 'person_search',
            max: '10'
        }"
    />
</Demo>

:::tip
The filter's default placeholder can be configured through the `placeholderFilter` [configuration option](#configuration-options).
:::

### Not-found placeholder <Badge><pre>placeholder-not-found: (query: string) => string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

The `placeholder-not-found` prop is used to obtain a placeholder to display when the `Select`'s filter input yields no results. The passed function receives as a single argument the filter input's query.

```vue-html
<Select
    :options="['Option']"
    placeholder="Select option"
    filter
    :placeholder-not-found="query => {
        return `@@search_off@@\nCould not find [['${query}']]`
    }"
/>
```

<Demo>
    <Select
        :options="['Option']"
        placeholder="Select option"
        filter
        :placeholder-not-found="query => `@@search_off@@\nCould not find [['${query}']]`"
    />
</Demo>

The following function is used as the default `placeholder-not-found` value.

```js
query => `No results for [["${query}"]]`
```

### Chips <Badge><pre>chips: boolean</pre></Badge> <Badge type="warning">Only for multiple selection</Badge>

```vue-html
<Select
    :value="[]"
    :options="['abc','uvw','xyz']"
    placeholder="Select option"
    chips
/>
```

<Demo>
    <Select
        :value="[]"
        :options="['abc','uvw','xyz']"
        placeholder="Select option"
        chips
    />
</Demo>

### Float label <Badge><pre>float-label: boolean</pre></Badge>

```vue
<Select label="Select option" float-label :options="['Option']"/>
```

<Demo>
    <Select label="Select option" float-label :options="['Option']"/>
</Demo>

:::tip NOTE
`float-label` only works if the `placeholder` and `description` props are unset.
:::

### Underline <Badge><pre>underline: boolean</pre></Badge>

<Demo>
    <Select placeholder="Select option" underline :options="['Option']"/>
</Demo>

### Fill <Badge><pre>fill: boolean</pre></Badge>

<Demo>
    <Select placeholder="Select option" underline fill :options="['Option']"/>
</Demo>

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <div class="row center">
        <Select underline :options="['Option']" theme="brand" placeholder="Brand"/>
        <Select underline :options="['Option']" theme="user" placeholder="User"/>
        <Select underline :options="['Option']" theme="ok" placeholder="Ok"/>
        <Select underline :options="['Option']" theme="info" placeholder="Info"/>
        <Select underline :options="['Option']" theme="warn" placeholder="Warn"/>
        <Select underline :options="['Option']" theme="danger" placeholder="Danger"/>
        <Select underline :options="['Option']" theme="neutral" placeholder="Neutral"/>
    </div>
</Demo>

### Size <Badge><pre>size: ('sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <div class="col center">
        <Select size="sm" :options="['Option']" placeholder="Small"/>
        <Select size="md" :options="['Option']" placeholder="Medium"/>
        <Select size="lg" :options="['Option']" placeholder="Large"/>
        <Select size="xl" :options="['Option']" placeholder="Extra Large"/>
    </div>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="col center w-initial">
        <Select :options="['Option']" placeholder="None" radius="none"/>
        <Select :options="['Option']" placeholder="Small" radius="sm"/>
        <Select :options="['Option']" placeholder="Medium" radius="md"/>
        <Select :options="['Option']" placeholder="Large" radius="lg"/>
        <Select :options="['Option']" placeholder="Full" radius="full"/>
    </div>
    <div class="col center w-initial">
        <Select :options="['Option']" underline placeholder="None" radius="none"/>
        <Select :options="['Option']" underline placeholder="Small" radius="sm"/>
        <Select :options="['Option']" underline placeholder="Medium" radius="md"/>
        <Select :options="['Option']" underline placeholder="Large" radius="lg"/>
        <Select :options="['Option']" underline placeholder="Full" radius="full"/>
    </div>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <Select size="sm" :options="['Option']" spacing="compact" placeholder="Compact"/>
            <Select size="sm" :options="['Option']" placeholder="Default"/>
            <Select size="sm" :options="['Option']" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Select size="md" :options="['Option']" spacing="compact" placeholder="Compact"/>
            <Select size="md" :options="['Option']" placeholder="Default"/>
            <Select size="md" :options="['Option']" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Select size="lg" :options="['Option']" spacing="compact" placeholder="Compact"/>
            <Select size="lg" :options="['Option']" placeholder="Default"/>
            <Select size="lg" :options="['Option']" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Select size="xl" :options="['Option']" spacing="compact" placeholder="Compact"/>
            <Select size="xl" :options="['Option']" placeholder="Default"/>
            <Select size="xl" :options="['Option']" spacing="expanded" placeholder="Expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <Select disabled placeholder="Disabled"/>
    <Select disabled placeholder="Disabled" underline/>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `string \| array` | `''` |
| `options` | `array \| object` | `[]` |
| `optionValue` | `string \| function` | |
| `optionLabel` | `string \| function` | |
| `optionDescription` | `string \| function` | |
| `placeholder` | `string` | |
| `placeholderFallback` | `(n: number) => string` | |
| `filter` | `boolean` | |
| `placeholderNotFound` | `(query: string) => string` | |
| `chips` | `boolean` | |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| `float-label` | `boolean` | |
| `underline` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `disabled` | `boolean` | |

### Configuration options

The following `Select` props' default values can be overwritten under the `select` root-level [configuration option](/configuration).

| `select.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `placeholderFallback` | |
| `placeholderNotFound` | |
| `placeholderFilter` | |
| `underline` | |
| `fill` | |
| `theme` | ✅ |
| `size` | ✅ |
| `radius` | ✅ |
| `spacing` | ✅ |

## Styling

### Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field select">
        <Anatomy tag="div" classes="form-field-label-wrapper">
            <Anatomy tag="label" classes="form-field-label"/>
            <Anatomy tag="span" classes="form-field-hint"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-description"/>
        <Anatomy tag="Btn" classes="btn select-button">
            <Anatomy tag="p" classes="select-placeholder">
                <Anatomy tag="span"/>
            </Anatomy>
            <Anatomy tag="div" classes="chips">
                <Anatomy tag='Badge.badge v-for="(label,value) in selected'>
                    <Anatomy tag="button">
                        <Anatomy tag="Icon" classes="icon"/>
                    </Anatomy>
                </Anatomy>
            </Anatomy>
            <Anatomy slot="aside">
                <Anatomy tag="label"/>
            </Anatomy>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
        <Anatomy tag="div" classes="floating">
            <Anatomy tag="div" classes="select-dropdown">
                <Anatomy tag='Input' classes="input-text"/>
                <Anatomy tag='p' classes="select-not-found"/>
                <Anatomy tag='CheckboxGroup' classes="checkbox-group"/>
            </Anatomy>
        </Anatomy>
    </Anatomy>
</Demo>