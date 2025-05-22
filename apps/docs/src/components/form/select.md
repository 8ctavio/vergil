---
outline: [2,3]
---

# Select

<script setup>
import { h } from 'vue'
import { ClientOnly } from 'vitepress/dist/client/app/components/ClientOnly'
import { Select as VergilSelect } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
import { kebabCase } from '@8ctavio/vergil/utilities'

function Select(props) {
    return h(ClientOnly, () => h(VergilSelect, props))
}
Select.inheritAttrs = false

const difficulties = {
    easy: 'Easy',
    normal: 'Normal',
    heroic: 'Heroic',
    legendary: 'Legendary'
}
const skulls = {
    anger: 'Anger',
    blind: 'Blind',
    catch: 'Catch',
    ghost: 'Ghost',
}

const demo1 = useModel('', { shallow: true })
const demo2 = useModel('', { shallow: true })
const demo3 = useModel('', { shallow: true })
const demo4 = useModel('', { shallow: true })

const options1 = [
    'Option 1',
    ['Option 2', 'Description 2']
]
const options2 = {
    value1: 'Option 1',
    value2: ['Option 2', 'Description 2']
}
const options3 = [{
    id: '123',
    name: 'Abc Def',
    email: 'abc.def@vergil.com'
},{
    id: '456',
    name: 'Uvw Xyz',
    email: 'uvw.xyz@vergil.com'
}]
const options4 = ['The Fall of Reach', 'The Flood', 'First Strike']
const options5 = ['abc','uvw','xyz']
const options6 = ['Option']
</script>

<style>
.select {
    width: 200px;
}
</style>

<style>
#popover-portal > .popover-wrapper > .select-popover.select-demo {
    width: 200px;
}   
</style>

## Basic Usage

<Demo>
    <div class="col center">
        <Select class="select-demo"
            label="Difficulty"
            placeholder="Choose difficulty"
            :options="difficulties"/>
        <Select class="select-demo"
            :value="[]"
            label="Skulls"
            placeholder="Select skulls"
            :options="skulls"/>
    </div>
</Demo>

```vue
<script setup>
import { Select } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'

const difficulty = useModel('')
const difficultyOptions = {
    easy: 'Easy',
    normal: 'Normal',
    heroic: 'Heroic',
    legendary: 'Legendary'
}

const skulls = useModel([])
const skullOptions = {
    anger: 'Anger',
    blind: 'Blind',
    catch: 'Catch',
    ghost: 'Ghost',
}
</script>

<template>
    <!-- Single Selection -->
    <Select
        class="select-demo"
        v-model="difficulty"
        :options="difficultyOptions"
        label="Difficulty"
        placeholder="Choose difficulty"
    />
    <!-- Multiple Selection -->
    <Select
        class="select-demo"
        v-model="skulls"
        :options="skullOptions"
        label="Skulls"
        placeholder="Select skulls"
    />
</template>

<style scoped>
.select-demo {
    width: 200px;
}
</style>

<style>
#popover-portal > .popover-wrapper > .select-demo {
    width: 200px;
}   
</style>
```

## Props

### Options <Badge><pre>options: (string | [string, string])[] | Record<string, string | [string, string]> = []</pre></Badge>

The `options` prop is an array or (plain) object that provides the required data to define each *option*'s *value*, *label*, and *description*, which correspond to the `value`, `label`, and `description` props of underlying [`Checkbox`](/components/form/checkbox) components.

Options' values, labels, and descriptions can be automatically inferred from the values of `options` — each denoted as `option` — if they're either a string or an array of strings.

The following table summarizes how option's label and description are inferred from an `option`.

| Type of `option` | `label` | `description` |
| ---------------- | ------- | ------------- |
| `string` | `option` | `undefined` |
| `string[]` | `option[0]` | `option[1]` |

The following table summarizes how an option's value is inferred depending on the type of `options`.

