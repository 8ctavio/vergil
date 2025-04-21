import { EntangledImpl } from "./private"

/** @import { Entangled, EntangledOptions } from '../types' */

/**
 * @template { Record<PropertyKey, unknown> } [T = {}]
 * @template { PropertyKey } [Ignore = never]
 * @overload
 * @param { T } [properties]
 * @param { EntangledOptions<Ignore> } [options]
 * @returns { Entangled<T, Ignore> }
 */

/**
 * Creates an object whose ref properties are automatically unwrapped by default.
 * 
 * @param { Record<PropertyKey, unknown> } [properties]	- Object whose own key-value pairs represent key-descriptor pairs used to define corresponding properties on the underlying entangled object.
 * @param { object } [options]
 * @param { boolean } [options.defaults]				- Default value of the `configurable`, `enumerable`, and `writable` options. Defaults to `true`.
 * @param { boolean } [options.configurable]			- Default `configurable` property value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { boolean } [options.enumerable]				- Default `enumerable` property value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { boolean } [options.writable]				- Default `writable` property value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { PropertyKey[] } [options.ignore]			- Array of `properties` property keys not to be defined on the underlying entangled object.
 * @returns { Entangled }
 * 
 * @example
 *  // Define regular or ref properties
 *  const _entangled = entangled({
 *      prop1: 1,
 *      prop2: ref(2)
 *  })
 * 
 *  // Ref properties are unwrapped by default
 *  console.log(_entangled.prop1) // 1
 *  console.log(_entangled.prop2) // 2
 * 
 *  // Extend entangled and configure properties
 *  _entangled.extend({
 *      prop3: 3,
 *      prop4: markDescriptor({
 *          value: 4,
 *          writable: false,
 *          enumerable: false
 *      }),
 *      prop5: markDescriptor({
 *          value: ref(5),
 *          unwrap: false
 *      })
 *  })
 */
export function entangled(properties, options) {
	const _entangled = new EntangledImpl()
	if (properties) _entangled.extend(properties, options)
	return _entangled
}