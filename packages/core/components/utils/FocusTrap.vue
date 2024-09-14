<script setup>
import { toValue, useTemplateRef, nextTick, onMounted, onUnmounted } from 'vue'
import { FocusTrap } from '../../utilities/classes/private/FocusTrap'

const focusTrap = new FocusTrap()

function focus(target) {
    const element = toValue(target)
    element.focus({ preventScroll: true })
    element.select?.()
}

function getTabbableEdges(container) {
    const walker = document.createTreeWalker(toValue(container), NodeFilter.SHOW_ELEMENT, node => {
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
    const { first } = getTabbableEdges(container)
    focus(first ?? container)
}

let focusedBeforeBlur = null
async function handleFocusOut(event) {
    if(event.relatedTarget === null) {
        await nextTick()
        if(event.target.disabled || !event.target.isConnected) {
            focusFirst()
        } else {
            focusedBeforeBlur = event.target
        }
    }
}
function handleFocusIn(event) {
    if(focusTrap.isActive && !container.value.contains(event.target)) {
        if(focusedBeforeBlur) {
            focus(focusedBeforeBlur)
            focusedBeforeBlur = null
        } else focusFirst()
    }
}

let focusedBeforeTrap = null
onMounted(() => {
    focusTrap.activate()
    focusedBeforeTrap = document.activeElement
    document.addEventListener('focusin', handleFocusIn)
    nextTick(focusFirst)
})
onUnmounted(() => {
    document.removeEventListener('focusin', handleFocusIn)
    focus(focusedBeforeTrap)
    focusTrap.deactivate()
})
</script>

<template>
    <div ref="container" tabindex="0" @keydown="handleKeyDown" @focusout="handleFocusOut">
        <slot/>
    </div>
</template>