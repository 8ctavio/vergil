import { shallowRef, toRef, isRef } from 'vue'
import { isFunction } from '..'

export function normalizeRef(value, isShallow = false) {
	return isShallow && !isRef(value) && !isFunction(value)
		? shallowRef(value)
		: toRef(value)
}