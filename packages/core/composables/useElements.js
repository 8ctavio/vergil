import { shallowRef } from "vue"
import { extendedReactive } from "./extendedReactivity/extendedReactive"
import { definedElements, symTrigger, getTrue } from "./private"

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
export function useElements() {
	const dep = shallowRef().dep
	let track = dep.track.bind(dep)
	const elements = extendedReactive({
		[symTrigger]: () => {
			dep.trigger()
			track = undefined
		}
	})
	const elementsProxy = new Proxy(elements.refs, {
		get(target, property) {
			if(typeof property === 'string') {
				track?.()
				const descriptor = Object.getOwnPropertyDescriptor(target, property)
				return descriptor && (Object.hasOwn(descriptor, 'value') || descriptor.get)
					? target[property].value
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
	definedElements.set(elementsProxy, elements)
	return elementsProxy
}