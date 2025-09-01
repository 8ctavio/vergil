import { isShallow, triggerRef, customRef, getCurrentInstance, onScopeDispose } from 'vue'
import { useElements, useExposed, useResetValue, privateModelMap, groupValidationCtx } from '#composables'
import { extendedRef } from '#reactivity'
import { isModel, markDescriptor, dataDescriptor } from '#functions'
import { debounce, isFunction, normalizeRef, shallowCopy, looselyEqual, pull, noop, getTrue, uniqueKey } from '#utilities'

/**
 * @import { Ref, UnwrapRef, MaybeRefOrGetter } from 'vue'
 * @import { Model, ModelOptions } from '#types'
 */

const validationError = Object.preventExtensions({})
const getNoop = () => noop

/** @this { Model } */
function getError() {
	return this.errors.value.length > 0
}

/**
 * @template { MaybeRefOrGetter<unknown> } T
 * @template { boolean } [Shallow = false]
 * @template { boolean } [ExtendRef = false]
 * @template { boolean } [IncludeExposed = false]
 * @template { boolean } [IncludeElements = false]
 * @overload
 * @param { T } [value]
 * @param { ModelOptions<UnwrapRef<T>, Shallow, ExtendRef, IncludeExposed, IncludeElements> } [options = {}]
 * @returns { Model<
 *     ExtendRef extends true ? T : UnwrapRef<T>,
 *     Shallow,
 *     IncludeExposed,
 *     IncludeElements
 * > }
 */

/**
 * Creates a component model.
 * 
 * @param { MaybeRefOrGetter<unknown> } [value] - Component model's initial value.
 * @param { object } [options = {}]
 * @param { boolean } [options.shallow = false] - Whether to use `shallowRef` for the model's internal `ref` object. Defaults to `false`.
 * @param { boolean } [options.extendRef = false] - If `value` is a ref, whether to use the provided ref itself as the extendedRef's underlying `ref` object. When set to `false`, the `value` ref is instead used as the dynamic source of reset values. When set to `true`, the reset value will be the `value` ref's initial value. Defaults to `false`.
 * @param { (
 *     value: unknown,
 *     error: (msg: string) => void,
 *     checkpoint: () => void
 * ) => void } [options.validator] - Function to peform model-value validation and collect encountered validation errors.
 * @param { boolean } [options.includeExposed = false] - Whether to include the `exposed` object into the model. Defaults to `false`.
 * @param { boolean } [options.includeElements = false] - Whether to include the `elements` object into the model. Defaults to `false`.
 * 
 * @returns { Model }
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
		getResetValue = useResetValue(/** @type { Ref } */(value).value)
	} else {
		getResetValue = useResetValue(value)
		value = normalizeRef(getResetValue(), shallow)
	}

	/** @type { (force?: boolean, trigger?: boolean) => boolean } */
	let validate = getTrue
	/** @type { (msg: string) => void } */
	let error
	/** @type { () => void } */
	let checkpoint
	/** @type { (() => void)[] } */
	const cancelHandlers = []

	if (isFunction(validator)) {
		const lastValidation = {
			value: uniqueKey,
			result: false,
		}
		validate = (force = false, trigger = true) => {
			// @ts-expect-error
			const modelValue = model.ref._value
			if (force || !looselyEqual(modelValue, lastValidation.value)) {
				// @ts-expect-error
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
			unwrap: /** @type { const } */ (false),
			value: customRef(track => {
				/** @type { string[] } */
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
			// @ts-expect-error
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
	// @ts-expect-error
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
	/** @type { (minWait: number, options?: object) => unknown } */
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