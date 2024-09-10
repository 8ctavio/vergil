<script setup>
import ModalTransition from '../utils/ModalTransition.vue'
import { watchEffect } from "vue"
import { popup, closePopup, popupLeaving } from '.'

function onExpose(exposed){
	if(!exposed.modalAnimation){
		popupLeaving.value = false
	}
}

function handleKeydown(e) {
	if(e.key === "Escape") closePopup(true)
}
watchEffect(() => {
	if(popup.component !== null) document.addEventListener('keydown', handleKeydown)
	else document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
	<ModalTransition :ref="onExpose" :show="popup.component !== null" z-index="var(--z-index-popup)">
		<component :is="popup.component" v-bind="popup.props" :is-leaving="popupLeaving" @close="closePopup" @error="closePopup"/>
	</ModalTransition>
</template>