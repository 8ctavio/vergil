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
	<ModalTransition :ref="onExpose" :show="popup.component !== null" z-index="var(--z-index-popup)">
		<component :is="popup.component" v-bind="popup.props" :is-leaving="popupLeaving" @close="closePopup" @error="closePopup"/>
	</ModalTransition>
</template>