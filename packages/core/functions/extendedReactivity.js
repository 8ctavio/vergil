import { EntangledImpl, ExtendedRefImpl } from "../reactivity/internal"

/** @import { Entangled, ExtendedRef } from '../types' */

/**
 * Assesses whether a value is an entangled object.
 * 
 * @param { unknown } value
 * @returns { value is Entangled } `true` if `value` is an entangled object, and `false` otherwise.
 */
export function isEntangled(value) {
	return value instanceof EntangledImpl
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