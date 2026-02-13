import { ref, shallowRef, customRef, triggerRef, isRef, toValue, toRef, toRaw } from 'vue'
import { ExtendedRefImpl } from '#reactivity'
import { isFunction, shallowCopy, looselyEqual, uniqueKey, noop } from '#utilities'
import { isModel } from '#composables/useModel'
import { useExposed } from '#composables/useExposed'
import { useElements } from '#composables/useElements'
import { useResetValue } from '#composables/.internal/useResetValue'
import { eldestValidatingGroup } from '#composables/.private/ModelGroupImpl'

/**
 * @import { ShallowRef, Ref, MaybeRefOrGetter } from 'vue'
 * @import { ModelOptions, UnknownModel } from '#composables'
 * @import { UnwrapRefOrGetter, NormalizeRef } from '#reactivity'
 */

/**
 * @typedef {{
 *   interactiveContext: boolean
 *   readonly eldestValidatingGroup: typeof eldestValidatingGroup
 *   readonly validationCancelFunctions: (() => void)[]
 * }} ProtectedModel
 */

/** @type { WeakMap<ModelImpl, ProtectedModel> } */
export const protectedModelMap = new WeakMap()

/** @type { (value: unknown) => unknown } */
const getterToRef = value => isFunction(value) ? toRef(value) : value
const validationError = Object.preventExtensions({})

/**
 * @template { MaybeRefOrGetter } [T = unknown]
 * @template { boolean } [Shallow = boolean]
 * @template { boolean } [ExtendRef = boolean]
 * @template { Ref<unknown> } [R = (
 *   ExtendRef extends true ? T extends Ref
 *     ? T
 *     : NormalizeRef<UnwrapRefOrGetter<T>, Shallow>
 *     : NormalizeRef<UnwrapRefOrGetter<T>, Shallow>
 * )]
 * @extends { ExtendedRefImpl<R> }
 */
export class ModelImpl extends ExtendedRefImpl {
	/** @type { ShallowRef<string[]> } */
	errors = /** @type {any} */(undefined)

	/** @type { UnknownModel } */
	#model

	#validationContext
	/** @type { () => unknown } */
	#getResetValue = /** @type {any} */(undefined)
	/** @type { string[] } */
	#errors = /** @type {any} */(undefined)
	/** @type { (() => void)[] } */
	#validationCancelFunctions = /** @type {any} */(undefined)

	static {
		Object.defineProperty(this.prototype, Symbol.toStringTag, { value: 'Model' })
	}

	/**
	 * @template { unknown } T
	 * @overload
	 * @param { T } value
	 * @returns { T extends UnknownModel ? T : ModelImpl<UnwrapRefOrGetter<T>, false, false> }
	 */
	/**
	 * @template { MaybeRefOrGetter } T
	 * @template { boolean } [Shallow = false]
	 * @template { boolean } [ExtendRef = false]
	 * @overload
	 * @param { T } value
	 * @param { T extends UnknownModel ? never : ModelOptions<UnwrapRefOrGetter<T>, Shallow, ExtendRef> } [options]
	 * @returns { ModelImpl<T, Shallow, ExtendRef> }
	 */
	/**
	 * @this { UnknownModel }
	 * @param { unknown } value
	 * @param { ModelOptions } [options]
	 */
	constructor(value, options = {}) {
		if (isModel(value)) {
			const model = value.#model

			// @ts-expect-error
			super(model.ref)

			this.#model = model
			Object.defineProperties(this, {
				errors: {
					value: model.errors,
					writable: false,
					enumerable: true,
					configurable: false,
				},
				__isModel: { value: true }
			})
		} else {
			const initialValue = toRaw(toValue(value))
			const extendRef = options.extendRef && isRef(value)
			const modelRef = extendRef ? value : (options.shallow ? shallowRef : ref)(initialValue)

			// @ts-expect-error
			super(modelRef)

			this.#model = this
			this.#errors = []
			this.#validationCancelFunctions = []
			
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

			protectedModelMap.set(this, {
				interactiveContext: false,
				eldestValidatingGroup,
				validationCancelFunctions: this.#validationCancelFunctions
			})
		}
	}

	get hasErrors() {
		return this.errors.value.length > 0
	}
	
	get isValid() {
		return !this.hasErrors
	}

	/** @this { UnknownModel } */
	reset() {
		this.ref.value = this.#model.#getResetValue()
	}

	clear() {
		const model = this.#model
		model.#errors.length = 0
		for (const cancel of model.#validationCancelFunctions) {
			cancel()
		}
		triggerRef(model.errors)
	}

	validate(force = false, trigger = true) {
		const model = this.#model
		const validationContext = model.#validationContext
		if (!validationContext) return true

		// @ts-expect-error
		const modelValue = model.ref._value
		const { lastValidation } = validationContext
		if (force || !looselyEqual(modelValue, lastValidation.value)) {
			const errors = model.#errors
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
		for (const cancel of model.#validationCancelFunctions) {
			cancel()
		}
		if (trigger) triggerRef(model.errors)
		return lastValidation.result
	}
}