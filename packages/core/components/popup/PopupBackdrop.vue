<script setup>
import ModalTransition from '../utils/ModalTransition.vue'
import { popup, closePopup } from '.'
</script>

<template>
	<ModalTransition :show="popup.component !== null" z-index="var(--z-index-popup)">
		<component :is="popup.component" v-bind="popup.props" @close="closePopup" @error="closePopup"/>
	</ModalTransition>
</template>