import { h, mergeProps } from "vue"
import { modal, modalMeta, closeModal } from "./index.js"
import ModalTransition from "#components/.internal/ModalTransition"

const handleClose = () => closeModal()
const eventHandlers = {
	onClose: handleClose,
	onError: handleClose
}

export default function ModalBackdrop() {
	return h(ModalTransition, {
		id: 'modal-backdrop',
		onAfterLeave: () => modalMeta.isLeaving = false,
		show: modal.value.component !== null
	}, () => modal.value.component && h(
		modal.value.component,
		modal.value.props
			? mergeProps(modal.value.props, eventHandlers) 
			: eventHandlers
		)
	)
}