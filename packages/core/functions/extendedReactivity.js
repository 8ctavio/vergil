import { EntangledImpl, ExtendedRefImpl } from "../reactivity/private"

/** @import { Entangled, ExtendedRef } from '../types' */

/**
 * Assesses whether a value is an entangled object.
 * 
 * @template T
 * @param { T } value
 * @returns { value is T extends Entangled ? T : never } `true` if `value` is an entangled object, and `false` otherwise.
 */
export function isEntangled(value) {
	return value instanceof EntangledImpl
}

/**
 * Assesses whether a value is an extendedRef object.
 * 
 * @template T
 * @param { T } value
 * @returns { value is T extends ExtendedRef ? T : never } `true` if `value` is an extendedRef object, and `false` otherwise.
 */
export function isExtendedRef(value) {
	return value instanceof ExtendedRefImpl
}