<script setup lang="ts">
import { useTemplateRef, nextTick, onMounted, onUnmounted } from 'vue'
import { FocusTrap, focusElement, isTabKey, isTabbable, getFirstTabbable, getLastTabbable } from '#utilities'
import type { PropType, ComponentPublicInstance } from 'vue'

const { autofocus, focusOnUnmount } = defineProps({
    autofocus: {
        type: [Boolean, Object] as PropType<boolean | HTMLElement | ComponentPublicInstance>,
        default: true
    },
    focusOnUnmount: {
        type: Object as PropType<Element>,
        validator: v => v instanceof Element
    }
})

const root = useTemplateRef('root')
const focusTrap = new FocusTrap()

function handleKeyDown(event: KeyboardEvent) {
    if (isTabKey(event)) {
        const root = event.currentTarget as HTMLElement
        const focusedElement = event.target
        const first = getFirstTabbable(root)
        const last = first && getLastTabbable(root)

        if (focusedElement === root) {
            if (event.shiftKey) {
                event.preventDefault()
                focusElement(last)
            } else if (!first) {
                event.preventDefault()
            }
        } else if (first) {
            if (focusedElement === last && !event.shiftKey) {
                event.preventDefault()
                focusElement(first)
            } else if (focusedElement === first && event.shiftKey) {
                event.preventDefault()
                focusElement(last)
            }
        } else {
            event.preventDefault()
        }
    }
}

function focusFirst() {
    focusElement(getFirstTabbable(root.value as HTMLElement) ?? root.value)
}
let focusedBeforeBlur: HTMLElement | null = null
async function handleFocusOut(event: FocusEvent) {
    if (event.relatedTarget === null) {
        await nextTick()
        if (isTabbable(event.target as HTMLElement)) {
            focusedBeforeBlur = event.target as HTMLElement
        } else {
            focusFirst()
        }
    }
}
function handleFocusIn(event: FocusEvent) {
    if (focusTrap.isActive && !(root.value as HTMLElement).contains(event.target as HTMLElement)) {
        if (focusedBeforeBlur) {
            focusElement(focusedBeforeBlur)
            focusedBeforeBlur = null
        } else focusFirst()
    }
}

let focusedBeforeTrap: Element | null = null
onMounted(async () => {
    focusTrap.activate()
    focusedBeforeTrap = document.activeElement
    document.addEventListener('focusin', handleFocusIn)
    await nextTick()
    if (autofocus === true) {
        focusFirst()
    } else {
        // @ts-expect-error
        const element: unknown = autofocus?.$el ?? autofocus
        if (element instanceof HTMLElement) {
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