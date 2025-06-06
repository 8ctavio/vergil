import { shallowRef, unref, markRaw } from "vue"
import { definedExposed, symTrigger } from "./internal"
import { getTrue } from "../utilities"

/**
 * @import { Exposed } from '../types'
 */

/**
 * Creates a read-only, shallow-ref-unwrapping object to consume component exposed data. 
 * 
 * @returns { Exposed } A read-only, shallow-ref-unwrapping object to be provided through an `exposed` prop to a component with proper `useExposed` support.
 * 
 * @example
 *  ```vue
 *  <script setup>
 *  const exposed = useExposed()
 *  onMounted(() => {
 *  	// Access component's exposed data
 *  	console.log(exposed.someProperty)
 *  	exposed.someMethod()
 *  })
 *  </script>
 * 
 *  <template>
 *      <!-- Provide `exposed` for component to expose data -->
 *      <Component :exposed/>
 *  </template>
 *  ```
 */
export function useExposed() {
	// @ts-expect-error
	const dep = shallowRef().dep
	const track = dep.track.bind(dep)
	const exposed = markRaw({
		[symTrigger]: dep.trigger.bind(dep)
	})
	const exposedProxy = new Proxy(exposed, {
		/** @param { Record<PropertyKey, unknown> } target */
		get(target, property) {
			if(typeof property === 'string') {
				track()
				const descriptor = Object.getOwnPropertyDescriptor(target, property)
				return descriptor && (Object.hasOwn(descriptor, 'value') || descriptor.get)
					? unref(target[property])
					: undefined
			} else {
				return undefined
			}
		},
		set: getTrue,
		defineProperty: getTrue,
		deleteProperty: getTrue,
		setPrototypeOf: getTrue,
	})
	definedExposed.set(exposedProxy, exposed)
	return exposedProxy
}