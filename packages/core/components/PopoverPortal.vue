<template>
	<div id="popover-portal"></div>
</template>

<style>
#popover-portal {
	position: fixed;
	top: 0;
	left: 0;
	z-index: var(--z-index-popover);

	& > .popover-wrapper > .popover {
		/* Fix for scale animation on Chrome */
		transform-style: preserve-3d;
        backface-visibility: hidden;
        &.popover-enter-active {
            transition: opacity 70ms var(--bezier-sine-out), transform 100ms var(--bezier-sine-out);
        }
        &.popover-leave-active {
            transition: opacity 70ms var(--bezier-sine-in), transform 70ms var(--bezier-sine-in);
        }
        &:is(.popover-enter-from, .popover-leave-to){
            opacity: 0;
            /* transform: translateY(4px); */
            transform: scale(0.95);
        }
	}
}
</style>