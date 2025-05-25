import './ModalTransition.css'
import { h, mergeProps, withDirectives, vShow, Transition } from 'vue'

/**
 * @import { FunctionalComponent } from 'vue'
 */

/**
 * @typedef { FunctionalComponent<{ show: boolean }, { afterLeave(): void }> } ModalTransitionFC
 * @typedef { Parameters<ModalTransitionFC> } ModalTransitionParams
 * 
 * @param { ModalTransitionParams[0] } props
 * @param { ModalTransitionParams[1] } ctx
 * @returns { ReturnType<ModalTransitionFC> }
 */
export default function ModalTransition(props, { emit, slots, attrs }) {
	return withDirectives(
		h(
			Transition, {
				name: 'modal-backdrop',
				appear: true,
				duration: 500
			},
			() => h(
				'div',
				mergeProps(attrs, { class: 'modal-backdrop' }),
				withDirectives(
					h(
						Transition, {
							name: 'modal-window',
							appear: true,
							mode: 'out-in',
							onAfterLeave: () => emit('afterLeave')
						},
						() => slots.default?.()
					),
					[[vShow, props.show]]
				)
			)
		),
		[[vShow, props.show]]
	)
}
ModalTransition.inheritAttrs = false