import { isInput } from "."

function isInert(node) {
	do if(node.inert) return true
	while((node = node.parentElement) !== null)
    return false
}

function isTabbableCandidate(node, backgroundChecked = false) {
	return backgroundChecked
		? !node.inert && node.checkVisibility()
		: node instanceof HTMLElement
			&& node.isConnected
			&& node.checkVisibility()
			&& !isInert(node)
}
function isTabbableRadio(element, radioGroups) {
    if(!element.name || element.checked) {
        return true
    } else if(element.form) {
        const radioNodeList = element.form.elements.namedItem(element.name)
        return !radioNodeList.value
    } else if(Object.hasOwn(radioGroups, element.name)) {
        return radioGroups[element.name]
    } else {
        const walker = document.createTreeWalker(element.ownerDocument.body, NodeFilter.SHOW_ELEMENT, el => {
            return isInput(el, 'radio') && el.name === element.name && el.checked
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP
        })
        return radioGroups[element.name] = walker.nextNode() === null
    }
}
function approveTabbableCandidate(element, radioGroups) {
    return element.tabIndex >= 0
        && !element.disabled
        && (!isInput(element, 'radio') || isTabbableRadio(element, radioGroups))
        && getComputedStyle(element).visibility === 'visible'
}
function filterTabbable(element, radioGroups) {
	return isTabbableCandidate(element, true)
		? approveTabbableCandidate(element, radioGroups)
			? NodeFilter.FILTER_ACCEPT
			: NodeFilter.FILTER_SKIP
		: NodeFilter.FILTER_REJECT
}

export function isTabbable(node) {
    return node instanceof HTMLElement
		&& node.isConnected
        && node.tabIndex >= 0
        && node.checkVisibility({ visibilityProperty: true })
        && !node.disabled
        && !isInert(node)
}

function createTabbableWalker(root) {
    const radioGroups = {}
    return document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, el => {
        return filterTabbable(el, radioGroups)
    })
}
export function getFirstTabbable(root, includeRoot = false) {
    if(!isTabbableCandidate(root))
        return null
    if(includeRoot && approveTabbableCandidate(root))
        return root

    const walker = createTabbableWalker(root)
    return walker.nextNode()
}
export function getLastTabbable(root, includeRoot = false) {
    if(!isTabbableCandidate(root))
        return null

    const walker = createTabbableWalker(root)
    while(walker.lastChild());

	return walker.currentNode !== root || (includeRoot && approveTabbableCandidate(root))
		? walker.currentNode
		: null
}

function createAdjacentTabbableWalker(root, target) {
    const radioGroups = {}
    return document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, el => {
        return el === target ? NodeFilter.FILTER_ACCEPT : filterTabbable(el, radioGroups)
    })
}
export function hasTabbableBefore(root, target) {
    if(root === target) {
        return false
    } else {
        const walker = createAdjacentTabbableWalker(root, target)
        return walker.nextNode() !== target
    }
}
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