import { isObject } from "#utilities"

/** @import { DescriptorMarked } from '#functions' */

/**
 * Marks an object as a property descriptor.
 * 
 * @template { object } T
 * @param { T } value - Object to be marked as a descriptor.
 * @returns { DescriptorMarked<T> } Descriptor-marked object.
 */
export function markDescriptor(value) {
	if (isObject(value)) {
		return /** @type { DescriptorMarked<T> } */ (Object.defineProperty(value, '__descriptor', { value: true }))
	} else {
		throw new TypeError(`Argument must be an object: received ${value}`)
	}
}

/**
 * Assesses whether an object has been marked as a descriptor (with `markDescriptor`).
 * 
 * @template T
 * @param { T } value
 * @returns { value is DescriptorMarked<{}> } `true` if `value` is marked as a descriptor.
 */
export function isDescriptor(value) {
	return isObject(value)
		&& Object.hasOwn(value, '__descriptor')
		&& /** @type { Record<string, unknown> } */(value).__descriptor === true
}

/**
 * @template [T = undefined]
 * @overload
 * @param { T } [value]
 * @param { boolean } [writable]
 * @param { boolean } [enumerable]
 * @param { boolean } [configurable]
 * @returns { DescriptorMarked<{
 *     value: T;
 *     writable?: boolean;
 *     enumerable?: boolean;
 *     configurable?: boolean;
 * }> } 
 */

/**
 * Creates a descriptor-marked object with `value`, `writable`, `enumerable`, and `configurable` properties.
 * 
 * @param { unknown } [value]
 * @param { boolean } [writable]
 * @param { boolean } [enumerable]
 * @param { boolean } [configurable]
 * @returns { DescriptorMarked<{
 *     value: unknown;
 *     writable: boolean | undefined;
 *     enumerable: boolean | undefined;
 *     configurable: boolean | undefined;
 * }> } Descriptor-marked object with `value`, `writable`, `enumerable`, and `configurable` properties.
 */
export function dataDescriptor(value, writable, enumerable, configurable) {
	return markDescriptor({ value, writable, enumerable, configurable })
}