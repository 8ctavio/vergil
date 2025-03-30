import { isObject } from "../utilities"

/**
 * Assesses whether an object has been marked as a descriptor (with `markDescriptor`).
 * 
 * @param { any } value
 * 
 * @returns { boolean } `true` if `value` is marked as a descriptor.
 */
export function isDescriptor(value) {
	return isObject(value)
		&& Object.hasOwn(value, '__descriptor')
		&& value.__descriptor === true
}

/**
 * Marks an object as a property descriptor.
 * 
 * @param { object } value - Object to be marked as a descriptor.
 * 
 * @returns { object } Descriptor-marked object.
 */
export function markDescriptor(value) {
	if (isObject(value)) {
		return Object.defineProperty(value, '__descriptor', { value: true })
	} else {
		throw new TypeError(`Argument must be an object: received ${value}`)
	}
}

/**
 * Creates a descriptor-marked object with `value`, `writable`, `enumerable`, and `configurable` properties.
 * 
 * @param { any } [value]
 * @param { boolean } [writable]
 * @param { boolean } [enumerable]
 * @param { boolean } [configurable]
 * 
 * @returns { boolean } Descriptor-marked object with `value`, `writable`, `enumerable`, and `configurable` properties.
 */
export function dataDescriptor(value, writable, enumerable, configurable) {
	return markDescriptor({ value, writable, enumerable, configurable })
}