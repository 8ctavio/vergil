import { EntangledImpl, defineEntangledProperties } from "#reactivity/.private/extendedReactivity"

/**
 * @import { Entangled, EntangledOptions } from '#reactivity'
 */

/**
 * Creates an object whose ref properties are automatically unwrapped by default.
 * 
 * @template { Record<PropertyKey, unknown> } [T = {}]
 * @template { PropertyKey } [Ignore = never]
 * @overload
 * @param { T } [properties]
 *     Object whose own key-value pairs represent key-descriptor pairs used to
 *     define corresponding properties on the underlying entangled object.
 * @param { EntangledOptions<Ignore> } [options]
 * @returns { Entangled<T, Ignore> }
 */
/**
 * 
 * @param { Record<PropertyKey, unknown> } [properties]
 * @param { EntangledOptions } [options]
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
 */
export function entangled(properties, options) {
	const _entangled = new EntangledImpl()
	if (properties) defineEntangledProperties(_entangled, properties, options)
	return _entangled
}

/**
 * Assesses whether a value is an entangled object.
 * 
 * @param { unknown } value
 * @returns { value is Entangled } `true` if `value` is an entangled object, and `false` otherwise.
 */
export function isEntangled(value) {
	return value instanceof EntangledImpl
}

export { defineEntangledProperties }