---
outline: [2,3]
---

# Toast

> Toasts display messages to communicate information to the user.

## Demo

<script setup>
import { ref } from 'vue'
import { toast } from 'vergil'
import { Toast, Button, Icon } from 'vergil/components'

const theme = ref('brand')
console.time('toast-duration')
</script>

<Demo>
    <Button label="Toast" @click="toast('Please remain calm!')"/>
</Demo>

<Demo>
    <Toast message="Attention traveler!" details="Lost item can be claimed on lower levels"/>
</Demo>

## Props

### Message <Badge type="tip"><pre>message: string = ''</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

```vue
<Toast message="Service Number **[[01928-19912-JK]]**" icon="military_tech"/>
```

<Demo>
    <Toast message="Service Number **[[01928-19912-JK]]**" icon="military_tech"/>
</Demo>

### Details <Badge type="tip"><pre>details: string = ''</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

When the `details` prop is provided:

- `message` is displayed as a header, and
- Mini-Markup support is **only** available for the `details` prop.

```vue
<Toast message="Message Header" details="Message details..."/>
```

<Demo>
    <Toast message="Message Header" details="Message details..."/>
</Demo>

:::tip
Message details are displayed only if the `message` prop is specified.
:::

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

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `message` | `string` | `''` |
| `details` | `string` | `''` |
| `icon` | `string` | `''` |
| `duration` | `number` | `undefined` |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |

### Configuration options

`Toast`'s [configuration options](/configuration) allow to overwrite some `Toast` props' default values and may be overwritten under the `toast` root-level configuration option.

| `toast.<option>` | type | default | [global](/configuration#global-configuration-options) |
| -------------------- | ---- | ------- | :------: |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| [`icon.<theme>`](/theme#the-theme-prop) | `string` | | ✅ |

## Toaster &#8203;

Multiple `Toast`s can be displayed simultaneously by adding them to a **toaster** (i.e., toast feed).

After a `Toast` is mounted, it can be removed from a toaster automatically after a developer defined time-out or manually through user interaction.

When a `Toast` is added to a toaster, already mounted `Toast`s are displaced to free up space for the recently added `Toast`.

### Mount toasters

Toasters may be enabled by passing the `toaster` boolean prop to the [`Vergil`](/components/vergil) component.

```vue
<script setup>
import { Vergil } from '@vrgl/vergil/components'
</script>

<template>
    <Vergil toaster>
        <AppLayout/>
    </Vergil>
</template>
```

:::tip
Toasters `z-index` value is by default set to `40` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

### Programmatic use

Toasts can be displayed programmatically through the `toast` function.

```js
import { toast } from '@vrgl/vergil'
```

It receives an `options` object, which has default values for options not specified.

```ts
function toast(options: {
    position?: ToasterPosition;
    message?: string;
    details?: string;
    theme?: string;
    icon?: string;
    duration?: number;
}): void

type ToasterPosition = 
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'bottom-start'
    | 'bottom'
    | 'bottom-end';
```

- `position`: The position of the toaster the `Toast` is going to be mounted on.
- `duration`: The number of seconds a `Toast` lasts mounted. Defaults to `6`.
- `icon`: If not specified, the `icon` default value depends on the `theme` option. Default `icon` values for each `theme` are found under the `global` [default configuration](/configuration#default-configuration) option.

The remaining options are the same as the `Toast`'s props.

In order to reduce syntax for frequently used options, there are two additional ways to use `toast`.

```ts
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

`Toaster`'s [configuration options](/configuration) allow to overwrite some `toast` parameters' default values and may be overwritten under the `toaster` root-level configuration option. Additionally, only required toaster positions may be specified under `toaster.positions`.

| `toaster.<option>` | type | default | [global](/configuration#global-configuration-options) |
| -------------------- | ---- | ------- | :------: |
| `positions` | `ToasterPosition[]` | `['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end']` | |
| `default` | `ToasterPosition` | `'bottom-end'` | |
| `duration` | `number` | `6` | |

### Examples

#### Different themes

```js
toast(theme, message[theme])
```

<Demo>
    <Button label="Brand" @click="toast('brand', 'Welcome!')"/>
    <Button label="User" @click="toast('user', 'Welcome!')"/>
    <Button label="Ok" @click="toast('ok', 'Success!')"/>
    <Button label="Info" @click="toast('info', 'Attention!')"/>
    <Button label="Warn" @click="toast('warn', 'Warning!')"/>
    <Button label="Danger" @click="toast('danger', 'Error!')"/>
    <Button label="Neutral" @click="toast('neutral', 'Notification')"/>
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
        <Button label="Top-Start" @click="toast({ position: 'top-start', message: 'top-start' })"/>
        <Button label="Top" @click="toast({ position: 'top', message: 'top' })"/>
        <Button label="Top-End" @click="toast({ position: 'top-end', message: 'top-end' })"/>
        <Button label="Bottom-Start" @click="toast({ position: 'bottom-start', message: 'bottom-start' })"/>
        <Button label="Bottom" @click="toast({ position: 'bottom', message: 'bottom' })"/>
        <Button label="Bottom-End" @click="toast({ position: 'bottom-end', message: 'bottom-end' })"/>
    </div>
</Demo>

<style>
.positions {
    display: grid;
    grid-template-columns: repeat(3,auto);    
    justify-content: space-between;
    align-content: space-between;
    gap: 10px;
    height: 150px;
    width: 100%;
}
</style>