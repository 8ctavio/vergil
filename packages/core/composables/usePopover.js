import {
	toRef, toValue, computed, shallowRef, shallowReadonly, watchEffect,
	h, cloneVNode, isVNode, mergeProps, withDirectives, vShow,
	Comment, Fragment, Transition, Teleport,
	onBeforeUnmount
} from 'vue'
import { useFloating, autoUpdate, offset as useOffset, flip as useFlip, shift as useShift, arrow as useArrow } from '@floating-ui/vue'
import { vergil } from '../vergil'
import { waitFor } from '../reactivity'
import {
	isTabKey, isEscapeKey,
	focusElement, getFirstTabbable, hasTabbableBefore, hasTabbableAfter,
	inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme
} from '../utilities'

/**
 * @import { ShallowRef, MaybeRefOrGetter, ComponentPublicInstance, VNode, FunctionalComponent, PropType } from 'vue'
 * @import { Placement, Side, MiddlewareState } from '@floating-ui/vue'
 * @import { Theme, Size, Radius, Spacing } from '../types'
 */

/**
 * @typedef { object } Arrow
 * @property { number } [border]
 * @property { boolean } show
 * @property { ShallowRef<HTMLElement | null> } element
 * @property { number } height
 * 
 * @param { Arrow } arrow
 */
const usePositionArrow = arrow => ({
	name: 'positionArrow',
	/** @param { MiddlewareState } state */
	fn({ placement, rects, middlewareData }) {
		if (arrow.element.value) {
			const { x, y } = middlewareData.arrow ?? {}
			const [side, alignment] = /** @type { [Side, string | undefined] } */ (placement.split('-'))

			const unsetSides = {
				top: '',
				bottom: '',
				left: '',
				right: ''
			}
			const arrowDirection = {
				top: 'bottom',
				bottom: 'top',
				left: 'right',
				right: 'left',
			}[side]
			const arrowRotation = {
				top: '0deg',
				bottom: '180deg',
				left: '-90deg',
				right: '90deg'
			}[arrowDirection]

			const dim = ['top', 'bottom'].includes(side) ? 'width' : 'height'
			if (alignment && rects.reference[dim] > rects.floating[dim]) {
				const crossSide = {
					'top-start': 'left',
					'top-end': 'right',
					'bottom-start': 'left',
					'bottom-end': 'right',
					'left-start': 'top',
					'left-end': 'bottom',
					'right-start': 'top',
					'right-end': 'bottom',
				}[/** @type { Exclude<Placement, Side> } */(placement)]

				Object.assign(arrow.element.value.style, {
					...unsetSides,
					transform: `rotate(${arrowRotation})`,
					[arrowDirection]: `-${arrow.height}px`,
					[crossSide]: 'min(15%,15px)',
				})
			} else {
				Object.assign(arrow.element.value.style, {
					...unsetSides,
					transform: `rotate(${arrowRotation})`,
					left: (typeof x === 'number') ? `${x}px` : '',
					top: (typeof y === 'number') ? `${y}px` : '',
					[arrowDirection]: `-${arrow.height}px`,
				})
			}
		}
		return {}
	}
})

/**
 * @typedef { object } PopoverProps
 * @property { Theme } [theme]
 * @property { Size } [size]
 * @property { Radius } [radius]
 * @property { Spacing } [spacing]
 */

