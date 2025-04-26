import { toRaw, customRef, watch, watchSyncEffect, nextTick, getCurrentScope, getCurrentInstance, onScopeDispose, onMounted } from 'vue'
import { useModel, useElements, useExposed } from '.'
import { privateModelMap, useModelWatchers } from './private'
import { watchControlledSync } from '../reactivity/private'
import { isModel } from '../functions'
import { isFunction, isObject, noop } from '../utilities'

/**
 * @import { WatchOptions, EffectScope } from 'vue'
 * @import { ModelWrapper, DefineModelOptions, ExternalModelUpdateCallback, InternalModelUpdateCallback } from '../types'
 */

const symExt_controller = Symbol('external:controller')
const symInt_trigger = Symbol('internal:triggerCbs')
const symInt_hasSyncCbs = Symbol('internal:hasSyncCbs')

/**
 * @template [T = unknown]
 * @template { boolean } [IncludeExposed = false]
 * @template { boolean } [CaptureExposed = false]
 * @template { boolean } [IncludeElements = false]
 * @template { boolean } [CaptureElements = false]
 * @overload
 * @param { DefineModelOptions<IncludeExposed, CaptureExposed, IncludeElements, CaptureElements> } [options = {}]
 * @returns { ModelWrapper<T, IncludeExposed, CaptureExposed, IncludeElements, CaptureElements> }
 */

/**
 * Defines a bidirectional model-value bond between a (provided) model and a component, and creates a model wrapper with additional utilities to separately handle internal and external model value mutations.
 * 
 * @param { object } [options = {}]
 * @param { boolean } [options.isCollection = false]	- Whether the model value may be a collection-like data type (e.g., array, object). Defaults to `false`.
 * @param { boolean } [options.includeExposed = false]	- Whether to include into the model wrapper an `exposed` object. Defaults to `false`.
 * @param { boolean } [options.captureExposed = false]	- Whether to attach into the model wrapper the `exposed` object provided to its associated component (either through a model or the `exposed` prop). Defaults to `false`.
 * @param { boolean } [options.includeElements = false]	- Whether to include into the model wrapper an `elements` object. Defaults to `false`.
 * @param { boolean } [options.captureElements = false]	- Whether to attach into the model wrapper the `elements` object provided to its associated component (either through a model or the `elements` prop). Defaults to `false`.
 * 
 * @returns { ModelWrapper }
 * 
 * @example
 *  ```vue
 *  <script setup>
 *  defineProps({
 *      modelValue: {
 *          type: [ModelValueType, Object],
 *          default: defaultModelValue
 *      },
 *      ['onUpdate:modelValue']: Function
 *  })
 *  const model = useDefineModel()
 *  </script>
 *  ```
 */
