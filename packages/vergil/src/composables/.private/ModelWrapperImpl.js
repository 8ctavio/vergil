import { isShallow, triggerRef, nextTick, getCurrentScope, onScopeDispose, getCurrentInstance, onMounted } from "vue"
import { isFunction, debounce, pull, noop } from '#utilities'
import { useModelWatchers } from "#composables/.internal/model"
import { ModelImpl, protectedModelMap } from "#composables/.private/ModelImpl"

/**
 * @import { WatchCallback, WatchOptions, EffectScope } from "vue"
 * @import { UnknownModel, ProtectedModel, ExternalModelUpdateCallback, Exposed, Elements } from "#composables"
 * @import { MaybeUndefined } from "#utilities"
 */

/**
 * @typedef { object } ModelWrapperImplOptions
 * @property { Exposed } [exposed]
 * @property { Elements } [elements]
 * @property { boolean } [maybeObject]
 */

const _isModelWrapper_ = Symbol('isModelWrapper')

/**
 * @template [T = unknown]
 * @extends { ModelImpl<T> }
 */
export class ModelWrapperImpl extends ModelImpl {
	/** @type { ModelWrapperImpl | null } */
	#parent
	/** @type { ProtectedModel } */
	#protected

	#externalHandler
	#externalController
	#internalHandler
	#internalController

	/**
	 * @this { ModelWrapperImpl<unknown> }
	 * @param { UnknownModel | ModelWrapperImpl } model
	 * @param { ModelWrapperImplOptions } [options]
	 */
	constructor(model, options = {}) {
		// @ts-expect-error
		super(model)
		
		if (Object.hasOwn(model, _isModelWrapper_)) {
			this.#parent = /** @type { ModelWrapperImpl } */(model)
			this.#protected = this.#parent.#protected
		} else {
			this.#parent = null
			this.#protected = /** @type { ProtectedModel } */(protectedModelMap.get(model))
		}

		const depth = options.maybeObject && !isShallow(this.ref) && 1
		const [onModelUpdate, controller] = useModelWatchers(model, depth, this.#protected)
		this.#externalHandler = onModelUpdate
		this.#externalController = controller

		const internalWatchers = useModelWatchers(model, depth)
		this.#internalHandler = internalWatchers[0]
		this.#internalController = internalWatchers[1]
		this.#internalController.pause()

		/** @type { PropertyDescriptorMap } */
		const descriptorMap = {
			[_isModelWrapper_]: { value: true },
			update: {
				// @ts-expect-error
				value: this.updateDecorator(v => {
					if (isFunction(v)) {
						v()
					} else {
						this.ref.value = v
					}
				}),
				enumerable: true
			}
		}

		const { exposed, elements } = options
		if (exposed) {
			descriptorMap.exposed = {
				value: exposed,
				enumerable: true
			}
		}
		if (elements) {
			descriptorMap.elements = {
				value: elements,
				enumerable: true
			}
		}

		Object.defineProperties(this, descriptorMap)
	}

	/**
	 * @template { Function } F
	 * @overload
	 * @param { F } fn 
	 * @returns { F }
	 */
	/** @param { Function } fn */
	updateDecorator(fn) {
		const model = this
		return isFunction(fn) ?
			/**
			 * @this { unknown }
			 * @param { unknown[] } args
			 */
			function(...args) {
				/** @type { ModelWrapperImpl | null } */
				let currentModel = model
				while (true) {
					currentModel.#externalController.pause()
					if (currentModel = currentModel.#parent) {
						currentModel.#internalController.resume()
					} else {
						break
					}
				}
				
				// Set interactive context flag
				const protectedModel = model.#protected
				const resetInteractiveContext = protectedModel.interactiveContext
					? false
					: (protectedModel.interactiveContext = true)

				try {
					return fn.apply(this, args)
				} finally {
					// Reset interactive context flag
					if (resetInteractiveContext) {
						nextTick(() => {
							protectedModel.interactiveContext = false
						})
					}

					currentModel = model
					while (true) {
						currentModel.#externalController.resume()
						if (currentModel = currentModel.#parent) {
							currentModel.#internalController.pause()
						} else {
							break
						}
					}
				}
			}
			: noop
	}

	/**
	 * @template { boolean } [Immediate = false]
	 * @overload
	 * @param { ExternalModelUpdateCallback<T, Immediate> } callback
	 * @param { Omit<WatchOptions<Immediate>, 'deep'> & { onMounted?: boolean } } [options]
	 * @returns { () => void }
	 */ 
	/**
	 * @param { ExternalModelUpdateCallback<any> } cb 
	 * @param { Omit<WatchOptions, 'deep'> & { onMounted?: boolean } } [options] 
	 */
	onExternalUpdate(cb, { onMounted: isOnMounted, ...options } = {}) {
		if (!isFunction(cb)) {
			return noop
		} else if (isOnMounted && getCurrentInstance()) {
			/** @type { boolean | (() => void) } */
			let stop = false
			const setupScope = /** @type { EffectScope } */(getCurrentScope())
			onMounted(() => {
				if (!stop) {
					setupScope.run(() => {
						stop = this.#externalHandler(cb, { ...options, immediate: true })
					})
				}
			})
			return () => {
				if (isFunction(stop)) {
					stop()
				} else {
					stop = true
				}
			}
		} else {
			return this.#externalHandler(cb, options)
		}
	}

	/**
	 * @template { boolean } [Immediate = false]
	 * @overload
	 * @param { WatchCallback<T, MaybeUndefined<T, Immediate>> } callback
	 * @param { Omit<WatchOptions<Immediate>, 'deep'> } [options]
	 * @returns { () => void }
	 */ 
	/**
	 * @param { WatchCallback } cb
	 * @param { Omit<WatchOptions, 'deep'> } [options = {}]
	 */
	onInternalUpdate(cb, options) {
		return isFunction(cb)
			? this.#internalHandler(cb, options)
			: noop
	}

	handleValidation(eager = false) {
		const validationTarget = this.#protected.eldestValidatingGroup ?? this
		if (eager || validationTarget.hasErrors) {
			validationTarget.validate()
		}
	}

	/**
	 * @param { number } minWait 
	 * @param {{ eager?: boolean }} [options]
	 * @returns { (eager?: boolean) => void }
	 */
	useDebouncedValidation(minWait, options) {
		if (!getCurrentInstance()) {
			return noop
		} else if (minWait > 0) {
			const {
				eldestValidatingGroup: validationTarget = this,
				validationCancelFunctions
			} = this.#protected

			const debounced = debounce(() => validationTarget.validate(), minWait, options)
			
			validationCancelFunctions.push(debounced.cancel)
			onScopeDispose(() => {
				pull(validationCancelFunctions, validationCancelFunctions.indexOf(debounced.cancel))
			})
			
			return (eager = false) => {
				if (eager || validationTarget.hasErrors) debounced()
			}
		} else {
			return eager => this.handleValidation(eager)
		}
	}

	triggerIfShallow() {
		if (isShallow(this.ref)) {
			triggerRef(this.ref)
		}
	}
}