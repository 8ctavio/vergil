import { Entangled, ExtendedRef } from "../reactivity/private"

/**
 * Assesses whether a value is an entangled object.
 * 
 * @param { any } value
 * 
 * @returns { boolean } `true` if `value` is an entangled object, and `false` otherwise.
 */
export function isEntangled(value) {
	return value instanceof Entangled
}

/**
 * Assesses whether a value is an extendedRef object.
 * 
 * @param { any } value
 * 
 * @returns { boolean } `true` if `value` is an extendedRef object, and `false` otherwise.
 */
export function isExtendedRef(value) {
	return value instanceof ExtendedRef
}