| Type of `options` | `value` |
| ----------------- | ------- |
| `Array` | Same as `label` |
| `object` | The `option`'s `key` |

##### Example. Options Array

```vue
<script setup>
const options = [
    'Option 1',
    ['Option 2', 'Description 2']
]
</script>

<template>
    <Select v-model="selected" :options/>
</template>
```

<Demo>
    <Select class="select-demo"
        v-model="demo1"
        :options="options1"
        placeholder="Options array"
    />    
    <code>selected.value === '{{ demo1.value }}'</code>
</Demo>

##### Example. Options Object

```vue
<script setup>
const options = {
    value1: 'Option 1',
    value2: ['Option 2', 'Description 2']
}
</script>

<template>
    <Select v-model="selected" :options/>
</template>
```

<Demo>
    <Select class="select-demo"
        v-model="demo2"
        :options="options2"
        placeholder="Options object"
    />  
    <code>selected.value === '{{ demo2.value }}'</code>
</Demo>

### Option's attributes <Badge><pre>option-[value|label|description]: (string | Function)</pre></Badge>

The `option-value`, `option-label`, and `option-description` props allow to specify custom options' values, labels, and descriptions.

As strings, these props represent an object key. If an `option` is an object, the resulting value/label/description is obtained by accessing that object with the provided key.

```vue
<script setup>
const options = [{
    id: '123',
    name: 'Abc Def',
    email: 'abc.def@vergil.com'
},{
    id: '456',
    name: 'Uvw Xyz',
    email: 'uvw.xyz@vergil.com'
}]
</script>

<template>
    <Select
        v-model="selected"
        :options
        option-value="id"    
        option-label="name"
        option-description="email"
    />
</template>
```

<Demo>
    <Select class="select-demo"
        v-model="demo3"
        :options="options3"
        option-value="id"    
        option-label="name"
        option-description="email"
        placeholder="Select option"
    />
    <code>checked.value === '{{ demo3.value }}'</code>
</Demo>

As functions, these props are called for each `option`, receive the `option` and its `key` (index for arrays) as arguments, and their return value becomes the resulting value/label/description.

```vue
<script setup>
const options = [{
    id: '123',
    name: 'Abc Def',
    email: 'abc.def@vergil.com'
},{
    id: '456',
    name: 'Uvw Xyz',
    email: 'uvw.xyz@vergil.com'
}]
</script>

<template>
    <Select
        v-model="selected"
        :options
        :option-value="option => kebabCase(option.name)"    
        :option-label="option => option.name.split(' ')[0]"
        :option-description="option => `@@mail@@ ${option.email}`"
    />
</template>
```

<Demo>
    <Select class="select-demo"
        v-model="demo4"
        :options="options3"
        :option-value="option => kebabCase(option.name)"    
        :option-label="option => option.name.split(' ')[0]"
        :option-description="option => `@@mail@@ ${option.email}`"
        placeholder="Select option"
    />
    <code>checked.value === '{{ demo4.value }}'</code>
</Demo>

The following functions are the default values for the `option-value`, `option-label`, and `option-description` props.

```js
function defaultOptionValue(option, key) {
    return typeof key === 'number'
        ? Array.isArray(option) ? option[0] : option
        : key
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

```vue
<script setup>
const options = ['The Fall of Reach', 'The Flood', 'First Strike']
</script>

<template>
    <Select :value="[]" :options
        :placeholder-fallback="n => {
            return `${n} Option${n > 1 ? 's':''} Selected`
        }"
        placeholder="Select option"
    />
</template>
```

<Demo>
    <Select class="select-demo"
        :value="[]"
        :options="options4"
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

```vue
<script setup>
const options = ['abc','uvw','xyz']
</script>

<template>
    <Select :options filter placeholder="Select option"/>
