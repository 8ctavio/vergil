<script setup>
import Icon from '../Icon'
import MiniMarkup from "../private/MiniMarkup"
import { shallowRef } from 'vue'
import { vergil } from '../../vergil'
import { isValidRadius, isValidSize, inferTheme, isValidTheme } from '../../utilities'

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    details: String,
    icon: String,
    duration: {
        type: Number,
        validator: v => v > 0
    },
    theme: {
        type: String,
        default: () => vergil.config.toast.theme ?? vergil.config.global.theme,
        validator: isValidTheme
    },
    size: {
        type: String,
        default: () => vergil.config.toast.size ?? vergil.config.global.size,
        validator: isValidSize
    },
    radius: {
        type: String,
        default: () => vergil.config.toast.radius ?? vergil.config.global.radius,
        validator: isValidRadius
    }
})
defineEmits(['close'])
const theme = inferTheme(props.theme)
const playState = shallowRef('running')
</script>

<template>
    <div
        :class="['toast', theme, `size-${size} radius-${radius}`]"
        @mouseenter="playState = 'paused'"
        @mouseleave="playState = 'running'"
    >
        <Icon :code="icon || vergil.config.toast.icon[theme] || vergil.config.global.icon[theme]"/>
        <p class="toast-message" :class="{ title: details }">
            <template v-if="details">{{ message }}</template>
            <template v-else>
                <MiniMarkup :str="message"/>
            </template>
        </p>
        <button class="toast-close" @click="$emit('close')">
            <Icon code="close"/>
        </button>
        <p v-if="message && details" class="toast-details">
            <MiniMarkup :str="details"/>
        </p>
        <span v-if="duration" class="toast-progress">
            <div @animationend="$emit('close')"></div>
        </span>
    </div>
</template>

<style>
.toast {
    font-size: var(--font-size);
    line-height: var(--line-height-text);
    padding: calc(10 * var(--gap-unit));
    border-radius: var(--g-radius-md);

    position: relative;
    display: grid;
    grid-template-columns: min-content auto min-content;
    column-gap: 10px;
    row-gap: 5px;
    width: max-content;
    min-width: 250px;
    max-width: 350px;
    background-color: light-dark(white, #131313);
    box-shadow: 3px 3px 3px var(--c-box-shadow);
    overflow: hidden;
    cursor: default;

    &:has(.toast-details) {
        padding: calc(12 * var(--gap-unit)) calc(10 * var(--gap-unit));
    }
    & > .toast-message {
        align-self: center;
        font-weight: 500;
        text-align: center;
        &.title{
            font-weight: 600;
            text-align: left;
        }
    }
    & > .toast-details {
        grid-column-start: 2;
        line-height: 1.5;
    }
    & > .icon {
        line-height: normal;
        font-size: 1.5em;
        color: var(--c-theme-1);
        cursor: default;
        aspect-ratio: initial;
    }
    & > .toast-close {
        color: light-dark(rgb(0 0 0 / 0.4), rgb(255 255 255 / 0.6));
        transition: color 150ms;
        &:hover {
            color: light-dark(rgb(0 0 0 / 0.7), rgb(255 255 255 / 0.8));
        }
        & .icon {
            font-size: 1.2em;
        }
    }
    & > .toast-progress {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: var(--g-radius-md);
        background-color: var(--c-theme-soft-3);
        & > div {
            width: 100%;
            height: 100%;
            background-color: var(--c-theme-1);
            animation-name: move-left;
            animation-duration: v-bind('`${duration}s`');
            animation-fill-mode: forwards;
            animation-timing-function: linear;
            animation-play-state: v-bind(playState);
        }
    }
}
:root.dark .toast {
    border: 1px solid var(--c-grey-soft-1);
}
</style>