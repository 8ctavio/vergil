import { isRef, markRaw } from 'vue'
import { defineReactiveProperties } from "./utils/extendedReactivity"

/** Defines accessor methods to read and write internally stored refs of automatically unwrapped reactive properties */
export class ExtendedReactive {
	#refs = {}
	constructor() {
		markRaw(this)
		Object.defineProperties(this, {
			getRef: {
				value: (property) => this.#refs[property],
			},
			setRef: {
				value: (property, refProperty) => {
                    if(isRef(refProperty)) this.#refs[property] = refProperty
				},
			},
		})
	}
}

/**
 * Defines additional object properties through descriptors with special ref support.
 * 
 * @template T
 * @param { T | (withDescriptor: function) => T } [properties] - An object, or function that returns an object, whose keys represent the names of the properties to be defined and whose values represent either the properties' (initial) values or descriptors.
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
 */
export function extendedReactive(properties) {
	return defineReactiveProperties(new ExtendedReactive(), properties)
}