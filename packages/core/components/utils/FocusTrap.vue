<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

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
        if(first) {
            if(focusedElement === last && !event.shiftKey) {
                event.preventDefault()
                first.focus({ preventScroll: true })
            } else if(focusedElement === first && event.shiftKey) {
                event.preventDefault()
                last.focus({ preventScroll: true })
            }
        } else {
            event.preventDefault()
        }
    }
}

const container = ref(null)
let lastFocused = null
onMounted(async () => {
    lastFocused = document.activeElement
    const { first } = getTabbableEdges(container.value)
    if(first) {
        await nextTick()
        first.focus({ preventScroll: true })
    }
})
onUnmounted(() => {
    lastFocused?.focus({ preventScroll: true })
})
</script>

<template>
    <div ref="container" @keydown="handleKeyDown">
        <slot/>
    </div>
</template>