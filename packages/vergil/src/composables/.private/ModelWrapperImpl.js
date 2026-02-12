import { isShallow, customRef, triggerRef, watch, nextTick, getCurrentScope, onScopeDispose, getCurrentInstance, onMounted } from "vue"
import { watchControlledSync } from '#reactivity'
import { isFunction, debounce, pull, noop } from '#utilities'
import { useModelWatchers } from "#composables/.internal/model"
import { ModelImpl, protectedModelMap } from "#composables/.private/ModelImpl"

/**
 * @import { WatchOptions, EffectScope } from "vue"
 * @import { UnknownModel, ProtectedModel, ExternalModelUpdateCallback, InternalModelUpdateCallback, Exposed, Elements } from "#composables"
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
	#effectScope

	#externalHandler
	#externalController

	/** @type { Record<'pre' | 'post' | 'sync', ((v: unknown, u: unknown) => void)[]> } */
	#internalCallbacks = {
		pre: [],
		post: [],
		sync: [],
	}
	#internalFlags = {
		sensorActive: false,
		sensorReset: false,
		sensorTriggered: false,
		triggerSyncCbs: false,
	}
	#internalSignal = customRef((track, trigger) => {
		/** @type { unknown } */
		let oldValue
		return {
			get: () => (track(), oldValue),
			set: v => (oldValue = v, trigger())
		}
	})
	#internalSensor

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
		this.#effectScope = getCurrentScope()

		const depth = options.maybeObject && !isShallow(this.ref) && 1
		const [onModelUpdate, controller] = useModelWatchers(model, this.#protected, depth)
		this.#externalHandler = onModelUpdate
		this.#externalController = controller

		this.#internalSensor = watchControlledSync(this.ref, (newValue, oldValue) => {
			const internalFlags = this.#internalFlags
			if (!internalFlags.sensorTriggered) {
				internalFlags.sensorTriggered = true
				this.#internalSignal.value = oldValue
			}
			if (internalFlags.triggerSyncCbs) {
				/** @type { ModelWrapperImpl | null } */
				let currentModel = this
				while (currentModel = currentModel.#parent) {
					for (const cb of this.#internalCallbacks.sync) {
						cb(newValue, oldValue)
					}
				}
			} else {
				this.#internalSensor.pause()
			}
		}, { deep: depth })
		this.#internalSensor.pause()

		for (const flush of /** @type { const } */ (['pre', 'post'])) {
			watch(this.#internalSignal, oldValue => {
				this.#internalFlags.sensorTriggered = false
				const newValue = this.ref.value
				/** @type { ModelWrapperImpl | null } */
				let currentModel = this
				while (currentModel = currentModel.#parent) {
					for (const cb of this.#internalCallbacks[flush]) {
						cb(newValue, oldValue)
					}
				}
			}, { flush })
		}

		onScopeDispose(() => {
			const callbacks = this.#internalCallbacks
			callbacks.pre.length = 0
			callbacks.post.length = 0
			callbacks.sync.length = 0
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
				const internalFlags = model.#internalFlags
				const protectedModel = model.#protected
				
				// Pause parent component models
				/** @type { ModelWrapperImpl | null } */
				let currentModel = model
				internalFlags.triggerSyncCbs = false
				do {
					model.#externalController.pause()
					internalFlags.triggerSyncCbs ||= currentModel.#internalCallbacks.sync.length > 0
				} while (currentModel = currentModel.#parent)
				
				// Set interactive context flag
				const resetInteractiveContext = protectedModel.interactiveContext
					? false
					: (protectedModel.interactiveContext = true)

				// Resume internalSensor to fire parent componet models'
				// internal-update-callbacks if a model value change is detected
				if (!internalFlags.sensorTriggered || internalFlags.triggerSyncCbs) {
					internalFlags.sensorActive = true
					model.#internalSensor.resume()
				}

				try {
					return fn.apply(this, args)
				} finally {
					// Pause internalSensor while not in use
					if (internalFlags.sensorActive) {
						internalFlags.sensorActive = false
						if (!internalFlags.sensorReset && internalFlags.sensorTriggered) {
							internalFlags.sensorReset = true
							nextTick(() => {
								internalFlags.sensorTriggered = false
								internalFlags.sensorReset = false
							})
						}
						model.#internalSensor.pause()
					}

					// Reset interactive context flag
					if (resetInteractiveContext) {
						nextTick(() => {
							protectedModel.interactiveContext = false
						})
					}

					// Resume parent component models
					currentModel = model
					do currentModel.#externalController.resume()
					while (currentModel = currentModel.#parent)
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
	 * @param { InternalModelUpdateCallback<T, Immediate> } callback
	 * @param { Omit<WatchOptions<Immediate>, 'deep'> } [options]
	 * @returns { () => void }
	 */ 
	/**
	 * @param { InternalModelUpdateCallback<any> } cb
	 * @param { Omit<WatchOptions, 'deep'> } [options = {}]
	 */
	onInternalUpdate(cb, options = {}) {
		if (!isFunction(cb)) return noop

		if (options.immediate) {
			cb(this.ref.value, undefined)
			if (options.once) return noop
		}

		if (options.once) {
			const _cb = cb
			cb = (...args) => {
				_cb(...args)
				stop()
			}
		}

		/** @type { 'sync' | 'pre' | 'post' } */
		// @ts-expect-error
		const flush = ['sync', 'post'].includes(options.flush) ? options.flush : 'pre'
		this.#internalCallbacks[flush].push(cb)

		const stop = () => {
			const callbacks = this.#internalCallbacks[flush]
			const idx = callbacks.indexOf(cb)
			if (idx > -1) pull(callbacks, idx)
		}

		if (this.#effectScope !== getCurrentScope()) {
			onScopeDispose(stop, true)
		}

		return stop
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