/**
 * Creates state and (functional) component to manage a Popover.
 * 
 * @param { object } [options = {}]
 * @param { boolean | { border: number } } [options.arrow] - Whether to show an arrow in the floating element pointing toward the reference element. As an object, the `border` option defines the arrow's border width in `px`.
 * @param { MaybeRefOrGetter<'unmount' | 'hide'> } [options.closeBehavior = 'unmount'] - Popover closing method: unmount (`v-if`) or hide (`v-show`). Defaults to `'unmount'`.
 * @param { MaybeRefOrGetter<number> } [options.delay = 400] - Popover opening delay in milliseconds. If `trigger === 'hover'`, defaults to `400`.
 * @param { number } [options.offset] - Distance in `px` of gap between reference and floating elements. See [offset](https://floating-ui.com/docs/offset#options).
 * @param { number } [options.padding] - [Shift axis](https://floating-ui.com/docs/shift#mainaxis) virtual padding in `px` left when the floating element shifts. Defaults to `6`.
 * @param { MaybeRefOrGetter<Placement> } [options.placement = 'bottom'] - Floating element's placement relative to reference element. Defaults to `'bottom'`. See [placement](https://floating-ui.com/docs/computePosition#placement).
 * @param { MaybeRefOrGetter<'absolute' | 'fixed'> } [options.position = 'absolute'] - Floating element's CSS `position` property. Defaults to `'absolute'`. See [strategy](https://floating-ui.com/docs/computeposition#strategy).
 * @param { MaybeRefOrGetter<boolean> } [options.resize] - Whether to update floating element's position when itself or the reference element are resized. See [`elementResize`](https://floating-ui.com/docs/autoupdate#elementresize).
 * @param { MaybeRefOrGetter<'click' | 'hover'> } [options.trigger] - If specified, event handlers are automatically attached to the reference and floating elements to toggle the popover on click or hover.
 * 
 * @returns { {
 * 		Popover: FunctionalComponent<PopoverProps>,
 * 		openPopover(waitUntilOpened?: boolean): Promise<boolean>;
 * 		closePopover(): void;
 * 		togglePopover(): void;
 * 		isOpen: Readonly<ShallowRef<boolean>>;
 * } }
 * - `Popover`: Functional component with `default` and `portal` slots to manage and render the Popover's *reference* and *floating* elements, respectively.
 * - `openPopover`: Opens `Popover`. Returns a Promise that resolves to `false` if the opening operation gets aborted by calling `closePopover`, and to `true` otherwise.
 * Returns (or resolves to) `false` if already opened and `true` otherwise.
 * - `closePopover`: Closes `Popover`.
 * - `togglePopover`: Toggle `Popover`'s open state.
 * - `isOpen`: Boolean ref indicating whether the `Popover` is open.
 * 
 * @example
 *  ```vue
 * 	<script setup>
 * 	const { Popover, togglePopover } = usePopover({ offset: 5 })
 * 	</script>
 * 
 * 	<template>
 * 		<Popover class="popover-demo">
 * 			<Btn v-on:click="togglePopover" label="Toggle Popover"/>
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
		closeBehavior = 'unmount',
		offset,
		padding = vergil.config.popover.padding,
		placement,
		position,
		resize,
	} = options
	const trigger = toRef(options.trigger)
	const delay = toRef(() => toValue(options.delay) ?? (trigger.value === 'hover' && vergil.config.popover.delay))
	/** @type { Arrow } */
	const arrow = {
		.../** @type { object } */(options.arrow),
		show: Boolean(options.arrow),
		element: shallowRef(null),
		height: 7,
	}
	
	/** @type { ShallowRef<null | (HTMLElement & ComponentPublicInstance)> } */
	const referenceRef = shallowRef(null)
	const reference = computed(() => referenceRef.value?.$el ?? referenceRef.value)
	/** @type { ShallowRef<null | HTMLElement> } */
	const floating = shallowRef(null)

	const open = shallowRef(false)
	const isOpen = shallowRef(false)

	const middleware = []
	if (offset || arrow.show) {
		middleware.push(useOffset((offset ?? 0) + (arrow.show ? arrow.height : 0)))
	}
	middleware.push(useFlip(), useShift({ padding }))
	if (arrow.show) {
		middleware.push(
			useArrow({ element: arrow.element }),
			usePositionArrow(arrow)
		)
	}

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
		if (isPositioned.value) isOpen.value = true
	})

	/** @type { AbortController | void } */
	let controller // oxlint-disable-line no-unused-vars
	/** @type { (() => void) | void } */
	let abortOpenPopover // oxlint-disable-line no-unused-vars
	/** @type { (() => void) | void } */
	let stopAutoUpdate // oxlint-disable-line no-unused-vars
	function openPopover(waitUntilOpened = false) {
		return open.value ? Promise.resolve(true) : new Promise((resolve, reject) => {
			function task() {
				open.value = true
				updatePosition()
				stopAutoUpdate = autoUpdate(reference.value, /** @type { HTMLElement } */ (floating.value), updatePosition, {
					elementResize: toValue(resize)
				})
				document.addEventListener('focusin', handleDocumentFocusIn)
				if (trigger.value !== 'hover') {
					document.addEventListener('click', handleDocumentClick)
				}
				if (waitUntilOpened) {
					waitFor(isOpen, {
						flush: 'sync',
						signal: (controller = new AbortController()).signal
					}).toBe(true).then(resolve, error => {
						if (
							error instanceof DOMException
							&& error.name === 'AbortError'
							&& error.message === 'VergilError'
						) resolve(false)
						else reject(error)
					})
				} else resolve(true)
			}
			if (typeof delay.value === 'number' && delay.value > 0) {
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
		stopAutoUpdate = stopAutoUpdate?.()
		document.removeEventListener('click', handleDocumentClick)
		document.removeEventListener('focusin', handleDocumentFocusIn)
		open.value = false
		if (focusWithin.value) {
			reference.value.focus({ preventScroll: true })
		}
	}
	function togglePopover() {
		if (open.value) {
			closePopover()
		} else {
			openPopover()
		}
	}

	const clickWithin = shallowRef(false)
	const focusWithin = shallowRef(false)
	function handleDocumentClick() {
		if (!clickWithin.value) closePopover()
		clickWithin.value = false
	}
	function handleDocumentFocusIn() {
		if (!focusWithin.value) closePopover()
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
	/** @type { number } */
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
		if (open.value) closePopover()
	})

	/**
	 * @typedef { FunctionalComponent<PopoverProps> } PopoverFC
	 * @typedef { Parameters<PopoverFC> } PopoverParams
	 * 
	 * @param { PopoverParams[0] } props
	 * @param { PopoverParams[1] } ctx
	 * @returns { ReturnType<PopoverFC> }
	 */
	function Popover({ theme, size, radius, spacing }, { slots, attrs }) {
		/**
		 * @See [getTransitionRawChildren](https://github.com/vuejs/core/blob/76c43c6040518c93b41f60a28b224f967c007fdf/packages/runtime-core/src/components/BaseTransition.ts#L529)
		 * @See [findNonCommentChild](https://github.com/vuejs/core/blob/76c43c6040518c93b41f60a28b224f967c007fdf/packages/runtime-core/src/components/BaseTransition.ts#L264)
		 */
		/** @type { VNode | VNode[] | undefined } */
		let referenceRoot = slots.default?.()
		outer: while (Array.isArray(referenceRoot)) {
			for (const vnode of referenceRoot) {
				if (vnode.type !== Comment) {
					referenceRoot = vnode.type === Fragment
						? /** @type { VNode[] } */(vnode.children)
						: vnode
					continue outer
				}
			}
			break
		}

		const popoverContent = slots.portal?.()
		if (popoverContent && arrow.show) {
			const shapes = [
				h('polygon', {
					points: `0,${arrow.height} ${arrow.height},0 ${2 * arrow.height},${arrow.height}`
				})
			]
			if (arrow.border && arrow.border > 0) {
				const coeff = 0.5 * Math.sqrt(2)
				shapes.push(
					h('polyline', {
						'stroke-width': `${arrow.border}px`,
						points:
							`${coeff * arrow.border},${arrow.height}`
							+ ` ${arrow.height},${coeff * arrow.border}`
							+ ` ${2 * arrow.height - coeff * arrow.border},${arrow.height}`
					})
				)
			}
			popoverContent.push(
				h('svg', {
					ref: arrow.element,
					class: 'popover-arrow',
					style: {
						width: `${2 * arrow.height}px`,
						height: `${2 * arrow.height}px`,
					},
					viewBox: `0 0 ${2 * arrow.height} ${2 * arrow.height}`
				}, shapes)
			)
		}

		const referenceVNode = isVNode(referenceRoot)
			? cloneVNode(referenceRoot, mergeProps(
				{
					ref: referenceRef,
					/** @param { KeyboardEvent } event */
					onKeydown(event) {
						if (isEscapeKey(event)) {
							closePopover()
						} else if (isTabKey(event, false)) {
							if (
								isOpen.value
								&& floating.value?.firstElementChild
								&& !hasTabbableAfter(
									/** @type { HTMLElement } */ (event.currentTarget),
									/** @type { HTMLElement } */ (event.target)
								)
							) {
								const first = getFirstTabbable(/** @type { HTMLElement } */(floating.value.firstElementChild), true)
								if (first) {
									event.preventDefault()
									focusElement(first)
								}
							}
						}
					}
				},
				dismissHandlers.focus,
				trigger.value !== 'hover' ? dismissHandlers.click : {},
				trigger.value ? triggerHandlers[trigger.value] : {},
			))
			: null
		const popover = h('div', mergeProps(attrs, {
			class: [`popover ${inferTheme(theme)} size-${size} radius-${radius}`, {
				[`spacing-${spacing}`]: spacing,
			}],
			/** @param { KeyboardEvent } event */
			onKeydown(event) {
				if (isEscapeKey(event)) {
					event.stopPropagation()
					closePopover()
					const first = getFirstTabbable(reference.value, true)
					if (first) focusElement(first)
				} else if (isTabKey(event)) {
					if (!(event.shiftKey ? hasTabbableBefore : hasTabbableAfter)(
						/** @type { HTMLElement } */ (event.currentTarget),
						/** @type { HTMLElement } */ (event.target)
					)) {
						const span = document.createElement('span')
						span.setAttribute('tabindex', '-1')
						span.style.position = 'fixed'
						span.style.pointerEvents = 'none'
						reference.value.after(span)
						span.addEventListener('focusin', dismissHandlers.focus.onFocusin)
						span.addEventListener('focusout', () => {
							dismissHandlers.focus.onFocusout()
							span.remove()
						})
						span.focus({ preventScroll: true })
					}
				}
			}
		}), popoverContent)
		const popoverClone = withDirectives(cloneVNode(popover), [[vShow, open.value]])

		return [
			referenceVNode,
			h(Teleport, {
				to: '#popover-portal',
				defer: true
			}, h('div', mergeProps(
				{
					ref: floating,
					class: 'popover-wrapper',
					style: floatingStyles.value
				},
				dismissHandlers.focus,
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
			type: /** @type { PropType<Theme> } */ (String),
			default: () => vergil.config.global.theme,
			validator: isValidTheme
		},
		size: {
			type: /** @type { PropType<Size> } */ (String),
			default: () => vergil.config.global.size,
			validator: isValidSize
		},
		radius: {
			type: /** @type { PropType<Radius> } */ (String),
			default: () => vergil.config.global.radius,
			validator: isValidRadius
		},
		spacing: {
			type: /** @type { PropType<Spacing> } */ (String),
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