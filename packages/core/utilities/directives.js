/** @param { MouseEvent } event */
function preventClickSelection(event) {
	if (event.detail > 1) event.preventDefault()
}

export const vPreventClickSelection = {
	/** @param { HTMLElement } el */
	mounted(el) {
		el.addEventListener('mousedown', preventClickSelection)
	},
	/** @param { HTMLElement } el */
	unmounted(el) {
		el.removeEventListener('mousedown', preventClickSelection)
	}
}