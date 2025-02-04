import { toRaw, getCurrentInstance } from "vue"
import { extendedReactive } from "./extendedReactivity/extendedReactive"
import { isModel } from "./useModel"
import { createExposer } from "./private"

const updateElements = createExposer(value => ({
	get() { return value.value },
	enumerable: true,
	configurable: true
}))
export function useDefineElements(elements) {
	const instance = getCurrentInstance()
	if(instance) {
		const props = toRaw(instance.props)
		const target = isModel(props.modelValue)
			? props.modelValue.elements
			: props.elements
		elements = extendedReactive(elements)
		updateElements(target, elements.refs)
		return elements
	}
}