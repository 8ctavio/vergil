// @ts-nocheck
import ToggleGroup from '../internal/ToggleGroup.vue'
import { h, mergeProps } from 'vue'

export default function RadioGroup(props, { slots }) {
	return h(
		ToggleGroup,
		mergeProps(props, { type: 'radio' }),
		slots
	)
}