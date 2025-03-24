export function focusElement(element) {
    if(element instanceof HTMLElement) {
        element.focus({ preventScroll: true })
        element.select?.()
    }
}

export function isInput(element, type) {
    return element.tagName === 'INPUT' && (!type || element.type === type)
}