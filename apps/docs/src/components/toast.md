---
outline: [2,3]
---

# Toast

> Toasts display messages at the bottom-right corner of the viewport to communicate information to the user.

## Demo

<script setup>
import { Toast, Btn, Icon } from '@8ctavio/vergil/components'
import { ref } from 'vue'
import { toast } from '@8ctavio/vergil'

const theme = ref('brand')
console.time('duration')
</script>

<Demo>
    <Btn variant="solid" label="Toast" @click="toast('brand', 'Please remain calm!')"/>
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

### Theme <Badge type="tip"><pre>theme: ('brand' | 'ok' | 'info' | 'warn' | 'danger' | 'neutral') = 'brand'</pre></Badge>

There are aliases available for some `theme` prop values:

| Value      | Aliases |
| ---------- | ------- |
| `'ok'`     | `'success', 'check'` |
| `'info'`   | `'help', 'tip'` |
| `'warn'`   | `'warning', 'caution'` |
| `'danger'` | `'error'` |

```vue
<Toast message="Toast message" :theme/>
```

<Demo>
    <Toast message="Toast message" theme="brand"/>
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
<Toast message="Check the console!" :duration="5" @close="console.timeEnd('duration')"/>
```

<Demo>
    <Toast message="Check the console!" :duration="5" @close="console.timeEnd('duration')"/>
</Demo>

## API Reference

| prop | type | default |
| ---- | ---- | ------- |
| `message` | `string` | `''` |
| `details` | `string` | `''` |
| `theme` | `'brand' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `icon` | `string` | `''` |
| `duration` | `number` | `undefined` |

## Toaster &#8203;

Multiple toasts can be displayed simultaneously by adding them to the **toaster** (i.e., toast feed). After a toast is mounted, it can be removed from the toaster automatically after a developer defined time-out or manually through user interaction.

### Usage

First, it is required to add the `Toaster` component somewhere in the app's template. It's recommended to place it as a direct child of the application's container.

```vue
<script setup>
    import { Toaster } from '@8ctavio/vergil/components'
</script>

<template>
    <AppLayout/>
    <Toaster/>
</template>
```

:::tip
`Toaster`'s backdrop `z-index` value is by default set to `60` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

Then, toasts can be displayed programatically with the `toast` function

```js
import { toast } from '@8ctavio/vergil'

toast('warn', 'Icy conditions')
```

### API

```js
function toast(theme: string, msg_opt: string | object, duration: number = 6): void
```

#### Description

Displays a `Toast` at the bottom-right corner of the viewport that can be hidden automatically after a time-out or manually by user interaction.

When invoked, already displayed toasts are scrolled up to free up space for the new toast to show up.

#### Parameters

- `theme`: `Toast` theme.
- `msg_opt`: As a `string` it is the `Toast`'s message. As an `object` it may contain values for some `Toast` props:
    ```js
    {
        message: string,
        details: string,
        icon: string,
        duration: number
    }
    ```
- `duration`: Number of seconds to elapse before `Toast` is automatically hidden. Defaults to `6`.

### Examples

```js
toast(theme, message[theme])
```

<Demo>
    <Btn variant="solid" label="Brand" @click="toast('brand', 'Welcome!')"/>
    <Btn variant="solid" label="Ok" @click="toast('ok', 'Success!')"/>
    <Btn variant="solid" label="Info" @click="toast('info', 'Attention!')"/>
    <Btn variant="solid" label="Warn" @click="toast('warn', 'Warning!')"/>
    <Btn variant="solid" label="Danger" @click="toast('danger', 'Error!')"/>
    <Btn variant="solid" label="Neutral" @click="toast('neutral', 'Notification')"/>
</Demo>

<style>
.demo .toast p{
    margin: 0;
}
</style>