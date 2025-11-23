---
outline: [2,3]
---

# DatePicker

<script setup>
import { h } from 'vue'
import { ClientOnly } from 'vitepress/dist/client/app/components/ClientOnly'
import { DatePicker as VergilDatePicker } from '@vrgl/vergil/components'

function DatePicker(props) {
    return h(ClientOnly, () => h(VergilDatePicker, props))
}

const formatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}
const btnClearProps = {
    position: 'before',
    variant: 'solid',
    iconLeft: 'rocket_launch',
    iconRight: 'rocket_launch',
}
</script>

<style>
.date-picker {
    width: 200px;
}
</style>

## Basic Usage

<Demo>
    <div class="col">
        <div class="row center">
            <DatePicker placeholder="Select Date"/>
        </div>
        <div class="row center">
            <DatePicker placeholder="Select Dates" :value="[]"/>
        </div>
    </div>
</Demo>

```vue
<script setup>
import { DatePicker } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const date = useModel(null, { shallow: true })
const dates = useModel([])
</script>

<template>
    <!-- Single Selection -->
    <DatePicker v-model="date" placeholder="Select Date"/>
    <!-- Multiple Selection -->
    <DatePicker v-model="dates" placeholder="Select Dates"/>
</template>

<style scoped>
.date-picker {
    width: 200px;
}
</style>
```

## Props

All [`Calendar`](/components/form/calendar) props are available for `DatePicker`.

### Date format <Badge><pre>format: Intl.DateTimeFormatOptions | ((date: Date) => string)</pre></Badge>

As an object, the `format` prop conforms to the [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) constructor's `options` object. The locales used by `Intl.DateTimeFormat` are obtained from the `Calendar`'s `locale` prop.

As a function, the `format` prop itself is used to format dates. It receives as a single argument a `Date` object and should return a string — the formatted string of the received date.

```vue
<script setup>
const formatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
}
</script>

<template>
    <DatePicker locale="es-MX" :format="formatOptions"/>
</template>
```

<Demo>
    <DatePicker placeholder="Seleccionar Fecha" locale="es-MX" :format="formatOptions"/>
</Demo>

#### Default date format

The `format` prop's default value is configurable through the `datePicker.format` or `datePicker.formatOptions` [configuration options](#configuration-options) (`datePicker.format` precedes `datePicker.formatOptions`).

The `datePicker.format` should be a function, which is used to directly format dates. The function receives as a single argument a `Date` object and should return a string — the formatted string of the received date.

```js
datePicker: {
    format: date => { /* ... */ }
}
```

The `datePicker.formatOptions` may be either an object that conforms to `Intl.DateTimeFormat` constructor's `options` object, or a function that returns such object. As a function, a boolean argument is received that indicates whether time selection is enabled.

```js
datePicker: {
    formatOptions: { /* ... */ }
    // or
    formatOptions: timeEnabled => ({ /* ... */ })
}
```

### Placeholder <Badge><pre>placeholder: string</pre></Badge>

```vue-html
<DatePicker placeholder="Select Date"/>
```

### Placeholder fallback <Badge><pre>placeholder-fallback: (n: number) => string</pre></Badge>

When multiple date selection is enabled, a string with the comma-separated, selected dates' formatted strings is displayed in the `DatePicker`'s main button. If that string overflows its container, a fallback placeholder is obtained from the `placeholder-fallback` function and displayed instead.

The `placeholder-fallback` function receives as its only argument the number of selected dates.

```vue-html
<DatePicker
    :value="[]"
    :placeholder-fallback="n => {
        return `Selected ${n} date${n > 1 ? 's':''}`
    }"
    placeholder="Select Dates"
/>
```

<Demo>
    <DatePicker
        :value="[]"
        :placeholder-fallback="n => {
            return `Selected ${n} date${n > 1 ? 's':''}`
        }"
        placeholder="Select Dates"
    />
</Demo>

The following function is used as the default `placeholder-fallback` value.

```js
n => `${n} Dates Selected`
```

### Side button's icons <Badge><pre>icon-calendar: string = 'calendar_month'</pre></Badge> <Badge><pre>icon-clear: string = 'event_busy'</pre></Badge>

```vue
<DatePicker icon-calendar="calendar_add_on" icon-clear="close"/>
```

<Demo>
    <DatePicker placeholder="Select Date" icon-calendar="calendar_add_on" icon-clear="close"/>
</Demo>

### Clear button <Badge type="tip"><pre>btn-clear: Record<string, unknown></pre></Badge>

The `btn-clear` prop receives an object representing the props of the clear button's underlying [`Btn`](/components/buttons/btn) component.

The `Btn`'s `disabled` prop is bound to the `DatePicker`'s. That is, if the `DatePicker` is disabled, the clear button will also get disabled regardless of `btnClear.disabled`.

