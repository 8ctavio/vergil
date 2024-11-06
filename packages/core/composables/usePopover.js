import {
	toValue, shallowRef, shallowReadonly, computed, watchEffect,
	h, withDirectives, onBeforeUnmount,
	Transition, vShow
} from 'vue'
import { useFloating, autoUpdate, offset as useOffset, flip as useFlip } from '@floating-ui/vue'
import { waitFor } from './waitFor'

/**
 * Creates (functional) components and state to manage a `Popover`.
 * 
 * @param { {
 *      placement: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
 *      offset: number;
 *      flip: boolean;
 *      resize: boolean;
 * } } options -
 *  - [`placement`](https://floating-ui.com/docs/computePosition#placement): Floating element's placement relative to reference element. Defaults to `bottom`.
 *  - [`offset`](https://floating-ui.com/docs/offset#options): Distance between reference and floating elements.
 *  - [`flip`](https://floating-ui.com/docs/flip): Whether to change floating element's placement to keep it in view.
 *  - [`resize`](https://floating-ui.com/docs/autoupdate#elementresize): Whether to update floating element's position when itself or the reference element are resized.
 * 
 * @returns { {
 * 		Popover: {
 * 			Reference: function;
 * 			Floating: function;
 * 		};
 * 		openPopover: (waitUntilOpened: boolean) => boolean | Promise<boolean>;
 * 		closePopover: () => void;
* 		togglePopover: () => void;
* 		isOpen: Ref<boolean>;
 * } }
 * - `Popover.Reference`: Functional component for the reference element. Accepts an `is` prop to pass the element or component to render.
 * - `Popover.Floating`: Functional component for the floating element. Accepts an `is` prop to pass the element or component to render.
 * - `openPopover`: Opens `Popover`. Returns (or resolves to) `false` if already opened and `true` otherwise.
 * - `closePopover`: Closes `Popover`.
 * - `togglePopover`: Toggle `Popover`'s open state.
 * - `isOpen`: Whether the `Popover` is open.
 * 
 * @example
 *  ```vue
 * 	<script setup>
 * 	const { Popover, togglePopover } = usePopover({
 * 		offset: 4,
 * 		flip: true
 *	})
 * 	</script>
 * 
 * 	<template>
 * 		<div class="popover-container">
 * 			<Popover.Reference :is="Btn" v-on:click="togglePopover">
 * 				Toggle Popover
 * 			</Popover.Reference>
 * 			<Popover.Floating :is="Placeholder"/>
 * 		</div>
 * 	</template>
 * 
 * 	<style scoped>
 * 	.popover-container {
 * 		position: relative;
 * 		& > .popover-floating > :deep(.placeholder) {
 * 			height: 50px;
 * 		}
 * 	}
 * 	</style>
 *  ```
 */
export function usePopover(options) {
	const {
		placement,
		offset,
		flip,
		resize,
	} = options

	const middleware = []
	if(offset) middleware.push(useOffset(offset))
	if(flip) middleware.push(useFlip())

	const referenceRef = shallowRef(null)
	const reference = computed(() => referenceRef.value?.$el ?? referenceRef.value)
	const floating = shallowRef(null)
	const open = shallowRef(false)
	const isOpen = shallowRef(false)

	const {
		isPositioned,
		floatingStyles,
		update: updatePosition,
	} = useFloating(reference, floating, {
		open,
		placement,
		middleware,
	})

	watchEffect(() => {
		if(isPositioned.value) isOpen.value = true
	})

	let controller, stopAutoUpdate
	function openPopover(waitUntilOpened = false) {
		if(!open.value) {
			open.value = true
			updatePosition()
			stopAutoUpdate = autoUpdate(reference.value, floating.value, updatePosition, {
				elementResize: toValue(resize)
			})
			document.addEventListener('click', handleDocumentClick)
			document.addEventListener('focusin', handleDocumentFocusIn)
			return waitUntilOpened
				? waitFor(isOpen, {
					flush: 'sync',
					signal: (controller = new AbortController()).signal
				}).toBe(true)
				: true
		}
		return waitUntilOpened ? Promise.resolve(false) : false
	}
	function closePopover() {
		controller = controller?.abort(new DOMException('[Vergil] Open Popover operation aborted', 'AbortError'))
		stopAutoUpdate = void stopAutoUpdate?.()
		document.removeEventListener('click', handleDocumentClick)
		document.removeEventListener('focusin', handleDocumentFocusIn)
		open.value = false
		if(focusWithin.value) {
			reference.value.focus({ preventScroll: true })
		}
	}
	function togglePopover() {
		if(!openPopover()) closePopover()
	}

	const clickWithin = shallowRef(false)
	const focusWithin = shallowRef(false)
	function handleDocumentClick() {
		if(!clickWithin.value) closePopover()
		clickWithin.value = false
	}
	function handleDocumentFocusIn() {
		if(!focusWithin.value) closePopover()
	}
	const eventHandlers = {
		onClick() {
			clickWithin.value = true
		},
		onFocusin() {
			focusWithin.value = true
		},
		onFocusout() {
			focusWithin.value = false
		}
	}

	onBeforeUnmount(() => {
		if(open.value) closePopover()
	})

	function Reference(props, { slots }) {
		return h(props.is, {
			ref: referenceRef,
			...eventHandlers
		}, slots)
	}
	Reference.props = ['is']
	
	function Floating(props, { slots, attrs }) {
		return h('div', {
			ref: floating,
			class: 'popover-floating',
			style: floatingStyles.value,
			...eventHandlers
		}, h(Transition, {
			name: 'popover',
			onAfterLeave() {
				isOpen.value = false
			}
		}, () => withDirectives(
			h(props.is, attrs, slots),
			[[vShow, open.value]]
		)))
	}
	Floating.props = ['is']
	Floating.inheritAttrs = false

	return {
		Popover: {
			Reference,
			Floating,
		},
		openPopover,
		closePopover,
		togglePopover,
		isOpen: shallowReadonly(isOpen),
	}
}