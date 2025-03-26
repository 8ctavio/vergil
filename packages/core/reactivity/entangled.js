import { Entangled } from "./private"

/**
 * Creates an object whose ref properties are unwrapped by default.
 * 
 * @template T
 * @param { T } [properties] - The properties to define into the entangled object. If a property value is a descriptor-marked object, it is used as the descriptor with which to define the property; otherwise, the provided property value becomes the entangled defined property value.
 * @param { object } [options] - Additional options.
 * @param { boolean } [options.defaults] - Default value of the `configurable`, `enumerable`, and `writable` options. Defaults to `true`.
 * @param { boolean } [options.configurable] - Default `configurable` option value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { boolean } [options.enumerable] - Default `enumerable` option value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { boolean } [options.writable] - Default `writable` option value for descriptors of newly created properties. Defaults to `defaults`.
 * @param { string[] } [options.ignore] - Array of property keys to ignore from the `properties` object.
 * 
 * @returns { Entangled }
 * 
 * @example
 *  // Define regular or ref properties
 *  const entangledA = entangled({
 *      prop1: 1,
 *      prop2: ref(2)
 *  })
 *  // Ref properties are unwrapped by default
 *  console.log(entangledA.prop1) // 1
 *  console.log(entangledA.prop2) // 2
 * 
 *  // Configure properties
 *  const entangledB = entangled({
 *      prop1: 1,
 *      prop2: markDescriptor({
 *          value: 2,
 *          writable: false,
 *          enumerable: false
 *      }),
 *      prop3: markDescriptor({
 *          value: ref(3),
 *          unwrap: false
 *      })
 *  })
 */
export function entangled(properties, options) {
	const _entangled = new Entangled()
	if (properties) _entangled.extend(properties, options)
	return _entangled
}