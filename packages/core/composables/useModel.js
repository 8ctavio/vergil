import { isShallow, triggerRef, customRef, getCurrentInstance, onScopeDispose } from 'vue'
import { useElements, useExposed } from '.'
import { privateModelMap, useResetValue } from './private'
import { extendedRef } from '../reactivity'
import { isModel, markDescriptor, dataDescriptor } from '../functions'
import { groupValidationCtx } from '../functions/ModelGroup'
import { debounce, isFunction, normalizeRef, shallowCopy, looselyEqual, pull, noop, getTrue, uniqueKey } from '../utilities'

const validationError = Object.preventExtensions({})
const getNoop = () => noop
function getError() {
	return this.errors.value.length > 0
}

/**
 * Creates a component model.
 * 
 * @param [value] - Component model's initial value.
 * @param { {
 *      shallow: boolean;
 *      extendRef: boolean;
 *      validator: (
 *          value: T,
 *          error: (msg: string) => void,
 *          checkpoint: () => void
 *      ) => void;
 *      includeElements: boolean;
 *      includeExposed: boolean;
 * } } options -
 *  - `shallow`: Whether to use `shallowRef` for the model's internal `ref` object. Defaults to `false`.
 *  - `extendRef`: If `value` is a ref, whether to use the provided ref itself as the extendedRef's underlying `ref` object. When set to `false`, the `value` ref is instead used as the dynamic source of reset values. When set to `true`, the reset value will be the `value` ref's initial value. Defaults to `false`.
 *  - `validator`: Function to peform model-value validation and collect encountered validation errors.
 *  - `includeExposed`/`includeElements`: Whether to include the `exposed`/`elements` object into the model. Defaults to `false`.
 * 
 * @returns { ExtendedRef }
 */
export function useModel(value, options = {}) {
	if (isModel(value)) return value

	const {
		validator,
		shallow = false,
		extendRef = false,
		includeExposed = false,
		includeElements = false,
	} = options

	let getResetValue
	if (extendRef) {
		value = normalizeRef(value, shallow)
		getResetValue = useResetValue(value.value)
	} else {
		getResetValue = useResetValue(value)
		value = normalizeRef(getResetValue(), shallow)
	}

	let validate = getTrue
	let error, checkpoint
	const cancelHandlers = []

	if (isFunction(validator)) {
		const lastValidation = {
			value: uniqueKey,
			result: undefined,
		}
		validate = (force = false, trigger = true) => {
			const modelValue = model.ref._value
			if (force || !looselyEqual(modelValue, lastValidation.value)) {
				const errors = model.errors._value
				errors.length = 0
				try {
					validator(modelValue, error, checkpoint)
				} catch (error) {
					if (error !== validationError) {
						throw error
					}
				}
				lastValidation.value = shallowCopy(modelValue)
				lastValidation.result = errors.length === 0
			}
			for (const cancel of cancelHandlers) {
				cancel()
			}
			if (trigger) triggerRef(model.errors)
			return lastValidation.result
		}
	}

	const model = extendedRef(value, {
		reset() {
			model.ref.value = getResetValue()
		},
		error: markDescriptor({ get: getError }),
		errors: markDescriptor({
			unwrap: false,
			value: customRef(track => {
				const errors = []
				error = message => {
					if (typeof message === 'string' && message.length > 0) {
						errors.push(message)
					}
				}
				checkpoint = () => {
					if (errors.length > 0) {
						throw validationError
					}
				}
				return {
					get: () => (track(), errors),
					set: noop
				}
			})
		}),
		validate,
		clear() {
			model.errors._value.length = 0
			for (const cancel of cancelHandlers) {
				cancel()
			}
			triggerRef(model.errors)
		},
		__v_isModel: dataDescriptor(true, false, false)
	}, { configurable: false, writable: false })
	/**
	 * Required to force trigger of watcher callbacks
	 * @See https://github.com/vuejs/core/blob/main/packages/reactivity/src/watch.ts#L245
	 */
	model.errors.__v_isShallow = true
	/**
	 * Run ref/errors value getter to initialize _value if it's a customRef
	 * @See https://github.com/vuejs/core/blob/main/packages/reactivity/src/ref.ts#L308
	 */
	model.ref.value
	model.errors.value

	if (includeExposed) {
		Object.defineProperty(model, 'exposed', {
			value: useExposed(),
			enumerable: true
		})
	}
	if (includeElements) {
		Object.defineProperty(model, 'elements', {
			value: useElements(),
			enumerable: true
		})
	}

	let handleValidation = noop
	let useDebouncedValidation = getNoop
	if (isFunction(validator) || groupValidationCtx) {
		let validationTarget, validate
		if (groupValidationCtx) {
			validationTarget = groupValidationCtx.modelGroup
			validate = groupValidationCtx.validate
			handleValidation = groupValidationCtx.handleValidation
		} else {
			validationTarget = model
			validate = model.validate
			handleValidation = (eager = false) => {
				if (eager || model.error) model.validate()
			}
		}
		useDebouncedValidation = (minWait, options) => {
			if (getCurrentInstance()) {
				if (minWait > 0) {
					const debounced = debounce(validate, minWait, options)
					cancelHandlers.push(debounced.cancel)
					onScopeDispose(() => {
						pull(cancelHandlers, cancelHandlers.indexOf(debounced.cancel))
					})
					return (eager = false) => {
						if (eager || validationTarget.error) debounced()
					}
				} else {
					return handleValidation
				}
			}
		}
	}
	privateModelMap.set(model, {
		hasInteractiveCtx: false,
		resetInteractiveCtx: false,
		triggerIfShallow() {
			if (isShallow(model.ref)) {
				triggerRef(model.ref)
			}
		},
		handleValidation,
		useDebouncedValidation
	})

	return model
}