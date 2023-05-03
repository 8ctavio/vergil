<script setup>
defineProps({
    zIndex: String,
    transitionDuration: [Number, Object]
})

</script>

<template>
	<Transition name="backdrop" :duration="transitionDuration">
		<div class="backdrop">
			<slot></slot>
		</div>
	</Transition>
</template>

<style scoped>
.backdrop{
	position: fixed;
	top: 0;
	left: 0;
    display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background-color: var(--backdrop-c);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);

    z-index: v-bind(zIndex);
}

.backdrop-enter-from,
.backdrop-leave-to{
	opacity: 0;
}
.backdrop-enter-active,
.backdrop-leave-active{
	transition: opacity 500ms ease;
}
</style>