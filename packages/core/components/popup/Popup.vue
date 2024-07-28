<script setup>
import Btn from '../buttons/Btn.vue'
import { vergil } from '../../vergil'
import { closePopup, popupLeaving } from '.'
import { inferTheme, isValidTheme } from '../../utilities/private'

defineProps({
    title: String,
    theme: {
        type: String,
        default: () => vergil.config.popup.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    disabled: Boolean
})
</script>

<template>
    <div :class="['popup', inferTheme(theme)]">
        <header class="popup-head">
            <div class="controls left">
                <slot name="controls-left"></slot>
            </div>
            <div class="controls right">
                <slot name="controls-right"></slot>
                <Btn icon="close" variant="ghost" spacing="compact" @click="() => closePopup(true)" :disabled/>
            </div>
            <h1>{{ title }}</h1>
        </header>
        <div class="popup-wrapper">
            <slot></slot>
        </div>
        <span v-show="popupLeaving" class="popup-overlay"></span>
    </div>
</template>

<style scoped>
.popup{
	font-size: var(--font-size-md);
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 95vh;
    border-radius: var(--border-radius-lg);
    background-color: var(--c-bg);
	box-shadow: 4px 4px 4px var(--c-box-shadow);

    & > .popup-head{
        display: grid;
        grid-template-columns: repeat(2,auto);
        row-gap: 5px;
        padding: 5px;
        padding-bottom: 15px;
        background-color: var(--c-theme-soft-1);
        border-top-left-radius: var(--border-radius-lg);
        border-top-right-radius: var(--border-radius-lg);

        & > h1{
            font-size: 1.5em;
            grid-column: span 2;
            justify-self: center;
            padding: 0 15px;
            font-weight: 700;
            color: var(--c-theme-text-2);
            letter-spacing: 0.5px;
        }
        & > .controls{
            display: flex;
            &.left{ justify-content: start; }
            &.right{ justify-content: end; }
        }
    }
    & > .popup-wrapper{
        overflow-y: auto;
        & > :first-child{
            border-bottom-left-radius: var(--border-radius-lg);
            border-bottom-right-radius: var(--border-radius-lg);
        }
    }
    & > .popup-overlay{
        position: absolute;
        inset: 0;
        background-color: transparent;
    }
}
.dark .popup{
    border: 1px solid var(--c-grey-soft-2);
}
</style>