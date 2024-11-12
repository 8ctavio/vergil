import {
	toValue, shallowRef, shallowReadonly, computed, watchEffect,
	h, cloneVNode, Comment, withDirectives, mergeProps, onBeforeUnmount,
	vShow, Transition, Teleport
} from 'vue'
import { useFloating, autoUpdate, offset as useOffset, flip as useFlip, shift as useShift } from '@floating-ui/vue'
import { vergil } from '../vergil'
import { waitFor } from './waitFor'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../utilities/private'

/**
 * Creates state and (functional) component to manage a `Popover`.
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
 *  - [`shift`](https://floating-ui.com/docs/shift): Prevent the floating element from overflowing along its axis of alignment.
 *  - [`resize`](https://floating-ui.com/docs/autoupdate#elementresize): Whether to update floating element's position when itself or the reference element are resized.
 *  - [`strategy`](https://floating-ui.com/docs/computeposition#strategy): The CSS `position` property to use on the floating element.
 * 
 * @returns { {
 * 		Popover: function;
 * 		openPopover: (waitUntilOpened: boolean) => boolean | Promise<boolean>;
 * 		closePopover: () => void;
* 		togglePopover: () => void;
* 		isOpen: Ref<boolean>;
 * } }
 * - `Popover`: Functional component with `default` and `portal` slots to manage and render the Popover's *reference* and *floating* elements, respectively.
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
 * 		<Popover class="popover-demo">
 * 			<Btn @click="togglePopover" label="Toggle Popover"/>
 * 			<template #portal>
 * 				<Placeholder/>
 * 			</template>
 * 		</Popover>
 * 	</template>
 * 
 * 	<style scoped>
 * 	#popover-portal > .popover-wrapper > .popover-demo {
 * 		width: 200px;
 * 		height: 80px;
 * 		padding: 10px;
 * 		border: 1px solid var(--c-grey-border-subtle);
 * 		border-radius: var(--g-radius);
 * 		background-color: var(--c-bg);
 * 		& > .placeholder {
 * 			width: 100%;
 * 			height: 100%;
 * 		}
 * 	}
 * 	</style>
 *  ```
 */
export function usePopover(options = {}) {
	const {
		placement,
		offset,
		flip,
		shift,
		resize,
		strategy,
	} = options

	const middleware = []
	if(offset) middleware.push(useOffset(offset))
	if(flip) middleware.push(useFlip())
	if(shift) middleware.push(useShift({ padding: shift.padding ?? offset }))

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
		strategy,
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

	function Popover({ theme, size, radius, spacing }, { slots, attrs }) {
		let reference
		/** @See https://github.com/vuejs/core/blob/76c43c6040518c93b41f60a28b224f967c007fdf/packages/runtime-core/src/components/BaseTransition.ts#L264 */
		for(const vnode of (slots.default?.() ?? [])) {
			if(vnode.type !== Comment) {
				reference = cloneVNode(vnode, {
					ref: referenceRef,
					...eventHandlers
				})
				break
			}
		}
		return [
			reference,
			h(Teleport, {
				to: '#popover-portal',
				defer: true
			}, h('div', {
				ref: floating,
				class: 'popover-wrapper',
				style: floatingStyles.value,
				...eventHandlers
			}, h(Transition, {
				name: 'popover',
				onAfterLeave() {
					isOpen.value = false
				}
			}, () => withDirectives(
				h('div', mergeProps(attrs, {
					class: [`popover ${inferTheme(theme)} size-${size} radius-${radius}`, {
						[`spacing-${spacing}`]: spacing,
					}]
				}), slots.portal()),
				[[vShow, open.value]]
			))))
		]
	}
	Popover.inheritAttrs = false
	Popover.props = {
		theme: {
			type: String,
			default: () => vergil.config.global.theme,
			validator: isValidTheme
		},
		size: {
			type: String,
			default: () => vergil.config.global.size,
			validator: isValidSize
		},
		radius: {
			type: String,
			default: () => vergil.config.global.radius,
			validator: isValidRadius
		},
		spacing: {
			type: String,
			default: () => vergil.config.global.spacing,
			validator: isValidSpacing
		}
	}

	return {
		Popover,
		openPopover,
		closePopover,
		togglePopover,
		isOpen: shallowReadonly(isOpen),
	}
}