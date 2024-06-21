---
outline: [2,3]
---

# Toast

> Toasts display messages to communicate information to the user.

## Demo

<script setup>
import { Toast, Btn, Icon } from '@8ctavio/vergil/components'
import { ref } from 'vue'
import { toast } from '@8ctavio/vergil'

const theme = ref('brand')
console.time('toast-duration')
</script>

<Demo>
    <Btn label="Toast" @click="toast('Please remain calm!')"/>
</Demo>

<Demo>
    <Toast message="Attention traveler!" details="Lost item can be claimed on lower levels"/>
</Demo>

## Props

### Message <Badge type="tip"><pre>message: string = ''</pre></Badge>

```vue
<Toast message="Some message"/>
```

<Demo>
    <Toast message="Some message"/>
</Demo>

Vergil is able to parse `message` for a minimal set of Markdown-like tags, as well as line breaks inside template strings. Available tags syntax is shown in the next table.

| Syntax      | Effect |
| ----------- | ------ |
| `**<str>**` | `str` is displayed with bold font |
| `//<str>//` | `str` is displayed in italics |
| `[[<str>]]` | `str` is displayed inside an inline block |

```vue
<Toast message="Service Number **[[01928-19912-JK]]**" icon="coronavirus"/>
```
<Demo>
    <Toast message="Service Number **[[01928-19912-JK]]**" icon="coronavirus"/>
</Demo>

### Details <Badge type="tip"><pre>details: string = ''</pre></Badge>

:::tip
Message details are displayed only if the `message` prop is specified.
:::

When passing `details`, the `message` will be displayed as a header for the toast.

```vue
<Toast message="Message Header" details="Message details..."/>
```

<Demo>
    <Toast message="Message Header" details="Message details..."/>
</Demo>

When providing `details`, Vergil only parses Markdown-like tags in the `details` prop.

### Theme <Badge type="tip"><pre>theme: [theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

```vue
<Toast message="Toast message" :theme/>
```

<Demo>
    <Toast message="Toast message" theme="brand"/>
    <Toast message="Toast message" theme="user"/>
    <Toast message="Toast message" theme="ok"/>
    <Toast message="Toast message" theme="info"/>
    <Toast message="Toast message" theme="warn"/>
    <Toast message="Toast message" theme="danger"/>
    <Toast message="Toast message" theme="neutral"/>
</Demo>

### Icon <Badge type="tip"><pre>icon: string</pre></Badge>

```vue
<Toast message="A walk in the woods" icon="forest"/>
```

<Demo>
    <Toast message="A walk in the woods" icon="forest"/>
</Demo>

### Duration <Badge type="tip"><pre>duration: number</pre></Badge>

The `duration` prop specifies the number of **seconds** elapsed since `Toast` is mounted, before it emmits a `close` event. If no duration is specified, the event won't be emmited on a time-out basis.

```vue
<Toast message="Check the console!" :duration="5" @close="console.timeEnd('toast-duration')"/>
```

<Demo>
    <Toast message="Check the console!" :duration="5" @close="console.timeEnd('toast-duration')"/>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `message` | `string` | `''` |
| `details` | `string` | `''` |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `icon` | `string` | `''` |
| `duration` | `number` | `undefined` |

### Configuration options

The following `Toast` props' default values can be overwritten under the `toast` root-level [configuration option](/configuration).

| `toast.<option>` | [global](/configuration#global-configuration) |
| -------------- | :---: |
| `theme` | ✅ |
| `icon.<theme>` | ✅ |

## Toaster &#8203;

Multiple `Toast`s can be displayed simultaneously by adding them to a **toaster** (i.e., toast feed).

After a `Toast` is mounted, it can be removed from a toaster automatically after a developer defined time-out or manually through user interaction.

When a `Toast` is added to a toaster, already mounted `Toast`s are displaced to free up space for the recently added `Toast`.


### Mount toasters

First, it is required to add the `Toasters` component somewhere in the app's template. It's recommended to place it as a direct child of the application's container.

```vue
<script setup>
import { Toasters } from '@8ctavio/vergil/components'
</script>

<template>
    <AppLayout/>
    <Toasters/>
</template>
```

:::tip
Toasters `z-index` value is by default set to `60` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

### Programmatic use

Toasts can be displayed programmatically through the `toast` function.

```js
import { toast } from '@8ctavio/vergil'
```

It receives an `options` object, which has default values for options not specified.

```js
function toast(options: {
    position: string = 'bottom-end',
    message: string = '',
    details: string = '',
    theme: string = 'brand',
    icon: string,
    duration: number = 6
}): void
```

- `position`: The position of the toaster the `Toast` is going to be mounted on. Possible values are:
```ts
type position = 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end'
```
- `duration`: The number of seconds a `Toast` lasts mounted.
- `icon`: If not specified, the `icon` default value depends on the `theme` option. Default `icon` values for each `theme` are found under the `global` [default configuration](/configuration#default-configuration) option.

The remaining options are the same as the `Toast`'s props.

In order to reduce syntax for frequently used options, there are two additional ways to use `toast`.

```js
function toast(message: string): void
function toast(theme: string, message: string): void
```

For instance, the following calls of `toast` result in the same `Toast` being displayed thrice.

```js
toast('Please remain calm!')
toast('brand', 'Please remain calm!')
toast({ message: 'Please remain calm!' })
```

### Configuration options

The following `toast` parameters' default values can be overwritten under the `toaster` root-level [configuration option](/configuration).

- `position`
- `duration`

Additionally, only the toaster positions to be used may be specified under `toaster.positions`.

### Examples

#### Different themes

```js
toast(theme, message[theme])
```

<Demo>
    <Btn label="Brand" @click="toast('brand', 'Welcome!')"/>
    <Btn label="User" @click="toast('user', 'Welcome!')"/>
    <Btn label="Ok" @click="toast('ok', 'Success!')"/>
    <Btn label="Info" @click="toast('info', 'Attention!')"/>
    <Btn label="Warn" @click="toast('warn', 'Warning!')"/>
    <Btn label="Danger" @click="toast('danger', 'Error!')"/>
    <Btn label="Neutral" @click="toast('neutral', 'Notification')"/>
</Demo>


#### Different positions

```js
toast({
    position,
    message: position
})
```

<Demo>
    <div class="positions">
        <Btn label="Top-Start" @click="toast({ position: 'top-start', message: 'top-start' })"/>
        <Btn label="Top" @click="toast({ position: 'top', message: 'top' })"/>
        <Btn label="Top-End" @click="toast({ position: 'top-end', message: 'top-end' })"/>
        <Btn label="Bottom-Start" @click="toast({ position: 'bottom-start', message: 'bottom-start' })"/>
        <Btn label="Bottom" @click="toast({ position: 'bottom', message: 'bottom' })"/>
        <Btn label="Bottom-End" @click="toast({ position: 'bottom-end', message: 'bottom-end' })"/>
    </div>
</Demo>

<style>
.demo .toast p{
    margin: 0;
}
.positions{
    display: grid;
    grid-template-columns: repeat(3,auto);    
    justify-content: space-between;
    align-content: space-between;
    gap: 10px;
    height: 150px;
    width: 100%;
}
</style>