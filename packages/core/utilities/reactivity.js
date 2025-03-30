import { shallowRef, toRef, isRef } from 'vue'
import { isFunction } from './public'

/**
 * Assesses whether a value is a valid watch source.
 * 
 * @param { any } value 
 * @returns { boolean } `true` if `value` is a valid watch source.
 */
export function isWatchSource(value) {
    return isRef(value) || isFunction(value)
}

export function normalizeRef(value, shallow = false) {
	return isRef(value)
		? value
		: shallow && !isFunction(value)
			? shallowRef(value)
			: toRef(value)
}