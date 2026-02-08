import { isRef, toRef, shallowRef } from 'vue'
import { isFunction } from '#utilities/common'

/**
 * @import { Ref, MaybeRefOrGetter, WatchSource } from "vue"
 * @import { NormalizeRef } from '#reactivity'
 */

/**
 * Assesses whether a value is a valid watch source.
 * 
 * @template T
 * @param { MaybeRefOrGetter<T> } value 
 * @returns { value is WatchSource<T> } `true` if `value` is a valid watch source.
 */
export function isWatchSource(value) {
	return isFunction(value) || isRef(value)
}

/**
 * @template [T = undefined]
 * @overload
 * 
 * @returns { NormalizeRef<T | undefined, false> }
 */

/**
 * @template T
 * @template { boolean } [S = false]
 * @overload
 * 
 * @param { T } value 
 * @param { S } [shallow = false] 
 * @returns { NormalizeRef<T,S> }
 */

/**
 * @param { MaybeRefOrGetter } [value]
 * @param { boolean } [shallow = false]
 * @returns { Ref }
 */
export function normalizeRef(value, shallow = false) {
	return isRef(value)
		? value
		: shallow && !isFunction(value)
			? shallowRef(value)
			: toRef(value)
}