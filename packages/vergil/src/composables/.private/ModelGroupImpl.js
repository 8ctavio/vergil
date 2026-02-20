import { triggerRef, markRaw, toRaw } from "vue"
import { isObject, isPlainObject, isFunction } from "#utilities"
import { useModel, isModel } from "#composables/useModel"

/**
 * @import { ShallowRef } from "vue"
 * @import {
 *   Model,
 *   ModelGroup,
 *   ModelSpec,
 *   ModelGroupSpec,
 *   ModelGroupFields,
 *   ModelGroupFieldsConstraint,
 *   ModelGroupValidator,
 *   ModelGroupPayload,
 *   ModelFilter
 * } from "#composables"
 */

export const _isNestedGroup_ = Symbol('isNestedGroup')
export const _validator_ = Symbol('nested-model-group:validator')
export const filterActions = Object.freeze({
	SKIP: false,
	ACCEPT: true,
	ACCEPT_CHILDREN: 1,
	ACCEPT_DESCENDANTS: 2,
})

/**
 * @this { ModelGroupImpl }
 * @param { ModelFilter } [filter]
 * @param { string } [path = '']
 * @param { 0 | 1 | 2 } [clearance = 0]
 * @returns { Generator<[string[], string, string, Model]> }
 */
function* generateModelErrors(filter, path = '', clearance = 0) {
	for (const field of Object.keys(this)) {
		// @ts-expect-error
		const value = /** @type { Model | ModelGroup } */ (this[field])
		const fullPath = (path && (path + ".")) + field
		if (value instanceof ModelGroupImpl) {
			const action = !isFunction(filter) || (clearance === 2 ? 2 : filter(filterActions, fullPath, true, value))
			if (action === 1 || action === 2) {
				yield* generateModelErrors.call(value, filter, fullPath, action)
			} else if (action) {
				yield* generateModelErrors.call(value, filter, fullPath)
			}
		} else {
			const include = !isFunction(filter) || clearance > 0 || filter(filterActions, fullPath, false, value)
			if (include && value.hasErrors) {
				yield [value.errors.value, field, fullPath, value]
			}
		}
	}
}

/**
 * @param { ModelGroupImpl } modelGroup
 * @param { string } path
 * @returns { Model }
 */
function getNestedModel(modelGroup, path) {
	if (typeof path === 'string') {
		/** @type { ModelGroupImpl | Model | null } */
		let model = modelGroup
		for (const field of path.split('.')) {
			if (Object.hasOwn(model, field)) {
				// @ts-expect-error
				model = /** @type { Model | ModelGroupImpl } */ (model[field])
			} else {
				model = null
				break
			}
		}
		if (isModel(model)) return model
	}
	throw new ReferenceError(`No model found at ModelGroup's '${path}' path`)
}

/**
 * @type {{
 *   group: ModelGroupImpl | null,
 *   errorRefs: ShallowRef<string[]>[]
 * }}
 */
const validationGroup = {
	group: null,
	errorRefs: []
}

/** @type { ModelGroupImpl | undefined } */
export let eldestValidatingGroup = undefined

/**
 * @template { ModelGroupFields } [F = {}]
 */
