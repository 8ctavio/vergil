import { h, defineAsyncComponent } from 'vue'

/**
 * @import { VNode, SetupContext } from 'vue'
 */

const ModalBackdrop = defineAsyncComponent(() => import('./modal/ModalBackdrop.js'))
const Confirm = defineAsyncComponent(() => import('./confirm/Confirm.vue'))
const Toasters = defineAsyncComponent(() => import('./toast/Toasters.vue'))

/**
 * @param { object } props
 * @param { boolean } [props.confirm]
 * @param { boolean } [props.modal]
 * @param { boolean } [props.toaster]
 * @param { SetupContext } ctx
 */
export default function Vergil(props, { slots }) {
	if (slots.default) {
		/** @type { VNode[] } */
		const vnodes = [...slots.default()]
		if (props.modal) vnodes.push(h(ModalBackdrop))
		vnodes.push(h(function PopoverPortal() {
			return h('div', { id: 'popover-portal' })
		}))
		if (props.confirm) vnodes.push(h(Confirm))
		if (props.toaster) vnodes.push(h(Toasters))
		return vnodes
	}
}
Vergil.props = {
	modal: Boolean,
	confirm: Boolean,
	toaster: Boolean,
}