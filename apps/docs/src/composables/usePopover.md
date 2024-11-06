---
outline: [2,3]
---

# `usePopover`

> Creates (functional) components and state to manage a `Popover`.

## Usage

<script setup>
import { Btn, Placeholder } from '@8ctavio/vergil/components'
import { usePopover } from '@8ctavio/vergil'

const { Popover, togglePopover } = usePopover({
	offset: 4,
	flip: true
})
</script>

```vue
<script setup>
import { Btn, Placeholder } from '@8ctavio/vergil/components'
import { usePopover } from '@8ctavio/vergil'

const { Popover, togglePopover } = usePopover({
	offset: 4,
	flip: true
})
</script>

<template>
	<div class="container">
		<Popover.Reference :is="Btn" @click="togglePopover">
			Toggle Popover
		</Popover.Reference>	
		<Popover.Floating :is="Placeholder"/>
	</div>
</template>

<style scoped>
.container {
	position: relative;
	& > .popover-floating > :deep(.placeholder) {
		height: 50px;
	}
}
</style>
```

<Demo>
	<div class="container">
		<Popover.Reference :is="Btn" @click="togglePopover">
			Toggle Popover
		</Popover.Reference>	
		<Popover.Floating :is="Placeholder"/>
	</div>
</Demo>

<style scoped>
.container {
	position: relative;
	& > .popover-floating > :deep(.placeholder) {
		height: 50px;
	}
}
</style>

## Description

The `usePopover` composable creates two functional components — `Popup.Reference` and `Popup.Floating` — to manage and render the *reference* and *floating* elements. The floating element is the element that *pops over*, positioned in relation to the reference element.

Both of these components accept a single `is` prop to indicate the component to be rendered. All props and slots are directly passed to that component, so the rendered components can normally be used.

The `Popup.Floating` component wraps the specified component in a `div` element with the class `popover-floating`.

<Demo>
	<Anatomy tag="div" classes="popover-floating">
		<Anatomy tag="floating-component"/>
	</Anatomy>
</Demo>

:::tip
The floating element's parent should have `position: realtive` (or similar) for the floating element styles to take effect. 
:::

:::tip
`Popup.Floating` only supports a single element or component as its slot content. If the content is a component, the component must also have only one single root element.
:::


The `usePopover` composable provides three functions to control the popover's state: `openPopover`, `closePopover`, and `togglePopover`. Their names best describe their functionality; however, `openPopover` provides additional functionality. Both `closePopover` and `togglePopover` don't accept arguments and return `undefined`. On the other hand, `openPopover` returns `false` if the popover was already opened and `true` otherwise.

Additionally, the `openPopover` function accepts a `waitUntilOpened` boolean argument that, when set to `true`, makes `openPopover` return a `Promise` resolved until the floating element has been properly positioned.

Lastly, the `usePopover` composable returns an `isOpen` ref with a boolean value to detect when the popover has been opened and is safe to interact with it or its contents. The popover is considered to be open when the floating element has been properly positioned, and closed (i.e., `isOpen.value === false`) when the leaving transition of the floating element completes and the element has been removed from the DOM.

:::warning
If `openPopover` is called with `waitUntilOpened = true` and then `closePopover` is called before `openPopover`'s promise is resolved, the promise will be rejected with an `AbortError` [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException).
:::

## Definition

```ts
function usePopover<T>(optione?: {
	placement: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
	offset: number;
	flip: boolean;
	resize: boolean;
}): {
	Popover: {
		Reference: function;
		Floating: function;
	},
	openPopover: (waitUntilOpened: boolean) => boolean | Promise<boolean>;
	closePopover: () => void;
	togglePopover: () => void;
	isOpen: Ref<boolean>;
}
```

#### Parameters

- **[`placement`](https://floating-ui.com/docs/computePosition#placement)**: Floating element's placement relative to reference element. Defaults to `bottom`.
- **[`offset`](https://floating-ui.com/docs/offset#options)**: Distance between reference and floating elements.
- **[`flip`](https://floating-ui.com/docs/flip)**: Whether to change floating element's placement to keep it in view.
- **[`resize`](https://floating-ui.com/docs/autoupdate#elementresize)**: Whether to update floating element's position when itself or the reference element are resized.

#### Return value

- **`Popover.Reference`**: Functional component for the reference element. Accepts an `is` prop to pass the element or component to render.
- `Popover.Floating`: Functional component for the floating element. Accepts an `is` prop to pass the element or component to render.
- **`openPopover`**: Opens `Popover`. Returns (or resolves to) `false` if already opened and `true` otherwise.
- **`closePopover`**: Closes `Popover`.
- **`togglePopover`**: Toggle `Popover`'s open state.
- **`isOpen`**: Whether the `Popover` is open.