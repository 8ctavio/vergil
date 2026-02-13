import { isShallow, triggerRef, nextTick, getCurrentScope, onScopeDispose, getCurrentInstance, onMounted } from "vue"
import { isFunction, debounce, pull, noop } from '#utilities'
import { useWatchers } from '#composables/useWatchers'
import { _deep_ } from "#composables/.private/constants"
import { ModelImpl, protectedModelMap } from "#composables/.private/ModelImpl"

/**
 * @import { Ref, WatchCallback, WatchOptions, EffectScope } from "vue"
 * @import { UnknownModel, ProtectedModel, WatchersHandle, ExternalModelUpdateCallback, Exposed, Elements } from "#composables"
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
	/** @type { WatchersHandle<Ref> } */
	#externalWatchers
	/** @type { WatchersHandle<Ref> | undefined } */
	#internalWatchers

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

		this.#externalWatchers = useWatchers(this.ref, {
			deep: options.maybeObject && !isShallow(this.ref) && 1
		})

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
					currentModel.#externalWatchers.pause()
					if (currentModel = currentModel.#parent) {
						currentModel.#internalWatchers?.resume()
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
						currentModel.#externalWatchers.resume()
						if (currentModel = currentModel.#parent) {
							currentModel.#internalWatchers?.pause()
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
	 * @param { ExternalModelUpdateCallback<any> } callback
	 * @param { Omit<WatchOptions, 'deep'> & { onMounted?: boolean } } [options] 
	 */
	onExternalUpdate(callback, { onMounted: isOnMounted, ...options } = {}) {
		if (isFunction(callback)) {
			/** @type { WatchCallback } */
			const cb = (v, u, c) => {
				callback(v, u, !this.#protected.interactiveContext, c)
			}
			if (isOnMounted && getCurrentInstance()) {
				/** @type { boolean | (() => void) } */
				let stop = false
				const setupScope = /** @type { EffectScope } */(getCurrentScope())
				onMounted(() => {
					if (!stop) {
						setupScope.run(() => {
							stop = this.#externalWatchers.onUpdated(cb, {
								...options,
								nonPreemptive: false,
								immediate: true
							})
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
				return this.#externalWatchers.onUpdated(cb, { ...options, nonPreemptive: false })
			}
		} else {
			return noop
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
	 * @this { ModelWrapperImpl<unknown> }
	 * @param { WatchCallback } callback
	 * @param { Omit<WatchOptions, 'deep'> } [options]
	 */
	onInternalUpdate(callback, options) {
		if (isFunction(callback)) {
			if (!this.#internalWatchers) {
				this.#internalWatchers = useWatchers(this.ref, {
					deep: this.#externalWatchers[_deep_]
				})
				this.#internalWatchers.pause()
			}
			return this.#internalWatchers.onUpdated(callback, { ...options, nonPreemptive: true })
		} else {
			return noop
		}
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