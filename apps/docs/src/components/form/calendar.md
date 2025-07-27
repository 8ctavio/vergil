---
outline: [2,3]
---

# Calendar

<script setup>
import { Calendar } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'

const demo1 = useModel(null, { shallow: true })
const demo2 = useModel(null, { shallow: true })
const demo3 = useModel(null, { shallow: true })
const demo4 = useModel(null, { shallow: true })
const demo5 = useModel(null, { shallow: true })
const demo6 = useModel(null, { shallow: true })
const demo7 = useModel([], { shallow: true })
</script>

## Basic Usage

<Demo>
    <div class="col">
        <div class="row center">
            <Calendar v-model="demo1"/>
        </div>
        <div class="row center">
            <code>date.value === '{{ demo1.value?.toString().split(' (',1)[0] }}'</code>
        </div>
        <div class="row center">
            <Calendar v-model.string="demo7"/>
        </div>
        <div class="row center">
            <code>date.value === {{ demo7.value }}</code>
        </div>
    </div>
</Demo>

```vue
<script setup>
import { Calendar } from '@8ctavio/vergil/components'
import { useModel } from '@8ctavio/vergil'
const date = useModel(null, { shallow: true })
const dates = useModel([])
</script>

<template>
    <!-- Single Selection -->
    <Calendar v-model="date"/>
    <!-- Multiple Selection -->
    <Calendar v-model="dates"/>
</template>
```

## Modifiers

:::warning
If no modifier is used, `Calendar` does not support regular refs directly provided through `v-model`.
:::

### String

When the `string` modifier is present, the model value is handled as a date-only-form string (`"YYYY-MM-DD"`) of the [date time string format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format).

```vue
<Calendar v-model.string="date"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <Calendar v-model.string="demo2"/>
        </div>
        <div class="row center">
            <code>date.value === '{{ demo2.value }}'</code>
        </div>
    </div>
</Demo>

### Timestamp <Badge><pre>timestamp</pre></Badge>

When the `timestamp` modifier is present, the model value is handled as a [timestamp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_epoch_timestamps_and_invalid_date).

```vue
<Calendar v-model.timestamp="date"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <Calendar v-model.timestamp="demo3"/>
        </div>
        <div class="row center">
            <code>date.value === {{ demo3.value }}</code>
        </div>
    </div>
</Demo>

## Props

### Locale <Badge><pre>locale: Intl.LocalesArgument = 'en'</pre></Badge>

The `locale` prop conforms to the [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) constructor's `locales` parameter.

```vue
<Calendar locale="es-MX"/>
```

<Demo>
    <Calendar locale="es-MX"/>
</Demo>

### Labels <Badge><pre>labels: Record<'month' | 'shortMonths' | 'shortWeekdays', string[]></pre></Badge>

If custom month/weekday labels are required, they can be specified through the `labels` prop as an object of the following form:

```ts
type Labels = {
    months: string[],
    shortMonths: string[]
    shortWeekdays: string[],
}
```

- Short weekday labels are taken from the `shortWeekdays` array, going from Sunday at index `0` to Saturday at index `6`.
- Month (short) labels are taken from the `months` (`shortMonths`) array, going from January at index `0` to December at index `11`.

### First weekday <Badge><pre>first-weekday: (0 | 1 | 2 | 3 | 4 | 5 | 6) = 0</pre></Badge>

The `first-weekday` prop specifies the index of the weekday to be considered as the first day of the week by the calendar. Weekdays are considered to be indexed from Sunday through Saturday from `0` to `6`.

```vue
<Calendar :first-weekday="1"/>
```

<Demo>
    <Calendar :first-weekday="1"/>
</Demo>

### Dates range <Badge><pre>min: CalendarDate = '1970-01-01'</pre></Badge> <Badge><pre>max: CalendarDate = '2131-12-31'</pre></Badge>

The `min` and `max` props define an inclusive range of dates that can be selected. Individual dates outside the defined range are disabled. Months that do not include dates inside the defined range cannot be displayed.

For both props, dates can be specified as a string of the form `'YYYY-MM-DD'`, a timestamp, or a date object.

```vue
<Calendar min="2025-01-01" max="2025-12-31"/>
```

<Demo>
    <Calendar min="2025-01-01" max="2025-12-31"/>
</Demo>

### Selected month and year <Badge><pre>selected-month: string</pre></Badge> <Badge><pre>selected-year: string</pre></Badge>

The `selected-month` and `selected-year` props define which month and year to display initially when the calendar is mounted. If one of these props is not set, it will default to the current date's month or year, respectively.

For the `selected-month` prop, months are considered to be numbered from `'1'` through `'12'`.

If there are selected dates when the calendar is mounted, these props are ignored.

```vue
<Calendar selected-year="2009" selected-month="9"/>
```

<Demo>
    <Calendar selected-year="2009" selected-month="9"/>
</Demo>

### Time selection <Badge><pre>time: boolean | string</pre></Badge>

As a boolean, the `time` prop enables time selection controls. The selected time will be set to any selected date.

The `time` prop may also be a string of the form `"HH:mm"` that, apart from enabling time controls, sets their intially selected time. If, however, there's an initially selected date, the initial time is ignored.

:::tip NOTE
When using the `string` model-value modifier, dates are represented in the date-time form of the [date time string format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format) (`"YYYY-MM-DDTHH:mm"`).
:::

```vue
<Calendar time/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <Calendar v-model="demo4" time/>
        </div>
        <div class="row center">
            <code>date.value === '{{ demo4.value?.toString().split(' (',1)[0] }}'</code>
        </div>
    </div>
</Demo>

```vue
<Calendar time="01:17"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <Calendar v-model="demo5" time="01:17"/>
        </div>
        <div class="row center">
            <code>date.value === '{{ demo5.value?.toString().split(' (',1)[0] }}'</code>
        </div>
    </div>
</Demo>

### Time format <Badge><pre>time-format: ('12' | '24') = '24'</pre></Badge>

```vue
<Calendar time time-format="12"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <Calendar v-model="demo6" time time-format="12"/>
        </div>
        <div class="row center">
            <code>date.value === '{{ demo6.value?.toString().split(' (',1)[0] }}'</code>
        </div>
    </div>
</Demo>

:::tip NOTE
The `time-format` prop does not affect the model-value's date representation when the `string` modifier is used.
:::

### Time controls <Badge><pre>hours: TimeControls</pre></Badge> <Badge><pre>minutes: TimeControls</pre></Badge>

The `hours` and `minutes` props are objects whose properties respectively configure time controls. The configuration objects have the following form

```ts
type TimeControls = {
	min?: number;
	max?: number;
	step?: number;
}
```

The `min` and `max` options define an inclusive range of values the corresponding time control can be set to. The `step` option becomes the `step` prop of the corresponding [`Slider`](/components/form/slider#attributes).

The following configuration objects are the default values for `hours` and `minutes`:

```js
const defaultHours = { min: 0, max: 23, step: 1 }
const defaultMinutes = { min: 0, max: 59, step: 1 }
```

```vue-html
<Calendar time
    :hours="{
        min: 10,
        max: 22,
        step: 2
    }"
    :minutes="{
        min: 15,
        max: 45,
        step: 5
    }"    
