import { toRaw, getCurrentInstance, onUnmounted } from "vue"
import { isModel } from "./useModel"
import { isFunction, isPlainObject } from "../utilities"
import { definedInstances, definedExposed, symTrigger, symHasInstance } from "./private"

export function useDefineExposed(source) {
	const instance = getCurrentInstance()
	if(instance && isPlainObject(source)) {
		let instMeta = definedInstances.get(instance)
		if(!instMeta) definedInstances.set(instMeta = {
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