---
outline: [2,3]
---

# `usePopover`

> Creates state and (functional) component to manage a `Popover`.

## Usage

<script setup>
import { Btn, Placeholder } from '@8ctavio/vergil/components'
import { usePopover } from '@8ctavio/vergil'

const { Popover, togglePopover } = usePopover({
	offset: 4,
	flip: true
})
</script>

First, it is required to add the `PopoverPortal` component somewhere in the app's template. It's recommended to place it as a direct child of the application's container.

```vue
<script setup>
import { PopoverPortal } from '@8ctavio/vergil/components'
</script>

<template>
    <AppLayout/>
    <PopoverPortal/>
</template>
```
:::tip
`PopoverPortal`'s container `z-index` value is by default set to `20` through a css variable. See [Styles](/get-started.md#styles) on the Get Started guide to learn how to overwrite Vergil's css variables.
:::

Then, the `usePopover` returned `Popover` component's `portal` slot content is teleported to a `div#popover-portal` element rendered by the `PopoverPortal` component.

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
	<Popover class="popover-demo">
		<Btn @click="togglePopover" label="Toggle Popover"/>
		<template #portal>
			<Placeholder/>
		</template>
	</Popover>
</template>

<style>
#popover-portal > .popover-wrapper > .popover-demo {
	width: 200px;
	height: 80px;
	padding: 10px;
	border: 1px solid var(--c-grey-border-subtle);
	border-radius: var(--g-radius);
	background-color: var(--c-bg);
	& > .placeholder {
		width: 100%;
		height: 100%;
	}
}
</style>
```

<Demo>
	<Popover class="popover-demo">
		<Btn @click="togglePopover" label="Toggle Popover"/>
		<template #portal>
			<Placeholder/>
		</template>
	</Popover>
</Demo>

<style>
#popover-portal > .popover-wrapper > .popover-demo {
	width: 200px;
	height: 80px;
	padding: 10px;
	border: 1px solid var(--c-grey-border-subtle);
	border-radius: var(--g-radius);
	background-color: var(--c-bg);
	& > .placeholder {
		width: 100%;
		height: 100%;
	}
}
</style>

## Description

The `usePopover` composable creates a `Popover` functional component to manage and render the Popover's *reference* and *floating* elements. The floating element is the element that *pops over*, positioned in relation to the reference element. The reference element is taken from the `default` slot's root element while the `portal` slot content is wrapped by the floating element.

:::tip
The `Popover` component only supports a single element or component as its `default` slot content. If the content is a component, the component must also have only one single root element.
:::

The `portal` slot content is teleported to a `div#popover-portal` element and wrapped inside two `div` elements with `popover-wrapper` and `popover` classes, respectively.

<Demo>
	<Anatomy tag="div" id="popover-portal">
		<Anatomy tag="div" classes="popover-wrapper">
			<Anatomy tag="div" classes="popover"/>
		</Anatomy>
	</Anatomy>
</Demo>

The `Popover` component attributes are applied to the `div.popover` element. The `div.popover` element can be styled as the Popover's content main container.

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
	shift: boolean;
	resize: boolean;
	strategy: 'absolute' | 'fixed'
}): {
	Popover: function,
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
- [`shift`](https://floating-ui.com/docs/shift): Prevent the floating element from overflowing along its axis of alignment.
- **[`resize`](https://floating-ui.com/docs/autoupdate#elementresize)**: Whether to update floating element's position when itself or the reference element are resized.
- [`strategy`](https://floating-ui.com/docs/computeposition#strategy): The CSS `position` property to use on the floating element.

:::tip
If a floating element's parent has position `fixed`, use `strategy: 'fixed'`.
:::

#### Return value

- **`Popover`**: Functional component with `default` and `portal` slots to manage and render the Popover's *reference* and *floating* elements, respectively.
- **`openPopover`**: Opens `Popover`. Returns (or resolves to) `false` if already opened and `true` otherwise.
- **`closePopover`**: Closes `Popover`.
- **`togglePopover`**: Toggle `Popover`'s open state.
- **`isOpen`**: Whether the `Popover` is open.