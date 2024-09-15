<script setup>
import { toValue, useTemplateRef, nextTick, onMounted, onUnmounted } from 'vue'
import { FocusTrap } from '../../utilities/classes/private/FocusTrap'

const { autofocus } = defineProps({
    autofocus: {
        type: [Boolean, Object],
        default: true
    }
})

const root = useTemplateRef('root')
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
    while(node !== root.value) {
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
function getFirstTabbable(node = root.value, { includeRoot = false } = {}) {
    if(node !== root.value && (!root.value.contains(node) || isHidden(node)))
        return null
    if(includeRoot && isTabbable(node))
        return node

    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, filterTabbable)
    return walker.nextNode()
}
function getLastTabbable(node = root.value, { includeRoot = false } = {}) {
    if(node !== root.value && (!root.value.contains(node) || isHidden(node)))
        return null
    if(includeRoot && isTabbable(node))
        return node

    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, filterTabbable)
    while(walker.lastChild());
    return walker.currentNode === walker.root ? null : walker.currentNode
}

function handleKeyDown(event) {
    const isTabKey = event.key === 'Tab' && !(event.altKey || event.ctrlKey || event.metaKey)
    const focusedElement = document.activeElement
    if(isTabKey && focusedElement) {
        const root = event.currentTarget
        const first = getFirstTabbable(root)
        const last = getLastTabbable(root)

        if(focusedElement === root) {
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
    focus(getFirstTabbable() ?? root)
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
    if(focusTrap.isActive && !root.value.contains(event.target)) {
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
            focus(getFirstTabbable(element, { includeRoot: true }) ?? root)
        } else {
            focus(root)
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
    <div ref="root" tabindex="0" @keydown="handleKeyDown" @focusout="handleFocusOut">
        <slot/>
    </div>
</template>