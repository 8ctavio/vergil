import { toRaw, useTemplateRef, getCurrentInstance, onUnmounted } from "vue"
import { isModel } from "./useModel"
import { isPlainObject } from "../utilities"

const definedElements = new WeakSet()
export function useDefineElements(keys) {
	const instance = getCurrentInstance()
	if(instance && !definedElements.has(instance) && Array.isArray(keys)) {
		definedElements.add(instance)

		const props = toRaw(instance.props)
		const target = (isModel(props.modelValue) && props.modelValue.elements) || props.elements
		const isValidTarget = isPlainObject(target)
		let aux = isValidTarget ? target : {}

		const elements = {}
		for(const key of keys) {
			const element = useTemplateRef(key)
			Object.defineProperty(elements, key, {
				get() { return element._value },
				enumerable: true,
			})
			Object.defineProperty(aux, key, {
				get() { return element._value },
				enumerable: true,
				configurable: true
			})
		}
		aux = undefined

		onUnmounted(() => {
			definedElements.delete(instance)
			if(isValidTarget) {
				for(const key of keys) {
					Object.defineProperty(target, key, {
						value: undefined,
						writable: false,
						enumerable: true,
						configurable: true
					})
				}
			}
		})
		
		return elements
	}
}