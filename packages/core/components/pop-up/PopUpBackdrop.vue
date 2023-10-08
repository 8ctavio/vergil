<script setup>
import Backdrop from '../Backdrop.vue'
import { popUp } from '.'
</script>

<template>
    <Backdrop v-show="popUp.component !== null" z-index="var(--z-index-pop-up)">
        <Transition name="pop-up" mode="out-in">
            <component :is="popUp.component" v-bind="popUp.props"></component>
        </Transition>
    </Backdrop>
</template>