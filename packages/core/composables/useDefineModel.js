import { toRaw, customRef, triggerRef, isShallow, watch, watchSyncEffect, nextTick, getCurrentScope, getCurrentInstance, onScopeDispose, onMounted } from 'vue'
import { useModel, useElements } from '.'
import { isExtendedRef } from './extendedReactivity'
import { defineReactiveProperties } from './extendedReactivity/defineReactiveProperties'
import { useModelWatchers, watchControlledSync } from './private'
import { isFunction, isObject } from '../utilities'
import { noop } from '../utilities/private'

const modelMap = new WeakMap()
const symExt_controller = Symbol('external:controller')
const symInt_trigger = Symbol('internal:triggerCbs')
const symInt_hasSyncCbs = Symbol('internal:hasSyncCbs')

/**
 * Creates component a model wrapper to conveniently implement component's two-way data binding and handle external programmatic mutations.
 * 
 * @param { object } [props] - Component props. The `modelValue`, `onUpdated:modelValue`, and `value` are read from the props object.
 * @param { boolean } [options.isCollection] - Whether the model value may be a collection-like data type (e.g., array, object).
 * 
 * @returns { ExtendedRef }
 * 
 * @example
 *  ```vue
 *  <script setup>
 * 	const props = defineProps({
 * 		modelValue: {
 * 			type: [String, Object],
 * 			default: ''
 * 		},
 * 		['onUpdate:modelValue']: Function
 * 	})
 * 	const model = useDefineModel(props)
 *  </script>
 *  ```
 */
export function useDefineModel(options = {}) {
    const instance = getCurrentInstance()
    if(instance) {
        const { isCollection = false } = options
        const resources = {
            elements: {
                include: options.includeElements ?? true,
                capture: options.captureElements ?? false,
                create: useElements,
            },
            exposed: {
                include: options.includeExposed ?? true,
                capture: options.captureExposed ?? false,
                create: () => {},
            }
        }

        const { props } = instance
        const rawProps = toRaw(props)
        const { modelValue } = rawProps

        let mayBeComponentModel = false
        const modelCandidate = isObject(modelValue)
            ? (mayBeComponentModel = Object.hasOwn(modelValue, '__v_isComponentModel'))
                ? Object.getPrototypeOf(modelValue)
                : modelValue
            : null
        const isValidModel = modelCandidate !== null
            && Object.hasOwn(modelCandidate, '__v_isModel')
            && isExtendedRef(modelCandidate)
        const model = isValidModel
            ? modelCandidate
            : isFunction(rawProps['onUpdate:modelValue'])
                ? useModel(customRef((track, trigger) => {
                    let value = modelValue

                    watchSyncEffect(() => {
                        const v = props.modelValue
                        if(!Object.is(value, v)) {
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
                            if(!Object.is(value, v)) {
                                rawProps['onUpdate:modelValue'](v)
                                value = v
                                trigger()
                            }
                        }
                    }
                }), { extendRef: true, includeElements: false, includeExposed: false })
                : useModel(modelValue, {
                    shallow: true,
                    includeElements: false,
                    includeExposed: false,
                })

        let modelMeta = modelMap.get(model)
        if(!modelMeta) {
            modelMap.set(model, modelMeta = {
                hasInteractiveCtx: false,
                resetInteractiveCtx: false,
                triggerIfShallow() {
                    if(isShallow(model.ref)) {
                        triggerRef(model.ref)
                    }
                }
            })
        }

        const [onModelUpdate, controller] = useModelWatchers(model, modelMeta, isCollection)
        
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
            if(!internalFlags.sensorTriggered) {
                internalFlags.sensorTriggered = true
                internalSignal.value = oldValue
            }
            if(internalFlags.triggerSyncCbs) {
                let currentModel = componentModel
                while(currentModel = currentModel.parent) {
                    currentModel[symInt_trigger]('sync', newValue, oldValue)
                }
            } else {
                internalSensor.pause()
            }
        }, { deep: isCollection && 1 })

        internalSensor.pause()
        for(const flush of ['pre', 'post']) {
            watch(internalSignal, oldValue => {
                internalFlags.sensorTriggered = false
                const newValue = model.value
                let currentModel = componentModel
                while(currentModel = currentModel.parent) {
                    currentModel[symInt_trigger](flush, newValue, oldValue)
                }
            }, { flush })
        }

        function updateDecorator(fn) {
            return isFunction(fn) ? function(...args) {
                // Pause parent component models
                let currentModel = componentModel
                internalFlags.triggerSyncCbs = false
                do {
                    currentModel[symExt_controller].pause()
                    internalFlags.triggerSyncCbs ||= currentModel[symInt_hasSyncCbs]
                } while(currentModel = currentModel.parent)
                // Set hasInteractiveCtx flag
                if(!modelMeta.hasInteractiveCtx) {
                    modelMeta.hasInteractiveCtx = true
                    modelMeta.resetInteractiveCtx = true
                }
                // Resume internalSensor to fire parent componet models'
                // internal-update-callbacks if a model value change is detected
                if(!internalFlags.sensorTriggered || internalFlags.triggerSyncCbs) {
                    internalFlags.sensorActive = true
                    internalSensor.resume()
                }
                try {
                    return fn.apply(this, args)
                } finally {
                    // Pause internalSensor while not in use
                    if(internalFlags.sensorActive) {
                        internalFlags.sensorActive = false
                        if(!internalFlags.sensorReset && internalFlags.sensorTriggered) {
                            internalFlags.sensorReset = true
                            nextTick(() => {
                                internalFlags.sensorTriggered = false
                                internalFlags.sensorReset = false
                            })
                        }
                        internalSensor.pause()
                    }
                    // Reset hasInteractiveCtx flag
                    if(modelMeta.resetInteractiveCtx) {
                        modelMeta.resetInteractiveCtx = false
                        nextTick(() => {
                            modelMeta.hasInteractiveCtx = false
                        })
                    }
                    // Resume parent component models
                    currentModel = componentModel
                    do currentModel[symExt_controller].resume()
                    while(currentModel = currentModel.parent)
                }
            } : noop
        }

        const instanceScope = getCurrentScope()
        onScopeDispose(() => {
            internalCallbacks.pre.length = 0
            internalCallbacks.post.length = 0
            internalCallbacks.sync.length = 0
            internalFlags.hasSyncCbs = false
        })

        const componentModel = defineReactiveProperties(Object.create(model), withDescriptor => ({
            parent: withDescriptor({
                value: mayBeComponentModel && isValidModel ? props.modelValue : null,
                enumerable: false,
                writable: false
            }),

            updateDecorator,
            update: updateDecorator(v => {
                if(isFunction(v)) {
                    v()
                } else {
                    model.value = v
                }
            }),
            triggerIfShallow: modelMeta.triggerIfShallow,

            onExternalUpdate(cb, { onMounted: isOnMounted, ...options } = {}) {
                if(isFunction(cb)) {
                    if(isOnMounted) {
                        const instance = getCurrentInstance()
                        if(instance) {
                            let stop
                            const setupScope = getCurrentScope()
                            onMounted(() => {
                                setupScope.run(() => {
                                    stop = onModelUpdate(cb, { ...options, immediate: true })
                                })
                            })
                            return () => {
                                if(instance.isMounted) {
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
            onInternalUpdate(cb, options = {}) {
                if(isFunction(cb)) {
                    if(options.immediate) {
                        cb(model.value, undefined)
                        if(options.once) return
                    }
                    if(options.once) {
                        const _cb = cb
                        cb = (...args) => {
                            _cb(...args)
                            stop()
                        }
                    }
                    const flush = ['sync', 'post'].includes(options.flush) ? options.flush : 'pre'
                    internalCallbacks[flush].push(cb)
                    if(flush === 'sync') {
                        internalFlags.hasSyncCbs ||= true
                    }
                    const stop = () => {
                        const callbacks = internalCallbacks[flush]
                        const idx = callbacks.indexOf(cb)
                        if(idx > -1) {
                            callbacks.splice(idx, 1)
                        }
                        if(flush === 'sync' && callbacks.length === 0) {
                            internalFlags.hasSyncCbs = false
                        }
                    }
                    if(instanceScope !== getCurrentInstance()) {
                        onScopeDispose(stop, true)
                    }
                    return stop
                } else {
                    return noop
                }
            },

            [symExt_controller]: withDescriptor({
                value: controller,
                enumerable: false,
                writable: false
            }),
            [symInt_trigger](flush, newValue, oldValue) {
                for(const cb of internalCallbacks[flush]) {
                    cb(newValue, oldValue)
                }
            },
            [symInt_hasSyncCbs]: withDescriptor({
                get() {
                    return internalFlags.hasSyncCbs
                }
            }),

            __v_isComponentModel: withDescriptor({
				value: true,
				enumerable: false,
				writable: false
			})
        }), { configurable: false })

        for(const key of ['elements', 'exposed']) {
            const descriptor = { writable: false }
            if(resources[key].include) {
                if(resources[key].capture && isValidModel) {
                    if(mayBeComponentModel && Object.hasOwn(modelValue, key)) {
                        descriptor.value = modelValue[key] ?? rawProps[key] ?? resources[key].create()
                    } else if(!Object.hasOwn(model, key)) {
                        descriptor.value = rawProps[key] ?? resources[key].create()
                    }
                } else {
                    descriptor.value = resources[key].create()
                }
            } else {
                descriptor.value = null
            }
            if(Object.hasOwn(descriptor, 'value')) {
                Object.defineProperty(componentModel, key, descriptor)
            }
        }

        return componentModel
    }
}