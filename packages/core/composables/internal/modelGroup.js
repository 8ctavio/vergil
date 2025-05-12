import { triggerRef, markRaw, toRaw } from 'vue'
import { useModel } from '../../composables'
import { isModel } from '../../functions'
import { isObject, isPlainObject, isFunction } from "../../utilities"

/**
 * @import { ShallowRef } from 'vue'
 * @import { ModelGroup, ModelGroupFields, ModelGroupSpec, ModelSpec, ModelGroupPayload, ModelGroupValidator, Model } from '../../types'
 */

/**
 * @typedef { typeof filterActions } FilterActions
 * @typedef {(
 *     (
 *         actions: FilterActions,
 *         path: string,
 *         isGroup: boolean,
 *         value: Model | ModelGroupImpl
 *     ) => FilterActions[keyof FilterActions]
 * )} ModelFilter
 */

/**
 * @type { null | {
 *     shouldForce: boolean;
 *     shouldTrigger: boolean;
 *     refsToTrigger: ShallowRef<string[]>[]
 * } }
 */
let validationData = null

const filterActions = Object.freeze({
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
		const value = /** @type { Model | ModelGroupImpl } */ (this[field])
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
			if (include && value.error) {
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
 * @type { undefined | {
 *     modelGroup: ModelGroupImpl;
 *     validate: ModelGroupImpl['validate'];
 *     handleValidation: (eager?: boolean) => void;
 * } }
 */
export let groupValidationCtx

export class ModelGroupImpl {
	#validator
	#isValid

	/**
	 * @param { ModelGroupFields } fields
	 * @param { ModelGroupValidator } [validator]
	 */
	constructor(fields, validator) {
		if (!isPlainObject(fields)) {
			throw new TypeError(`Argument must be a plain object; received ${Object.prototype.toString.call(fields)}`)
		}

		let shouldCleanup = false
		if (isFunction(validator)) {
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
			/** @param { string } path */
			// @ts-expect-error
			this.#isValid = path => getNestedModel(this, path).errors._value.length === 0
		}
		try {
			for (const field of Object.keys(fields)) {
				const value = fields[field]
				if (isObject(value)) {
					if (Object.hasOwn(value, '__modelGroup') && /** @type { ModelGroupSpec } */ (value).__modelGroup === true) {
						const { __validator, ...nestedFields } = /** @type { ModelGroupSpec } */ (value)
						// @ts-expect-error
						this[field] = new ModelGroupImpl(nestedFields, __validator)
					} else {
						const { value: modelValue, formLabel, ...options } = /** @type { ModelSpec } */ (value)
						const model = useModel(modelValue, options)
						if (formLabel) {
							// @ts-expect-error
							Object.defineProperty(model.errors._value, '_formLabel', { value: formLabel })
						}
						// @ts-expect-error
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

	reset() {
		for (const field of Object.keys(this)) {
			// @ts-expect-error
			this[field].reset()
		}
	}

	/**
	 * @template { ModelGroupFields } F
	 * @overload
	 * @this { ModelGroup<F> }
	 * @returns { ModelGroupPayload<F> }
	 */

	/**
	 * @overload
	 * @returns { ModelGroupPayload }
	 */
	getPayload() {
		/** @type { Record<string, unknown> } */
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
	 * @template { ModelGroupFields } F
	 * @template { boolean } [IncludePayload = false]
	 * @template { boolean } [HasValidator = false]
	 * @overload
	 * @this { ModelGroup<F, HasValidator> }
	 * @param { IncludePayload } [includePayload]
	 * @returns {(
	 *     true extends IncludePayload | HasValidator ? [boolean, ModelGroupPayload<F>] : boolean
	 * )}
	 */

	/**
	 * @template { boolean } [IncludePayload = false]
	 * @overload
	 * @param { IncludePayload } [includePayload]
	 * @returns {(
	 *     true extends IncludePayload ? [boolean, ModelGroupPayload] : boolean
	 * )}
	 */
	validate(includePayload = false) {
		let result = true
		const hasValidator = isFunction(this.#validator)
		if (includePayload || hasValidator) {
			let shouldCleanup = false
			if (hasValidator && !validationData) {
				shouldCleanup = true
				validationData = {
					shouldForce: true,
					shouldTrigger: false,
					refsToTrigger: []
				}
			}
			try {
				/** @type { ModelGroupPayload } */
				const payload = {}
				for (const field of Object.keys(this)) {
					// @ts-expect-error
					const value = /** @type { Model | ModelGroupImpl } */ (this[field])
					if (value instanceof ModelGroupImpl) {
						const [groupResult, groupPayload] = value.validate(true)
						result &&= groupResult
						Object.defineProperty(payload, field, {
							value: groupPayload,
							enumerable: true
						})
					} else {
						if (validationData) {
							result = value.validate(validationData.shouldForce, validationData.shouldTrigger) && result
							validationData.refsToTrigger.push(value.errors)
						} else {
							result = value.validate() && result
						}
						Object.defineProperty(payload, field, {
							// @ts-expect-error
							value: toRaw(value.ref._value),
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
						if (typeof message === 'string' && message.length > 0) {
							// @ts-expect-error
							getNestedModel(this, path).errors._value.push(message)
							result &&= false
						}
					}
					/** @type { ModelGroupValidator } */(this.#validator)(payload, error, /** @type { (path: string) => boolean } */ (this.#isValid))
				}
				return includePayload ? [result, payload] : result
			} finally {
				if (shouldCleanup) {
					for (const errors of /** @type { Exclude<typeof validationData, null> } */ (validationData).refsToTrigger) {
						triggerRef(errors)
					}
					validationData = null
				}
			}
		} else {
			for (const field of Object.keys(this)) {
				// @ts-expect-error
				result = this[field].validate() && result
			}
			return result
		}
	}

	clear() {
		for (const field of Object.keys(this)) {
			// @ts-expect-error
			this[field].clear()
		}
	}
	get error() {
		for (const field of Object.keys(this)) {
			// @ts-expect-error
			if (this[field].error) return true
		}
		return false
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
Object.defineProperty(ModelGroupImpl.prototype, Symbol.toStringTag, { value: 'ModelGroup' })