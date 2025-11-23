---
outline: [2,3]
---

# Modal

> A `Modal` is a modal window with isolated interaction from the main application. It can be shown programmatically and hidden through user interaction.

## Demo

<script setup>
import { showModal } from 'vergil'
import { Btn, Btn3D } from 'vergil/components'
import ModalDemo from '@components/modals/ModalDemo.vue'
import ModalSwap1 from '@components/modals/ModalSwap1.vue'
</script>

<Demo>
    <Btn label="Show Modal" @click="showModal(ModalDemo)"/>
</Demo>

## Usage

### Modal backdrop &#8203;

In order to display modals, the `modal` boolean prop must be passed to the [`Vergil`](/components/vergil) component.

```vue
<script setup>
import { Vergil } from '@8ctavio/vergil/components'
</script>

<template>
    <Vergil modal>
        <AppLayout/>
    </Vergil>
</template>
```

:::tip
The modals' backdrop `z-index` value is by default set to `10` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

### Modal components

A *modal component* is any component with `Modal` as its root component.

```vue
<!-- @/components/modals/ModalComponent.vue -->
<script setup>
import { Modal } from '@8ctavio/vergil/components'
</script>

<template>
    <Modal title="Custom Modal">
        <!-- Modal content... -->
    </Modal/>    
</template>
```

:::tip
Create modal components inside a `components/modals` directory.
:::

### Show Modal

A modal can be displayed programmatically with the `showModal` function. It receives the modal component to display.

```js
import ModalComponent from '@/components/modals/ModalComponent.vue'
import { showModal } from '@8ctavio/vergil'

showModal(ModalComponent)
```

:::warning
The `Modal` component traps application focus; therefore, modal components should only be mounted using the `showModal` function.
:::

#### Change Modal

The `showModal` function can be called inside a modal to replace it for another modal.

<Demo>
    <Btn label="Show Modal" @click="showModal(ModalSwap1)"/>
</Demo>

### Modal props and events

The `showModal` function receives two parameters. First one is the modal component object, i.e., the modal to show. The second is an object with prop values and event handlers for `props` and `events` defined in the modal component.

Thus, `defineProps` and `defineEmits` should be normally used in a modal component for two-way communication between the component and the API (`showModal`).

```vue
<!-- @/components/modals/ModalComponent.vue -->
<script setup>
defineProps({
    // Define data required by the modal
})
defineEmits([/* Define events to be handled by the API */])
</script>
```

The keys of the object sent through `showModal` should be
- for props: the prop key as defined in the `defineProps` directive.
- for events: the Pascal-case version of the event name as defined in the `defineEmits` directive, prefixed with `on`.

For example, if the following props and events are defined in the modal component

```js
defineProps(['foo', 'bar'])
defineEmits(['baz'])
```

the following `props` object can be sent with `showModal`

```js
showModal(ModalComponent, {
    foo: '',
    bar: 0,
    onBaz() {}
})
```

### Close Modal

A modal may be closed by the user through the `Modal` close button in the top-right corner or programmatically by emitting a `close` or `error` event from the modal component.

```vue
<!-- @/components/modals/ModalComponent.vue -->
<script setup>
const emit = defineEmits(['close', 'error'])
// ...later
emit('close') // or emit('error')
</script>
```

Despite these events being used internally to close the modal, event handlers can still be attached to each.

```js
showModal(ModalComponent, {
    onClose(){}
    onError(){}
})
```

Closing the modal through the close button will call the `onClose` handler.

### Autofocus

By default, the modal's first tabbable element is focused when mounted, but this behavior can be modified by passing an `autofocus` prop to `Modal`.

The `autofocus` prop may be a `boolean`, an `HTMLElement` object, or a [`ComponentPublicInstance`](https://vuejs.org/api/component-instance), and its default value is `true`.

- If `autofocus === false`: No modal child is focused (to keep focus trapped, the modal's root element itself is focused).
- If `autofocus instanceof HTMLElement`: The element's first tabbable element (including itself) is focused.
- If `autofocus` is a `ComponentPublicInstance`: The instance `$el` element's first tabbable element (including itself) is focused.

```vue
<script setup>
const autofocus = useTemplateRef('autofocus')
</script>

<template>
    <Modal title="Custom autofocus" :autofocus>
        <main class="modal-content">
            <InputText placeholder="First tabbable element"/>
            <InputText :ref="autofocus" placeholder="Force autofocus"/>
        </main>
    </Modal>
</template>
```

### Modal content

The recommended practice to define modal content, is to add a `main.modal-content` element inside the `Modal`'s default slot. `Modal`'s content layout and styles can be defined by styling the `.modal-content` element.

```vue
<template>
    <Modal title="Some title">
        <main class="modal-content">
            <!-- content... -->
        </main>
    </Modal>
</template>

<style scoped>
.modal-content {
    /* define content layout, padding, background color, etc. */
}
</style>
```

## API Reference

### `showModal`

```js
function showModal(component: Component, props: object): void
```

#### Parameters

- `component`: A component object.
- `props`: Props passed to `component`.

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `title` | `string` | |
| `disabled` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |

### Configuration options

`Modal`'s [configuration options](/configuration) allow to overwrite some `Modal` props' default values and may be overwritten under the `modal` root-level configuration option.

| `modal.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ---------------- | ---- | ------- | :------: |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |

## Styling

To properly display a modal, (commonly) its width property needs to be styled. It is recommended to use the `clamp` function for the width, with `min` and `max` values expressed in pixels (`px`) and `val` expressed as a percentage (`%`).

An example of recommended styles is shown below. `clamp` values should be adjusted depending on the modal's content.

```vue
<template>
    <Modal>
        <main class="modal-content"></main>
    </Modal>
</template>

<style scoped>
.modal {
    width: clamp(250px, 25%, 400px);
}
.modal-content {
	box-sizing: border-box;
    width: 100%;
    padding: 25px;
}
</style>
```

## Modal template

```vue
<script setup>
import { Modal } from '@8ctavio/vergil/components'

defineProps({
    
})
const emit = defineEmits(['close', 'error'])

</script>

<template>
    <Modal title="">
        <main class="modal-content">
            
        </main>
    </Modal>
</template>

<style scoped>
.modal {
    width: clamp(250px, 30%, 800px);
}
.modal-content {
	box-sizing: border-box;
    width: 100%;
    padding: 25px;
}
</style>
```