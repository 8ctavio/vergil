<template>
	<div id="popover-portal"></div>
</template>

<style>
#popover-portal {
	position: absolute;
	top: 0;
	left: 0;
	z-index: var(--z-index-popover);

	& > .popover-wrapper > .popover {
        position: relative;
        &.popover-enter-active {
            transition: opacity 70ms var(--bezier-sine-out), transform 100ms var(--bezier-sine-out);
        }
        &.popover-leave-active {
            transition: opacity 70ms var(--bezier-sine-in), transform 70ms var(--bezier-sine-in);
        }
        &:is(.popover-enter-from, .popover-leave-to){
            opacity: 0;
            transform: scale(0.95);
        }

        & > .popover-arrow {
            position: absolute;
            & > polygon {
                stroke-width: 0;
            }
            & > polyline {
                fill: none;
                stroke-linecap: square;
            }
        }
	}
}
</style>