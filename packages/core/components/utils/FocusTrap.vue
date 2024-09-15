<script setup>
import { toValue, useTemplateRef, nextTick, onMounted, onUnmounted } from 'vue'
import { FocusTrap } from '../../utilities/classes/private/FocusTrap'

const { autofocus } = defineProps({
    autofocus: {
        type: [Boolean, Object],
        default: true
    }
})

const container = useTemplateRef('container')
const focusTrap = new FocusTrap()

function focus(target) {
    const element = toValue(target)
    element.focus({ preventScroll: true })
    element.select?.()
}
function isSelfHidden(node) {
    const style = getComputedStyle(node)
    return style.display === 'none'
        || node.hidden
        || ['hidden','collapse'].includes(style.visibility)
        || ['','true'].includes(node.getAttribute('inert'))
}
function isHidden(node) {
    while(node !== container.value) {
        if(isSelfHidden(node)) return true
        node = node.parentElement
    }
    return false
}
function isTabbable(node) {
    return node.tabIndex >= 0 && !node.disabled && !(node.tagName === 'INPUT' && node.type === 'hidden')
}

function filterTabbable(node) {
    if(isSelfHidden(node))
        return NodeFilter.FILTER_REJECT
    if(isTabbable(node))
        return NodeFilter.FILTER_ACCEPT
    else
        return NodeFilter.FILTER_SKIP
}
function getFirstTabbable(node = container.value, { includeRoot = false } = {}) {
    if(node !== container.value && (!container.value.contains(node) || isHidden(node)))
        return null
    if(includeRoot && isTabbable(node))
        return node

    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, filterTabbable)
    return walker.nextNode()
}
function getTabbableEdges(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, filterTabbable)
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
            if(event.shiftKey) {
                event.preventDefault()
                if(last) focus(last)
            } else if(!first) {
                event.preventDefault()
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

function focusFirst() {
    focus(getFirstTabbable() ?? container)
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
onMounted(async () => {
    focusTrap.activate()
    focusedBeforeTrap = document.activeElement
    document.addEventListener('focusin', handleFocusIn)
    await nextTick()
    if(autofocus === true) {
        focusFirst()
    } else {
        const element = autofocus?.$el ?? autofocus
        if(element instanceof HTMLElement) {
            focus(getFirstTabbable(element, { includeRoot: true }) ?? container)
        } else {
            focus(container)
        }
    }
})
onUnmounted(() => {
    document.removeEventListener('focusin', handleFocusIn)
    if(focusedBeforeTrap) focus(focusedBeforeTrap)
    focusTrap.deactivate()
})
</script>

<template>
    <div ref="container" tabindex="0" @keydown="handleKeyDown" @focusout="handleFocusOut">
        <slot/>
    </div>
</template>