Additionally, a `position` prop can be passed through `btn-clear` to indicate the clear button's position with respect to the `DatePicker`'s main button. The `position` prop possible values are `'after'` and `'before'`, and its default value can be configured through the `sideButtonPosition` [configuration option](#configuration-options).

Finally, the `Btn` prop used to display the `DatePicker`'s icons changes with `position`. If `position === 'before'`, the `iconRight` prop is reserved for the `DatePicker`'s icons. Otherwise, the `icon` prop is used.

```vue
<script setup>
const btnClearProps = {
    position: 'before',
    variant: 'solid',
    iconLeft: 'rocket_launch',
    iconRight: 'rocket_launch', // ignored
}
</script>

<template>
    <DatePicker :btn-clear="btnClearProps"/>
</template>
```

<Demo>
    <DatePicker :btn-clear="btnClearProps"/>
</Demo>

### Float label <Badge><pre>float-label: boolean</pre></Badge>

```vue
<DatePicker label="Select date" float-label/>
```

<Demo>
    <DatePicker label="Select date" float-label/>
</Demo>

:::tip NOTE
`float-label` only works if the `placeholder` and `description` props are unset.
:::

### Underline <Badge><pre>underline: boolean</pre></Badge>

<Demo>
    <DatePicker placeholder="Select date" underline/>
</Demo>

### Fill <Badge><pre>fill: boolean</pre></Badge>

<Demo>
    <DatePicker placeholder="Select date" underline fill/>
</Demo>

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <div class="row center">
        <DatePicker theme="brand" placeholder="Brand"/>
        <DatePicker theme="user" placeholder="User"/>
        <DatePicker theme="ok" placeholder="Ok"/>
        <DatePicker theme="info" placeholder="Info"/>
        <DatePicker theme="warn" placeholder="Warn"/>
        <DatePicker theme="danger" placeholder="Danger"/>
        <DatePicker theme="neutral" placeholder="Neutral"/>
    </div>
</Demo>

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <div class="col center">
        <DatePicker size="xs" placeholder="Extra Small"/>
        <DatePicker size="sm" placeholder="Small"/>
        <DatePicker size="md" placeholder="Medium"/>
        <DatePicker size="lg" placeholder="Large"/>
        <DatePicker size="xl" placeholder="Extra Large"/>
    </div>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="row center">
        <DatePicker placeholder="None" radius="none"/>
        <DatePicker placeholder="Small" radius="sm"/>
        <DatePicker placeholder="Medium" radius="md"/>
        <DatePicker placeholder="Large" radius="lg"/>
        <DatePicker placeholder="Full" radius="full"/>
    </div>
</Demo>

### Spacing <Badge><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <DatePicker size="xs" spacing="compact" placeholder="Compact"/>
            <DatePicker size="xs" placeholder="Default"/>
            <DatePicker size="xs" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <DatePicker size="sm" spacing="compact" placeholder="Compact"/>
            <DatePicker size="sm" placeholder="Default"/>
            <DatePicker size="sm" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <DatePicker size="md" spacing="compact" placeholder="Compact"/>
            <DatePicker size="md" placeholder="Default"/>
            <DatePicker size="md" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <DatePicker size="lg" spacing="compact" placeholder="Compact"/>
            <DatePicker size="lg" placeholder="Default"/>
            <DatePicker size="lg" spacing="expanded" placeholder="Expanded"/>
        </div>
        <div class="row center">
            <DatePicker size="xl" spacing="compact" placeholder="Compact"/>
            <DatePicker size="xl" placeholder="Default"/>
            <DatePicker size="xl" spacing="expanded" placeholder="Expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

<Demo>
    <DatePicker disabled placeholder="Disabled"/>
</Demo>

## Elements

| element | tag | description |
| ---- | ---- | ------- |
| `root` | `<div.calendar>` | `Calendar`'s root div container. |
| `dates` | `<div.calendar-dates>` | `Calendar`'s date button elements' wrapper |

### Anatomy

<Demo>
    <Anatomy tag="div" classes="form-field date-picker">
        <Anatomy tag="div" classes="form-field-label-wrapper">
            <Anatomy tag="label" classes="form-field-label"/>
            <Anatomy tag="span" classes="form-field-hint"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-description"/>
        <Anatomy tag="div" classes="date-picker-wrapper">
            <Anatomy tag="Btn" classes="btn date-picker-select">
                <Anatomy tag="p" classes="date-picker-placeholder">
                    <Anatomy tag="span"/>
                </Anatomy>
                <Anatomy slot="aside">
                    <Anatomy tag="label"/>
                </Anatomy>
            </Anatomy>
            <Anatomy tag="Btn" classes="btn date-picker-clear"/>
        </Anatomy>
        <Anatomy tag="p" classes="form-field-details form-field-help"/>
        <Anatomy tag="Teleport" id="popover-portal">
            <Anatomy tag="div" classes="popover-wrapper">
                <Anatomy tag="div" classes="popover date-picker-popover">
                    <Anatomy tag='Calendar'/>
                </Anatomy>
            </Anatomy>
        </Anatomy>
    </Anatomy>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `Date \| null \| string \| number \| Date[] \| string[] \| number[]` | `null` |
| `format` | `Intl.DateTimeFormatOptions \| (date: Date) => string` | |
| `placeholder` | `string` | |
| `placeholderFallback` | `(n: number) => string` | |
| `iconCalendar` | `string` | `'calendar_month'` |
| `iconClear` | `string` | `'event_busy'` |
| `btnClear` | `Record<string, unknown>` | |
| `underline` | `boolean` | |
| `fill` | `boolean` | |
| `disabled` | `boolean` | |
| `label` | `string` | |
| `hint` | `string` | |
| `description` | `string` | |
| `help` | `string` | |
| `showErrros` | `boolean` | |
| `floatLabel` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `validator` | `Function` | |
| `eagerValidation` | `boolean` | |
| `elements` | `object` | |

### Configuration options

`DatePicker`'s [configuration options](/configuration) allow to overwrite some `DatePicker` props' default values and may be overwritten under the `datePicker` root-level configuration option.

| `datePicker.<option>` | type | default | [global](/configuration#global-configuration-options) |
| --------------------- | ---- | ------- | :------: |
| `format` | `object \| (date: Date) => string` | | |
| `formatOptions` | `object \| (timeEnabled: boolean) => object` | | |
| `placeholderFallback` | `(n: number) => string` | <code>n => \`${n} Dates Selected\`</code> | |
| `sideButtonPosition` | `'before' \| 'after'` | `'after'` | |
| `underline` | `boolean` | | |
| `fill` | `boolean` | | |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |