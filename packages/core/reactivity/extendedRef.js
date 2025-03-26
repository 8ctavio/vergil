import { ExtendedRef } from "./private"

/**
 * Extends a ref with additional properties.
 * 
 * @template T,E
 * @param { T | (() => T) | Ref<T> | ExtendedRef<T,F> } value - Value to normalize into the ref to be extended.
 * @param { E } [extension] - Extension object whose keys represent the names or symbols of the properties to be defined while its values represent the properties' initial values or descriptors.
 * @param { object } [options] - Additional options.
 * @param { boolean } [options.get] - Custom `value` getter function.
 * @param { boolean } [options.set] - Custom `value` setter function.
 * @param { boolean } [options.defaults] - Default value of the `configurable`, `enumerable`, and `writable` options. Defaults to `true`.
 * @param { boolean } [options.configurable] - Default `configurable` option value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { boolean } [options.enumerable] - Default `enumerable` option value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { boolean } [options.writable] - Default `writable` option value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { string[] } [options.ignore] - Array of property keys to ignore from the `properties` object.
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
 *	const extendedB = extendedRef(0, {
 *		extra1: 1,
 *		extra2: markDescriptor({ value: 2, writable: false, enumerable: false }),
 *		extra3: markDescriptor({ value: ref(3), unwrap: false })
 *	})
 */
export function extendedRef(value, extension, options = {}) {
	const { get, set, ...extensionOptions } = options
	const extended = value instanceof ExtendedRef
		? value
		: new ExtendedRef(value, { get, set })
	if (extension) extended.extend(extension, extensionOptions)
	return extended
}