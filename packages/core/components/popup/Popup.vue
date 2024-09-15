<script setup>
import Btn from '../buttons/Btn.vue'
import FocusTrap from '../utils/FocusTrap.vue'
import { vergil } from '../../vergil'
import { closePopup, popupLeaving } from '.'
import { inferTheme, isValidTheme } from '../../utilities/private'

const { disabled } = defineProps({
    title: String,
    theme: {
        type: String,
        default: () => vergil.config.popup.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    disabled: Boolean
})

function handleKeyDown(e) {
	if(e.key === "Escape" && !disabled) closePopup(true)
}
</script>

<template>
    <FocusTrap :class="['popup', inferTheme(theme)]" @keydown="handleKeyDown">
        <div class="popup-wrapper">
            <slot/>
        </div>
        <header class="popup-head">
            <div class="controls left">
                <slot name="controls-left"/>
            </div>
            <div class="controls right">
                <slot name="controls-right"/>
                <Btn icon="close" variant="soft" spacing="compact" @click="() => closePopup(true)" :disabled/>
            </div>
            <h1>{{ title }}</h1>
        </header>
        <span v-show="popupLeaving" class="popup-overlay"/>
    </FocusTrap>
</template>

<style scoped>
.popup {
	font-size: var(--font-size-md);
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 95vh;
    border-radius: var(--border-radius-lg);
    background-color: var(--c-bg);
	box-shadow: 4px 4px 4px var(--c-box-shadow);

    & > .popup-head {
        order: 1;
        display: grid;
        grid-template-columns: repeat(2,auto);
        row-gap: 5px;
        padding: 5px;
        padding-bottom: 15px;
        background-color: var(--c-theme-soft-2);
        border-top-left-radius: var(--border-radius-lg);
        border-top-right-radius: var(--border-radius-lg);

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
    & > .popup-wrapper {
        order: 2;
        overflow-y: auto;
        & > :first-child {
            border-bottom-left-radius: var(--border-radius-lg);
            border-bottom-right-radius: var(--border-radius-lg);
        }
    }
    & > .popup-overlay {
        position: absolute;
        inset: 0;
        background-color: transparent;
    }
}
.dark .popup {
    border: 1px solid var(--c-grey-soft-2);
}
</style>