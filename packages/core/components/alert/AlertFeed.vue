<script setup>
import Alert from './Alert.vue'
import { ref, onMounted } from 'vue'
import { alertFeed } from '.'

function closeAlert(alert){
    const index = alertFeed.value.findIndex(a => a.id === alert.id)
    if(index > -1) alertFeed.value.splice(index, 1)
}

const feed = ref(null)
onMounted(() => {
    feed.value = document.getElementById('alert-feed')
})
</script>

<template>
    <TransitionGroup tag="div" id="alert-feed" name="alert"
        @before-enter="() => feed.classList.add('enter')"
        @after-enter="() => feed.classList.remove('enter')"
        @before-leave="alert => {
            alert.classList.add(feed.firstChild === alert ? 'first-leave' : 'not-first-leave')
        }"
        >
        <Alert v-for="alert in alertFeed" :key="alert.id"
            :message="alert.message"
            :details="alert.details"
            :theme="alert.theme"
            :icon="alert.icon"
            :duration="alert.duration"
            @close="closeAlert(alert)"
            />
    </TransitionGroup>
</template>

<style>
#alert-feed{
    --alert-gap: 15px;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 0;
    overflow-y: visible;
    z-index: var(--z-index-alert);

    & > .alert{
        margin: auto;
        margin-top: var(--alert-gap);

        /*-------- alert that is entering --------*/
        &:first-of-type{
            &.alert-enter-active{
                transition: transform 500ms var(--bezier-bounce-out);
            }
            &.alert-enter-from{
                transform: translateY(calc((var(--alert-gap) + 100% + 4px) * -1));
            }
        }

        /*-------- alert that is leaving --------*/
        &.first-leave{
            &:is(.alert-move, .alert-leave-active){
                transition: transform 500ms var(--bezier-bounce-in);
            }
            &.alert-leave-active{
                position: absolute;
                left: 50%;
                transform: translateX(-50%) translateY(calc((var(--alert-gap) + 100% + 4px) * -1));
            }
        }
        &.not-first-leave{
            &:is(.alert-move, .alert-leave-active){
                transition: transform 400ms var(--bezier-sine-in-out), opacity 350ms var(--bezier-sine-in-out);
            }
            &.alert-leave-active{
                opacity: 0;
                position: absolute;
                left: 50%;
                transform: translateX(-50%) translateY(calc(var(--alert-gap) * -0.7));
            }
        }

        /*-------- alerts that move while an alert is leaving --------*/
        &:not(.first-leave, .not-first-leave).alert-move{
            transition: transform 500ms var(--bezier-bounce-in);
        }
    }
    /*-------- alerts that move while an alert is entering --------*/
    &.enter > .alert:not(:first-of-type).alert-move{
        transition: transform 500ms var(--bezier-bounce-out);
    }
}
</style>