<script setup>
import Toast from './Toast.vue'
import { ref, onMounted } from 'vue'
import { toaster } from '.'

function closeToast(toast){
    const index = toaster.value.findIndex(t => t.id === toast.id)
    if(index > -1) toaster.value.splice(index, 1)
}

const toasterEl = ref(null)
onMounted(() => {
    toasterEl.value = document.getElementById('toaster')
})

function onBeforeLeave(toast){
    if(toasterEl.value.firstChild === toast){
        toast.classList.add('first-leave')
    }
    else{
        const { bottom: toasterBottom } = toasterEl.value.getBoundingClientRect()
        const { bottom: toastBottom } = toast.getBoundingClientRect()
        toast.style.bottom = `${toasterBottom - toastBottom}px`
        toast.classList.add('not-first-leave')
    }
}
</script>

<template>
    <TransitionGroup tag="div" id="toaster" name="toast"
        @before-enter="() => toasterEl.classList.add('enter')"
        @after-enter="() => toasterEl.classList.remove('enter')"
        @before-leave="onBeforeLeave"
        >
        <Toast v-for="toast in toaster" :key="toast.id"
            :message="toast.message"
            :details="toast.details"
            :theme="toast.theme"
            :icon="toast.icon"
            :duration="toast.duration"
            @close="closeToast(toast)"
            />
    </TransitionGroup>
</template>

<style>
#toaster{
    --toast-gap: 15px;
    position: fixed;
    bottom: 0;
    right: calc(var(--toast-gap) * 1.5);
    display: flex;
    flex-direction: column-reverse;
    align-items: end;
    row-gap: var(--toast-gap);
    height: 0;
    overflow-y: visible;
    z-index: var(--z-index-toast);

    & > .toast{
        flex-shrink: 0;

        /*-------- toast that is entering --------*/
        &:first-of-type{
            margin-bottom: var(--toast-gap);
            &.toast-enter-active{
                transition: transform 500ms var(--bezier-bounce-out);
            }
            &.toast-enter-from{
                transform: translateY(calc((var(--toast-gap) + 100% + 4px) * 1));
            }
        }

        /*-------- toast that is leaving --------*/
        &.first-leave{
            &:is(.toast-move, .toast-leave-active){
                transition: transform 500ms var(--bezier-bounce-in);
            }
            &.toast-leave-active{
                position: absolute;
                right: 0;
                transform: translateY(calc((var(--toast-gap) + 100% + 4px) * 1));
            }
        }
        &.not-first-leave{
            &:is(.toast-move, .toast-leave-active){
                transition: transform 400ms var(--bezier-sine-in-out), opacity 350ms var(--bezier-sine-in-out);
            }
            &.toast-leave-active{
                opacity: 0;
                position: absolute;
                right: 0;
                transform: translateY(calc(var(--toast-gap) * 0.7));
            }
        }

        /*-------- toasts that move while an toast is leaving --------*/
        &:not(.first-leave, .not-first-leave).toast-move{
            transition: transform 500ms var(--bezier-bounce-in);
        }
    }
    /*-------- toasts that move while an alert is entering --------*/
    &.enter > .toast:not(:first-of-type).toast-move{
        transition: transform 500ms var(--bezier-bounce-out);
    }
}
</style>