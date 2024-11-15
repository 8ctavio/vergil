<script setup>
import MiniMarkup from './private/MiniMarkup'
import { usePopover } from '../composables'
import { isValidPlacement } from '../utilities/private'

const { placement, offset, padding, position, trigger } = defineProps({
	text: String,
	placement: {
		type: String,
		default: 'top',
		validator: isValidPlacement,
	},
	offset: {
		type: Number,
		default: 5
	},
	padding: Number,
	trigger: {
		type: String,
		default: 'hover',
		validator: v => ['click','hover'].includes(v)
	},
	position: {
		type: String,
		validator: v => ['absolute','fixed'].includes(v)
	}
})

const { Popover } = usePopover({
	placement,
	offset,
	padding,
	position,
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
}
</style>