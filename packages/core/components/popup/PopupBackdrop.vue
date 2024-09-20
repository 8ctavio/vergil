<script setup>
import ModalTransition from '../private/ModalTransition.vue'
import { popup, closePopup, popupLeaving } from '.'

function onExpose(exposed){
	if(!exposed.modalAnimation){
		popupLeaving.value = false
	}
}
</script>

<template>
	<ModalTransition id="popup-backdrop" :ref="onExpose" :show="popup.component !== null">
		<component :is="popup.component" v-bind="popup.props" :is-leaving="popupLeaving" @close="closePopup" @error="closePopup"/>
	</ModalTransition>
</template>

<style>
#popup-backdrop { z-index: var(--z-index-popup) }
</style>