<script setup>
import { toValue, useTemplateRef, nextTick, onMounted, onUnmounted } from 'vue'

function focus(target) {
    const element = toValue(target)
    element.focus({ preventScroll: true })
    element.select?.()
}

function getTabbableEdges(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, node => {
        const style = getComputedStyle(node)

        if(style.display === 'none' || ['','true'].includes(node.getAttribute('inert')))
            return NodeFilter.FILTER_REJECT
        
        return node.tabIndex < 0
            || node.disabled
            || node.hidden
            || style.visibility === 'hidden'
            || (node.tagName === 'INPUT' && node.type === 'hidden')
            ? NodeFilter.FILTER_SKIP
            : NodeFilter.FILTER_ACCEPT
    })
    const nodes = { first: walker.nextNode() }
    do {
        nodes.last = walker.currentNode
    } while(walker.nextNode())
    return nodes
}

function handleKeyDown(event) {
    const isTabKey = event.key === 'Tab' && !(event.altKey || event.ctrlKey || event.metaKey)
    const focusedElement = document.activeElement
    if(isTabKey && focusedElement) {
        const container = event.currentTarget
        const { first, last } = getTabbableEdges(container)

        if(focusedElement === container) {
            if(!event.shiftKey && !first) {
                event.preventDefault()
            } else if(event.shiftKey) {
                event.preventDefault()
                if(last) focus(last)
            }
        } else if(first) {
            if(focusedElement === last && !event.shiftKey) {
                event.preventDefault()
                focus(first)
            } else if(focusedElement === first && event.shiftKey) {
                event.preventDefault()
                focus(last)
            }
        } else {
            event.preventDefault()
        }
    }
}

const container = useTemplateRef('container')
function focusFirst() {
    const { first } = getTabbableEdges(container.value)
    focus(first ?? container)
}

let lastFocused = null
const mutationObserver = new MutationObserver(mutations => {
    for(const mutation of mutations) {
        if(mutation.removedNodes.length > 0 && Array.prototype.some.call(mutation.removedNodes, node => !(node instanceof Comment))) {
            if(!container.value.contains(document.activeElement)) {
                focusFirst()
            }
            break
        }
    }
})

onMounted(() => {
    mutationObserver.observe(container.value, {
        childList: true,
        subtree: true
    })
    lastFocused = document.activeElement
    nextTick(focusFirst)
})
onUnmounted(() => {
    mutationObserver.disconnect()
    lastFocused?.focus({ preventScroll: true })
})
</script>

<template>
    <div ref="container" tabindex="0" @keydown="handleKeyDown">
        <slot/>
    </div>
</template>