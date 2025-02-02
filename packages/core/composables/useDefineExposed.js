import { isRef, isReadonly, getCurrentInstance } from "vue"
import { hasModel, createExposer } from "./private"
import { isFunction } from "../utilities"

const updateExposed = createExposer(value => {
	if(isRef(value) && !isReadonly(value)) {
		return {
			get() { return value.value },
			enumerable: true,
			configurable: true
		}
	} else {
		return {
			value,
			writable: false,
			enumerable: !isFunction(value),
			configurable: true
		}
	}
})
export function useDefineExposed(props, exposed) {
	if(getCurrentInstance()) {
		const target = hasModel(props.modelValue)
			? props.modelValue.exposed
			: props.exposed
		updateExposed(target, exposed)
	}
}