</template>
```

<Demo>
    <Select class="select-demo"
        :options="options5"
        placeholder="Select option"
        filter
    />
</Demo>

### Filter input <Badge><pre>filter-input: Record<string, unknown></pre></Badge>

The `filter-input` prop is an object of props forwarded to the filter's `InputText` component.

```vue
<script setup>
const options = ['Option']
</script>

<template>
    <Select :options filter placeholder="Select option"
        :filter-input="{
            placeholder: 'Filter users',
            icon: 'person_search',
            max: '10'
        }"
    />
</template>
```

<Demo>
    <Select class="select-demo"
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

```vue
<script setup>
const options = ['Option']
</script>

<template>
    <Select :options filter placeholder="Select option"
        :placeholder-not-found="query => {
            return `@@search_off@@\nCould not find [['${query}']]`
        }"
    />
</template>
```

<Demo>
    <Select class="select-demo"
        :options="options6"
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

```vue
<script setup>
const options = ['abc','uvw','xyz']
</script>

<template>
    <Select
        :value="[]"
        :options
        chips
        placeholder="Select option"
    />
</template>
```

<Demo>
    <Select class="select-demo"
        :value="[]"
        :options="options5"
        placeholder="Select option"
        chips
    />
</Demo>

### Float label <Badge><pre>float-label: boolean</pre></Badge>

```vue
<script setup>
const options = ['Option']
</script>

<template>
    <Select label="Select option" float-label :options/>
