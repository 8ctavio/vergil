import { defineReactiveProperties } from './defineReactiveProperties'
import { ExtendedRef } from '../utilities'

/**
 * Extends a ref with additional properties.
 * 
 * @template T,E
 * @param { T | (() => T) | Ref<T> | ExtendedRef<T,F> } value - Value to normalize into the ref to be extended. If an extendedRef is provided, it is extended without creating a new `ExtendedRef` object.
 * @param { E | (withDescriptor: function) => E } [extension] - Extension object or callback that returns extension object. The extension object keys represent the names or symbols of the properties to be defined while its values represent the properties' initial values or descriptors.
 * @param { object } [options] - Additional options.
 * @param { string[] } [options.ignore] - Array of property keys to be ignored from the extension object.
 * @param { boolean } [options.configurable] - Default value for data descriptors' `configurable` option. Defaults to `true`.
 * @param { boolean } [options.enumerable] - Default value for data descriptors' `enumerable` option. Defaults to `true`.
 * 
 * @returns { ExtendedRef }
 * 
 * @example
 *	const extendedA = extendedRef(0, { extra: '' })
 *	// read and write inner reactive value normally
 *	extendedA.value = 8
 *	console.log(extendedA.value)
 *	// read and write extended properties
 *	extendedA.extra = 'some value'
 *	console.log(extendedA.extra)
 *	
 *	// Configure extended properties
 *	const extendedB = extendedRef(0, (withDescriptor) => ({
 *		extra1: 1,
 *		extra2: withDescriptor({ value: 2, enumerable: false, writable: false }),
 *		extra3: withDescriptor({ value: ref(3), enumerable: true, readonly: true })
 *	}))
 */
export function extendedRef(value, extension, options) {
	return defineReactiveProperties(
		value instanceof ExtendedRef ? value : new ExtendedRef(value),
		extension,
		options
	)
}