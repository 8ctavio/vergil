<script setup>
import Backdrop from '../Backdrop.vue'
import { popUp } from '.'
</script>

<template>
    <Backdrop v-show="popUp !== null" z-index="var(--z-index-pop-up)">
        <Transition name="pop-up" mode="out-in">
            <component :is="popUp"></component>
        </Transition>
    </Backdrop>
</template>