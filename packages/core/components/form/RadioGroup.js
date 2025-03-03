import ToggleGroup from '../private/ToggleGroup.vue'
import { h, mergeProps } from 'vue'

export default function(props, { slots }) {
	return h(
		ToggleGroup,
		mergeProps(props, { type: 'radio' }),
		slots
	)
}