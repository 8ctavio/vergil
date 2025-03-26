import { toRaw, shallowRef, getCurrentInstance, onUnmounted } from "vue"
import { entangled } from "../reactivity"
import { isModel } from "../functions"
import { isFunction } from "../utilities"
import { definedInstances, definedElements, symTrigger, symHasInstance } from "./private"

/**
 * Defines component's exposed element property names and creates corresponding shallowRefs to reference exposed HTML elements.
 * 
 * @param { string[] } keys - String array whose elements represent exposed element property names.
 * 
 * @example
 *  ```vue
 *  <script setup>
 *  defineProps({
 *  	elements: Object
 *  })
 *  const elements = useDefineElements(['root', 'input'])
 *  onMounted(() => {
 *  	console.log(elements.root) // HTMLDivElement
 *  	console.log(elements.input) // HTMLInputElement
 *  })
 *  </script>
 * 
 *  <template>
 *  	<!-- Reference exposed elements with `ref` attribute -->
 *  	<div :ref="elements.getRef('root')">
 *  		<input :ref="elements.getRef('input')"/>
 *  	</div>
 *  </template>
 *  ```
 */
export function useDefineElements(keys) {
	const instance = getCurrentInstance()
	if(instance && Array.isArray(keys)) {
		let instMeta = definedInstances.get(instance)
		if (!instMeta) definedInstances.set(instMeta = {
			definedElements: false,
			definedExposed: false
		})

		if (!instMeta.definedElements) {
			const props = toRaw(instance.props)
			const elementsProxy = (isModel(props.modelValue) && props.modelValue.elements) || props.elements
			const elements = definedElements.get(elementsProxy) ?? entangled()
			if (!elements[symHasInstance]) {
				instMeta.definedElements = true
				if (Object.hasOwn(elements, symHasInstance)) {
					elements[symHasInstance] = true
				} else {
					Object.defineProperty(elements, symHasInstance, {
						value: true,
						writable: true
					})

					const extension = {}
					for(const key of keys) {
						if (typeof key === 'string' && key !== '__v_skip') {
							extension[key] = shallowRef(false)
						}
					}
					elements.extend(extension, { defaults: false })
					if(isFunction(elements[symTrigger])) {
						elements[symTrigger]()
						delete elements[symTrigger]
					}
					Object.seal(elements)
				}
				onUnmounted(() => {
					elements[symHasInstance] = false
				})
				return elements
			}
		}
	}
	return null
}