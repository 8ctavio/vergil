import {
	toValue, shallowRef, computed, readonly,
	h, withDirectives, onBeforeUnmount,
	Transition, vShow
} from 'vue'
import { useFloating, autoUpdate, offset as useOffset, flip as useFlip } from '@floating-ui/vue'

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

	let stopAutoUpdate
	function openPopover() {
		if(!open.value) {
			open.value = true
			isOpen.value = true
			updatePosition()
			stopAutoUpdate = autoUpdate(reference.value, floating.value, updatePosition, {
				elementResize: toValue(resize)
			})
			document.addEventListener('click', handleDocumentClick)
			document.addEventListener('focusin', handleDocumentFocusIn)
			return true
		}
		return false
	}
	function closePopover() {
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
		isOpen: readonly(isOpen),
		isPositioned,
		openPopover,
		closePopover,
		togglePopover,
	}
}