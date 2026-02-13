import { shallowRef } from "vue"
import { entangled } from "#reactivity"
import { getTrue } from "#utilities"
import { definedElements, _trigger_ } from "#composables/.private/constants"

/**
 * @import { Elements } from '#composables'
 */

/**
 * @TODO add functions for the update handler methods
 * to display a warning message during development
 * 
 * @NOTE A proxy is required so that effects are able to track a custom
 * dependency whenever a property is read, even if the target's properties
 * have not yet been defined. The custom dependency is then triggered when
 * properties get defined inside useDefinedElements, thus, allowing the
 * effects to track the actual element refs.
 * 		In order not to use a Proxy, properties for the `elements` object
 * must be defined beforehand in useElements. Then, an object with getters
 * could be used instead of a proxy (ideally, however, javascript getters
 * would pass the property name as an argument, so that a single getter
 * function can be shared between all property descriptors).
 * 		To achieve this, `useElements` should also accept a custom component-
 * identifier to then retrieve a template to define the elements' properties.
 * Custom components that support useElements and useDefinedElements must,
 * therefore, provide and comply with such a template.
 * 
 * @example
 * ```js
 * import { InputText } from 'vergil'
 * const elements = useElements(InpuText)
 * ```
 */

/**
 * Creates a read-only, shallow-ref-unwrapping object to consume component-exposed HTML elements. 
 * 
 * @returns { Elements } A read-only, shallow-ref-unwrapping object to be provided through an `elements` prop to a component with proper `useElements` support.
 * 
 * @example
 *  ```vue
 *  <script setup>
 *  const elements = useElements()
 *  onMounted(() => {
 *  	// Access component's exposed elements
 *  	console.log(elements.someHTMLElement)
 *  })
 *  </script>
 * 
 *  <template>
 *      <!-- Provide `elements` for component to expose elements -->
 *      <Component :elements/>
 *  </template>
 *  ```
 */
export function useElements() {
	// @ts-expect-error
	const dep = shallowRef().dep
	let track = dep.track.bind(dep)
	const elements = entangled({
		[_trigger_]() {
			dep.trigger()
			track = undefined
		}
	}, { writable: false, enumerable: false })
	const elementsProxy = new Proxy(/** @type { Elements } */(/** @type { unknown } */ (elements)), {
		get(target, property) {
			if (typeof property === 'string') {
				track?.()
				return target[property] ?? null
			} else {
				return null
			}
		},
		set: getTrue,
		defineProperty: getTrue,
		deleteProperty: getTrue,
		setPrototypeOf: getTrue,
	})
	definedElements.set(elementsProxy, elements)
	return elementsProxy
}