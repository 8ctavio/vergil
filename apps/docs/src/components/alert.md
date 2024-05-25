---
outline: [2,3]
---

# Alert

> Alerts display messages at the top of the viewport drawing user's attention to communicate important information.

## Demo

<script setup>
import { Alert, Btn, Icon } from '@8ctavio/vergil/components'
import { ref } from 'vue'
import { alert } from '@8ctavio/vergil'

const theme = ref('brand')
console.time('duration')
</script>

<Demo>
    <Btn variant="solid" label="Alert" @click="alert('brand', 'Please remain calm!')"/>
</Demo>

<Demo>
    <Alert message="Attention traveler!" details="Lost item can be claimed on lower levels"/>
</Demo>

## Props

### Message <Badge type="tip"><pre>message: string = ''</pre></Badge>

```vue
<Alert message="Some message"/>
```

<Demo>
    <Alert message="Some message"/>
</Demo>

### Details <Badge type="tip"><pre>details: string = ''</pre></Badge>

:::tip
Message details are displayed only if the `message` prop is specified.
:::

When passing `details`, the `message` will be displayed as a header for the alert.

```vue
<Alert message="Message Header" details="Message details..."/>
```

<Demo>
    <Alert message="Message Header" details="Message details..."/>
</Demo>

### Theme <Badge type="tip"><pre>theme: ('brand' | 'ok' | 'info' | 'warn' | 'danger' | 'neutral') = 'brand'</pre></Badge>

There are aliases available for some `theme` prop values:

| Value      | Aliases |
| ---------- | ------- |
| `'ok'`     | `'success', 'check'` |
| `'info'`   | `'help', 'tip'` |
| `'warn'`   | `'warning', 'caution'` |
| `'danger'` | `'error'` |

```vue
<Alert message="Alert message" :theme/>
```

<Demo>
    <Alert message="Alert message" theme="brand"/>
    <Alert message="Alert message" theme="ok"/>
    <Alert message="Alert message" theme="info"/>
    <Alert message="Alert message" theme="warn"/>
    <Alert message="Alert message" theme="danger"/>
    <Alert message="Alert message" theme="neutral"/>
</Demo>

### Icon <Badge type="tip"><pre>icon: string</pre></Badge>

```vue
<Alert message="A walk in the woods" icon="forest"/>
```

<Demo>
    <Alert message="A walk in the woods" icon="forest"/>
</Demo>

### Duration <Badge type="tip"><pre>duration: number</pre></Badge>

The `duration` prop specifies the number of **seconds** elapsed since `Alert` is mounted, before it emmits a `close` event. If no duration is specified, the event won't be emmited on a time-out basis.

```vue
<Alert message="Check the console!" :duration="5" @close="console.timeEnd('duration')"/>
```

<Demo>
    <Alert message="Check the console!" :duration="5" @close="console.timeEnd('duration')"/>
</Demo>

## Alert Feed &#8203;

Multiple alerts can be displayed simultaneously at the top of the viewport by adding them to the **alert feed**. After an alert is mounted, it can be removed from the feed automatically after a developer defined time-out or manually through user interaction.

### Usage

First, it is required to add the `AlertFeed` component somewhere in the app's template. It's recommended to place it as a direct child of the application's container.

```vue
<script setup>
    import { AlertFeed } from '@8ctavio/vergil/components'
</script>

<template>
    <AppLayout/>
    <AlertFeed/>
</template>
```

:::tip
`AlertFeed` backdrop `z-index` value is by default set to `60` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

Then, alerts can be displayed programatically with the `alert` function

```js
import { alert } from '@8ctavio/vergil'

alert('ok', 'Please remain calm!')
```

### API

```js
function alert(theme: string, msg_opt: string | object, duration: number = 6): void
```

#### Description

Displays an `Alert` at the top of the viewport that can be hidden automaticaaly after a time-out or manually by user interaction.

If invoked while one or more alerts are being shown, those alerts are scrolled down to free up space for the new alert to show up.

#### Parameters

- `theme`: `Alert` theme.
- `msg_opt`: As a `string` it is the `Alert`'s message. As an `object` it may contain values for some `Alert` props:
    ```js
    {
        message: string,
        details: string,
        icon: string,
        duration: number
    }
    ```
- `duration`: Number of seconds to elapse before `Alert` is automatically hiddens.

### Examples

```js
alert(theme, message[theme])
```

<Demo>
    <Btn variant="solid" label="Brand" @click="alert('brand', 'Welcome!')"/>
    <Btn variant="solid" label="Ok" @click="alert('ok', 'Success!')"/>
    <Btn variant="solid" label="Info" @click="alert('info', 'Attention!')"/>
    <Btn variant="solid" label="Warn" @click="alert('warn', 'Warning!')"/>
    <Btn variant="solid" label="Danger" @click="alert('danger', 'Error!')"/>
    <Btn variant="solid" label="Neutral" @click="alert('neutral', 'Notification')"/>
</Demo>

<style>
.demo .alert p{
    margin: 0;
}
</style>