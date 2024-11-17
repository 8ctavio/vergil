import {
	toRef, toValue, shallowRef, shallowReadonly, computed, watchEffect,
	h, cloneVNode ,mergeProps, withDirectives, vShow,
	Comment, Fragment, Transition, Teleport,
	onBeforeUnmount
} from 'vue'
import { useFloating, autoUpdate, offset as useOffset, flip as useFlip, shift as useShift } from '@floating-ui/vue'
import { vergil } from '../vergil'
import { waitFor } from './waitFor'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../utilities/private'

/**
 * Creates state and (functional) component to manage a Popover.
 * 
 * @param { {
 *      placement: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
 *      offset: number;
 *      padding: number;
 * 		delay: number;
 *      resize: boolean;
 *      closeBehavior: 'unmount' | 'hide';
 *      trigger: 'click' | 'hover';
 *      position: 'absolute' | 'fixed';
 * } } options -
 *  - [`placement`](https://floating-ui.com/docs/computePosition#placement): Floating element's placement relative to reference element. Defaults to `'bottom'`.
 *  - [`offset`](https://floating-ui.com/docs/offset#options): Distance in `px` of gap between reference and floating elements.
 *  - `padding`: [Shift axis](https://floating-ui.com/docs/shift#mainaxis) virtual padding in `px` left when the floating element shifts. Defaults to `6`.
 * 	- `delay`: Popover opening delay in milliseconds. If `trigger === 'hover'`, defaults to `400`.
 *  - [`resize`](https://floating-ui.com/docs/autoupdate#elementresize): Whether to update floating element's position when itself or the reference element are resized.
 * 	- `closeBehavior`: Popover closing method: unmount (`v-if`) or hide (`v-show`). Defaults to `'unmount'`.
 *  - `trigger`: If specified, event handlers are automatically attached to the reference and floating elements to toggle the popover on click or hover.
 *  - [`position`](https://floating-ui.com/docs/computeposition#strategy): Floating element's CSS `position` property. Defaults to `'absolute'`.
 * 
 * @returns { {
 * 		Popover: function;
 * 		openPopover: (waitUntilOpened: boolean) => Promise<boolean>;
 * 		closePopover: () => void;
 * 		togglePopover: () => void;
 * 		isOpen: Ref<boolean>;
 * } }
 * - `Popover`: Functional component with `default` and `portal` slots to manage and render the Popover's *reference* and *floating* elements, respectively.
 * - `openPopover`: Opens `Popover`. Returns a Promise that resolves to `false` if the opening operation gets aborted by calling `closePopover`, and to `true` otherwise.
 * Returns (or resolves to) `false` if already opened and `true` otherwise.
 * - `closePopover`: Closes `Popover`.
 * - `togglePopover`: Toggle `Popover`'s open state.
 * - `isOpen`: Whether the `Popover` is open.
 * 
 * @example
 *  ```vue
 * 	<script setup>
 * 	const { Popover, togglePopover } = usePopover({ offset: 5 })
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
		padding = vergil.config.popover.padding,
		resize,
		closeBehavior = 'unmount',
		position
	} = options
	const trigger = toRef(options.trigger)
	const delay = toRef(() => toValue(options.delay) ?? (trigger.value === 'hover' && vergil.config.popover.delay))

	const middleware = []
	if(offset) middleware.push(useOffset(offset))
	middleware.push(useFlip(), useShift({ padding }))

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
		strategy: position,
	})

	watchEffect(() => {
		if(isPositioned.value) isOpen.value = true
	})

	let controller, abortOpenPopover, stopAutoUpdate
	function openPopover(waitUntilOpened = false) {
		return open.value ? Promise.resolve(true) : new Promise((resolve, reject) => {
			function task() {
				open.value = true
				updatePosition()
				stopAutoUpdate = autoUpdate(reference.value, floating.value, updatePosition, {
					elementResize: toValue(resize)
				})
				document.addEventListener('focusin', handleDocumentFocusIn)
				if(trigger.value !== 'hover') {
					document.addEventListener('click', handleDocumentClick)
				}
				if(waitUntilOpened) {
					waitFor(isOpen, {
						flush: 'sync',
						signal: (controller = new AbortController()).signal
					}).toBe(true).then(resolve, error => {
						if(
							error instanceof DOMException
							&& error.name === 'AbortError'
							&& error.message === 'VergilError'
						) resolve(false)
						else reject(error)
					})
				} else resolve(true)
			}
			if(delay.value > 0) {
				const timeout = setTimeout(() => {
					abortOpenPopover = undefined
					task()
				}, delay.value)
				abortOpenPopover = () => {
					clearTimeout(timeout)
					resolve(false)
				}
			} else task()
		})
	}
	function closePopover() {
		controller = controller?.abort(new DOMException('VergilError', 'AbortError'))
		abortOpenPopover = abortOpenPopover?.()
		stopAutoUpdate = void stopAutoUpdate?.()
		document.removeEventListener('click', handleDocumentClick)
		document.removeEventListener('focusin', handleDocumentFocusIn)
		open.value = false
		if(focusWithin.value) {
			reference.value.focus({ preventScroll: true })
		}
	}
	function togglePopover() {
		if(open.value) {
			closePopover()
		} else {
			openPopover()
		}
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

	const dismissHandlers = {
		click: {
			onClick() {
				clickWithin.value = true
			}
		},
		focus: {
			onFocusin() {
				focusWithin.value = true
			},
			onFocusout() {
				focusWithin.value = false
			}
		}
	}
	let closeTimeout
	const triggerHandlers = {
		click: {
			onClick: togglePopover
		},
		hover: {
			onPointerenter() {
				clearTimeout(closeTimeout)
				openPopover()
			},
			onPointerleave() {
				closeTimeout = setTimeout(closePopover, 100)
			}
		}
	}

	onBeforeUnmount(() => {
		if(open.value) closePopover()
	})

	function Popover({ theme, size, radius, spacing }, { slots, attrs }) {
		/**
		 * @See [getTransitionRawChildren](https://github.com/vuejs/core/blob/76c43c6040518c93b41f60a28b224f967c007fdf/packages/runtime-core/src/components/BaseTransition.ts#L529)
		 * @See [findNonCommentChild](https://github.com/vuejs/core/blob/76c43c6040518c93b41f60a28b224f967c007fdf/packages/runtime-core/src/components/BaseTransition.ts#L264)
		 */
		let reference
		let vnodes = slots.default?.()
		outer: while(vnodes?.length && !reference) {
			for(const vnode of vnodes) {
				if(vnode.type !== Comment) {
					if(vnode.type === Fragment) {
						vnodes = vnode.children
					} else {
						reference = cloneVNode(vnode, mergeProps(
							{
								ref: referenceRef,
								...dismissHandlers.focus
							},
							trigger.value !== 'hover' && dismissHandlers.click,
							triggerHandlers[trigger.value]
						))
					}
					continue outer
				}
			}
			break
		}

		const popover = h('div', mergeProps(attrs, {
			class: [`popover ${inferTheme(theme)} size-${size} radius-${radius}`, {
				[`spacing-${spacing}`]: spacing,
			}]
		}), slots.portal())
		const popoverClone = withDirectives(cloneVNode(popover), [[vShow,open.value]])

		return [
			reference,
			h(Teleport, {
				to: '#popover-portal',
				defer: true
			}, h('div', mergeProps(
				{
					ref: floating,
					class: 'popover-wrapper',
					style: floatingStyles.value,
					...dismissHandlers.focus
				},
				trigger.value === 'hover' ? triggerHandlers.hover : dismissHandlers.click,
			), h(Transition, {
				name: 'popover',
				onAfterLeave() {
					isOpen.value = false
				}
			}, toValue(closeBehavior) === 'unmount'
				? () => open.value ? popover : null
				: () => popoverClone
			)))
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