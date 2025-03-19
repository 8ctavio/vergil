import { toRaw, customRef, watch, watchSyncEffect, nextTick, getCurrentScope, getCurrentInstance, onScopeDispose, onMounted } from 'vue'
import { useModel, useElements, useExposed } from '.'
import { isExtendedRef } from './extendedReactivity'
import { defineReactiveProperties } from './extendedReactivity/defineReactiveProperties'
import { privateModelMap, useModelWatchers, watchControlledSync } from './private'
import { isFunction, isObject } from '../utilities'
import { noop } from '../utilities/private'

const symExt_controller = Symbol('external:controller')
const symInt_trigger = Symbol('internal:triggerCbs')
const symInt_hasSyncCbs = Symbol('internal:hasSyncCbs')

/**
 * Defines a bidirectional model-value bond between a (provided) model and a component, and creates a model wrapper with additional utilities to separately handle internal and external model value mutations.
 * 
 * @param { {
 *      isCollection: boolean;
 *      includeExposed: boolean;
 *      captureExposed: boolean;
 *      includeElements: boolean;
 *      captureElements: boolean;
 * } } options -
 *  - `isCollection`: Whether the model value may be a collection-like data type (e.g., array, object). Defaults to `false`.
 *  - `includeExposed`/`includeElements`: Whether to include into the model wrapper an `exposed`/`elements` object. Defaults to `false`.
 *  - `captureExposed`/`captureElements`: Whether to attach into the model wrapper the `exposed`/`elements` object provided to its associated component (either through a model or the `exposed`/`elements` prop). Defaults to `false`.
 * 
 * @returns { ExtendedRef }
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
    if(instance) {
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
                }), { extendRef: true, validator: rawProps.validator })
                : useModel(modelValue, { shallow: true, validator: rawProps.validator })
        const privateModel = privateModelMap.get(model)

        const [onModelUpdate, controller] = useModelWatchers(model, privateModel, isCollection)
        
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
                while(currentModel = currentModel.__parent) {
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
                const newValue = model.ref.value
                let currentModel = componentModel
                while(currentModel = currentModel.__parent) {
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
                } while(currentModel = currentModel.__parent)
                // Set hasInteractiveCtx flag
                if(!privateModel.hasInteractiveCtx) {
                    privateModel.hasInteractiveCtx = true
                    privateModel.resetInteractiveCtx = true
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
                    if(privateModel.resetInteractiveCtx) {
                        privateModel.resetInteractiveCtx = false
                        nextTick(() => {
                            privateModel.hasInteractiveCtx = false
                        })
                    }
                    // Resume parent component models
                    currentModel = componentModel
                    do currentModel[symExt_controller].resume()
                    while(currentModel = currentModel.__parent)
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
            __parent: withDescriptor({
                value: mayBeComponentModel && isValidModel ? props.modelValue : null,
                enumerable: false,
                writable: false
            }),

            updateDecorator,
            update: updateDecorator(v => {
                if(isFunction(v)) {
                    v()
                } else {
                    model.ref.value = v
                }
            }),
            triggerIfShallow: privateModel.triggerIfShallow,
            handleValidation: privateModel.handleValidation,
            useDebouncedValidation: privateModel.useDebouncedValidation,

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
                        cb(model.ref.value, undefined)
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
        for(const key of ['elements', 'exposed']) {
            const descriptor = { writable: false }
            if(resources[key].capture) {
                if(isValidModel && mayBeComponentModel && Object.hasOwn(modelValue, key)) {
                    descriptor.value = modelValue[key] ?? rawProps[key] ?? resources[key].getDefault()
                } else if(!Object.hasOwn(model, key)) {
                    descriptor.value = rawProps[key] ?? resources[key].getDefault()
                }
            } else {
                descriptor.value = resources[key].getDefault()
            }
            if(Object.hasOwn(descriptor, 'value')) {
                Object.defineProperty(componentModel, key, descriptor)
            }
        }

        return componentModel
    }
}