// @ts-nocheck
import { h, mergeProps } from 'vue'
import ToggleGroup from '#components/.internal/ToggleGroup.vue'

export default function RadioGroup(props, { slots }) {
	return h(
		ToggleGroup,
		mergeProps(props, { type: 'radio' }),
		slots
	)
}