import { isObject } from "#utilities/common"
import { isInput } from "#utilities/.internal/elements"

/** @param { HTMLElement } element */
function isInert(element) {
	do if (element.inert) return true
    // @ts-expect-error
	while((element = element.parentElement) !== null)
    return false
}

/**
 * @param { HTMLInputElement & { type: 'radio' } } element
 * @param { Record<string, boolean> } radioGroups
 * @returns { boolean }
 */
function isTabbableRadio(element, radioGroups) {
    if(!element.name || element.checked) {
        return true
    } else if(element.form) {
        const radioNodeList = /** @type { RadioNodeList } */ (element.form.elements.namedItem(element.name))
        return !radioNodeList.value
    } else if(Object.hasOwn(radioGroups, element.name)) {
        return /** @type { boolean } */ (radioGroups[element.name])
    } else {
        const walker = document.createTreeWalker(element.ownerDocument.body, NodeFilter.SHOW_ELEMENT, (el) => {
            return isInput(/** @type { Element } */ (el), 'radio') && el.name === element.name && el.checked
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP
        })
        return radioGroups[element.name] = walker.nextNode() === null
    }
}

/**
 * @param { HTMLElement } element
 * @param { boolean } [backgroundChecked = false]
 * @returns { boolean }
 */
function isTabbableCandidate(element, backgroundChecked = false) {
	return backgroundChecked
		? !element.inert && element.checkVisibility()
		: element.isConnected && element.checkVisibility() && !isInert(element)
}
/**
 * @param { HTMLElement } element
 * @param { Record<string, boolean> } [radioGroups]
 */
function approveTabbableCandidate(element, radioGroups) {
    return element.tabIndex >= 0
        && !(/** @type { HTMLInputElement } */ (element)).disabled
        && (!isObject(radioGroups) || !isInput(element, 'radio') || isTabbableRadio(element, radioGroups))
        && getComputedStyle(element).visibility === 'visible'
}
/**
 * @param { HTMLElement } element
 * @param { Record<string, boolean> } [radioGroups]
 * @returns { typeof NodeFilter.FILTER_ACCEPT | typeof NodeFilter.FILTER_SKIP | typeof NodeFilter.FILTER_REJECT }
 */
function filterTabbable(element, radioGroups) {
	return isTabbableCandidate(element, true)
		? approveTabbableCandidate(element, radioGroups)
			? NodeFilter.FILTER_ACCEPT
			: NodeFilter.FILTER_SKIP
		: NodeFilter.FILTER_REJECT
}

/** @param { Node } node */
export function isTabbable(node) {
    return node instanceof HTMLElement
		&& node.isConnected
        && node.tabIndex >= 0
        && node.checkVisibility({ visibilityProperty: true })
        && !(/** @type { HTMLInputElement } */ (node)).disabled
        && !isInert(node)
}

/** @param { HTMLElement } root */
function createTabbableWalker(root) {
	/** @type { Record<string, boolean> } */
    const radioGroups = {}
    return document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, el => {
        return filterTabbable(/** @type { HTMLElement } */ (el), radioGroups)
    })
}

/**
 * @param { HTMLElement } root
 * @param { boolean } [includeRoot = false] 
 */
export function getFirstTabbable(root, includeRoot = false) {
    if(!isTabbableCandidate(root))
        return null
    if(includeRoot && approveTabbableCandidate(root))
        return root

    const walker = createTabbableWalker(root)
    return /** @type { HTMLElement | null } */ (walker.nextNode())
}
/**
 * @param { HTMLElement } root
 * @param { boolean } [includeRoot = false]
 */
export function getLastTabbable(root, includeRoot = false) {
    if(!isTabbableCandidate(root))
        return null

    const walker = createTabbableWalker(root)
    while(walker.lastChild());

	return walker.currentNode !== root || (includeRoot && approveTabbableCandidate(root))
		? /** @type { HTMLElement | null } */ (walker.currentNode)
		: null
}

/**
 * @param { HTMLElement } root
 * @param { HTMLElement } target
 */
function createAdjacentTabbableWalker(root, target) {
	/** @type { Record<string, boolean> } */
    const radioGroups = {}
    return document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, el => {
        return el === target ? NodeFilter.FILTER_ACCEPT : filterTabbable(/** @type { HTMLElement } */ (el), radioGroups)
    })
}

/**
 * @param { HTMLElement } root
 * @param { HTMLElement } target 
 */
export function hasTabbableBefore(root, target) {
    if(root === target) {
        return false
    } else {
        const walker = createAdjacentTabbableWalker(root, target)
        return walker.nextNode() !== target
    }
}
/**
 * @param { HTMLElement } root
 * @param { HTMLElement } target 
 */
export function hasTabbableAfter(root, target) {
    if(root === target) {
        return getFirstTabbable(target) !== null
    } else {
        const walker = createAdjacentTabbableWalker(root, target)
        while(walker.lastChild()) {
            if(walker.currentNode === target) {
                return getFirstTabbable(target) !== null
            }
        }
        return true
    }
}