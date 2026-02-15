import { ExtendedRefImpl, defineEntangledProperties } from "#reactivity/.private/extendedReactivity"

/**
 * @import { MaybeRefOrGetter, UnwrapRef } from 'vue'
 * @import { ExtendedRef, ExtendedRefOptions } from '#reactivity'
 * @import { Prettify } from '#utilities'
 */

/**
 * @template { MaybeRefOrGetter | ExtendedRef } [T = undefined]
 * @template [U = T extends ExtendedRef<infer R> ? UnwrapRef<R> : UnwrapRef<T>]
 * @template { Record<PropertyKey, unknown> | null } [Extension = {}]
 * @template { boolean } [Shallow = false]
 * @template { PropertyKey } [Ignore = never]
 * @overload
 * @param { T } [value]
 * @param { Extension } [extension]
 * @param { ExtendedRefOptions<T extends ExtendedRef<infer R> ? UnwrapRef<R> : UnwrapRef<T>, U, Shallow, Ignore> } [options = {}]
 * @returns {(
 *     T extends ExtendedRef<infer R, infer V, infer S, infer E>
 *         ? ExtendedRef<R, V, S, Extension extends null ? E : Prettify<E & Extension>, Ignore>
 *         : ExtendedRef<T, U, Shallow, Extension extends null ? {} : Extension, Ignore>
 * )}
 */

/**
 * Extends a ref with additional properties.
 * 
 * @param { MaybeRefOrGetter | ExtendedRef } [value]			- Value to normalize into the ref to be extended.
 * @param { Record<PropertyKey, unknown> | null } [extension]	- Extension object whose keys represent the names or symbols of extendedRef properties to be defined, while its values represent those properties' initial values or descriptors.
 * @param { object } [options]
 * @param { boolean } [options.shallow]					- Whether the created extendedRef's underlying ref is shallow. Defaults to `false`.
 * @param { () => unknown } [options.get]				- Custom extendedRef's `value` getter function.
 * @param { (value: unknown) => void } [options.set]	- Custom extendedRef's `value` setter function.
 * @param { boolean } [options.defaults]				- Default value of the `configurable`, `enumerable`, and `writable` options. Defaults to `true`.
 * @param { boolean } [options.configurable]			- Default `configurable` property value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { boolean } [options.enumerable]				- Default `enumerable` property value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { boolean } [options.writable]				- Default `writable` property value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { PropertyKey[] } [options.ignore]			- Array of `extension` property keys not to be defined on the underlying extendedRef object. object.
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