export function useDefineModel(options = {}) {
	const instance = getCurrentInstance()
	// @ts-expect-error
	if (!instance) return
	const {
		isCollection = false,
		includeElements = false,
		includeExposed = false
	} = options

	const { props } = instance
	const rawProps = toRaw(props)
	const { modelValue } = rawProps

	let mayBeComponentModel = false
	const modelCandidate = isObject(modelValue)
		? (mayBeComponentModel = Object.hasOwn(modelValue, '__v_isComponentModel'))
			? Object.getPrototypeOf(modelValue)
			: modelValue
		: null
	const isValidModel = isModel(modelCandidate, true)
	const model = isValidModel
		? modelCandidate
		: isFunction(rawProps['onUpdate:modelValue'])
			? useModel(customRef((track, trigger) => {
				let value = modelValue

				watchSyncEffect(() => {
					const v = props.modelValue
					if (!Object.is(value, v)) {
						value = v
						trigger()
					}
				})

				return {
					get() {
						track()
						return value
					},
					set(v) {
						if (!Object.is(value, v)) {
							/** @type { Function } */(rawProps['onUpdate:modelValue'])(v)
							value = v
							trigger()
						}
					}
				}
			// @ts-expect-error
			}), { extendRef: true, validator: rawProps.validator })
			// @ts-expect-error
			: useModel(modelValue, { shallow: true, validator: rawProps.validator })
	const privateModel = privateModelMap.get(model)

	const [onModelUpdate, controller] = useModelWatchers(model, privateModel, isCollection)

	/** @type { Record<'sync' | 'pre' | 'post', ((v: unknown, u: unknown) => void)[]> } */
	const internalCallbacks = {
		sync: [],
		pre: [],
		post: []
	}
	const internalFlags = {
		sensorActive: false,
		sensorReset: false,
		sensorTriggered: false,
		triggerSyncCbs: false,
		hasSyncCbs: false,
	}
	const internalSignal = customRef((track, trigger) => {
		/** @type { unknown } */
		let oldValue
		return {
			get() {
				track()
				return oldValue
			},
			set(v) {
				oldValue = v
				trigger()
			}
		}
	})
	const internalSensor = watchControlledSync(model.ref, (newValue, oldValue) => {
		if (!internalFlags.sensorTriggered) {
			internalFlags.sensorTriggered = true
			internalSignal.value = oldValue
		}
		if (internalFlags.triggerSyncCbs) {
			let currentModel = componentModel
			while (currentModel = currentModel.__parent) {
				currentModel[symInt_trigger]('sync', newValue, oldValue)
			}
		} else {
			internalSensor.pause()
		}
	}, { deep: isCollection && 1 })

	internalSensor.pause()
	for (const flush of /** @type { const } */ (['pre', 'post'])) {
		watch(internalSignal, oldValue => {
			internalFlags.sensorTriggered = false
			const newValue = model.ref.value
			let currentModel = componentModel
			while (currentModel = currentModel.__parent) {
				currentModel[symInt_trigger](flush, newValue, oldValue)
			}
		}, { flush })
	}

	/** @param { unknown } fn */
	function updateDecorator(fn) {
		return isFunction(fn) ?
			/**
			 * @this { unknown }
			 * @param  { unknown[] } args 
			 */
			function(...args) {
				// Pause parent component models
				let currentModel = componentModel
				internalFlags.triggerSyncCbs = false
				do {
					currentModel[symExt_controller].pause()
					internalFlags.triggerSyncCbs ||= currentModel[symInt_hasSyncCbs]
				} while (currentModel = currentModel.__parent)
				// Set hasInteractiveCtx flag
				if (!privateModel.hasInteractiveCtx) {
					privateModel.hasInteractiveCtx = true
					privateModel.resetInteractiveCtx = true
				}
				// Resume internalSensor to fire parent componet models'
				// internal-update-callbacks if a model value change is detected
				if (!internalFlags.sensorTriggered || internalFlags.triggerSyncCbs) {
					internalFlags.sensorActive = true
					internalSensor.resume()
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
						internalSensor.pause()
					}
					// Reset hasInteractiveCtx flag
					if (privateModel.resetInteractiveCtx) {
						privateModel.resetInteractiveCtx = false
						nextTick(() => {
							privateModel.hasInteractiveCtx = false
						})
					}
					// Resume parent component models
					currentModel = componentModel
					do currentModel[symExt_controller].resume()
					while (currentModel = currentModel.__parent)
				}
			}
			: noop
	}

	const instanceScope = getCurrentScope()
	onScopeDispose(() => {
		internalCallbacks.pre.length = 0
		internalCallbacks.post.length = 0
		internalCallbacks.sync.length = 0
		internalFlags.hasSyncCbs = false
	})

	const componentModel = Object.defineProperties(Object.create(model), {
		updateDecorator: {
			value: updateDecorator,
			enumerable: true
		},
		update: {
			// @ts-expect-error
			value: updateDecorator(v => {
				if (isFunction(v)) {
					v()
				} else {
					model.ref.value = v
				}
			}),
			enumerable: true
		},
		onExternalUpdate: {
			/**
			 * @param { ExternalModelUpdateCallback } cb
			 * @param { Omit<WatchOptions, 'deep'> & { onMounted?: boolean } } [options = {}]
			 * @returns { () => void }
			 */
			value: function(cb, { onMounted: isOnMounted, ...options } = {}) {
				if (isFunction(cb)) {
					if (isOnMounted) {
						const instance = getCurrentInstance()
						if (instance) {
							/** @type { () => void } */
							let stop
							const setupScope = /** @type { EffectScope } */ (getCurrentScope())
							onMounted(() => {
								setupScope.run(() => {
									stop = onModelUpdate(cb, { ...options, immediate: true })
								})
							})
							return () => {
								if (instance.isMounted) {
									stop()
								} else {
									onMounted(stop)
								}
							}
						}
					}
					return onModelUpdate(cb, options)
				} else {
					return noop
				}
			},
			enumerable: true
		},
		onInternalUpdate: {
			/**
			 * @param { InternalModelUpdateCallback } cb
			 * @param { Omit<WatchOptions, 'deep'> } [options = {}]
			 * @returns { () => void }
			 */
			value: function(cb, options = {}) {
				if (isFunction(cb)) {
					if (options.immediate) {
						cb(model.ref.value, undefined)
						if (options.once) return noop
					}
					if (options.once) {
						const _cb = cb
						cb = (...args) => {
							_cb(...args)
							stop()
						}
					}
					// @ts-expect-error
					const flush = /** @type { 'sync' | 'pre' | 'post' } */ (['sync', 'post'].includes(options.flush) ? options.flush : 'pre')
					internalCallbacks[flush].push(cb)
					if (flush === 'sync') {
						internalFlags.hasSyncCbs ||= true
					}
					const stop = () => {
						const callbacks = internalCallbacks[flush]
						const idx = callbacks.indexOf(cb)
						if (idx > -1) {
							callbacks.splice(idx, 1)
						}
						if (flush === 'sync' && callbacks.length === 0) {
							internalFlags.hasSyncCbs = false
						}
					}
					if (instanceScope !== getCurrentScope()) {
						onScopeDispose(stop, true)
					}
					return stop
				} else {
					return noop
				}
			},
			enumerable: true
		},
		triggerIfShallow: {
			value: privateModel.triggerIfShallow,
			enumerable: true
		},
		handleValidation: {
			value: privateModel.handleValidation,
			enumerable: true
		},
		useDebouncedValidation: {
			value: privateModel.useDebouncedValidation,
			enumerable: true
		},

		[symExt_controller]: { value: controller },
		[symInt_trigger]: {
			/**
			 * @param { 'pre' | 'post' | 'sync' } flush
			 * @param { unknown } newValue
			 * @param { unknown } oldValue
			 */
			value: (flush, newValue, oldValue) => {
				for (const cb of internalCallbacks[flush]) {
					cb(newValue, oldValue)
				}
			}
		},
		[symInt_hasSyncCbs]: {
			get: () => internalFlags.hasSyncCbs
		},
		__parent: { value: mayBeComponentModel && isValidModel ? props.modelValue : null },
		__v_isComponentModel: { value: true }
	})

	const resources = {
		elements: {
			capture: options.captureElements ?? false,
			getDefault: includeElements ? useElements : () => null,
		},
		exposed: {
			capture: options.captureExposed ?? false,
			getDefault: includeExposed ? useExposed : () => null,
		}
	}
	for (const key of /** @type { const } */ (['elements', 'exposed'])) {
		/** @type {{ value?: unknown, writable: boolean }} */
		const descriptor = { writable: false }
		if (resources[key].capture) {
			if (isValidModel && mayBeComponentModel && Object.hasOwn(/** @type { object } */(modelValue), key)) {
				// @ts-expect-error
				descriptor.value = modelValue[key] ?? rawProps[key] ?? resources[key].getDefault()
			} else if (!Object.hasOwn(model, key)) {
				descriptor.value = rawProps[key] ?? resources[key].getDefault()
			}
		} else {
			descriptor.value = resources[key].getDefault()
		}
		if (Object.hasOwn(descriptor, 'value')) {
			Object.defineProperty(componentModel, key, descriptor)
		}
	}

	return componentModel
}