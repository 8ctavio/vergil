/**
 * @param { Element | null } element
 * @returns { void }
 */
export function focusElement(element) {
	if (element instanceof HTMLElement) {
		element.focus({ preventScroll: true })
		;(/** @type { HTMLInputElement } */ (element)).select?.()
	}
}

/**
 * @template { string } T
 * @param { Element } element
 * @param { T } [type]
 * @returns { element is string extends T
 *     ? HTMLInputElement
 *     : HTMLInputElement & { type: T }
 * } 
 */
export function isInput(element, type) {
	return element.tagName === 'INPUT' && (!type || (/** @type { HTMLInputElement } */ (element)).type === type)
}