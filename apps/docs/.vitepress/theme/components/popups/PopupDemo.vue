<script setup>
import { Popup, Btn3D } from '@8ctavio/vergil/components'
import { ref } from 'vue'

const emit = defineEmits(['close'])

const loader = ref(false)
async function doSomething(){
    loader.value = true
    await new Promise(r => setTimeout(r, 3000))
    emit('close')
    loader.value = false
}
</script>

<template>
    <Popup title="Popup Demo" :disabled="loader">
        <main class="popup-content">
            <p>Use the close button in the top-right corner to close the Popup.</p>
            <p>Otherwise, click the following button to close the Popup after three seconds.</p>
            <Btn3D label="Continue" spacing="expanded" @click="doSomething" :loading="loader"/>
        </main>
    </Popup>
</template>

<style scoped>
.popup{
    width: clamp(250px, 25%, 400px);
}
.popup-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 20px;
    width: 100%;
    padding: 25px;
    & > .btn3D{        
        width: min(250px, 100%);
    }
}
</style>