/>
```

<Demo>
    <Calendar time
        :hours="{
            min: 10,
            max: 22,
            step: 2
        }"
        :minutes="{
            min: 15,
            max: 45,
            step: 5
        }"    
    />
</Demo>

### Disabled dates <Badge><pre>disabled-dates: (CalendarDate | [CalendarDate, CalendarDate])[]</pre></Badge>

The `disabled-dates` prop is an array of dates or date ranges to be disabled. A date range is simply an array of two dates that define the inclusive limits of the range. Dates can be represented as a string of the form `'YYYY-MM-DD'`, a timestamp, or a date object.

```vue-html
<Calendar selected-year="2025" selected-month="1"
    :disabled-dates="[
        '2025-01-01',
        new Date('2025-01-02T00:00'),
        Date.parse('2025-01-03T00:00'),
        ['2025-01-13', '2025-01-17'],
        [new Date('2025-01-20T00:00'), new Date('2025-01-24T00:00')],
        [Date.parse('2025-01-27T00:00'), Date.parse('2025-01-31T00:00')],
    ]"
/>
```

<Demo>
    <Calendar selected-year="2025" selected-month="1"
        :disabled-dates="[
            '2025-01-01',
            new Date('2025-01-02T00:00'),
            Date.parse('2025-01-03T00:00'),
            ['2025-01-13', '2025-01-17'],
            [new Date('2025-01-20T00:00'), new Date('2025-01-24T00:00')],
            [Date.parse('2025-01-27T00:00'), Date.parse('2025-01-31T00:00')],
        ]"
    />
</Demo>

### Enabled dates <Badge><pre>enabled-dates: (CalendarDate | [CalendarDate, CalendarDate])[]</pre></Badge>

The `enabled-dates` prop is an array of dates or date ranges to be enabled. This implies that when `enabled-dates` is set, all dates will be considered to be normally disabled. For this prop to take effect `disabled-dates` must be unset.

Similar to the `disabled-dates` prop, a date range is an array of two dates that define the inclusive limits of a range, and dates can be represented as a string of the form `'YYYY-MM-DD'`, a timestamp, or a date object.

```vue-html
<Calendar selected-year="2025" selected-month="1"
    :enabled-dates="[
        '2025-01-01',
        new Date('2025-01-02T00:00'),
        Date.parse('2025-01-03T00:00'),
        ['2025-01-13', '2025-01-17'],
        [new Date('2025-01-20T00:00'), new Date('2025-01-24T00:00')],
        [Date.parse('2025-01-27T00:00'), Date.parse('2025-01-31T00:00')],
    ]"
