<script setup>
import { useTemplateRef, nextTick, onMounted, onUnmounted } from 'vue'
import { FocusTrap, focusElement, isTabKey, isTabbable, getFirstTabbable, getLastTabbable } from '../../utilities/private'

const { autofocus, focusOnUnmount } = defineProps({
    autofocus: {
        type: [Boolean, Object],
        default: true
    },
    focusOnUnmount: Object
})

const root = useTemplateRef('root')
const focusTrap = new FocusTrap()

function handleKeyDown(event) {
    if(isTabKey(event)) {
        const root = event.currentTarget
        const focusedElement = event.target
        const first = getFirstTabbable(root)
        const last = first && getLastTabbable(root)

        if(focusedElement === root) {
            if(event.shiftKey) {
                event.preventDefault()
                focusElement(last)
            } else if(!first) {
                event.preventDefault()
            }
        } else if(first) {
            if(focusedElement === last && !event.shiftKey) {
                event.preventDefault()
                focusElement(first)
            } else if(focusedElement === first && event.shiftKey) {
                event.preventDefault()
                focusElement(last)
            }
        } else {
            event.preventDefault()
        }
    }
}

function focusFirst() {
    focusElement(getFirstTabbable(root.value) ?? root.value)
}
let focusedBeforeBlur = null
async function handleFocusOut(event) {
    if(event.relatedTarget === null) {
        await nextTick()
        if(isTabbable(event.target)) {
            focusedBeforeBlur = event.target
        } else {
            focusFirst()
        }
    }
}
function handleFocusIn(event) {
    if(focusTrap.isActive && !root.value.contains(event.target)) {
        if(focusedBeforeBlur) {
            focusElement(focusedBeforeBlur)
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
            focusElement(getFirstTabbable(element, true) ?? root.value)
        } else {
            focusElement(root.value)
        }
    }
})
onUnmounted(() => {
    document.removeEventListener('focusin', handleFocusIn)
    focusElement(focusOnUnmount ?? focusedBeforeTrap)
    focusTrap.deactivate()
})
</script>

<template>
    <div ref="root" tabindex="-1" @keydown="handleKeyDown" @focusout="handleFocusOut">
        <slot/>
    </div>
</template>