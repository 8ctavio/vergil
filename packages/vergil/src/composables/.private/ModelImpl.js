import { ref, shallowRef, customRef, triggerRef, isRef, isShallow, toValue, toRef, toRaw, getCurrentInstance, onScopeDispose } from 'vue'
import { ExtendedRefImpl } from '#reactivity'
import { isFunction, debounce, pull, shallowCopy, looselyEqual, uniqueKey, noop } from '#utilities'
import { useExposed } from '#composables/useExposed'
import { useElements } from '#composables/useElements'
import { useResetValue } from '#composables/.internal/useResetValue'
import { groupValidationCtx } from '#composables/.private/ModelGroupImpl'

/**
 * @import { ShallowRef, Ref, MaybeRefOrGetter } from 'vue'
 * @import { ModelOptions } from '#composables'
 * @import { UnwrapRefOrGetter } from '#reactivity'
 */

export const privateModelMap = new WeakMap()

/** @type { (value: unknown) => unknown } */
const getterToRef = value => isFunction(value) ? toRef(value) : value
const getNoop = () => noop
const validationError = Object.preventExtensions({})

/**
 * @template { MaybeRefOrGetter } [T = unknown]
 * @template { boolean } [Shallow = false]
 * @template { boolean } [ExtendRef = false]
 * @extends { ExtendedRefImpl<
 *   (ExtendRef | (T extends Ref ? true : false)) extends true ? T
 *   : Shallow extends true ? ShallowRef<UnwrapRefOrGetter<T>> : Ref<UnwrapRefOrGetter<T>>
 * > }
 */
export class ModelImpl extends ExtendedRefImpl {
	/** @type { ShallowRef<string[]> } */
	errors = /** @type { any } */(undefined)

	#getResetValue
	#validationContext
	/** @type { string[] } */
	#errors = []
	/** @type { (() => void)[] } */
	#cancelHandlers = []

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, { value: 'Model' })
	}

	/**
	 * @param { T } value
	 * @param { ModelOptions<UnwrapRefOrGetter<T>, Shallow, ExtendRef> } [options]
	 */
	constructor(value, options = {}) {
		const initialValue = toRaw(toValue(value))
		const extendRef = options.extendRef && isRef(value)
		const modelRef = extendRef ? value : (options.shallow ? shallowRef : ref)(initialValue)

		// @ts-expect-error
		super(modelRef)
		
		const resetValue = options.resetValue
			? getterToRef(options.resetValue)
			: extendRef ? initialValue : getterToRef(value)
		const {
			validator,
			cloneResetValue = !isRef(resetValue),
			includeExposed = false,
			includeElements = false,
		} = options

		this.#getResetValue = useResetValue(resetValue, cloneResetValue)

		if (isFunction(validator)) {
			this.#validationContext = {
				validator,
				/** @type { (msg: string) => void } */
				error: message => {
					if (typeof message === 'string' && message) {
						this.#errors.push(message)
					}
				},
				checkpoint: () => {
					if (this.#errors.length > 0) {
						throw validationError
					}
				},
				lastValidation: {
					/** @type { unknown } */
					value: uniqueKey,
					result: false
				}
			}
		}

		/** @type { PropertyDescriptorMap } */
		const descriptorMap = {
			errors: {
				value: customRef(track => ({
					get: () => (track(), this.#errors),
					set: noop
				})),
				writable: false,
				enumerable: true,
				configurable: false,
			},
			__isModel: { value: true }
		}

		if (includeExposed) {
			descriptorMap.exposed = {
				value: useExposed(),
				enumerable: true
			}
		}
		if (includeElements) {
			descriptorMap.elements = {
				value: useElements(),
				enumerable: true
			}
		}

		Object.defineProperties(this, descriptorMap)

		/**
		 * Required to force trigger of watcher callbacks
		 * @see https://github.com/vuejs/core/blob/v3.6.0-beta.5/packages/reactivity/src/watch.ts#L224
		 */
		// @ts-expect-error
		this.errors.__v_isShallow = true
		/**
		 * Run ref value getter to initialize _value if it's a customRef
		 * @see https://github.com/vuejs/core/blob/v3.6.0-beta.5/packages/reactivity/src/ref.ts#L371
		 */
		this.ref.value // oxlint-disable-line no-unused-expressions

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
				validationTarget = this
				validate = () => this.validate()
				handleValidation = (eager = false) => {
					if (eager || this.hasErrors) this.validate()
				}
			}
			useDebouncedValidation = (minWait, options) => {
				if (getCurrentInstance()) {
					if (minWait > 0) {
						const debounced = debounce(validate, minWait, options)
						const cancelHandlers = this.#cancelHandlers
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
		privateModelMap.set(this, {
			hasInteractiveCtx: false,
			resetInteractiveCtx: false,
			triggerIfShallow() {
				if (isShallow(this.ref)) {
					triggerRef(this.ref)
				}
			},
			handleValidation,
			useDebouncedValidation
		})
	}

	get hasErrors() {
		return this.errors.value.length > 0
	}
	
	get isValid() {
		return !this.hasErrors
	}

	reset() {
		// @ts-expect-error
		this.ref.value = this.#getResetValue()
	}

	clear() {
		this.#errors.length = 0
		for (const cancel of this.#cancelHandlers) {
			cancel()
		}
		triggerRef(this.errors)
	}

	validate(force = false, trigger = true) {
		const validationContext = this.#validationContext
		if (!validationContext) return true

		// @ts-expect-error
		const modelValue = this.ref._value
		const { lastValidation } = validationContext
		if (force || !looselyEqual(modelValue, lastValidation.value)) {
			const errors = this.#errors
			errors.length = 0
			try {
				validationContext.validator(
					modelValue,
					validationContext.error,
					validationContext.checkpoint
				)
			} catch (error) {
				if (error !== validationError) {
					throw error
				}
			}
			lastValidation.value = shallowCopy(modelValue)
			lastValidation.result = errors.length === 0
		}
		for (const cancel of this.#cancelHandlers) {
			cancel()
		}
		if (trigger) triggerRef(this.errors)
		return lastValidation.result
	}
}