</template>
```

<Demo>
    <Select class="select-demo" label="Select option" float-label :options="['Option']"/>
</Demo>

:::tip NOTE
`float-label` only works if the `placeholder` and `description` props are unset.
:::

### Underline <Badge><pre>underline: boolean</pre></Badge>

<Demo>
    <Select class="select-demo" placeholder="Select option" underline :options="['Option']"/>
</Demo>

### Fill <Badge><pre>fill: boolean</pre></Badge>

<Demo>
    <Select class="select-demo" placeholder="Select option" underline fill :options="['Option']"/>
</Demo>

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <div class="row center">
        <Select class="select-demo" underline :options="['Option']" theme="brand" placeholder="Brand"/>
        <Select class="select-demo" underline :options="['Option']" theme="user" placeholder="User"/>
        <Select class="select-demo" underline :options="['Option']" theme="ok" placeholder="Ok"/>
        <Select class="select-demo" underline :options="['Option']" theme="info" placeholder="Info"/>
        <Select class="select-demo" underline :options="['Option']" theme="warn" placeholder="Warn"/>
        <Select class="select-demo" underline :options="['Option']" theme="danger" placeholder="Danger"/>
        <Select class="select-demo" underline :options="['Option']" theme="neutral" placeholder="Neutral"/>
    </div>
</Demo>

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <div class="col center">
        <Select class="select-demo" size="xs" :options="['Option']" placeholder="Extra Small"/>
        <Select class="select-demo" size="sm" :options="['Option']" placeholder="Small"/>
        <Select class="select-demo" size="md" :options="['Option']" placeholder="Medium"/>
        <Select class="select-demo" size="lg" :options="['Option']" placeholder="Large"/>
        <Select class="select-demo" size="xl" :options="['Option']" placeholder="Extra Large"/>
    </div>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="col center w-initial">
        <Select class="select-demo" :options="['Option']" placeholder="None" radius="none"/>
        <Select class="select-demo" :options="['Option']" placeholder="Small" radius="sm"/>
        <Select class="select-demo" :options="['Option']" placeholder="Medium" radius="md"/>
        <Select class="select-demo" :options="['Option']" placeholder="Large" radius="lg"/>
        <Select class="select-demo" :options="['Option']" placeholder="Full" radius="full"/>
    </div>
    <div class="col center w-initial">
        <Select class="select-demo" :options="['Option']" underline placeholder="None" radius="none"/>
        <Select class="select-demo" :options="['Option']" underline placeholder="Small" radius="sm"/>
        <Select class="select-demo" :options="['Option']" underline placeholder="Medium" radius="md"/>
        <Select class="select-demo" :options="['Option']" underline placeholder="Large" radius="lg"/>
        <Select class="select-demo" :options="['Option']" underline placeholder="Full" radius="full"/>
    </div>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <Select class="select-demo" size="xs" :options="['Option']" spacing="compact" placeholder="Compact"/>
            <Select class="select-demo" size="xs" :options="['Option']" placeholder="Default"/>
            <Select class="select-demo" size="xs" :options="['Option']" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Select class="select-demo" size="sm" :options="['Option']" spacing="compact" placeholder="Compact"/>
            <Select class="select-demo" size="sm" :options="['Option']" placeholder="Default"/>
            <Select class="select-demo" size="sm" :options="['Option']" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Select class="select-demo" size="md" :options="['Option']" spacing="compact" placeholder="Compact"/>
            <Select class="select-demo" size="md" :options="['Option']" placeholder="Default"/>
            <Select class="select-demo" size="md" :options="['Option']" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Select class="select-demo" size="lg" :options="['Option']" spacing="compact" placeholder="Compact"/>
            <Select class="select-demo" size="lg" :options="['Option']" placeholder="Default"/>
            <Select class="select-demo" size="lg" :options="['Option']" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <Select class="select-demo" size="xl" :options="['Option']" spacing="compact" placeholder="Compact"/>
            <Select class="select-demo" size="xl" :options="['Option']" placeholder="Default"/>
            <Select class="select-demo" size="xl" :options="['Option']" spacing="expanded" placeholder="Expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <Select class="select-demo" disabled placeholder="Disabled"/>
    <Select class="select-demo" disabled placeholder="Disabled" underline/>
</Demo>

## Elements

| element | tag | description |
| ---- | ---- | ------- |
| `options` | <code class="vp-code-nowrap"><div.toggle-group-wrapper></code> | `CheckboxGroup`'s wrapper of underlying `Checkbox` components. |

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
        <Anatomy tag="Teleport" id="popover-portal">
            <Anatomy tag="div" classes="popover-wrapper">
                <Anatomy tag="div" classes="popover select-popver">
                    <Anatomy tag='Input' classes="input-text"/>
                    <Anatomy tag='p' classes="select-not-found"/>
                    <Anatomy tag='CheckboxGroup' classes="checkbox-group"/>
                </Anatomy>
            </Anatomy>
        </Anatomy>
    </Anatomy>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `string \| string[]` | `''` |
| `options` | `(string \| [string, string])[] \| Record<string, string \| [string, string]>` | `[]` |
| `optionValue` | `string \| ((option: unknown, key: string \| number) => string)` | |
| `optionLabel` | `string \| ((option: unknown, key: string \| number) => string)` | |
| `optionDescription` | `string \| ((option: unknown, key: string \| number) => string)` | |
| `placeholder` | `string` | |
| `placeholderFallback` | `(n: number) => string` | |
| `filter` | `boolean` | |
| `filterInput` | `Record<string, unknown>` | |
| `placeholderNotFound` | `(query: string) => string` | |
| `chips` | `boolean` | |
| `underline` | `boolean` | |
| `disabled` | `boolean` | |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| `showErrros` | `boolean` | |
| `float-label` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `validator` | `Function` | |
| `eagerValidation` | `boolean` | |
| `elements` | `object` | |

### Configuration options

`Select`'s [configuration options](/configuration) allow to overwrite some `Select` props' default values and may be overwritten under the `select` root-level configuration option.

| `select.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ----------------- | ---- | ------- | :------: |
| `placeholderFallback` | `(n: number) => string` | <code>n => \`${n} Selected\`</code> | |
| `placeholderNotFound` | `(query: string) => string` | <code>query => \`No results for [["${query}"]]\`</code> | |
| `placeholderFilter` | `string` | `'Filter'` | |
| `underline` | `boolean` | | |
| `fill` | `boolean` | | |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |