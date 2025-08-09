// @ts-nocheck
import { h, mergeProps } from 'vue'
import { ToggleGroup } from '#components'

export default function RadioGroup(props, { slots }) {
	return h(
		ToggleGroup,
		mergeProps(props, { type: 'radio' }),
		slots
	)
}