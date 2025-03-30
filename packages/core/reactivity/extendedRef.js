import { ExtendedRef } from "./private"

/**
 * Extends a ref with additional properties.
 * 
 * @template T,E
 * @param { T | (() => T) | Ref<T> | ExtendedRef<T,F> } value - Value to normalize into the ref to be extended.
 * @param { E } [extension] - Extension object whose keys represent the names or symbols of extendedRef properties to be defined, while its values represent those properties' initial values or descriptors.
 * @param { object } [options] - Additional options.
 * @param { () => any } [options.get] - Custom extendedRef's `value` getter function.
 * @param { (value: any) => void } [options.set] - Custom extendedRef's `value` setter function.
 * @param { boolean } [options.defaults] - Default value of the `configurable`, `enumerable`, and `writable` options. Defaults to `true`.
 * @param { boolean } [options.configurable] - Default `configurable` property value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { boolean } [options.enumerable] - Default `enumerable` property value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { boolean } [options.writable] - Default `writable` property value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { string[] } [options.ignore] - Array of `extension` property keys not to be defined on the underlying extendedRef object. object.
 * 
 * @returns { ExtendedRef }
 * 
 * @example
 *  const extended = extendedRef(0, { extra1: 0 })
 *  // normally read and write inner reactive value
 *  extended.value = extended.value + 8
 *  // read and write extended properties
 *  extended.extra1 = extended.extra1 + 1
 *  // create and configure properties
 *  extended.extend({
 *  	extra2: 2,
 *  	extra3: markDescriptor({
 *  		value: 3,
 *  		enumerable: false,
 *  		writable: false
 *  	}),
 *  	extra4: markDescriptor({
 *  		value: ref(4),
 *  		unwrap: false
 *  	})
 *  })
 */
export function extendedRef(value, extension, options = {}) {
	const { get, set, ...extensionOptions } = options
	const extended = value instanceof ExtendedRef
		? value
		: new ExtendedRef(value, { get, set })
	if (extension) extended.extend(extension, extensionOptions)
	return extended
}