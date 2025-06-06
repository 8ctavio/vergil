import ModalTransition from "../internal/ModalTransition"
import { h, mergeProps } from "vue"
import { popup, popupMeta, closePopup } from "."

export default function PopupBackdrop() {
	return h(ModalTransition, {
		id: 'popup-backdrop',
		onAfterLeave: () => popupMeta.isLeaving = false,
		show: popup.value.component !== null
	}, () => popup.value.component && h(popup.value.component, mergeProps(popup.value.props, {
		onClose: closePopup,
		onError: closePopup
	})))
}