import { triggerRef, markRaw, toRaw } from 'vue'
import { useModel, isModel } from "../composables"
import { isObject, isPlainObject, isFunction } from "../utilities"

let validationData = null
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
			const action = !isFunction(filter) || (clearance === 2 ? 2 : filter(filterActions, fullPath, true, value))
			if(action === 1 || action === 2) {
				yield* generateModelErrors.call(value, filter, fullPath, action)
			} else if(action) {
				yield* generateModelErrors.call(value, filter, fullPath)
			}
		} else {
			const include = !isFunction(filter) || clearance > 0 || filter(filterActions, fullPath, false, value)
			if(include && value.error) {
				yield [value.errors.value, field, fullPath, value]
			}
		}
	}
}
function getNestedModel(modelGroup, path) {
	if (typeof path === 'string') {
		let model = modelGroup
		for(const field of path.split('.')) {
			if(Object.hasOwn(model, field)) {
				model = model[field]
			} else {
				model = null
				break
			}
		}
		if (isModel(model)) return model
	}
	throw new ReferenceError(`No model found at ModelGroup's '${path}' path`)
}

export let groupValidationCtx

/**
 * Creates a collection of component models
 */
export class ModelGroup {
	#validator
	#isValid

	constructor(fields, validator) {
		if(!isPlainObject(fields)) {
			throw new TypeError(`Argument must be a plain object; received ${Object.prototype.toString.call(fields)}`)
		}

		let shouldCleanup = false
		if(isFunction(validator)) {
			if (!groupValidationCtx) {
				groupValidationCtx = {
					modelGroup: this,
					validate: this.validate.bind(this),
					handleValidation: (eager = false) => {
						if (eager || this.error) this.validate()
					}
				}
				shouldCleanup = true
			}
			this.#validator = validator
			this.#isValid = path => getNestedModel(this, path).errors._value.length === 0
		}
		try {
			for(const field of Object.keys(fields)) {
				const value = fields[field]
				if(isObject(value)) {
					if(Object.hasOwn(value, '__modelGroup') && value.__modelGroup) {
						const { __validator, ...nestedFields } = value
						this[field] = new ModelGroup(nestedFields, __validator)
					} else {
						const { value: modelValue, formLabel, ...options } = value
						const model = useModel(modelValue, options)
						if(formLabel) {
							Object.defineProperty(model.errors._value, '_formLabel', { value: formLabel })
						}
						this[field] = model
					}
				}
			}
			markRaw(this)
			Object.freeze(this)
		} finally {
			if (shouldCleanup) groupValidationCtx = undefined
		}
	}

	static nested(fields, validator) {
		return Object.defineProperties(fields, {
			__modelGroup: { value: true },
			__validator: { value: validator }
		})
	}

	reset() {
		for(const field of Object.keys(this)) {
			this[field].reset()
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
	validate(includePayload = false) {
		let result = true
		const hasValidator = isFunction(this.#validator)
		if(includePayload || hasValidator) {
			let shouldCleanup = false
			if(hasValidator && !validationData) {
				shouldCleanup = true
				validationData = {
					shouldForce: true,
					shouldTrigger: false,
					refsToTrigger: []
				}
			}
			try {
				const payload = {}
				for(const field of Object.keys(this)) {
					const value = this[field]
					if(value instanceof ModelGroup) {
						const [groupResult, groupPayload] = value.validate(true)
						result &&= groupResult
						Object.defineProperty(payload, field, {
							value: groupPayload,
							enumerable: true
						})
					} else {
						if(validationData) {
							result = value.validate(validationData.shouldForce, validationData.shouldTrigger) && result
							validationData.refsToTrigger.push(value.errors)
						} else {
							result = value.validate() && result
						}
						Object.defineProperty(payload, field, {
							value: toRaw(value.ref._value),
							enumerable: true
						})
					}
				}
				if(hasValidator) {
					const error = (path, message) => {
						if(typeof message === 'string' && message.length > 0) {
							getNestedModel(this, path).errors._value.push(message)
							result &&= false
						}
					}
					this.#validator(payload, error, this.#isValid)
				}
				return includePayload ? [result, payload] : result
			} finally {
				if(shouldCleanup) {
					for(const errors of validationData.refsToTrigger) {
						triggerRef(errors)
					}
					validationData = null
				}
			}
		} else {
			for(const field of Object.keys(this)) {
				result = this[field].validate() && result
			}
			return result
		}
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