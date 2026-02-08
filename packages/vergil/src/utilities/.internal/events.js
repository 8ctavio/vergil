/**
 * @param { KeyboardEvent } event 
 * @returns { event is KeyboardEvent & { key: 'Escape', shiftKey: false, altKey: false, ctrlKey: false, metaKey: false } }
 */
export function isEscapeKey(event) {
	return event?.key === 'Escape'
		&& !(event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)
}

/**
 * @template { boolean } T
 * @param { KeyboardEvent } event 
 * @param { T } [shift]
 * @returns { event is KeyboardEvent & (
 *     boolean extends T
 *         ? { key: 'Tab', altKey: false, ctrlKey: false, metaKey: false }
 *         : { key: 'Tab', shiftKey: T, altKey: false, ctrlKey: false, metaKey: false }
 * ) }
 */
export function isTabKey(event, shift) {
	return event?.key === 'Tab'
		&& !(event.altKey || event.ctrlKey || event.metaKey)
		&& (typeof shift === 'undefined' || Boolean(shift) === event.shiftKey)
}