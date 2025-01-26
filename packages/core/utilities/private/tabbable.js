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
function approveTabbableCandidate(node) {
    return node.tabIndex >= 0
        && !node.disabled
        && getComputedStyle(node).visibility === 'visible'
}
function filterTabbable(node) {
	return isTabbableCandidate(node, true)
		? approveTabbableCandidate(node)
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
export function getFirstTabbable(root, includeRoot = false) {
    if(!isTabbableCandidate(root))
        return null
    if(includeRoot && approveTabbableCandidate(root))
        return root

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filterTabbable)
    return walker.nextNode()
}
export function getLastTabbable(root, includeRoot = false) {
    if(!isTabbableCandidate(root))
        return null

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filterTabbable)
    while(walker.lastChild());

	return walker.currentNode !== root || (includeRoot && approveTabbableCandidate(root))
		? walker.currentNode
		: null
}

export function hasTabbableBefore(root, element) {
    if(root === element) {
        return false
    } else {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, node => {
            return node === element ? NodeFilter.FILTER_ACCEPT : filterTabbable(node)
        })
        return walker.nextNode() !== element
    }
}
export function hasTabbableAfter(root, element) {
    if(root === element) {
        return getFirstTabbable(element) !== null
    } else {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, node => {
            return node === element ? NodeFilter.FILTER_ACCEPT : filterTabbable(node)
        })
        while(walker.lastChild()) {
            if(walker.currentNode === element) {
                return getFirstTabbable(element) !== null
            }
        }
        return true
    }
}
