<script setup lang="ts">
import { vergil } from '#vergil'
import { usePopover } from '#composables'
import { isValidPlacement } from '#utilities'
import MiniMarkup from '#components/.internal/MiniMarkup'
import type { PropType } from 'vue'
import type { Placement } from '@floating-ui/vue'

const { arrow, delay, padding, placement, position, offset, trigger } = defineProps({
	text: String,
	arrow: {
		type: Boolean,
		default: () => vergil.config.tooltip.arrow
	},
	delay: Number,
	padding: Number,
	placement: {
		type: String as PropType<Placement>,
		default: () => vergil.config.tooltip.placement,
		validator: isValidPlacement,
	},
	position: {
		type: String as PropType<'absolute' | 'fixed'>,
		validator: (v: string) => ['absolute','fixed'].includes(v)
	},
	offset: {
		type: Number,
		default: (props: { arrow: boolean }) => vergil.config.tooltip.offset(props.arrow)
	},
	trigger: {
		type: String as PropType<'click' | 'hover'>,
		default: 'hover',
		validator: (v: string) => ['click','hover'].includes(v)
	}
})

const { Popover } = usePopover({
	arrow: arrow && { border: 1 },
	delay,
	padding,
	placement,
	position,
	offset,
	trigger,
})
</script>

<template>
	<Popover class="tooltip">
		<slot/>
		<template #portal>
			<slot name="content">
				<MiniMarkup :str="text"/>
			</slot>
		</template>
	</Popover>
</template>

<style>
#popover-portal > .popover-wrapper > .tooltip {
	font-size: var(--font-size);
    line-height: var(--line-height-text);
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: max-content;
	padding: var(--g-gap-sm) var(--g-gap-2xl);
    border-radius: var(--g-radius-full, var(--g-radius-md));
    border: 1px solid var(--c-grey-border-subtle);
    background-color: var(--c-bg);
    box-shadow: 1px 1px 2px var(--c-box-shadow);
	color: var(--c-text);
	cursor: default;

	& > .popover-arrow {
		fill: var(--c-bg);
		stroke: var(--c-grey-border-subtle);
	}
}
</style>