---
outline: [2,3]
---

# Alert

> Alerts display messages at the top of the viewport drawing user's attention to communicate important information.

## Demo

<script setup>
import { Btn, Icon } from '@8ctavio/vergil/components'
import { ref } from 'vue'
import { alert } from '@8ctavio/vergil'

const previewAlertType = ref('ok')
const alertIcons = {
    ok: 'check_circle',
    info: 'info',
    warn: 'warning',
    danger: 'cancel'
}
</script>

<Demo>
    <div class="row center">
        <Btn variant="solid" label="Ok" @click="alert('ok', 'Success! Green Alert.')"/>
        <Btn variant="solid" label="Info" @click="alert('error', 'Error! Red Alert.')"/>
        <Btn variant="solid" label="Warning" @click="alert('warn', 'Warning! Yellow Alert.')"/>
        <Btn variant="solid" label="Error" @click="alert('info', 'Info. Blue Alert.')"/>
    </div>
</Demo>

### Preview

<br>

<Demo>
    <div class="col">
        <div class="row center">
            <Btn variant="solid" label="Ok" @click="previewAlertType = 'ok'"/>
            <Btn variant="solid" label="Info" @click="previewAlertType = 'info'"/>
            <Btn variant="solid" label="Warning" @click="previewAlertType = 'warn'"/>
            <Btn variant="solid" label="Error" @click="previewAlertType = 'danger'"/>
        </div>
        <div :class="['alert', previewAlertType]">
            <span class="material-symbols-rounded">{{ alertIcons[previewAlertType] }}</span>
            <p>Lorem ipsum</p>
            <button>
                <Icon code="close"/>
            </button>
        </div>
        <div :class="['alert', previewAlertType]">
            <span class="material-symbols-rounded">{{ alertIcons[previewAlertType] }}</span>
            <p>Lorem ipsum dolor sit amet, consectetur elit.</p>
            <button>
                <Icon code="close"/>
            </button>
        </div>
        <div :class="['alert', previewAlertType]">
            <span class="material-symbols-rounded">{{ alertIcons[previewAlertType] }}</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis dignissim ante vel iaculis.</p>
            <button>
                <Icon code="close"/>
            </button>
        </div>
        <div :class="['alert', previewAlertType]">
            <span class="material-symbols-rounded">{{ alertIcons[previewAlertType] }}</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat non lorem at egestas. Integer et rutrum felis. Integer suscipit sapien nec neque finibus, sit amet mollis velit commodo.</p>
            <button>
                <Icon code="close"/>
            </button>
        </div>
    </div>
</Demo>

## Description

When an alert shows up, it is added to the **alert feed**, by the means of which multiple alerts can be shown simultaneously.

After a developer-defined time-out, an alert is removed from the feed automatically, which hides it. However, each alert also contains an `x` button that allows the user to immediately remove the alert from the feed.

Alerts can be themed according to the message's severity.

:::tip
Alerts are meant to communicate messages that are important/critical for the user to see.
:::

## Usage

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

```js
import { alert } from '@8ctavio/vergil'

alert('ok', 'Keep it clean!')
```

### Function

```js
function alert(theme: string, message: string, duration: number = 6): void
```

#### Description

Renders an alert at the top of the viewport, which
- is themed according to `theme`, 
- displays `message` to the user, and
- after a time-out of `duration` seconds elapses, it is hidden automatically.

If invoked while one or more alerts are being shown, those alerts are scrolled down to free up space for the new alert to show up.

#### Parameters

- `theme`: A string containing the alert theme. Possible `theme` values along with available aliases are summarized in the following table.

| Value      | Aliases |
| ---------- | ------- |
| `'ok'`     | `'success', 'check'` |
| `'info'`   | `'help', 'tip'` |
| `'warn'`   | `'warning', 'caution'` |
| `'danger'` | `'error'` |

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