/>
```

<Demo>
    <Calendar selected-year="2025" selected-month="1"
        :enabled-dates="[
            '2025-01-01',
            new Date('2025-01-02T00:00'),
            Date.parse('2025-01-03T00:00'),
            ['2025-01-13', '2025-01-17'],
            [new Date('2025-01-20T00:00'), new Date('2025-01-24T00:00')],
            [Date.parse('2025-01-27T00:00'), Date.parse('2025-01-31T00:00')],
        ]"
    />
</Demo>

### Disabled weekdays <Badge><pre>disabled-weekdays: number[]</pre></Badge>

The `disabled-weekdays` prop receives an array of weekday indexes. Calendar dates whose weekday index is in `disabled-weekdays` are disabled. Weekdays are considered to be indexed from Sunday through Saturday from `0` to `6`

```vue
<Calendar :disabled-weekdays="[0,6]"/>
```

<Demo>
    <Calendar :disabled-weekdays="[0,6]"/>
</Demo>

### Theme <Badge><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

```vue
<Calendar theme="user"/>
```

<Demo>
    <Calendar theme="user"/>
</Demo>

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <Calendar size="xs"/>
    <Calendar size="sm"/>
    <Calendar size="md"/>
    <Calendar size="lg"/>
    <Calendar size="xl"/>
</Demo>

### Radius <Badge><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <Calendar radius="none"/>
    <Calendar radius="sm"/>
    <Calendar radius="md"/>
    <Calendar radius="lg"/>
    <Calendar radius="full"/>
</Demo>

### Disabled <Badge><pre>disabled: boolean</pre></Badge>

```vue
<Calendar disabled time time-format="12"/>
```

<Demo>
    <Calendar disabled time time-format="12"/>
</Demo>

## Elements

| element | tag | description |
| ---- | ---- | ------- |
| `root` | `<div.calendar>` | `Calendar`'s root div container. |
| `dates` | `<div.calendar-dates>` | Date button elements' wrapper |

### Anatomy

<Demo>
    <Anatomy tag="div" classes="calendar">
        <Anatomy tag="div" classes="calendar-head">
            <Anatomy tag="button" classes="calendar-arrow calendar-button">
                <Anatomy tag="Icon"/>
            </Anatomy>
            <Anatomy tag="div" classes="calendar-arrow calendar-button">
                <Anatomy tag="button" classes="calendar-button"/>
                <Anatomy tag="button" classes="calendar-button"/>
            </Anatomy>
            <Anatomy tag="button" classes="calendar-arrow calendar-button">
                <Anatomy tag="Icon"/>
            </Anatomy>
        </Anatomy>
        <Anatomy tag="div" classes="calendar-body">
            <Anatomy tag="div" classes="calendar-week">
                <Anatomy tag='p v-for="weekday of weekdays"'/>
            </Anatomy>
            <Anatomy tag="div" classes="calendar-dates">
                <Anatomy tag='label' classes="calendar-date calendar-button">
                    <Anatomy tag="input"/>
                </Anatomy>
            </Anatomy>
        </Anatomy>
        <Anatomy tag="div" classes="calendar-months">
            <Anatomy tag='button' classes="calendar-month calendar-button"/>
        </Anatomy>
        <Anatomy tag="div" classes="calendar-years">
            <Anatomy tag='button' classes="calendar-year calendar-button"/>
        </Anatomy>
        <Anatomy tag="div" classes="calendar-foot">
            <Anatomy tag="div" classes="calendar-time">
                <Anatomy tag="InputText"/>
                <Anatomy tag="p"/>
                <Anatomy tag="InputText"/>
                <Anatomy tag="Btn"/>
            </Anatomy>
            <Anatomy tag="Slider"/>
            <Anatomy tag="Slider"/>
        </Anatomy>
    </Anatomy>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `value` | `Date \| null \| string \| number \| Date[] \| string[] \| number[]` | `null` |
| `locale` | `Intl.LocalesArgument` | `'en'` |
| `labels` | `Record<'month' \| 'shortMonths' \| 'shortWeekdays', string[]>` | |
| `firstWeekday` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` |
| `min` | `string \| number \| Date` | `'1970-01-01'` |
| `max` | `string \| number \| Date` | `'2131-12-31'` |
| `selectedMonth` | `string` | |
| `selectedYear` | `string` | |
| `time` | `boolean \| string` | |
| `timeFormat` | `'24' \| '12'` | `'24'` |
| `hours` | `TimeControls` | `{ min: 0, max: 23, step: 1 }` |
| `minutes` | `TimeControls` | `{ min: 0, max: 59, step: 1 }` |
| `disabledDates` | `(CalendarDate \| [CalendarDate, CalendarDate])[]` | |
| `enabledDates` | `(CalendarDate \| [CalendarDate, CalendarDate])[]` | |
| `disabledWeekdays` | `(0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6)[]` | |
| `disabled` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `validator` | `Function` | |
| `eagerValidation` | `boolean` | |
| `elements` | `object` | |
| `validationDelay` | `number` | `300` |
| `validationCooldown` | `number` | `350` |

### Configuration options

`Calendar`'s [configuration options](/configuration) allow to overwrite some `Calendar` props' default values and may be overwritten under the `calendar` root-level configuration option.

| `calendar.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ------------------- | ---- | ------- | :------: |
| `locale` | `Intl.LocalesArgument` | `'en'` | |
| `labels` |`Record<'month' \| 'shortMonths' \| 'shortWeekdays', string[]>` | | |
| `firstWeekday` |`0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | |
| `timeFormat` | `'24' \| '12'` | `'24'` | |
| `validationDelay` | `number` | | ✅ |
| `validationCooldown` | `number` | | ✅ |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |