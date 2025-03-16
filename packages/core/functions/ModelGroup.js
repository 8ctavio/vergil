import { isRef, markRaw, toRaw } from 'vue'
import { useModel } from "../composables"
import { isObject, isPlainObject, isFunction } from "../utilities"

const filterActions = Object.freeze({
	SKIP: false,
	ACCEPT: true,
	ACCEPT_CHILDREN: 1,
	ACCEPT_DESCENDANTS: 2,
})
function* generateModelErrors(filter, path = '', clearance = 0) {
	for(const field of Object.keys(this)) {
		const value = this[field]
		const fullPath = (path && (path + ".")) + field
		if(value instanceof ModelGroup) {
			const action = !isFunction(filter) || (clearance === 2 ? 2 : filter(fullPath, true, filterActions))
			if(action === 1 || action === 2) {
				yield* generateModelErrors.call(value, filter, fullPath, action)
			} else if(action) {
				yield* generateModelErrors.call(value, filter, fullPath)
			}
		} else {
			const include = !isFunction(filter) || clearance > 0 || filter(fullPath, false, filterActions)
			if(include && value.error) {
				yield [value.errors.value, field, fullPath, value]
			}
		}
	}
}

class ModelGroup {
	constructor(fields) {
		if(!isPlainObject(fields)) {
			throw new TypeError(`Argument must be a plain object; received ${Object.prototype.toString.call(fields)}`)
		}
		markRaw(this)
		for(const field of Object.keys(fields)) {
			const value = fields[field]
			if(isObject(value)) {
				if(value instanceof ModelGroup) {
					this[field] = value
				} else {
					const { value: modelValue, formLabel, ...options } = value
					const model = useModel(modelValue, options)
					if(formLabel && isRef(model.errors)) {
						Object.defineProperty(model.errors.value, '_formLabel', { value: formLabel })
					}
					this[field] = model
				}
			}
		}
	}

	getPayload() {
		const payload = {}
		for(const field of Object.keys(this)) {
			const value = this[field]
			Object.defineProperty(payload, field, {
				value: value instanceof ModelGroup
					? value.getPayload()
					: toRaw(value.ref._value),
				enumerable: true
			})
		}
		return payload
	}
	reset() {
		for(const field of Object.keys(this)) {
			this[field].reset()
		}
	}
	validate() {
		let isValid = true
		for(const field of Object.keys(this)) {
			isValid = this[field].validate() && isValid
		}
		return isValid
	}
	clear() {
		for(const field of Object.keys(this)) {
			this[field].clear()
		}
	}
	get error() {
		for(const field of Object.keys(this)) {
			if (this[field].error) return true
		}
		return false
	}
	forErrors(callback, filter) {
		for(const args of generateModelErrors.call(this, filter)) {
			callback(...args)
		}
	}
}
Object.defineProperty(ModelGroup.prototype, Symbol.toStringTag, { value: 'ModelGroup' })

export { ModelGroup }