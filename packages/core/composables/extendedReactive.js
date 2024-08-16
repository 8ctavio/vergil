import { defineReactiveProperties } from "./defineReactiveProperties"
import { ExtendedReactive } from "../utilities"

/**
 * Defines additional `ExtendedReactive` object properties through descriptors with special ref support.
 * 
 * @template T
 * @param { T | (withDescriptor: function) => T } [properties] - An object, or function that returns an object, whose keys represent the names or symbols of the properties to be defined and whose values represent either the properties' (initial) values or descriptors.
 * @param { object } [options] - Additional options.
 * @param { string[] } [options.ignore] - Array of property keys to be ignored from the properties object.
 * @param { boolean } [options.configurable] - Default value for data descriptors' `configurable` option. Defaults to `true`.
 * @param { boolean } [options.enumerable] - Default value for data descriptors' `enumerable` option. Defaults to `true`.
 * 
 * @returns { ExtendedReactive }
 * 
 * @example
 *  // Define regular or reactive properties
 *  const extendedA = extendedReactive({
 *      prop1: 1,
 *      prop2: ref(2)
 *  })
 *  // Reactive properties are unwrapped by default
 *  console.log(extended.prop1) // 1
 *  console.log(extended.prop2) // 2
 * 
 *  // Configure properties
 *  const extendedB = extendedReactive(withDescriptor => ({
 *      prop1: 1,
 *      prop2: withDescriptor({
 *          value: 2,
 *          enumerable: false,
 *          writable: false
 *      }),
 *      prop3: withDescriptor({
 *          value: ref(3),
 *          unwrap: false,
 *          readonly: true
 *      })
 *  }))
 * 
 */
export function extendedReactive(properties, options) {
	return defineReactiveProperties(new ExtendedReactive(), properties, options)
}