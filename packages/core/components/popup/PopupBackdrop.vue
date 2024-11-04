<script setup>
import ModalTransition from '../private/ModalTransition.vue'
import { popup, popupMeta, closePopup } from '.'

function onExpose(exposed) {
	if(!exposed.isLeaving) {
		popupMeta.isLeaving = false
	}
}
</script>

<template>
	<ModalTransition id="popup-backdrop" :ref="onExpose" :show="popup.component !== null">
		<component :is="popup.component" v-bind="popup.props" @close="closePopup" @error="closePopup"/>
	</ModalTransition>
</template>

<style>
#popup-backdrop { z-index: var(--z-index-popup) }
</style>