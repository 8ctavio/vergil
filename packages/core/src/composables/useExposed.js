import { shallowRef, unref } from "vue"
import { definedExposed } from "#composables"
import { getTrue } from "#utilities"

/**
 * @import { InternalExposed, Exposed } from '#composables'
 */

/**
 * Creates a read-only, shallow-ref-unwrapping object to consume component exposed data. 
 * 
 * @returns { Exposed } A read-only, shallow-ref-unwrapping object to be provided
 *   through an `exposed` prop to a component with proper `useExposed` support.
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
	const exposedRef = /** @type { InternalExposed } */ (shallowRef({}))
	const exposedProxy = new Proxy(exposedRef, {
		get(target, property) {
			if (typeof property === 'string') {
				const exposed = target.value
				const descriptor = Object.getOwnPropertyDescriptor(exposed, property)
				return descriptor && (Object.hasOwn(descriptor, 'value') || Object.hasOwn(descriptor, 'get'))
					? unref(exposed[property])
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
	definedExposed.set(exposedProxy, exposedRef)
	return exposedProxy
}