<script setup>
import { popup, closePopup, cleanPopup } from '.'
</script>

<template>
    <Transition name="backdrop" appear :duration="700" @after-leave="cleanPopup">
		<div v-show="popup.show" id="popup-backdrop">
			<component :is="popup.component" @close="closePopup" @error="closePopup" v-bind="popup.props"/>
		</div>
	</Transition>
</template>

<style>
#popup-backdrop{
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background-color: var(--c-backdrop);
    backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(2px);
	z-index: var(--z-index-popup);

	--duration-backdrop-opacity: 100ms;
	--duration-confirm-opacity: 150ms;
	--duration-confirm-tranform: 400ms;

	&.backdrop-enter-active{
		transition: opacity var(--duration-backdrop-opacity) var(--bezier-sine-out);
		& > .popup{
			transition: opacity var(--duration-confirm-opacity) var(--duration-backdrop-opacity) var(--bezier-sine-out),
						transform var(--duration-confirm-tranform) var(--duration-backdrop-opacity) var(--bezier-bounce-out);
		}
	}
	&.backdrop-leave-active{
		transition: opacity var(--duration-backdrop-opacity) var(--duration-confirm-tranform) var(--bezier-sine-in);
		& > .popup{
			transition: opacity var(--duration-confirm-opacity) calc(var(--duration-confirm-tranform) - var(--duration-confirm-opacity)) var(--bezier-sine-in),
						transform var(--duration-confirm-tranform) var(--bezier-bounce-in);
		}
	}
	&:is(.backdrop-enter-from, .backdrop-leave-to){
		opacity: 0;
		& > .popup{
			opacity: 0;
			transform: translateY(-20%);
		}
	}
}
</style>