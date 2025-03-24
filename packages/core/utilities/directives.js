function preventClickSelection(event) {
    if(event.detail > 1) event.preventDefault()
}

export const vPreventClickSelection = {
	mounted(el) {
		el.addEventListener('mousedown', preventClickSelection)
	},
	unmounted(el) {
		el.removeEventListener('mousedown', preventClickSelection)
	}
}