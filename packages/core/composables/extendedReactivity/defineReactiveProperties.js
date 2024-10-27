import { isRef, readonly } from 'vue'
import { isExtendedReactive, isExtendedRef } from '.'

/**
 * Marks an object as a property descriptor.
 * @param { object } o - Descriptor object to be marked.
 * @returns { object } Marked descriptor object.
 */
function markDescriptor(o) {
    return Object.defineProperty(o, '__v_isDescriptor', { value: true })
}
/**
 * Assesses whether an object has been marked as a descriptor.
 * @param { any } value
 * @returns { boolean } `true` if `value` is marked as a descriptor.
 */
function isDescriptor(value) {
    return Boolean(value?.__v_isDescriptor)
}

/**
 * Defines object properties similar to `Object.defineProperties` but with convenient default descriptors, special support for `extendedReactive` and `extendedRef` objects, and additional features for ref properties.
 * 
 * @template T
 * @param { object } object - The object on which to define properties.
 * @param { T | (withDescriptor: function) => T } [properties] - An object, or function that returns an object, whose keys represent the names or symbols of the properties to be defined and whose values represent either the properties' (initial) values or descriptors.
 * @param { object } [options] - Additional options.
 * @param { string[] } [options.ignore] - Array of property keys to be ignored from the properties object.
 * @param { boolean } [options.configurable] - Default value for data descriptors' `configurable` option. Defaults to `true`.
 * 
 * @returns { object }
 * 
 * @example
 *  // Define regular or reactive properties with default descriptors
 *  const obj = defineReactiveProperties({}, {
 *      prop1: 1,
 *      prop2: ref(2)
 *  })
 *  // Reactive properties are unwrapped by default
 *  console.log(obj.prop1) // 1
 *  console.log(obj.prop2) // 2
 * 
 *  // Configure properties
 *  defineReactiveProperties(obj, withDescriptor => ({
 *      prop3: 3,
 *      prop4: withDescriptor({
 *          value: 4,
 *          enumerable: false,
 *          writable: false
 *      }),
 *      prop5: withDescriptor({
 *          value: ref(5),
 *          unwrap: false,
 *          readonly: true
 *      })
 *  }))
 */
export function defineReactiveProperties(object, properties = {}, options = {}){
    if(typeof object !== 'object' || object === null)
        throw new TypeError('Invalid object')
    if(typeof properties === 'function')
        properties = properties(markDescriptor)
    if(typeof properties !== 'object' || properties === null)
        throw new TypeError('Invalid properties object')

	const {
		ignore = [],
		configurable: dataConfigurable = true,
	} = options

	if(isExtendedReactive(object)) ignore.push('__v_skip', 'refs')
	if(isExtendedRef(object)) ignore.push('ref', 'value')

    for(const property of [...Object.getOwnPropertyNames(properties), ...Object.getOwnPropertySymbols(properties)]){
        if(ignore.includes(property)) continue

        const v = properties[property]
        const descriptor = isDescriptor(v) ? v : { value: v }

        if ('value' in descriptor) {
			const { value, configurable = dataConfigurable } = descriptor
			const customDescriptor = { configurable }
			if (isRef(value)) {
				customDescriptor.enumerable = descriptor.enumerable ?? (typeof property !== 'symbol')
				const { unwrap = true, readonly: isReadOnly = false } = descriptor
				const refProperty = isReadOnly ? readonly(value) : value
				if (unwrap) {
					if(isExtendedReactive(object)) {
						Object.defineProperty(object.refs, property, {
							value: refProperty,
							enumerable: true
						})
					}
					customDescriptor.get = descriptor.get ?? (() => refProperty.value)
					customDescriptor.set = descriptor.set ?? (v => refProperty.value = v)
				} else {
					customDescriptor.writable = descriptor.writable ?? false
					customDescriptor.value = refProperty
				}
			} else if (typeof value === 'function') {
				customDescriptor.enumerable = descriptor.enumerable ?? false
				customDescriptor.writable = descriptor.writable ?? false
				customDescriptor.value = value
			} else {
				customDescriptor.enumerable = descriptor.enumerable ?? (typeof property !== 'symbol')
				customDescriptor.writable = descriptor.writable ?? true
				customDescriptor.value = value
			}
			Object.defineProperty(object, property, customDescriptor)
		} else {
			Object.defineProperty(object, property, descriptor)
		}
    }
    return object
}