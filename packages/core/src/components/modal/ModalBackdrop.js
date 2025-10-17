import { h, mergeProps } from "vue"
import { ModalTransition } from "#components"
import { modal, modalMeta, closeModal } from "./index.js"

const handleClose = () => closeModal()
export default function ModalBackdrop() {
	return h(ModalTransition, {
		id: 'modal-backdrop',
		onAfterLeave: () => modalMeta.isLeaving = false,
		show: modal.value.component !== null
	}, () => modal.value.component && h(modal.value.component, modal.value.props && mergeProps(modal.value.props, {
		onClose: handleClose,
		onError: handleClose,
	})))
}