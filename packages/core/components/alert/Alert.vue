<script setup>
import Icon from '../Icon.vue'
import { ref, onMounted } from 'vue'
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

const emit = defineEmits(['close', 'mounted'])

let timeout
function handleClose(){
    clearTimeout(timeout)
    emit('close')
}
const alert = ref(null)
onMounted(() => {
    if(props.duration){
        timeout = setTimeout(handleClose, props.duration*1000);
    }
    emit('mounted', alert.value)
})

const theme = inferTheme(props.theme)
</script>

<template>
    <div ref="alert" :class="['alert', theme]">
        <Icon :code="icon || alertIcons[theme]"/>
        <p class="alert-message" :class="{ title: details }">{{ message }}</p>
        <button class="alert-close" @click="handleClose">
            <Icon code="close"/>
        </button>
        <p v-if="message && details" class="alert-details">{{ details }}</p>
    </div>
</template>

<style>
.alert{
    font-size: var(--font-size-md);
    display: grid;
    grid-template-columns: min-content auto min-content;
    column-gap: 10px;
    row-gap: 5px;
    width: max-content;
    min-width: 300px;
    max-width: 500px;
    padding-left: 10px;
    padding-right: calc(10px - var(--border-radius-md));
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: var(--border-radius-md);
    border-left: var(--border-radius-md) solid var(--c-theme-1);
    background-color: white;
    box-shadow: 3px 3px 3px #50505050;

    &:has(.alert-details){
        padding-top: 12px;
        padding-bottom: 12px;
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
}
.dark .alert{
    background-color: var(--c-bg-alt);
    border: 1px solid var(--c-grey-soft-1);
    border-left: var(--border-radius-md) solid var(--c-theme-1);
    box-shadow: 3px 3px 3px #00000070;
    & > .alert-close {
        color: rgb(255 255 255 / 0.6);
        &:hover{
            color: rgb(255 255 255 / 0.8);
        }
    }
}
</style>