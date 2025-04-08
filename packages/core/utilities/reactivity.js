import { isRef, toRef, shallowRef } from 'vue'
import { isFunction } from './public'

/**
 * @import { Ref, ShallowRef, MaybeRefOrGetter, WatchSource } from "vue"
 */

/**
 * Assesses whether a value is a valid watch source.
 * 
 * @template T
 * @param { MaybeRefOrGetter<T> } value 
 * @returns { value is WatchSource<T> } `true` if `value` is a valid watch source.
 */
export function isWatchSource(value) {
	return isRef(value) || isFunction(value)
}

/**
 * @template T
 * @template { boolean } [S = false]
 * @overload
 * 
 * @param { T } value 
 * @param { S } [shallow] 
 * @returns { T extends Ref
 *     ? T
 *     : T extends () => infer V
 *         ? Readonly<Ref<V>>
 *         : S extends true ? ShallowRef<T> : Ref<T>
 * }
 */

/**
 * @param { MaybeRefOrGetter } value
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