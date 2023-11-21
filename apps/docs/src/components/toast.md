---
outline: [2,3]
---

# Toast

> Toasts display messages at the bottom-right corner of the viewport to communicate information to the user.

## Demo

<script setup>
import { ref } from 'vue'
import { toast } from 'vergil'

const previewToastType = ref('ok')
const toastIcons = {
    ok: 'check_circle',
    error: 'cancel',
    warn: 'warning',
    info: 'info'
}
</script>

<Demo>
    <div class="row">
        <button class="vp-btn" @click="toast('ok', 'Success! Green Toast.')">Ok</button>
        <button class="vp-btn" @click="toast('error', 'Error! Red Toast.')">Error</button>
        <button class="vp-btn" @click="toast('warn', 'Warning! Yellow Toast.')">Warning</button>
        <button class="vp-btn" @click="toast('info', 'Info. Blue Toast.')">Info</button>
    </div>
</Demo>

### Preview

<br>

<Demo>
    <div class="col">
        <div :class="['toast', previewToastType]">
            <span class="material-symbols-rounded">{{ toastIcons[previewToastType] }}</span>
            <p>Lorem ipsum</p>
        </div>
        <div :class="['toast', previewToastType]">
            <span class="material-symbols-rounded">{{ toastIcons[previewToastType] }}</span>
            <p>Lorem ipsum dolor sit amet, consectetur elit.</p>
        </div>
        <div :class="['toast', previewToastType]">
            <span class="material-symbols-rounded">{{ toastIcons[previewToastType] }}</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis dignissim ante vel iaculis.</p>
        </div>
        <div :class="['toast', previewToastType]">
            <span class="material-symbols-rounded">{{ toastIcons[previewToastType] }}</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat non lorem at egestas. Integer et rutrum felis. Integer suscipit sapien nec neque finibus, sit amet mollis velit commodo.</p>
        </div>
        <div class="row" :style="{'padding-top': '30px'}">
            <button class="vp-btn" @click="previewToastType = 'ok'">Ok</button>
            <button class="vp-btn" @click="previewToastType = 'error'">Error</button>
            <button class="vp-btn" @click="previewToastType = 'warn'">Warn</button>
            <button class="vp-btn" @click="previewToastType = 'info'">Info</button>
        </div>
    </div>
</Demo>

## Description

When an toast shows up, it is added to the **toaster** (a.k.a. the toast feed), by the means of which multiple toasts can be toasted simultaneously.

After a developer-defined time-out, a toast is taken out of the toaster automatically, hiding it.

There are four toast types which properly theme the toast for different types of messages:

- `ok`: for successful execution of tasks,
- `error`: for errors,
- `warn`: for warnings, and
- `info`: for general purpose information.

:::tip
Toasts are meant to communicate **non**-critical messages to the user.
:::

## Usage

First, it is required to add the `Toaster` component somewhere in the app's template. It's recommended to place it as a direct child of the application's container.

```vue
<script setup>
    import { Toaster } from 'vergil/components'
</script>

<template>
    <AppLayout/>
    <Toaster/>
</template>
```

:::tip
`Toaster`'s backdrop `z-index` value is by default set to `10` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

```js
import { toast } from 'vergil'

toast('warn', 'Icy conditions.')
```

### Function

```js
function toast(type: string, message: string, duration: number = 6): void
```

#### Description

Renders a toast at the bottom-right corner of the viewport, which
- is themed according to `type`, 
- displays `message` to the user, and
- after a time-out of `duration` seconds elapses, it is hidden automatically.

If invoked while one or more toasts are being shown, those toasts are scrolled up to free up space for the new toast to show up.

#### Parameters

- `type`: A string containing the toast type. Each type themes the toast differently. Possible values are:
    - `"ok"`: Green theme.
    - `"error"`: Red theme.
    - `"warn"`: Yellow theme.
    - `"info"`: Blue theme.
- `message`: A string containing the message to display in the toast.
- `duration`: The number of seconds toast's time-out lasts.

<style>
.demo .col{
    justify-items: right;
}
.demo .toast{
    position: initial;
    width: initial;
}
.demo .toast p{
    margin: 0;
}
</style>