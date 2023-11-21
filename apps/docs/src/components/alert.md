---
outline: [2,3]
---

# Alert

> Alerts display messages at the top of the viewport drawing user's attention to communicate important information.

## Demo

<script setup>
import { ref } from 'vue'
import { alert } from 'vergil'

const previewAlertType = ref('ok')
const alertIcons = {
    ok: 'check_circle',
    error: 'cancel',
    warn: 'warning',
    info: 'info'
}
</script>

<Demo>
    <div class="row">
        <button class="vp-btn" @click="alert('ok', 'Success! Green Alert.')">Ok</button>
        <button class="vp-btn" @click="alert('error', 'Error! Red Alert.')">Error</button>
        <button class="vp-btn" @click="alert('warn', 'Warning! Yellow Alert.')">Warning</button>
        <button class="vp-btn" @click="alert('info', 'Info. Blue Alert.')">Info</button>
    </div>
</Demo>

### Preview

<br>

<Demo>
    <div class="col">
        <div :class="['alert', previewAlertType]">
            <span class="material-symbols-rounded">{{ alertIcons[previewAlertType] }}</span>
            <p>Lorem ipsum</p>
            <button>
                <span class="material-symbols-rounded">cancel</span>
            </button>
        </div>
        <div :class="['alert', previewAlertType]">
            <span class="material-symbols-rounded">{{ alertIcons[previewAlertType] }}</span>
            <p>Lorem ipsum dolor sit amet, consectetur elit.</p>
            <button>
                <span class="material-symbols-rounded">cancel</span>
            </button>
        </div>
        <div :class="['alert', previewAlertType]">
            <span class="material-symbols-rounded">{{ alertIcons[previewAlertType] }}</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis dignissim ante vel iaculis.</p>
            <button>
                <span class="material-symbols-rounded">cancel</span>
            </button>
        </div>
        <div :class="['alert', previewAlertType]">
            <span class="material-symbols-rounded">{{ alertIcons[previewAlertType] }}</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat non lorem at egestas. Integer et rutrum felis. Integer suscipit sapien nec neque finibus, sit amet mollis velit commodo.</p>
            <button>
                <span class="material-symbols-rounded">cancel</span>
            </button>
        </div>
        <div class="row" :style="{'padding-top': '30px'}">
            <button class="vp-btn" @click="previewAlertType = 'ok'">Ok</button>
            <button class="vp-btn" @click="previewAlertType = 'error'">Error</button>
            <button class="vp-btn" @click="previewAlertType = 'warn'">Warn</button>
            <button class="vp-btn" @click="previewAlertType = 'info'">Info</button>
        </div>
    </div>
</Demo>

## Description

When an alert shows up, it is added to the **alert feed**, by the means of which multiple alerts can be shown simultaneously.

After a developer-defined time-out, an alert is removed from the feed automatically, which hides it. However, each alert also contains an `x` button that allows the user to immediately remove the alert from the feed.

There are four alert types which properly theme the alert for different types of messages:

- `ok`: for successful execution of tasks,
- `error`: for errors,
- `warn`: for warnings, and
- `info`: for general purpose information.

:::tip
Alerts are meant to communicate messages that are important/critical for the user to see.
:::

## Usage

First, it is required to add the `AlertFeed` component somewhere in the app's template. It's recommended to place it as a direct child of the application's container.

```vue
<script setup>
    import { AlertFeed } from 'vergil/components'
</script>

<template>
    <AppLayout/>
    <AlertFeed/>
</template>
```

:::tip
`Alert`'s backdrop `z-index` value is by default set to `10` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

```js
import { alert } from 'vergil'

alert('ok', 'Keep it clean!')
```

### Function

```js
function alert(type: string, message: string, duration: number = 6): void
```

#### Description

Renders an alert at the top of the viewport, which
- is themed according to `type`, 
- displays `message` to the user, and
- after a time-out of `duration` seconds elapses, it is hidden automatically.

If invoked while one or more alerts are being shown, those alerts are scrolled down to free up space for the new alert to show up.

#### Parameters

- `type`: A string containing the alert type. Each type themes the alert differently. Possible values are:
    - `"ok"`: Green theme.
    - `"error"`: Red theme.
    - `"warn"`: Yellow theme.
    - `"info"`: Blue theme.
- `message`: A string containing the message to display in the alert.
- `duration`: The number of seconds alert's time-out lasts.

<style>
.demo .alert{
    position: initial;
    width: initial;
}
.demo .alert p{
    margin: 0;
}
</style>