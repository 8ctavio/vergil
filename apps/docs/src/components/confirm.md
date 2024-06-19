---
outline: [2,3]
---

# Confirm

> The Confirm component raises a request as a message inside a modal window for the user, prompts the user to make a choice, and waits for the user's response.

## Demo

<script setup>
import { Btn } from '@8ctavio/vergil/components'
import { confirm, toast } from '@8ctavio/vergil'

const titles = {
    brand: 'Query',
    user: 'Query',
    ok: 'Check',
    info: 'Acknowledge',
    warn: 'Caution!',
    danger: 'Danger!',
    neutral: 'Query'
}

const testConfirm = async theme => {
    const confirmed = await confirm(theme, {
        title: titles[theme],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue molestie sem ut sagittis.'
    })
    if(confirmed === true) toast('ok', 'Confirmed')
    else if(confirmed === false) toast('error', 'Declined')
    else toast('warn', "Crime doesn't pay")
}

function example1(){
    confirm('brand', {
        title: 'Mayday, mayday',
        description: `
            This is //UNSC [[FFG-201]] Forward Unto Dawn.//
            Requesting immediate evac. Survivors aboard.

            Prioritization code: **Victor [[05-3-Sierra0117]]**
        `,
        confirmLabel: 'Respond',
        declineLabel: 'Dismiss',
        icon: 'sensors'
    })
}
</script>

<Demo>
    <Btn variant="solid" @click="testConfirm('brand')" label="Brand"/>
    <Btn variant="solid" @click="testConfirm('user')" label="User"/>
    <Btn variant="solid" @click="testConfirm('ok')" label="Ok"/>
    <Btn variant="solid" @click="testConfirm('info')" label="Info"/>
    <Btn variant="solid" @click="testConfirm('warn')" label="Warn"/>
    <Btn variant="solid" @click="testConfirm('danger')" label="Danger"/>
    <Btn variant="solid" @click="testConfirm('neutral')" label="Neutral"/>
</Demo>

## Description

`Confirm` is a modal window where a request is displayed in the form of a message, which itself consists of title and description. The title might represent, for example, the request's subject or the request itself, concisely written. The description, in the other hand, may be a more detailed request's description, the implications of request's responses, etc.

A request must be either confirmed or declined by the user. For this purpose, the modal displays a pair of buttons: a *confirm* button and a *decline* button. The buttons' labels can be modified to make it clearer for the user what each button does. Once either button is pressed, `Confirm` is hidden, and the developer may proceed according to the user's response.

## Usage

First, it is required to add the `Confirm` component somewhere in the app's template. It's recommended to place it as a direct child of the application's container.

```vue
<script setup>
import { Confirm } from '@8ctavio/vergil/components'
</script>

<template>
    <AppLayout/>
    <Confirm/>
</template>
```
:::tip
`Confirm`'s backdrop `z-index` value is by default set to `50` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

Then, a confirm request can be raised programmatically with the `confirm` function

```js
import { confirm } from '@8ctavio/vergil'

const confirmed = await confirm('check', {
    title: 'Hello, traveler. Mombasa welcomes you!',
    description: 'Anxious? Stressed? Please remain calm. Need a health kit?',
    confirmLabel: 'I need a weapon',
    declineLabel: 'Tell that to the covenant'
})

if(confirmed === true){
    // User confirmed request
}
else if(confirmed === false){
    // User declined request
}
else{
    // User tried to open a Confirm component before responding a previous request
}
```

## API

```js
async function confirm(theme: string, request: {
    title: string,
    description: string | (string | string[])[],
    confirmLabel: string = 'Accept',
    declineLabel: string = 'Cancel',
    icon: string
}): Promise<bool | null>
```

#### Parameters

- `theme`: Theme to style `Confirm` with. Different themes help transmit a request's level of concern to the user. Possible `theme` values are those of the [`theme`](/theme.md#the-theme-prop) prop.
- `title`: The request's title.
- `description`: The request's description. Vergil is able to parse `description` for a minimal set of Markdown-like tags, as well as line breaks inside template strings (see examples below). Available tags syntax is shown in the next table.
    | Syntax      | Effect |
    | ----------- | ------ |
    | `**<str>**` | `str` is displayed with bold font |
    | `//<str>//` | `str` is displayed in italics |
    | `[[<str>]]` | `str` is displayed inside an inline block |
- `confirmLabel`: Confirm button's label.
- `declineLabel`: Decline button's label.
- `icon`: Icon code.

#### Return value

A `Promise` that resolves to: 
- `true` if the confirm button is pressed,
- `false` if the decline button is pressed, and
- `null` if a previous `confirm`'s promise has not been resolved.

:::warning
`confirm`'s promise resolves to `null` if the user — somehow — opens a `Confirm` component before responding a previous request. In this case, the modal window will display the unresponded request.

Thus, if important operations are performed when the user declines a request, strict equality should be verified for the `false` return value.
:::

## Examples

```js
await confirm('brand', {
    title: 'Mayday, mayday',
    description: `
        This is //UNSC [[FFG-201]] Forward Unto Dawn.//
        Requesting immediate evac. Survivors aboard.

        Prioritization code: **Victor [[05-3-Sierra0117]]**
    `,
    confirmLabel: 'Respond',
    declineLabel: 'Dismiss',
    icon: 'sensors'
})
```

<Demo>
    <Btn variant="solid" label="Mayday" @click="example1"/>
</Demo>