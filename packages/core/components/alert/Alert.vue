<script setup>
import Icon from '../Icon.vue'
import { ref } from 'vue'
import { isValidTheme, inferTheme } from '../../utils'
import { alertIcons } from '.'

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
    <div :class="['alert', theme]" @mouseenter="playState = 'paused'" @mouseleave="playState = 'running'">
        <Icon :code="icon || alertIcons[theme]"/>
        <p class="alert-message" :class="{ title: details }">{{ message }}</p>
        <button class="alert-close" @click="$emit('close')">
            <Icon code="close"/>
        </button>
        <p v-if="message && details" class="alert-details">{{ details }}</p>
        <span v-if="duration" class="alert-progress">
            <div @animationend="$emit('close')"></div>
        </span>
    </div>
</template>

<style>
.alert{
    position: relative;
    font-size: var(--font-size-md);
    display: grid;
    grid-template-columns: min-content auto min-content;
    column-gap: 10px;
    row-gap: 5px;
    width: max-content;
    min-width: 300px;
    max-width: 500px;
    padding: 10px;
    border-radius: var(--border-radius-md);
    background-color: white;
    box-shadow: 3px 3px 3px #50505050;
    overflow: hidden;
    cursor: default;

    &:has(.alert-details){
        padding: 12px 10px;
    }
    & > .alert-message{
        align-self: center;
        font-weight: 500;
        text-align: center;
        &.title{
            font-weight: 600;
            text-align: left;
        }
    }
    & > .alert-details{
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
    & > .alert-close{
        color: rgb(0 0 0 / 0.4);
        transition: color 150ms;
        &:hover{
            color: rgb(0 0 0 / 0.7);
        }
        & .icon{
            font-size: 1.2em;
        }
    }
    & > .alert-progress{
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
.dark .alert{
    background-color: #131313;
    border: 1px solid var(--c-grey-soft-1);
    box-shadow: 3px 3px 3px #00000070;
    & > .alert-close {
        color: rgb(255 255 255 / 0.6);
        &:hover{
            color: rgb(255 255 255 / 0.8);
        }
    }
}
</style>