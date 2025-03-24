import { shallowRef, toRef, isRef } from 'vue'
import { isFunction } from './public'

export function normalizeRef(value, shallow = false) {
	return isRef(value)
		? value
		: shallow && !isFunction(value)
			? shallowRef(value)
			: toRef(value)
}