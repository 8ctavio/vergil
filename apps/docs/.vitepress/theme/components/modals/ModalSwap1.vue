<script setup>
import { showModal } from 'vergil'
import { Modal, Btn } from 'vergil/components'
import ModalSwap2 from './ModalSwap2.vue'

const emit = defineEmits(['close', 'error'])
</script>

<template>
    <Modal title="Modal 1">
        <main class="modal-content">
            <Btn label="Show Modal 2" @click="showModal(ModalSwap2)"/>
        </main>
    </Modal>
</template>

<style scoped>
.modal{
    width: clamp(200px, 20%, 350px);
}
.modal-content{
    width: 100%;
    padding: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>