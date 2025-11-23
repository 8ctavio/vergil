import { toRaw, shallowRef, getCurrentInstance, onUnmounted } from "vue"
import { componentInstanceMap, definedElements, _trigger_, _hasComponent_ } from "#composables"
import { entangled } from "#reactivity"
import { isModel } from "#functions"
import { isFunction } from "#utilities"

/**
 * @import { ShallowRef } from 'vue'
 * @import { Entangled } from '#reactivity'
 * @import { InternalElements } from '#composables'
 */

/**
 * @template { string } K
 * @overload
 * @param { K[] } keys
 * @returns { Entangled<Record<K, ShallowRef<HTMLElement | null>>> }
 */

/**
 * Defines component's exposed element property names and creates corresponding shallowRefs to reference exposed HTML elements.
 * 
 * @param { readonly string[] } keys - String array whose elements represent exposed element property names.
 * @returns { Entangled<Record<string, ShallowRef<HTMLElement | null>>> | null }
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
	if (instance && Array.isArray(keys)) {
		let instMeta = componentInstanceMap.get(instance)
		if (!instMeta) componentInstanceMap.set(instance, instMeta = {
			definedElements: false,
			definedExposed: false
		})

		if (!instMeta.definedElements) {
			const props = toRaw(instance.props)
			const elementsProxy = (isModel(props.modelValue) && props.modelValue.elements) || props.elements
			const elements = /** @type { InternalElements } */ (definedElements.get(/**@type {object}*/(elementsProxy)) ?? entangled())
			if (!elements[_hasComponent_]) {
				instMeta.definedElements = true
				if (Object.hasOwn(elements, _hasComponent_)) {
					elements[_hasComponent_] = true
				} else {
					Object.defineProperty(elements, _hasComponent_, {
						value: true,
						writable: true
					})

					/** @type { Record<string, ShallowRef<HTMLElement | null>> } */
					const extension = {}
					for (const key of keys) {
						if (typeof key === 'string' && key !== '__v_skip') {
							extension[key] = shallowRef(null)
						}
					}
					elements.extend(extension, { defaults: false })
					if (isFunction(elements[_trigger_])) {
						elements[_trigger_]()
						delete elements[_trigger_]
					}
					Object.seal(elements)
				}
				onUnmounted(() => {
					elements[_hasComponent_] = false
				})
				return elements
			}
		}
	}
	return null
}