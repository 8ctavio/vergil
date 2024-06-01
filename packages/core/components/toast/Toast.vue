<script setup>
import Icon from '../Icon.vue'
import MiniMarkup from "../MiniMarkup.vue"
import { ref } from 'vue'
import { isValidTheme, inferTheme, themeIcons } from '../../utils'

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    details: String,
    theme: {
        type: String,
        default: 'brand',
        validator: isValidTheme
    },
    icon: String,
    duration: {
        type: Number,
        validator(value, props){
            return value > 0
        }
    }
})
defineEmits(['close'])
const theme = inferTheme(props.theme)
const playState = ref('running')
</script>

<template>
    <div :class="['toast', theme]" @mouseenter="playState = 'paused'" @mouseleave="playState = 'running'">
        <Icon :code="icon || themeIcons[theme]"/>
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
.toast{
    font-size: var(--font-size-md);
    position: relative;
    display: grid;
    grid-template-columns: min-content auto min-content;
    column-gap: 10px;
    row-gap: 5px;
    width: max-content;
    min-width: 250px;
    max-width: 500px;
    padding: 10px;
    border-radius: var(--border-radius-md);
    background-color: white;
    box-shadow: 3px 3px 3px #50505050;
    overflow: hidden;
    cursor: default;

    &:has(.toast-details){
        padding: 12px 10px;
    }
    & > .toast-message{
        align-self: center;
        font-weight: 500;
        text-align: center;
        &.title{
            font-weight: 600;
            text-align: left;
        }
    }
    & > .toast-details{
        grid-column-start: 2;
        line-height: 1.5;
    }
    & > .icon{
        line-height: normal;
        font-size: 1.5em;
        color: var(--c-theme-icon-3);
        cursor: default;
        aspect-ratio: initial;
    }
    & > .toast-close{
        color: rgb(0 0 0 / 0.4);
        transition: color 150ms;
        &:hover{
            color: rgb(0 0 0 / 0.7);
        }
        & .icon{
            font-size: 1.2em;
        }
    }
    & > .toast-progress{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: var(--border-radius-md);
        background-color: var(--c-theme-soft-2);
        & > div{
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
.dark .toast{
    background-color: #131313;
    border: 1px solid var(--c-grey-soft-1);
    box-shadow: 3px 3px 3px #00000070;
    & > .toast-close {
        color: rgb(255 255 255 / 0.6);
        &:hover{
            color: rgb(255 255 255 / 0.8);
        }
    }
}
</style>