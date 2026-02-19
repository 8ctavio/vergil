<script setup>
import { ref } from 'vue'
import { Modal, PushButton } from 'vergil/components'

const emit = defineEmits(['close'])

const loader = ref(false)
async function doSomething() {
    loader.value = true
    await new Promise(r => setTimeout(r, 3000))
    emit('close')
    loader.value = false
}
</script>

<template>
    <Modal title="Modal Demo" :disabled="loader">
        <main class="modal-content">
            <p>Use the close button in the top-right corner to close the Modal.</p>
            <p>Otherwise, click the following button to close the Modal after three seconds.</p>
            <PushButton label="Continue" spacing="expanded" @click="doSomething" :loading="loader"/>
        </main>
    </Modal>
</template>

<style scoped>
.modal {
    width: clamp(250px, 25%, 400px);
}
.modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 20px;
    width: 100%;
    padding: 25px;
    & > .push-button {        
        width: min(250px, 100%);
    }
}
</style>