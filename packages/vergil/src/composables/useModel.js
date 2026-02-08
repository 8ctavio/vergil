import { ref, shallowRef, customRef, triggerRef, isRef, isShallow, toValue, toRef, toRaw, getCurrentInstance, onScopeDispose } from 'vue'
import { useElements, useExposed, useResetValue, privateModelMap, groupValidationCtx } from '#composables'
import { extendedRef } from '#reactivity'
import { isObject, isFunction, markDescriptor, dataDescriptor, debounce, pull, shallowCopy, looselyEqual, uniqueKey, noop, getTrue } from '#utilities'

/**
 * Assesses whether a value is a model created by `useModel`.
 * 
 * @param { unknown } value
 * @param { boolean } [self = false] - When set to `true`, ensures that `value` is a model created by `useModel`, as opposed to an object that extends a model. Defaults to `false`.
 * @returns { value is Model }
 */
export function isModel(value, self = false) {
	return isObject(value)
		&& (!self || Object.hasOwn(value, '__v_isModel'))
		&& /** @type { Record<string, unknown> } */(value).__v_isModel === true
}

/**
 * @import { Ref, MaybeRefOrGetter } from 'vue'
 * @import { Model, ModelOptions } from '#composables'
 * @import { UnwrapRefOrGetter } from '#reactivity'
 */

/** @type { (value: unknown) => unknown } */
const getterToRef = value => isFunction(value) ? toRef(value) : value

const validationError = Object.preventExtensions({})
const getNoop = () => noop

/** @this { Model } */
function hasErrors() {
	return this.errors.value.length > 0
}
/** @this { Model } */
function isValid() {
	return !hasErrors.call(this)
}

/**
 * Creates a component model.
 * @overload
 * @returns { Model<undefined, false, false, false> }
 */

/**
 * Creates a component model.
 * @template { ExtendRef extends true ? Ref : MaybeRefOrGetter } T
 * @template { boolean } [Shallow = false]
 * @template { boolean } [ExtendRef = false]
 * @template { boolean } [IncludeExposed = false]
 * @template { boolean } [IncludeElements = false]
 * @overload
 * @param { T } value Component model's initial value.
 * @param { ModelOptions<UnwrapRefOrGetter<T>, Shallow, ExtendRef, IncludeExposed, IncludeElements> } [options] Model options object.
 * @returns { Model<
 *     ExtendRef extends true ? T : UnwrapRefOrGetter<T>,
 *     Shallow,
 *     IncludeExposed,
 *     IncludeElements
 * > }
 */

/**
 * @param { MaybeRefOrGetter<unknown> } [value]
 * @param { ModelOptions } [options]
 * 
 * @returns { Model }
 */
export function useModel(value, options = {}) {
	if (isModel(value)) return value

	const initialValue = toRaw(toValue(value))
	const extendRef = options.extendRef && isRef(value)
	const modelRef = extendRef ? value : (options.shallow ? shallowRef : ref)(initialValue)
	const resetValue = ('resetValue' in options)
		? getterToRef(options.resetValue)
		: extendRef ? initialValue : getterToRef(value)

	const {
		validator,
		cloneResetValue = !isRef(resetValue),
		includeExposed = false,
		includeElements = false,
	} = options

	const getResetValue = useResetValue(resetValue, cloneResetValue)
	
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
	
	const model = extendedRef(modelRef, {
		reset() {
			modelRef.value = getResetValue()
		},
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
		hasErrors: markDescriptor({ get: hasErrors }),
		isValid: markDescriptor({ get: isValid }),
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
	 * @see https://github.com/vuejs/core/blob/main/packages/reactivity/src/watch.ts#L245
	 */
	// @ts-expect-error
	model.errors.__v_isShallow = true
	/**
	 * Run ref/errors value getter to initialize _value if it's a customRef
	 * @see https://github.com/vuejs/core/blob/v3.5.24/packages/reactivity/src/ref.ts#L308
	 */
	model.ref.value // oxlint-disable-line no-unused-expressions
	model.errors.value // oxlint-disable-line no-unused-expressions

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
				if (eager || model.hasErrors) model.validate()
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
						if (eager || validationTarget.hasErrors) debounced()
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