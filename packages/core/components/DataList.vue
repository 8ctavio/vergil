<script setup>
import Badge from './Badge.vue'
import MiniMarkup from './private/MiniMarkup'
import { ref, h } from 'vue'
import { vergil } from '../vergil'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme } from '../utilities/private'

defineProps({
	data: Object,
	descendant: Boolean,
	theme: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.datalist.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    size: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.datalist.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.datalist.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String,
        default: props => props.descendant ? undefined : (vergil.config.datalist.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})

const columns = ref(0)
function EmbeddedTable({ data }) {
	columns.value = `repeat(${data[0].length},1fr)`
	const rows = []
	for(let i=0; i<data.length; i++) {
		const cells = []
		for(let j=0; j<data[0].length; j++) {
			cells.push(h('p', h(MiniMarkup, { str: data[i][j] ?? '' })))
		}
		rows.push(
			h('div', {
				class: ['data-list-table-row', {
					'data-list-table-head': i === 0
				}]
			}, cells)
		)
	}
	return h('div', { class: 'data-list-table' }, rows)
}
</script>

<template>
	<div :class="['data-list', {
        [inferTheme(theme)]: theme,
        [`size-${size}`]: size,
        [`radius-${radius}`]: radius,
        [`spacing-${spacing}`]: spacing,
    }]">
		<template v-for="(value,key) in data">
			<label class="data-list-label">{{ key }}</label>
			<EmbeddedTable v-if="Array.isArray(value)"
				:data="value"
			/>
			<Badge v-else-if="/^\[\[.*?\]\]$/.test(value)" descendant
				:label="value.slice(2,-2)"
			/>
			<Badge v-else-if="/^\(\(.*?\)\)$/.test(value)" descendant
				:label="value.slice(2,-2)" radius="full"
			/>
			<p v-else class="data-list-value">
				<MiniMarkup :str="value"/>
			</p>
		</template>
	</div>
</template>

<style>
.data-list {
	font-size: var(--font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-2xl) var(--g-gap-3xl);
    gap: var(--g-gap-2xl);
    border-radius: var(--g-radius-lg);

	display: grid;
	grid-template-columns: max-content 1fr;
	align-items: center;
	background-color: var(--c-bg);
	color: var(--c-text);

	& > .data-list-label {
		font-size: 0.9em;
		text-align: end;
		color: var(--c-grey-text-1);
		&:has(+ .data-list-table) {
			align-self: start;
			padding-top: var(--g-gap-xs);
			line-height: calc(var(--line-height-text) / 0.9);
		}
	}
	& > .data-list-value {
		padding: var(--g-gap-xs) var(--g-gap-sm);
		border-bottom: 2px dotted var(--c-theme-solid-1);
	}
	& > .badge {
		justify-self: start;
		padding: var(--g-gap-xs) var(--g-gap-2xl);
	}
	& > .data-list-table {
		display: grid;
		grid-template-columns: v-bind(columns);
		border-bottom: 2px dotted var(--c-theme-solid-1);

		& > .data-list-table-row {
			grid-column: 1 / -1;
			display: grid;
			grid-template-columns: subgrid;
			padding: var(--g-gap-xs);
			column-gap: var(--g-gap-md);
			&:not(:last-child) {
				border-bottom: 1px solid var(--c-grey-border-subtle)
			}
		}
		& > .data-list-table-head {
			font-weight: 500;
			color: var(--c-theme-text-1);
			text-align: center;
		}
	}
}
</style>