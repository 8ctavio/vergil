<script setup>
import MiniMarkup from './private/MiniMarkup'
import { vergil } from '../vergil'
import { usePopover } from '../composables'
import { isValidPlacement } from '../utilities/private'

const { arrow, delay, padding, placement, position, offset, trigger } = defineProps({
	text: String,
	arrow: {
		type: Boolean,
		default: () => vergil.config.tooltip.arrow
	},
	delay: Number,
	padding: Number,
	placement: {
		type: String,
		default: () => vergil.config.tooltip.placement,
		validator: isValidPlacement,
	},
	position: {
		type: String,
		validator: v => ['absolute','fixed'].includes(v)
	},
	offset: {
		type: Number,
		default: props => vergil.config.tooltip.offset(props.arrow)
	},
	trigger: {
		type: String,
		default: 'hover',
		validator: v => ['click','hover'].includes(v)
	}
})

const { Popover } = usePopover({
	arrow: arrow && {
		border: 1
	},
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
	font-size: var(--g-font-size);
    line-height: var(--line-height-text);
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: max-content;
	padding: var(--g-gap-sm) var(--g-gap-lg);
    border-radius: var(--g-radius);
    border: 1px solid var(--c-grey-border-subtle);
    background-color: var(--c-bg);
    box-shadow: 1px 1px 2px var(--c-box-shadow);
	color: var(--c-text);
	cursor: default;

	& > .popover-arrow > svg {
		fill: var(--c-bg);
		stroke: var(--c-grey-border-subtle);
	}
}
</style>