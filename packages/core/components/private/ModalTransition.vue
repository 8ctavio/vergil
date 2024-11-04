<script setup>
import { ref } from 'vue'

const isLeaving = ref(false)

defineOptions({ inheritAttrs: false })
defineProps({ show: Boolean })
defineExpose({ isLeaving })
</script>

<template>
	<Transition v-show="show" name="modal-backdrop" appear :duration="500">
		<div class="modal-backdrop" v-bind="$attrs">
			<Transition v-show="show" name="modal-window" appear mode="out-in"
				@before-leave="isLeaving = true"
				@after-leave="isLeaving = false"
				>
				<slot/>
			</Transition>
		</div>
	</Transition>
</template>

<style>
.modal-backdrop {
	--duration-backdrop-opacity: 100ms;
	--duration-window-opacity: 150ms;
	--duration-window-tranform: 400ms;

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

	&.modal-backdrop-enter-active{
		transition: opacity var(--duration-backdrop-opacity) var(--bezier-sine-out);
	}
	&.modal-backdrop-leave-active{
		transition: opacity var(--duration-backdrop-opacity) var(--duration-window-tranform) var(--bezier-sine-in);
	}
	&:is(.modal-backdrop-enter-from, .modal-backdrop-leave-to){
		opacity: 0;
	}

	& > :first-child{
		&.modal-window-enter-active{
			transition: opacity var(--duration-window-opacity) var(--duration-backdrop-opacity) var(--bezier-sine-out),
						transform var(--duration-window-tranform) var(--duration-backdrop-opacity) var(--bezier-bounce-out);
		}
		&.modal-window-leave-active{
			transition: opacity var(--duration-window-opacity) calc(var(--duration-window-tranform) - var(--duration-window-opacity)) var(--bezier-sine-in),
						transform var(--duration-window-tranform) var(--bezier-bounce-in);
		}
		&:is(.modal-window-enter-from, .modal-window-leave-to){
			opacity: 0;
			transform: translateY(-30px);
		}
	}
}
</style>