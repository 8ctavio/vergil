---
outline: [2,3]
---

# Confirm

> The Confirm component raises a request as a message inside a modal window for the user, prompts the user to make a choice, and waits for the user's response.

## Demo

<script setup>
import { Confirm } from 'vergil/components'
import { confirm, toast } from 'vergil'

const requests = {
    danger: {
        header: 'Danger!',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue molestie sem ut sagittis.',
        confirmLabel: 'Confirm',
        declineLabel: 'Decline'
    },
    caution: {
        header: 'Caution!',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue molestie sem ut sagittis.',
        confirmLabel: 'Confirm',
        declineLabel: 'Decline'
    },
    ack: {
        header: 'Acknowledge',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue molestie sem ut sagittis.',
        confirmLabel: 'Confirm',
        declineLabel: 'Decline'
    },
    check: {
        header: 'Check',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue molestie sem ut sagittis.',
        confirmLabel: 'Confirm',
        declineLabel: 'Decline'
    }
}

const testConfirm = async (type) => {
    const confirmed = await confirm(type, requests[type])
    if(confirmed === true) toast('ok', 'Confirmed')
    else if(confirmed === false) toast('error', 'Declined')
    else toast('warn', "Crime doesn't pay")
}
</script>

<Demo>
    <div class="row">
        <button class="vp-btn" @click="testConfirm('danger')">Danger</button>
        <button class="vp-btn" @click="testConfirm('caution')">Caution</button>
        <button class="vp-btn" @click="testConfirm('ack')">Acknowledge</button>
        <button class="vp-btn" @click="testConfirm('check')">Check</button>
    </div>
</Demo>

## Description

`Confirm` is a modal window where a request is displayed in the form of a message, which itself consists of header and content. The header might represent, for example, the request's subject or the request itself, concisely written. The content, in the other hand, m be a more detailed request's description, the implications of request's responses, etc.

The presented request must be either confirmed or declined by the user. For this purpose, the component comes with a pair of buttons: a *confirm* button and a *decline* button. The buttons' labels can be modified to make it clearer for the user what each button does. Once either button is pressed, `Confirm` is hidden, and the developer may proceed according to the user's response.

Requests have different levels of concern. To help trasmit a request's level of concern to the user, there are four `Confirm` types which properly theme it for different types of requests:

- `danger`: for critical requests with major implications,
- `caution`: for requests with moderate implications,
- `ack`: for requests with minor implications, and
- `check`: for requests with no adverse implications.

## Usage

First, it is required to add the `Confirm` component somewhere in the app's template. It's recommended to place it as a direct child of the application's container.

```vue
<script setup>
    import { Confirm } from 'vergil/components'
</script>

<template>
    <AppLayout/>
    <Confirm/>
</template>
```
:::tip
`Confirm`'s backdrop `z-index` value is by default set to `9` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

```js
import { confirm } from 'vergil'

const confirmed = await confirm('check', {
    header: 'Hello, traveler. Mombasa welcomes you!',
    content: 'Anxious? Stressed? Please remain calm. Need a health kit?',
    confirmLabel: 'Affirmative',
    declineLabel: 'No. I need a weapon.'
})

if(confirmed === true){
    // User confirmed request.
}
else if(confirmed === false){
    // User declined request.
}
else{
    // User tried to open a Confirm component before responding a previous request.
}
```

:::warning
`confirm`'s promise resolves to `null` if the user — somehow — opens a `Confirm` component before responding a previous request. In this case, the modal window will display the unresponded request.

Thus, if important operations are performed when the user declines a request, strict equality should be verified for the `false` return value.
:::

### Function

```js
async function confirm(type: string, request: {header: string, content: string, confirmLabel: string = 'Aceptar', declineLabel: string = 'Cancelar'}): Promise<bool | null>
```

#### Description

Shows a modal window at the center of the viewport which
- is themed according to `type`,
- displays `header` and `content` to the user,
- displays two buttons with `confirmLabel` and `declineLabel` as their labels.

The promise only resolves when either button is pressed by the user, which also hides the modal window.

#### Parameters

- `type`: A string containing the `Confirm` type. Each type themes `Confirm` differently. Possible values are:
    - `"danger"`: Red theme.
    - `"caution"`: Yellow theme.
    - `"ack"`: Blue theme.
    - `"check"`: Green theme.
- `header`: A string containing the request's header.
- `content`: A string containng the request's content.
- `confirmLabel`: A string containing confirm button's label.
- `declineLabel`: A string containing decline button's label.

#### Return Value

A `Promise`. Resolves to: 
- `true` if the confirm button is pressed,
- `false` if the decline button is pressed, and
- `null` if a previous `confirm`'s promise has not been resolved.