<script setup>
import { Popup, Btn } from '@vrgl/vergil/components'
import PopupSwap1 from './PopupSwap1.vue'
import { showPopup } from '@vrgl/vergil'

const emit = defineEmits(['close', 'error'])
</script>

<template>
    <Popup title="Popup 2">
        <main class="popup-content">
            <Btn label="Show Popup 1" @click="showPopup(PopupSwap1)"/>
        </main>
    </Popup>
</template>

<style scoped>
.popup{
    width: clamp(200px, 20%, 350px);
}
.popup-content{
    width: 100%;
    padding: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>