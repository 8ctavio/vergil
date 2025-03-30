<script setup>
import { Btn, Radio } from '../../components'
import { useId } from 'vue'
import { usePopover } from '../../composables'
import { ucFirst, isValidColor } from '..'
import { userThemeColor } from '.'

const name = useId()
const { position } = defineProps({
	colors: {
		type: Object,
		default: ['emerald', 'moss', 'teal', 'sky', 'denim', 'indigo', 'wine'],
		validator(v) {
			if(Array.isArray(v)) {
				return v.every(c => isValidColor(c))
			} else {
				return Object.keys(v).every(c => isValidColor(c))
			}
		},
	},
	position: {
		type: String,
		validator: v => ['absolute','fixed'].includes(v)
	}
})

const { Popover, togglePopover } = usePopover({
	offset: 5,
	position
})
</script>

<template>
	<Popover class="user-theme-color-picker" @change="userThemeColor = $event.target.value">
		<Btn
			variant="subtle"
			mask="ghost"
			icon="style"
			size="lg"
			spacing="compact"
			radius="full"
			@click="togglePopover"
		/>
		<template #portal>
			<template v-if="Array.isArray(colors)">
				<Radio v-for="color of colors"
					:name
					:key="color"
					:value="color"
					:checked="userThemeColor === color"
					variant="list"
					theme="neutral"
					size="sm"
				>
					<template #label>
						<span :class="color"/>
						{{ ucFirst(color) }}
					</template>
				</Radio>
			</template>
			<template v-else>
				<Radio v-for="(label,color) in colors"
					:name
					:key="color"
					:value="color"
					:checked="userThemeColor === color"
					variant="list"
					theme="neutral"
					size="sm"
				>
					<template #label>
						<span :class="color"/>
						{{ label }}
					</template>
				</Radio>
			</template>
		</template>
	</Popover>
</template>

<style>
#popover-portal > .popover-wrapper > .user-theme-color-picker {
	box-sizing: border-box;
    display: grid;
	grid-template-columns: repeat(3,1fr);
    gap: var(--g-gap-md);
	padding: var(--g-gap-md);
    border-radius: var(--g-radius-lg);
    border: 1px solid var(--c-grey-border-subtle);
    background-color: var(--c-bg);
    box-shadow: 2px 2px 3px var(--c-box-shadow);

	& > .radio {
		--toggle-bw: 0.8px;
        --toggle-bc: var(--c-grey-border-subtle);
		& > .toggle-label {
			display: flex;
			align-items: center;
			column-gap: var(--g-gap-md);
			& > span {
				width: 8px;
				height: 8px;
				border-radius: 4px;
				&.emerald { background-color: var(--c-emerald-solid-1, var(--c-grey-solid-1)); }
				&.moss { background-color: var(--c-moss-solid-1, var(--c-grey-solid-1)); }
				&.teal { background-color: var(--c-teal-solid-1, var(--c-grey-solid-1)); }
				&.sky { background-color: var(--c-sky-solid-1, var(--c-grey-solid-1)); }
				&.denim { background-color: var(--c-denim-solid-1, var(--c-grey-solid-1)); }
				&.indigo { background-color: var(--c-indigo-solid-1, var(--c-grey-solid-1)); }
				&.wine { background-color: var(--c-wine-solid-1, var(--c-grey-solid-1)); }
			}
		}
	}
}
</style>