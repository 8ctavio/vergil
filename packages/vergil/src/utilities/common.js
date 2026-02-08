/**
 * @import { ToCompatible } from './common.types'
 */

/**
 * Assesses whether a value is an object.
 * 
 * @template T
 * @param { T } value 
 * @returns { value is ToCompatible<T extends Function ? never : T, object, Record<PropertyKey, unknown>> } `true` if `value` is an object, and `false` otherwise.
 */
export function isObject(value) {
	return value !== null && typeof value === 'object'
}

/**
 * Assesses whether a value is a plain object.
 * 
 * @template T
 * @param { T } value 
 * @returns { value is ToCompatible<T, Record<PropertyKey, unknown>> } `true` if `value` is a plain object, and `false` otherwise.
 */
export function isPlainObject(value) {
	if (value === null || typeof value !== 'object' || Object.hasOwn(value, Symbol.toStringTag))
		return false

	const proto = Object.getPrototypeOf(value)
	return proto === Object.prototype || proto === null
}

/**
 * Assesses whether a value is a function.
 * 
 * @template T
 * @param { T } value 
 * @returns { value is ToCompatible<T, Function> } `true` if `value` is a function, and `false` otherwise.
 */
export function isFunction(value) {
	return typeof value === 'function'
}