export class ModelGroupImpl {
	/** @type { ModelGroupValidator<F> | undefined } */
	#validator

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, { value: 'ModelGroup' })
	}

	/**
	 * @param { F & ModelGroupFieldsConstraint<F> } fields
	 * @param { ModelGroupValidator<F> } [validator]
	 */
	constructor(fields, validator) {
		if (!isPlainObject(fields)) {
			throw new TypeError(`Argument must be a plain object; received ${Object.prototype.toString.call(fields)}`)
		}

		if (isFunction(validator)) {
			eldestValidatingGroup ??= this
			this.#validator = validator
		}
		try {
			for (const field of Object.keys(fields)) {
				const value = fields[field]
				if (isObject(value)) {
					// @ts-expect-error
					if (Object.hasOwn(value, _isNestedGroup_) && value[_isNestedGroup_] === true) {
						Object.defineProperty(this, field, {
							// @ts-expect-error
							value: new ModelGroupImpl(value, value[_validator_])
						})
					} else {
						const { value: modelValue, formLabel, ...options } = /** @type { ModelSpec } */ (value)
						const model = useModel(modelValue, options)
						if (formLabel) {
							// @ts-expect-error
							Object.defineProperty(model.errors._value, '_formLabel', { value: formLabel })
						}
						Object.defineProperty(this, field, {
							value: model,
							enumerable: true
						})
					}
				}
			}
			markRaw(this)
			Object.preventExtensions(this)
		} finally {
			if (eldestValidatingGroup === this) eldestValidatingGroup = undefined
		}
	}

	/**
	 * @template { ModelGroupFields } F
	 * @param { F & ModelGroupFieldsConstraint<F> } fields
	 * @param { ModelGroupValidator<F> } [validator]
	 */
	static nested(fields, validator) {
		return /** @type { ModelGroupSpec<F> } */ (
			Object.defineProperties(fields, {
				__modelGroup: { value: true },
				__validator: { value: validator }
			})
		)
	}

	reset() {
		for (const field of Object.values(this)) {
			field.reset()
		}
	}

	/**
	 * @overload
	 * @returns { ModelGroupPayload<F> }
	 */
	getPayload() {
		/** @type { ModelGroupPayload } */
		const payload = {}
		for (const field of Object.keys(this)) {
			// @ts-expect-error
			const value = /** @type { Model | ModelGroupImpl } */ (this[field])
			Object.defineProperty(payload, field, {
				value: value instanceof ModelGroupImpl
					? value.getPayload()
					// @ts-expect-error
					: toRaw(value.ref._value),
				enumerable: true
			})
		}
		return payload
	}

	/**
	 * @template { boolean } [IncludePayload = false]
	 * @overload
	 * @param { IncludePayload } [includePayload]
	 * @returns { true extends IncludePayload ? [boolean, ModelGroupPayload<F>] : boolean }
	 */
	
	/**
	 * @overload
	 * @param { boolean } [includePayload]
	 * @returns { boolean | [boolean, ModelGroupPayload] }
	 */
	validate(includePayload = false) {
		let result = true
		const hasValidator = isFunction(this.#validator)
		if (includePayload || hasValidator) {
			if (hasValidator) {
				validationGroup.group ??= this
			}
			try {
				/** @type { ModelGroupPayload } */
				const payload = {}
				for (const field of Object.keys(this)) {
					// @ts-expect-error
					const value = /** @type { Model | ModelGroupImpl } */ (this[field])
					if (isModel(value)) {
						if (validationGroup.group) {
							result = value.validate(true, false) && result
							validationGroup.errorRefs.push(value.errors)
						} else {
							result = value.validate() && result
						}
						Object.defineProperty(payload, field, {
							// @ts-expect-error
							value: toRaw(value.ref._value),
							enumerable: true
						})
					} else {
						const [groupResult, groupPayload] = value.validate(true)
						result &&= groupResult
						Object.defineProperty(payload, field, {
							value: groupPayload,
							enumerable: true
						})
					}
				}
				if (hasValidator) {
					/**
					 * @param { string } path
					 * @param { string } message
					 */
					const error = (path, message) => {
						if (typeof message === 'string' && message) {
							// @ts-expect-error
							getNestedModel(this, path).errors._value.push(message)
							result &&= false
						}
					}
					// @ts-expect-error
					this.#validator(payload, error)
				}
				return includePayload ? [result, payload] : result
			} finally {
				if (validationGroup.group === this) {
					for (const errors of validationGroup.errorRefs) {
						triggerRef(errors)
					}
					validationGroup.group = null
					validationGroup.errorRefs.length = 0
				}
			}
		} else {
			for (const field of Object.values(this)) {
				result = field.validate() && result
			}
			return result
		}
	}

	clear() {
		for (const field of Object.values(this)) {
			field.clear()
		}
	}

	get hasErrors() {
		for (const field of Object.keys(this)) {
			// @ts-expect-error
			if (this[field].hasErrors) return true
		}
		return false
	}

	get isValid() {
		return !this.hasErrors
	}

	/**
	 * @param { (errors: string[], field: string, path: string, model: Model) => void } callback
	 * @param { ModelFilter } [filter]
	 */
	forErrors(callback, filter) {
		for (const args of generateModelErrors.call(this, filter)) {
			callback(...args)
		}
	}
}