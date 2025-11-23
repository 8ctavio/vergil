<script setup lang="ts">
import { onMounted } from 'vue'
import { vergil } from '#vergil'
import { Btn, FocusTrap } from '#components'
import { inferTheme, isEscapeKey, isValidRadius, isValidSize, isValidTheme } from '#utilities'
import { modalMeta, closeModal } from './index.js'
import type { PropType } from 'vue'
import type { Theme, Size, Radius } from '#utilities'

const { disabled } = defineProps({
    title: String,
    disabled: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: () => vergil.config.modal.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: () => vergil.config.modal.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: () => vergil.config.modal.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    },
})

function handleKeyDown(event: KeyboardEvent) {
	if(isEscapeKey(event) && !disabled) closeModal(true)
}

onMounted(() => {
    modalMeta.focusedBefore ??= document.activeElement
})
</script>

<template>
    <FocusTrap
        :class="['modal', inferTheme(theme), `size-${size} radius-${radius}`]"
        :inert="modalMeta.isLeaving"
        :focus-on-unmount="modalMeta.focusedBefore ?? undefined"
        @keydown="handleKeyDown">
        <div class="modal-wrapper">
            <slot/>
        </div>
        <header class="modal-head">
            <div class="controls left">
                <slot name="controls-left"/>
            </div>
            <div class="controls right">
                <slot name="controls-right"/>
                <Btn icon="close" variant="soft" spacing="compact" @click="() => closeModal(true)" :disabled/>
            </div>
            <h1>{{ title }}</h1>
        </header>
    </FocusTrap>
</template>

<style>
.modal {
	font-size: var(--font-size);
    line-height: var(--line-height-text);
    border-radius: var(--g-radius-lg);

    display: flex;
    flex-direction: column;
    max-height: 95vh;
    background-color: var(--c-bg);
	box-shadow: 4px 4px 4px var(--c-box-shadow);

    & > .modal-head {
        order: 1;
        display: grid;
        grid-template-columns: repeat(2,auto);
        row-gap: 5px;
        padding: 5px;
        padding-bottom: 15px;
        background-color: var(--c-theme-soft-2);
        border-top-left-radius: var(--g-radius-lg);
        border-top-right-radius: var(--g-radius-lg);

        & > h1 {
            font-size: 1.5em;
            grid-column: span 2;
            justify-self: center;
            padding: 0 15px;
            font-weight: 700;
            color: var(--c-theme-text-2);
            letter-spacing: 0.5px;
        }
        & > .controls {
            display: flex;
            &.left{ justify-content: start; }
            &.right{ justify-content: end; }
        }
    }
    & > .modal-wrapper {
        order: 2;
        overflow-y: auto;
    }
}
:root.dark .modal {
    border: 1px solid var(--c-grey-soft-2);
}
</style>