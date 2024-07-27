import { toRef, isRef, readonly } from 'vue'
import { ExtendedReactive } from '../extendedReactive'

/**
 * Marks an object as a property descriptor.
 * @param { object } o - Descriptor object to be marked.
 * @returns { object } Marked descriptor object.
 */
function markDescriptor(o){
    return Object.defineProperty(o, '__v_isDescriptor', { value: true })
}
/**
 * Assesses whether an object has been marked as a descriptor.
 * @param { any } value
 * @returns { boolean } `true` if `value` is marked as a descriptor.
 */
function isDescriptor(value){
    return Boolean(value?.__v_isDescriptor)
}

/**
 * Defines additional properties of ExtendedReactive objects. Similar to `Object.defineProperties` but with convenient default descriptors and special support for refs.
 * 
 * @template E
 * @param { ExtendedReactive } object - The ExtededReactive object on which to define properties.
 * @param { E | (withDescriptor: function) => E } [properties] - Extension object or callback that returns extension object. The extension object keys represent the names of the properties to be defined while its values represent the properties' initial values or descriptors.
 * @param { string[] } [ignore] - Array of property keys to be ignored from the extension object.
 * 
 * @returns { ExtendedReactive }
 * 
 * @example
 *  const extended = new ExtendedReactive()
 *  
 *  // Define regular or reactive properties with default descriptors
 *  defineReactiveProperties(extended, {
 *      prop1: 1,
 *      prop2: ref(2)
 *  })
 *  // Reactive properties are unwrapped by default
 *  console.log(extended.prop1) // 1
 *  console.log(extended.prop2) // 2
 * 
 *  // Configure properties
 *  defineReactiveProperties(extended, withDescriptor => ({
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
export function defineReactiveProperties(object, properties = {}, ignore = []){
    if(!object instanceof ExtendedReactive)
        return object
    if(typeof properties === 'function')
        properties = properties(markDescriptor)
    if(typeof properties !== 'object' || properties === null)
        throw new TypeError('Invalid extension properties')

    for(const property in properties){
        if(['__v_skip', 'getRef', 'setRef', ...ignore].includes(property)) continue

        const v = properties[property]
        const descriptor = isDescriptor(v) ? v : { value: v }

        if ('value' in descriptor) {
			const { value } = descriptor
			if (isRef(value)) {
				const { unwrap = true, readonly: isReadOnly = false } = descriptor
				const refProperty = isReadOnly ? readonly(toRef(value)) : toRef(value)
				if (unwrap) {
					object.setRef(property, refProperty)
					const {
						enumerable = true,
						get = function () {
							return object.getRef(property).value
						},
						set = function (v) {
							object.getRef(property).value = v
						},
					} = descriptor
					Object.defineProperty(object, property, {
						enumerable,
						get,
						set,
					})
				} else {
					const { enumerable = true, writable = false } = descriptor
					Object.defineProperty(object, property, {
						enumerable,
						writable,
						value,
					})
				}
			} else if (typeof value === 'function') {
				const { enumerable = true, writable = false } = descriptor
				Object.defineProperty(object, property, {
					enumerable,
					writable,
					value: value.bind(object),
				})
			} else {
				const { enumerable = true, writable = true } = descriptor
				Object.defineProperty(object, property, {
					enumerable,
					writable,
					value,
				})
			}
		} else {
			Object.defineProperty(object, property, descriptor)
		}
    }
    return object
}