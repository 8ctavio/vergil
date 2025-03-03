import ModalTransition from "../private/ModalTransition.vue"
import { h, mergeProps } from "vue"
import { popup, popupMeta, closePopup } from "."

function onExpose(exposed) {
	if(!exposed.isLeaving) {
		popupMeta.isLeaving = false
	}
}

export default function PopupBackdrop() {
	return h(ModalTransition, {
		id: 'popup-backdrop',
		ref: onExpose,
		show: popup.value.component !== null
	}, () => popup.value.component && h(popup.value.component, mergeProps(popup.value.props, {
		onClose: closePopup,
		onError: closePopup
	})))
}