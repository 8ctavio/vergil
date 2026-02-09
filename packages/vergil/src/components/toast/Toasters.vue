<script setup lang="ts">
import { shallowRef, triggerRef, nextTick, onMounted } from 'vue'
import { vergil } from '#vergil'
import { toasters } from './index.js'
import Toast from '#components/toast/Toast.vue'
import type { UnwrapRef } from 'vue'
import type { ToasterPosition } from '#components'

const containers = {} as Record<ToasterPosition, HTMLElement>
onMounted(async () => {
    const { positions } = vergil.config.toaster
    positions.forEach(position => {
        toasters[position] = shallowRef([])
    })
    await nextTick()
    positions.forEach(position => {
        containers[position] = document.getElementById(`toaster-${position}`) as HTMLElement
    })
})

const onBeforeEnter = (position: ToasterPosition) => containers[position].classList.add('enter')
const onAfterEnter = (position: ToasterPosition) => containers[position].classList.remove('enter')
function onBeforeLeave(position: ToasterPosition, toast: HTMLElement) {
    if (containers[position].lastChild === toast) {
        toast.classList.add('last-leave')
    } else {
        if (position.startsWith('top')) {
            const { top } = toast.getBoundingClientRect()
            toast.style.top = `${top}px`
        } else {
            const { bottom: toasterBottom } = containers[position].getBoundingClientRect()
            const { bottom: toastBottom } = toast.getBoundingClientRect()
            toast.style.bottom = `${toasterBottom - toastBottom}px`
        }
        toast.classList.add('not-last-leave')
    }
}
function closeToast(position: ToasterPosition, toast: UnwrapRef<typeof toasters[ToasterPosition]>[number]) {
    const toaster = toasters[position]
    const index = toaster.value.findIndex(t => t.id === toast.id)
    if (index > -1) {
        toaster.value.splice(index, 1)
        triggerRef(toaster)
    }
}
</script>

<template>
    <div id="toasters">
        <TransitionGroup v-for="(toaster, position) in toasters" name="toast"
            tag="div"
            :id="`toaster-${position}`"
            :class="['toaster', ...position.split('-')]"
            @before-enter="() => onBeforeEnter(position)"
            @after-enter="() => onAfterEnter(position)"
            @before-leave="toast => onBeforeLeave(position, toast as HTMLElement)"
        >
            <Toast v-for="toast in toaster.value" :key="toast.id"
                :message="toast.message"
                :details="toast.details"
                :theme="toast.theme"
                :icon="toast.icon"
                :duration="toast.duration"
                @close="() => closeToast(position, toast)"
            />
        </TransitionGroup>
    </div>
</template>

<style>
.toaster {
    --toast-gap: 15px;
    position: fixed;
    display: flex;
    row-gap: var(--toast-gap);
    height: 0;
    overflow-y: visible;
    z-index: var(--z-index-toast);

    &.top {
        --dir: -1;
        top: 0;
        flex-direction: column-reverse;
        justify-content: start;
        & > .toast:last-of-type {
            margin-top: var(--toast-gap);
        }
    }
    &.bottom {
        --dir: 1;
        bottom: 0;
        flex-direction: column;
        justify-content: end;
        & > .toast:last-of-type {
            margin-bottom: var(--toast-gap);
        }
    }
    &.start {
        left: calc(var(--toast-gap) * 1.5);
        align-items: start;
        & > .toast.toast-leave-active {
            left: 0;
        }
    }
    &.end {
        right: calc(var(--toast-gap) * 1.5);
        align-items: end;
        & > .toast.toast-leave-active {
            right: 0;
        }
    }
    &:is(.start, .end) > .toast.toast-leave-active {
        &.last-leave {
            transform: translateY(calc((var(--toast-gap) + 100% + 4px) * var(--dir)));
        }
        &.not-last-leave {
            transform: translateY(calc(var(--toast-gap) * 0.7 * var(--dir)));
        }
    }
    &:not(.start, .end) {
        left: 50%;
        transform: translateX(-50%);
        align-items: center;

        & > .toast {
            min-width: 300px;
            max-width: 450px;

            &.toast-leave-active {
                left: 50%;
                &.last-leave {
                    transform: translateX(-50%) translateY(calc((var(--toast-gap) + 100% + 4px) * var(--dir)));
                }
                &.not-last-leave {
                    transform: translateX(-50%) translateY(calc(var(--toast-gap) * 0.7 * var(--dir)));
                }
            }
        }
    }

    & > .toast {
        flex-shrink: 0;

        /*-------- toast that is entering --------*/
        &.toast-enter-active {
            transition: transform 500ms var(--bezier-bounce-out);
        }
        &.toast-enter-from {
            transform: translateY(calc((var(--toast-gap) + 100% + 4px) * var(--dir)));
        }

        /*-------- toast that is leaving --------*/
        &.last-leave {
            &:is(.toast-move, .toast-leave-active) {
                transition: transform 500ms var(--bezier-bounce-in);
            }
            &.toast-leave-active {
                position: absolute;
            }
        }
        &.not-last-leave {
            &:is(.toast-move, .toast-leave-active) {
                transition: transform 400ms var(--bezier-sine-in-out), opacity 350ms var(--bezier-sine-in-out);
            }
            &.toast-leave-active {
                opacity: 0;
                position: absolute;
            }
        }

        /*-------- toasts that move while a toast is leaving --------*/
        &:not(.last-leave, .not-last-leave).toast-move {
            transition: transform 500ms var(--bezier-bounce-in);
        }
    }
    /*-------- toasts that move while a toast is entering --------*/
    &.enter > .toast:not(:last-of-type).toast-move {
        transition: transform 500ms var(--bezier-bounce-out);
    }
}
</style>