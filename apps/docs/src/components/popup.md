---
outline: [2,3]
---

# Popup

> A Popup is a modal window with isolated interaction from the main application. It can be shown programmatically and hidden through user interaction.

## Demo

<script setup>
import { Btn, Btn3D } from '@8ctavio/vergil/components'
import PopupDemo from '@components/popups/PopupDemo.vue'
import PopupSwap1 from '@components/popups/PopupSwap1.vue'
import { showPopup } from '@8ctavio/vergil'
</script>

<Demo>
    <Btn label="Show Popup" @click="showPopup(PopupDemo)"/>
</Demo>

## Usage

### Popup backdrop &#8203;

In order to display popups as modal windows, the `popup` boolean prop must be passed to the [`Vergil`](/components/Vergil) component.

```vue
<script setup>
import { Vergil } from '@8ctavio/vergil/components'
</script>

<template>
    <Vergil popup>
        <AppLayout/>
    </Vergil>
</template>
```

:::tip
The popups' backdrop `z-index` value is by default set to `10` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
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

A popup component can be displayed programmatically with the `showPopup` function. It receives an imported popup component object.

```js
import PopupComponent from '@/components/popups/PopupComponent.vue'
import { showPopup } from '@8ctavio/vergil'

showPopup(PopupComponent)
```

:::warning
The `Popup` component traps application focus; therefore, popup components should only be mounted using the `showPopup` function.
:::

#### Change Popup

The `showPopup` function can be called inside a popup component. This results in the open popup component being replaced with the one specified in `showPopup`.

In the following demo, two popup components have a button to change between components.

<Demo>
    <Btn label="Show Popup" @click="showPopup(PopupSwap1)"/>
</Demo>

### Popup props and events

The `showPopup` function receives two parameters. First one is the popup component object, i.e., the popup to show. The second is an object with prop values and event handlers for `props` and `events` defined in the popup component.

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
emit('close') // or emit('error')
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

### Autofocus

By default, the popup component's first tabbable element is focused when mounted, but this behavior can be modified by passing an `autofocus` prop to the `Popup` component.

The `autofocus` prop may be a `boolean`, an `HTMLElement` object, or a [`ComponentPublicInstance`](https://vuejs.org/api/component-instance), and its default value is `true`.

- If `autofocus === false`: No popup component child is focused (to keep focus trapped, the popup component's root element itself is focused).
- If `autofocus instanceof HTMLElement`: The element's first tabbable element (including itself) is focused.
- If `autofocus` is a `ComponentPublicInstance`: The instance `$el` element's first tabbable element (including itself) is focused.

```vue
<script setup>
const autofocus = useTemplateRef('autofocus')
</script>

<template>
    <Popup title="Custom autofocus" :autofocus>
        <main class="popup-content">
            <InputText placeholder="First tabbable element"/>
            <InputText :ref="autofocus" placeholder="Force autofocus"/>
        </main>
    </Popup>
</template>
```

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
.popup-content {
    /* define content layout, padding, background color, etc. */
}
</style>
```

## API Reference

### `showPopup`

```js
function showPopup(component: Component, props: object): void
```

#### Parameters

- `component`: A component object.
- `props`: Props object appended to `component` via the `v-bind` directive.

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `title` | `string` | |
| `disabled` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |

### Configuration options

`Popup`'s [configuration options](/configuration) allow to overwrite some `Popup` props' default values and may be overwritten under the `popup` root-level configuration option.

| `popup.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ---------------- | ---- | ------- | :------: |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |

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
.popup {
    width: clamp(250px, 30%, 800px);
}
.popup-content {
    width: 100%;
    padding: 25px;
    display: flex, grid;
}
</style>
```