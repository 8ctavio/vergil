import { ExtendedRefImpl, defineEntangledProperties } from "#reactivity/.private/extendedReactivity"

/**
 * @import { MaybeRefOrGetter, UnwrapRef } from 'vue'
 * @import { ExtendedRef, ExtendedRefOptions } from '#reactivity'
 * @import { Prettify } from '#utilities'
 */

/**
 * Extends a ref with additional properties.
 * 
 * @template { MaybeRefOrGetter | ExtendedRef } [T = undefined]
 * @template [U = T extends ExtendedRef<infer R> ? UnwrapRef<R> : UnwrapRef<T>]
 * @template { Record<PropertyKey, unknown> | null } [Extension = {}]
 * @template { boolean } [Shallow = false]
 * @template { PropertyKey } [Ignore = never]
 * @overload
 * @param { T } [value] Value to normalize into the ref to be extended.
 * @param { Extension } [extension] Extension object whose keys represent
 *   the names or symbols of extendedRef properties to be defined, while
 *   its values represent those properties' initial values or descriptors.
 * @param { ExtendedRefOptions<T extends ExtendedRef<infer R> ? UnwrapRef<R> : UnwrapRef<T>, U, Shallow, Ignore> } [options = {}]
 * @returns {(
 *     T extends ExtendedRef<infer R, infer V, infer S, infer E>
 *         ? ExtendedRef<R, V, S, Extension extends null ? E : Prettify<E & Extension>, Ignore>
 *         : ExtendedRef<T, U, Shallow, Extension extends null ? {} : Extension, Ignore>
 * )}
 */
/**
 * @param { MaybeRefOrGetter | ExtendedRef } [value]
 * @param { Record<PropertyKey, unknown> | null } [extension]
 * @param { ExtendedRefOptions } [options]
 * @returns { ExtendedRef }
 * 
 * @example
 *  const extended = extendedRef(0, { extra1: 0 })
 *  // normally read and write inner reactive value
 *  extended.value = extended.value + 8
 *  // read and write extended properties
 *  extended.extra1 = extended.extra1 + 1
 */
export function extendedRef(value, extension, options = {}) {
	const { shallow, get, set, ...extensionOptions } = options
	const extended = value instanceof ExtendedRefImpl
		? value
		: new ExtendedRefImpl(value, { shallow, get, set })
	if (extension) defineEntangledProperties(extended, extension, extensionOptions)
	return extended
}

/**
 * Assesses whether a value is an extendedRef object.
 * 
 * @param { unknown } value
 * @returns { value is ExtendedRef } `true` if `value` is an extendedRef object, and `false` otherwise.
 */
export function isExtendedRef(value) {
	return value instanceof ExtendedRefImpl
}