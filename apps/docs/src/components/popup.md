---
outline: [2,3]
---

# Popup <Badge type="tip"><pre>.popup</pre></Badge>

> A Popup is a modal window with isolated interaction from the main application. It can be shown programmatically and hidden through user interaction.

## Demo

<script setup>
import { Popup, Btn, Btn3D } from '@8ctavio/vergil/components'
import PopupDemo from '@components/popups/PopupDemo.vue'
import PopupSwap1 from '@components/popups/PopupSwap1.vue'
import { showPopup } from '@8ctavio/vergil'
</script>

<Demo>
    <Btn variant="solid" label="Show Popup" @click="showPopup(PopupDemo)"/>
</Demo>

## Usage

### Popup Backdrop &#8203;

In order to display popups as modal windows, the `PopupBackdrop` component must be mounted somewhere in the app's template. It's recommended to place it as a direct child of the application's container.

```vue
<script setup>
import { PopupBackdrop } from '@8ctavio/vergil/components'
</script>

<template>
    <AppLayout/>
    <PopupBackdrop/>
</template>
```
:::tip
`PopupBackdrop` `z-index` value is by default set to `40` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

### Popup components

A *popup component* is any SFC with a `Popup` component as its root component.

```vue
<!-- @/components/popups/PopupComponent.vue -->
<script setup>
import { Popup } from '@8ctavio/vergil/components'
</script>

<template>
    <Popup title="Custom Popup">
        <!-- Popup content... -->
    </Popup/>    
</template>
```

:::tip
Create popup components inside a `components/popups` directory.
:::

### Show Popup

A popup component can be displayed programmatically with the `showPopup` function. It receives the popup component instance imported from a SFC.

```js
import PopupComponent from '@/components/popups/PopupComponent.vue'
import { showPopup } from '@8ctavio/vergil'

showPopup(PopupComponent)
```

#### Change Popup

The `showPopup` function can be called inside a popup component. This results in the open popup component being replaced with the one specified in `showPopup`.

In the following demo, two popup components have a button to change between components.

<Demo>
    <Btn variant="solid" label="Show Popup" @click="showPopup(PopupSwap1)"/>
</Demo>

### Popup props and events

The `showPopup` function receives two parameters. First one is the popup component instance, i.e., the popup to show. The second is an object with prop values and event handlers for `props` and `events` defined in the popup component.

Thus, `defineProps` and `defineEmits` should be normally used in a popup component for two-way communication between the component and the API (`showPopup`).

```vue
<!-- @/components/popups/PopupComponent.vue -->
<script setup>
defineProps({
    // Define data required by the popup
})
defineEmits([/* Define events to be handled by the API */])
</script>
```

The keys of the object sent through `showPopup` should be
- for props: the prop key as defined in the `defineProps` directive.
- for events: the Pascal-case version of the event name as defined in the `defineEmits` directive, prefixed with `on`.

For example, if the following props and events are defined in the popup component

```js
defineProps(['foo', 'bar'])
defineEmits(['baz'])
```

the following `props` object can be sent with `showPopup`

```js
showPopup(PopupComponent, {
    foo: '',
    bar: 0,
    onBaz(){}
})
```

### Close Popup

A popup component may be closed by the user through the `Popup` close button in the top-right corner or programmatically by emitting a `close` or `error` event from the popup component.

```vue
<!-- @/components/popups/PopupComponent.vue -->
<script setup>
const emit = defineEmits(['close', 'error'])
// ...later
emit('close')   // or emit('error')
</script>
```

Despite these events being used internally to close the popup, event handlers can still be attached to each.

```js
showPopup(PopupComponent, {
    onClose(){}
    onError(){}
})
```

Closing the popup through the close button will call the `onClose` handler.

### Popup content

The recommended practice to define `Popup` content, is to add a `main.popup-content` element inside the `Popup`'s default slot. `Popup`'s content layout and styles can be defined by styling the `.popup-content` element.

```vue
<template>
    <Popup title="Some title">
        <main class="popup-content">
            <!-- content... -->
        </main>
    </Popup>
</template>

<style scoped>
.popup-content{
    /* define content layout, padding, background color, etc. */
}
</style>
```

## Props

### Title <Badge type="tip"><pre>title: string = ''</pre></Badge>

```vue-html
<Popup title="Custom title">
    <main class="popup-content">
        Content    
    </main>
</Popup>
```

<Demo>
    <Popup title="Custom title">
        <main class="popup-content">
            Content    
        </main>
    </Popup>
</Demo>

### Disabled <Badge type="tip"><pre>disabled: boolean = false</pre></Badge>

The `disable` prop disables the `Popup`'s close button.

```vue-html
<Popup title="Some title" disabled>
    <main class="popup-content">
        Content
    </main>
</Popup>
```

<Demo>
    <Popup title="Some title" disabled>
        <main class="popup-content">
            Content
        </main>
    </Popup>
</Demo>

## Styling

To properly display the popup component, (commonly) its width property needs to be styled. It's recommended to use the `clamp` function for the width, with `min` and `max` values expressed in pixels (`px`) and `val` expressed as a percentage (`%`).

An example of recommended styles is shown below. `clamp` values should be adjusted depending on the popup's content.

```vue
<template>
    <Popup>
        <main class="popup-content"></main>
    </Popup>
</template>

<style scoped>
.popup{
    width: clamp(250px, 25%, 400px);
}
.popup-content{
    width: 100%;
    padding: 25px;
}
</style>
```

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `title` | `string` | `''` |
| `disabled` | `boolean` | `false` |

### Function

```js
function showPopup(component: ComponentInstance, props: object): void
```

#### Parameters

- `component`: The default import of a popup component's SFC.
- `props`: Props object appended to `component` via the `v-bind` directive.

## Popup template

```vue
<script setup>
import { Popup } from '@8ctavio/vergil/components'

defineProps({

})
const emit = defineEmits(['close', 'error'])

</script>

<template>
    <Popup title="">
        <main class="popup-content">
            
        </main>
    </Popup>
</template>

<style scoped>
.popup{
    width: clamp(250px, 30%, 800px);
}
.popup-content{
    width: 100%;
    padding: 25px;
    display: flex, grid;
}
</style>
```

<style scoped>
.popup{
    width: clamp(250px, 25%, 700px);
}
.popup-content{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25px;
    font-weight: 600;
}
</style>