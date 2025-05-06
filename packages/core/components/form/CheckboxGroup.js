// @ts-nocheck
import ToggleGroup from '../internal/ToggleGroup.vue'
import { h, mergeProps } from 'vue'

export default function CheckboxGroup(props, { slots }) {
	return h(
		ToggleGroup,
		mergeProps(props, { type: 'checkbox' }),
		slots
	)
}