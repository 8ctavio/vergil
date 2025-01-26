export function isEscapeKey(event) {
	return event?.key === 'Escape'
		&& !(event.shift || event.altKey || event.ctrlKey || event.metaKey)
}

export function isTabKey(event, shift) {
	return event?.key === 'Tab'
		&& !(event.altKey || event.ctrlKey || event.metaKey)
		&& (typeof shift === 'undefined' || Boolean(shift) === event.shiftKey)
}