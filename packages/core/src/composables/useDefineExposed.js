import { toRaw, getCurrentInstance, onUnmounted } from "vue"
import { definedInstances, definedExposed, symTrigger, symHasInstance } from "#composables"
import { isModel } from "#functions"
import { isFunction, isPlainObject } from "#utilities"

/**
 * Defines component's exposed data.
 * 
 * @param { Record<string, unknown> } source - Plain object whose own enumerable, string-keyed properties are to be exposed.
 * 
 * @example
 *  ```js
 *  defineProps({
 *  	exposed: Object
 *  })
 *  useDefineExposed({
 *  	// Properties to expose
 *  })
 *  ```
 */
export function useDefineExposed(source) {
	const instance = getCurrentInstance()
	if(instance && isPlainObject(source)) {
		let instMeta = definedInstances.get(instance)
		if(!instMeta) definedInstances.set(instance, instMeta = {
			definedElements: false,
			definedExposed: false
		})

		if(!instMeta.definedExposed) {
			const props = toRaw(instance.props)
			const exposedProxy = (isModel(props.modelValue) && props.modelValue.exposed) || props.exposed
			const exposed = definedExposed.get(exposedProxy)
			if(exposed && !exposed[symHasInstance]) {
				instMeta.definedExposed = true
				Object.defineProperty(exposed, symHasInstance, {
					value: true,
					writable: true
				})
				const keys = Object.keys(source)
				for(const key of keys) {
					Object.defineProperty(exposed, key, {
						value: source[key],
						writable: false,
						enumerable: !isFunction(source[key]),
						configurable: true
					})
				}
				exposed[symTrigger]()
				onUnmounted(() => {
					exposed[symHasInstance] = false
					for(const key of keys) {
						Object.defineProperty(exposed, key, {
							value: undefined,
							writable: false,
							enumerable: !isFunction(exposed[key]),
							configurable: true
						})
					}
					exposed[symTrigger]()
				})
			}
		}
	}
}